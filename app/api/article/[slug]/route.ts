import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const markdownFolder = path.join(process.cwd(), "app/markdown");
    const filePath = path.join(markdownFolder, `${slug}.md`);

    const content = await fs.readFile(filePath, "utf-8");
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch
      ? titleMatch[1].replace(/\*\*/g, "")
      : slug.split("-").join(" ").toUpperCase();

    return NextResponse.json({ content, title });
  } catch (error) {
    console.error(
      `Error reading markdown file for slug ${params.slug}:`,
      error
    );
    return NextResponse.json(
      { error: "Failed to fetch article content" },
      { status: 404 }
    );
  }
}
