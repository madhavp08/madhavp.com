import { serialize } from "next-mdx-remote/serialize";
import path from "path";
import fs from "fs";
import { ArtKind, Piece } from "./art";
import { coverSrc } from "./covers";
import { FAVORITES_HREF } from "./site";

interface CatalogItem {
  slug: string;
  title: string;
  creator: string;
  cover: string;
  spineColor: string;
  textColor: string;
  notes: string;
}

function readCatalog() {
  return JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "content", "favorites.json"), "utf8")
  ) as Record<ArtKind, CatalogItem[]>;
}

export async function getPieces(kind: ArtKind): Promise<Piece[]> {
  const items = readCatalog()[kind] || [];

  return Promise.all(
    items.map(async (item) => {
      const source = await serialize(item.notes || "", {
        mdxOptions: { development: false },
      });

      return {
        title: item.title,
        creator: item.creator,
        coverImage: coverSrc(item.cover),
        spineColor: item.spineColor,
        textColor: item.textColor,
        kind,
        slug: `${FAVORITES_HREF}/${kind}/${item.slug}`,
        notes: source.compiledSource,
      };
    })
  );
}
