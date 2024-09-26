import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const markdownFolder = path.join(process.cwd(), "app/blog");
    const files = await fs.readdir(markdownFolder);

    const articles = await Promise.all(
      files
        .filter((file) => file.endsWith(".md"))
        .map(async (file) => {
          const filePath = path.join(markdownFolder, file);
          const content = await fs.readFile(filePath, "utf-8");
          const titleMatch = content.match(/^#\s+(.+)$/m);
          const title = titleMatch
            ? titleMatch[1]
            : file.replace(".md", "").split("-").join(" ");

          return {
            slug: file.replace(".md", ""),
            title: title.toUpperCase(),
          };
        })
    );

    return NextResponse.json(articles);
  } catch (error) {
    console.error("Error reading markdown files:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}
