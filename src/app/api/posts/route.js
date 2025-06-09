import { NextResponse } from "next/server";
import { createPost, getAllPosts } from "@/lib/database";

export async function GET() {
  const posts = getAllPosts();
  return NextResponse.json(posts);
}

export async function POST(request) {
  const { title, content, author } = await request.json();
  console.log({ title, content, author });
  if (!title || !content || !author) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  try {
    const post = createPost({ title, content, author });
    return NextResponse.json(post, { status: 201 });
  } catch {
    return NextResponse.json({ error}, { status: 400 });
  }
}
