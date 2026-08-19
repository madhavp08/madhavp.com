import { serialize } from "next-mdx-remote/serialize";
import path from "path";
import fs from "fs";
import { ART_KINDS, ArtKind, Piece } from "./art";
import { getMdxContent, MaybeContent } from "./mdx";
import { FAVORITES_HREF } from "./site";

export async function getPieces(kind: ArtKind): Promise<Piece[]> {
  const basePath = path.join(process.cwd(), "content", "art", kind);
  const files = fs.readdirSync(basePath).filter((file) => file.endsWith(".mdx"));

  return Promise.all(
    files.map(async (fileName) => {
      const fileContents = fs.readFileSync(path.join(basePath, fileName), "utf8");
      const source = await serialize(fileContents, {
        parseFrontmatter: true,
        mdxOptions: { development: false },
      });

      return {
        ...(source.frontmatter as Omit<Piece, "kind" | "slug">),
        kind,
        slug: `${FAVORITES_HREF}/${kind}/${fileName.replace(/\.mdx$/, "")}`,
      };
    })
  );
}

export async function getAllPieces(): Promise<Piece[]> {
  const shelves = await Promise.all(ART_KINDS.map((kind) => getPieces(kind)));
  return shelves.flat();
}

export async function getPiece(
  kind: ArtKind,
  slug: string
): Promise<MaybeContent<Piece>> {
  const piece = await getMdxContent<Piece>("art", kind, `${slug}.mdx`);
  if (!piece) {
    return undefined;
  }

  return {
    metadata: {
      ...piece.metadata,
      kind,
      slug: `${FAVORITES_HREF}/${kind}/${slug}`,
    },
    source: piece.source,
  };
}
