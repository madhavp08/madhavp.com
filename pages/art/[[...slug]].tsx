import {
  Flex,
  Heading,
  Image,
  Stack,
  VStack,
  Text,
  Divider,
} from "@chakra-ui/react";
import { GetStaticPropsContext, NextPageWithLayout } from "next";
import Layout from "../../components/Layout";
import { Prose } from "@nikolovlazar/chakra-ui-prose";
import { MDXRemote } from "next-mdx-remote";
import {
  ART_KINDS,
  ART_LABELS,
  ArtKind,
  isArtKind,
  Piece,
} from "../../lib/art";
import { getAllPieces, getPiece, getPieces } from "../../lib/art-content";
import { Bookshelf } from "../../components/Bookshelf";
import { Content } from "../../lib/mdx";
import { NextSeo } from "next-seo";
import { site } from "../../lib/site";

interface ArtProps {
  shelves: Record<ArtKind, Piece[]>;
  piece?: Content<Piece>;
}

const Art: NextPageWithLayout<ArtProps> = ({ shelves, piece }) => {
  return (
    <>
      <NextSeo
        title={piece ? `${piece.metadata.title} | ${site.name}` : `Art | ${site.name}`}
        description={
          piece
            ? `${piece.metadata.title} by ${piece.metadata.creator}`
            : site.description
        }
      />
      <Flex direction="column" gap={10}>
        {ART_KINDS.map((kind) => (
          <Stack key={kind} spacing={3}>
            <Text fontWeight="bold" fontSize="smaller">
              {ART_LABELS[kind].toUpperCase()}
            </Text>
            <Bookshelf
              items={shelves[kind]}
              activeSlug={piece?.metadata.slug}
            />
          </Stack>
        ))}
        {piece && (
          <Stack spacing={6}>
            <Divider />
            <Flex
              direction={{ base: "column", sm: "row" }}
              align="flex-start"
              gap={6}
            >
              <Image
                border="1px solid"
                borderColor="gray.200"
                src={piece.metadata.coverImage}
                alt={piece.metadata.title}
                height={{ base: "180px", sm: "220px", md: "260px" }}
              />
              <VStack align="flex-start" flexGrow={1} spacing={3}>
                <Heading size="xl">{piece.metadata.title}</Heading>
                <Text color="gray.400" fontSize="xl">
                  {piece.metadata.creator}
                </Text>
                <Prose>
                  <MDXRemote
                    compiledSource={piece.source}
                    scope={{}}
                    frontmatter={{}}
                  />
                </Prose>
              </VStack>
            </Flex>
          </Stack>
        )}
      </Flex>
    </>
  );
};

export default Art;

Art.getLayout = (page) => <Layout>{page}</Layout>;

export async function getStaticPaths() {
  const pieces = await getAllPieces();

  return {
    paths: [
      { params: { slug: [] } },
      ...pieces.map((piece) => ({
        params: { slug: piece.slug.replace("/art/", "").split("/") },
      })),
    ],
    fallback: false,
  };
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const shelves = {
    books: await getPieces("books"),
    movies: await getPieces("movies"),
    music: await getPieces("music"),
  };

  if (!params || !params.slug || params.slug.length === 0) {
    return {
      props: {
        shelves,
      },
    };
  }

  if (params.slug.length !== 2 || !isArtKind(params.slug[0])) {
    return {
      redirect: {
        destination: "/art",
      },
    };
  }

  const piece = await getPiece(params.slug[0], params.slug[1]);
  if (!piece) {
    return {
      redirect: {
        destination: "/art",
      },
    };
  }

  return {
    props: { shelves, piece },
  };
}
