import { NextResponse } from "next/server";
import { getPostById, updatePost, deletePost } from "@/lib/database";

export async function GET(request, { params }) {
  const post = getPostById(params.id);
  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(post);
}

export async function PUT(request, { params }) {
  const { title, content, author } = await request.json();
  if (!title || !content || !author) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  updatePost(params.id, { title, content, author });
  return NextResponse.json({ success: true });
}

export async function DELETE(request, context) {
    const { params } = await context;
    deletePost(params.id);
    return NextResponse.json({ success: true });
}
