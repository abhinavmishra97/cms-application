import { NextResponse } from "next/server";
import { getPageBySlug, updatePage, deletePage } from "@/lib/database";

export async function GET(request, context) {
  const { params } = await context;
  const page = getPageBySlug(params.slug);
  if (!page) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(page);
}

export async function PUT(request, context) {
  const { params } = await context;
  const { title, content } = await request.json();
  if (!title || !content) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  updatePage(params.slug, { title, content });
  return NextResponse.json({ success: true });
}

export async function DELETE(request, context) {
  const { params } = await context;
  deletePage(params.slug);
  return NextResponse.json({ success: true });
}
