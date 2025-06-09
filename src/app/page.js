"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [pages, setPages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    fetchPosts();
    fetchPages();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/posts");
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("error fetching posts", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPages = async () => {
    try {
      const response = await fetch("/api/pages");
      const data = await response.json();
      setPages(data);
    } catch (error) {
      console.error("error fetching pages", error);
    }
  };

  const handleDelete = async (post) => {
    if (confirm(`delete this post "${post.title}"?`)) {
      try {
        await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
        fetchPosts();
      } catch (error) {
        console.error("error deleting post:", error);
      }
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingPost(null);
    fetchPosts();
    fetchPages();
  };

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8 sticky top-0 z-20 backdrop-blur px-8 py-4 rounded-b-lg">
        <div>
          <h1 className="text-3xl font-bold">CMS Dashboard</h1>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create New Post
          </button>
          <button>
            <Link
              href="/pages/new"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
            >
              Create New Page
            </Link>
          </button>
        </div>
      </div>

      {showForm && (
        <PostForm post={editingPost} onClose={handleFormClose}></PostForm>
      )}

      <h2 className="text-3xl text-center font-semibold m-4">Posts</h2>
      <div className="grid gap-6">
        {posts.map((post) => (
          <div
            className="border rounded-lg p-6  shadow-lg shadow-gray-500/50  hover:bg-gray-900"
            key={post.id}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold">{post.title}</h2>
                <p className="text-gray-600">by {post.author}</p>
                <p className="text-sm text-gray-500">
                  Created: {new Date(post.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(post)}
                  className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="text-white">{post.content}</p>
          </div>
        ))}
      </div>

      <h2 className="text-3xl text-center font-semibold mt-10 m-4">Pages</h2>
      <div className="grid gap-6">
        {pages.map((page) => (
          <div
            className="border rounded-lg p-6 shadow-lg shadow-gray-500/50 hover:bg-gray-900"
            key={page.id}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold">{page.title}</h2>
                <p className="text-sm text-gray-400">
                  Slug: <span className="font-mono">{page.slug}</span>
                </p>
              </div>
              <div>
                <Link
                  href={`/pages/${page.slug}`}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                >
                  View
                </Link>
              </div>
            </div>
            <p className="text-white">{page.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PostForm({ post, onClose }) {
  const [formData, setFormData] = useState({
    title: post?.title || "",
    content: post?.content || "",
    author: post?.author || "",
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = post ? `/api/posts/${post.id}` : `/api/posts`;
      const method = post ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Error saving post.");
        return;
      }

      onClose();
    } catch (error) {
      setError("Error saving post.");
      console.error("error saving post:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="p-6 rounded-lg w-full max-w-md shadow-2xl shadow-gray-500/50">
        <h2 className="text-xl font-bold mb-4">
          {post ? "Edit Post" : "Create New Post"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Author</label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) =>
                setFormData({ ...formData, author: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Content</label>
            <textarea
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              className="w-full border rounded px-3 py-2 h-32"
              required
            />
          </div>

          {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {post ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
