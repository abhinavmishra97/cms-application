import { NextResponse } from "next/server";
import { createPage, getAllPages } from "@/lib/database";

export async function GET() {
  const pages = getAllPages();
  return NextResponse.json(pages);
}

export async function POST(request) {
  const { title, slug, content } = await request.json();
  if (!title || !slug || !content) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  try {
    const page = createPage({ title, slug, content });
    return NextResponse.json(page, { status: 201 });
  } catch (e) {
      console.error(e);
    return NextResponse.json({ error: "Slug must be unique" }, { status: 400 });
  }
}
