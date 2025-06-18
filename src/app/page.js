"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [pages, setPages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState("dashboard"); // State to toggle between views
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
      console.error("Error fetching posts:", error);
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
      console.error("Error fetching pages:", error);
    }
  };

  const handleDelete = async (post) => {
    if (confirm(`Delete this post "${post.title}"?`)) {
      try {
        await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
        fetchPosts();
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setView("createPost");
  };

  const handlePostFormClose = () => {
    setView("dashboard");
    setEditingPost(null);
    fetchPosts();
  };

  const handlePageFormClose = () => {
    setView("dashboard");
    fetchPages();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const combinedVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2, ease: "linear" },
    },
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white mb-4"></div>
          <p className="text-lg font-medium text-white">
            Loading, please wait...
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={`container mx-auto p-8 ${
        view === "dashboard" ? "bg-black" : "bg-transparent"
      } text-white min-h-screen`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Navbar */}
      <motion.div
        className="flex justify-between items-center mb-8 sticky top-10 z-20 backdrop-blur px-8 py-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-all shadow-lg"
        variants={itemVariants}
      >
        <div>
          <h1 className="text-3xl font-bold text-white tracking-wide">
            {view === "dashboard"
              ? "CMS Dashboard"
              : view === "createPost"
              ? "Create New Post"
              : "Create New Page"}
          </h1>
        </div>
        {view === "dashboard" && (
          <div className="flex gap-4">
            <button
              onClick={() => setView("createPost")}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all shadow-md hover:shadow-lg"
            >
              Create New Post
            </button>
            <button
              onClick={() => setView("createPage")}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all shadow-md hover:shadow-lg"
            >
              Create New Page
            </button>
          </div>
        )}
      </motion.div>

      {/* Dashboard View */}
      {view === "dashboard" && (
        <>
          <motion.h2
            className="text-3xl text-center font-semibold m-4"
            variants={itemVariants}
          >
            Posts
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
          >
            {posts.map((post) => (
              <motion.div
                className="relative border rounded-lg p-6 shadow-lg hover:shadow-lg hover:shadow-gray-700 transition-all bg-gray-900 hover:bg-gray-950 group"
                key={post.id}
                variants={combinedVariants}
                whileHover="hover"
              >
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-semibold">{post.title}</h2>
                      <p className="text-gray-400">by {post.author}</p>
                      <p className="text-sm text-gray-500">
                        Created:{" "}
                        {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(post)}
                        className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600 transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(post)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-300">{post.content}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.h2
            className="text-3xl text-center font-semibold mt-10 m-4"
            variants={itemVariants}
          >
            Pages
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
          >
            {pages.map((page) => (
              <motion.div
                className="relative border rounded-lg p-6 shadow-lg hover:shadow-lg hover:shadow-gray-700 transition-all bg-gray-900 hover:bg-gray-950 group"
                key={page.id}
                variants={combinedVariants}
                whileHover="hover"
              >
                <div className="relative z-10">
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
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-all"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                  <p className="text-gray-300">{page.content}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </>
      )}

      {/* Create New Post Form */}
      {view === "createPost" && (
        <PostForm post={editingPost} onClose={handlePostFormClose} />
      )}

      {/* Create New Page Form */}
      {view === "createPage" && <NewPage onClose={handlePageFormClose} />}
    </motion.div>
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
      console.error("Error saving post:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="p-6 rounded-lg w-full max-w-md shadow-2xl shadow-gray-500/50 bg-gray-800 text-white">
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
              className="w-full border rounded px-3 py-2 bg-gray-700 text-white"
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
              className="w-full border rounded px-3 py-2 bg-gray-700 text-white"
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
              className="w-full border rounded px-3 py-2 h-32 bg-gray-700 text-white"
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

function NewPage({ onClose }) {
  const [form, setForm] = useState({ title: "", slug: "", content: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug)) {
      setError(
        "Slug must be lowercase, alphanumeric, and may include hyphens."
      );
      return;
    }
    const res = await fetch("/api/pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      onClose(); // Close the form after successful submission
    } else {
      setError(data.error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="p-6 rounded-lg w-full max-w-md shadow-2xl shadow-gray-500/50 bg-gray-800 text-white">
        <h2 className="text-xl font-bold mb-4">Create New Page</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              className="w-full border rounded px-3 py-2 bg-gray-700 text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Slug</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              className="w-full border rounded px-3 py-2 bg-gray-700 text-white"
              required
              placeholder="e.g. about-us"
            />
            <p className="text-xs text-gray-500 mt-1">
              Lowercase, alphanumeric, hyphens allowed (e.g.{" "}
              <code>about-us</code>)
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Content</label>
            <textarea
              value={form.content}
              onChange={(e) =>
                setForm((f) => ({ ...f, content: e.target.value }))
              }
              className="w-full border rounded px-3 py-2 h-32 bg-gray-700 text-white"
              required
            />
          </div>

          {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Create Page
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
