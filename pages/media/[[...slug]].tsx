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
import { useEffect, useMemo, useRef, useState } from "react";
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
import { VinylPlayer } from "../../components/VinylPlayer";
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
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef<HTMLAudioElement | null>(null);

  const allPieces = useMemo(
    () => MEDIA_KINDS.flatMap((kind) => shelves[kind]),
    [shelves]
  );
  const piece = allPieces.find((item) => item.slug === activeSlug);

  function select(slug?: string) {
    const next = allPieces.find((item) => item.slug === slug);
    setActiveSlug(slug);
    window.history.replaceState(null, "", slug || MEDIA_HREF);
    const audio = playerRef.current;
    if (!audio) {
      return;
    }
    audio.pause();
    setCurrentTime(0);
    setDuration(0);
    if (next?.kind === "music" && next.audio) {
      audio.src = next.audio;
      audio.loop = true;
      void audio.play().then(
        () => setPlaying(true),
        () => setPlaying(false)
      );
    } else {
      audio.removeAttribute("src");
      setPlaying(false);
    }
  }

  function togglePlay() {
    const audio = playerRef.current;
    if (!audio || !piece?.audio) {
      return;
    }
    if (audio.paused) {
      void audio.play().then(
        () => setPlaying(true),
        () => setPlaying(false)
      );
    } else {
      audio.pause();
      setPlaying(false);
    }
  }

  useEffect(() => {
    const audio = new Audio();
    playerRef.current = audio;
    const onTime = () => {
      setCurrentTime(audio.currentTime);
      if (Number.isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onTime);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onTime);
      audio.pause();
      audio.src = "";
    };
  }, []);

  useEffect(() => {
    function onPop() {
      const slug = slugFromPath(window.location.pathname);
      setActiveSlug(slug);
      const next = allPieces.find((item) => item.slug === slug);
      const audio = playerRef.current;
      if (!audio) {
        return;
      }
      audio.pause();
      setCurrentTime(0);
      setDuration(0);
      if (next?.kind === "music" && next.audio) {
        audio.src = next.audio;
        audio.loop = true;
        void audio.play().then(
          () => setPlaying(true),
          () => setPlaying(false)
        );
      } else {
        audio.removeAttribute("src");
        setPlaying(false);
      }
    }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [allPieces]);

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
        align={{ base: "flex-start", md: "stretch" }}
        gap={{ base: 6, md: 8 }}
      >
        <Flex direction="column" gap={8} flex={1} minW={0}>
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
          w={{ md: "300px" }}
          flexShrink={0}
          alignSelf={{ md: "stretch" }}
        >
          {piece?.kind === "music" ? (
            <Box position="relative" h="100%" minH={{ base: "420px", md: "100%" }}>
              <Fade in style={{ height: "100%" }}>
                <Box h="100%">
                  <VinylPlayer
                    title={piece.title}
                    artist={piece.creator}
                    cover={piece.coverImage}
                    playing={playing}
                    currentTime={currentTime}
                    duration={duration}
                    lyrics={piece.lyrics}
                    onToggle={togglePlay}
                  />
                </Box>
              </Fade>
            </Box>
          ) : (
            <Box
              position={{ md: "sticky" }}
              top={{ md: 10 }}
            >
              <Fade in={Boolean(piece)} unmountOnExit>
                {piece ? (
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
                ) : null}
              </Fade>
            </Box>
          )}
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
