import {
  Flex,
  Heading,
  Stack,
  VStack,
  Text,
  Box,
  Fade,
} from "@chakra-ui/react";
import { GetStaticPropsContext, NextPageWithLayout } from "next";
import { useEffect, useMemo, useState } from "react";
import Layout from "../../components/Layout";
import { Prose } from "@nikolovlazar/chakra-ui-prose";
import { MDXRemote } from "next-mdx-remote";
import {
  MEDIA_KINDS,
  MEDIA_LABELS,
  MediaKind,
  isMediaKind,
  Piece,
} from "../../lib/media";
import { getShelves } from "../../lib/media-content";
import { Bookshelf } from "../../components/Bookshelf";
import { NextSeo } from "next-seo";
import { MEDIA_HREF, site } from "../../lib/site";

interface MediaProps {
  shelves: Record<MediaKind, Piece[]>;
  initialSlug?: string;
}

function slugFromPath(path: string) {
  if (!path.startsWith(`${MEDIA_HREF}/`)) {
    return undefined;
  }
  return path;
}

const Media: NextPageWithLayout<MediaProps> = ({ shelves, initialSlug }) => {
  const [activeSlug, setActiveSlug] = useState(initialSlug);

  const allPieces = useMemo(
    () => MEDIA_KINDS.flatMap((kind) => shelves[kind]),
    [shelves]
  );
  const piece = allPieces.find((item) => item.slug === activeSlug);

  function select(slug?: string) {
    setActiveSlug(slug);
    window.history.replaceState(null, "", slug || MEDIA_HREF);
  }

  useEffect(() => {
    function onPop() {
      setActiveSlug(slugFromPath(window.location.pathname));
    }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  return (
    <>
      <NextSeo
        title={piece ? `${piece.title} | ${site.name}` : `Media | ${site.name}`}
        description={
          piece ? `${piece.title} by ${piece.creator}` : site.description
        }
      />
      <Flex
        direction={{ base: "column", md: "row" }}
        align="flex-start"
        gap={{ base: 6, md: 8 }}
      >
        <Flex direction="column" gap={5} flex={1} minW={0}>
          {MEDIA_KINDS.map((kind) => (
            <Stack key={kind} spacing={2}>
              <Text fontWeight="bold" fontSize="smaller">
                {MEDIA_LABELS[kind].toUpperCase()}
              </Text>
              <Bookshelf
                items={shelves[kind]}
                activeSlug={activeSlug}
                filterId={`paper-${kind}`}
                onSelect={select}
              />
            </Stack>
          ))}
        </Flex>
        <Box
          w={{ md: "280px" }}
          flexShrink={0}
          position={{ md: "sticky" }}
          top={{ md: 10 }}
          alignSelf={{ md: "flex-start" }}
        >
          <Fade in={Boolean(piece)} unmountOnExit>
            {piece && (
              <VStack align="flex-start" spacing={3}>
                <Heading size="md">{piece.title}</Heading>
                <Text color="gray.400">{piece.creator}</Text>
                <Prose>
                  <MDXRemote
                    compiledSource={piece.notes}
                    scope={{}}
                    frontmatter={{}}
                  />
                </Prose>
              </VStack>
            )}
          </Fade>
        </Box>
      </Flex>
    </>
  );
};

export default Media;

Media.getLayout = (page) => <Layout>{page}</Layout>;

export async function getStaticPaths() {
  const shelves = await getShelves();
  const pieces = MEDIA_KINDS.flatMap((kind) => shelves[kind]);
  const prefix = `${MEDIA_HREF}/`;

  return {
    paths: [
      { params: { slug: [] } },
      ...pieces.map((piece) => ({
        params: { slug: piece.slug.replace(prefix, "").split("/") },
      })),
    ],
    fallback: false,
  };
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const shelves = await getShelves();

  if (!params || !params.slug || params.slug.length === 0) {
    return {
      props: {
        shelves,
      },
    };
  }

  if (params.slug.length !== 2 || !isMediaKind(params.slug[0])) {
    return {
      redirect: {
        destination: MEDIA_HREF,
      },
    };
  }

  const initialSlug = `${MEDIA_HREF}/${params.slug[0]}/${params.slug[1]}`;
  const exists = MEDIA_KINDS.flatMap((kind) => shelves[kind]).some(
    (item) => item.slug === initialSlug
  );
  if (!exists) {
    return {
      redirect: {
        destination: MEDIA_HREF,
      },
    };
  }

  return {
    props: { shelves, initialSlug },
  };
}
