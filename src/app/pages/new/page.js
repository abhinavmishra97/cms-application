"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPage() {
  const [form, setForm] = useState({ title: "", slug: "", content: "" });
  const [error, setError] = useState("");
  const router = useRouter();

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
      const data = await res.json();
      router.push(`/pages/${data.slug}`);
    } else {
      const data = await res.json();
      setError(data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-8 shadow-2xl shadow-gray-500/50 ">
      <h2 className="text-2xl font-bold mb-4">Create New Page</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Title</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Slug</label>
        <input
          type="text"
          value={form.slug}
          onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
          className="w-full border rounded px-3 py-2"
          required
          placeholder="e.g. about-us"
        />
        <p className="text-xs text-gray-500 mt-1">
          Lowercase, alphanumeric, hyphens allowed (e.g. <code>about-us</code>)
        </p>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Content</label>
        <textarea
          value={form.content}
          onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
          className="w-full border rounded px-3 py-2 h-32"
          required
        />
      </div>
      {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Create Page
      </button>
    </form>
  );
}
