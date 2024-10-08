import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { error: "Slug parameter is required" },
        { status: 400 }
      );
    }

    console.log(slug);
    const markdownFolder = path.join(process.cwd(), "app/blog");
    const filePath = path.join(markdownFolder, `${slug}.md`);

    const content = await fs.readFile(filePath, "utf-8");
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch
      ? titleMatch[1].replace(/\*\*/g, "")
      : slug.split("-").join(" ").toUpperCase();

    return NextResponse.json({ content, title });
  } catch (error) {
    console.error(`Error reading markdown file for slug:`, error);
    return NextResponse.json(
      { error: "Failed to fetch article content" },
      { status: 404 }
    );
  }
}
