import { serialize } from "next-mdx-remote/serialize";
import path from "path";
import fs from "fs";
import { ArtKind, Piece } from "./art";
import { FAVORITES_HREF } from "./site";

export async function getPieces(kind: ArtKind): Promise<Piece[]> {
  const basePath = path.join(process.cwd(), "content", "art", kind);
  const files = fs
    .readdirSync(basePath)
    .filter((file) => file.endsWith(".mdx"))
    .sort();

  return Promise.all(
    files.map(async (fileName) => {
      const fileContents = fs.readFileSync(path.join(basePath, fileName), "utf8");
      const source = await serialize(fileContents, {
        parseFrontmatter: true,
        mdxOptions: { development: false },
      });

      return {
        ...(source.frontmatter as Omit<Piece, "kind" | "slug" | "notes">),
        kind,
        slug: `${FAVORITES_HREF}/${kind}/${fileName.replace(/\.mdx$/, "")}`,
        notes: source.compiledSource,
      };
    })
  );
}
