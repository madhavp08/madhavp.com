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
import {
  MEDIA_KINDS,
  MEDIA_LABELS,
  MEDIA_ROWS,
  MediaKind,
  isMediaKind,
  Piece,
  letterboxdStars,
} from "../../lib/media";
import { getShelves } from "../../lib/media-content";
import { Bookshelf } from "../../components/Bookshelf";
import { VinylPlayer } from "../../components/VinylPlayer";
import { RecommendForm } from "../../components/RecommendForm";
import { MediaHint } from "../../components/MediaHint";
import { NextSeo } from "next-seo";
import { MEDIA_HREF, site } from "../../lib/site";

interface MediaProps {
  shelves: Record<MediaKind, Piece[]>;
  initialSlug?: string;
}

function ratingSource(kind: MediaKind) {
  if (kind === "books") {
    return "Goodreads";
  }
  if (kind === "movies" || kind === "shows") {
    return "Letterboxd";
  }
  return undefined;
}

function playClip(
  audio: HTMLAudioElement,
  piece: Piece,
  setPlaying: (value: boolean) => void
) {
  if (!piece.audio) {
    audio.removeAttribute("src");
    setPlaying(false);
    return;
  }
  audio.src = piece.audio;
  audio.onended = null;
  const start = piece.audioStart ?? 0;
  audio.loop = start === 0;

  function startPlay() {
    if (start > 0 && Number.isFinite(audio.duration)) {
      audio.currentTime = Math.min(start, Math.max(0, audio.duration - 1));
      audio.onended = () => {
        audio.currentTime = start;
        void audio.play();
      };
    }
    void audio.play().then(
      () => setPlaying(true),
      () => setPlaying(false)
    );
  }

  if (start > 0) {
    audio.addEventListener("loadedmetadata", startPlay, { once: true });
  } else {
    startPlay();
  }
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
  const [hint, setHint] = useState(!initialSlug);
  const playerRef = useRef<HTMLAudioElement | null>(null);

  const allPieces = useMemo(
    () => MEDIA_KINDS.flatMap((kind) => shelves[kind] ?? []),
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
    if (next?.kind === "music") {
      playClip(audio, next, setPlaying);
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
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  useEffect(() => {
    if (!hint) {
      return;
    }
    const timer = window.setTimeout(() => setHint(false), 5000);
    function dismiss() {
      setHint(false);
    }
    document.addEventListener("click", dismiss);
    document.addEventListener("keydown", dismiss);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("click", dismiss);
      document.removeEventListener("keydown", dismiss);
    };
  }, [hint]);

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
      if (next?.kind === "music") {
        playClip(audio, next, setPlaying);
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
        gap={{ base: 8, md: 14 }}
      >
        <Flex direction="column" gap={5} flex={1} minW={0}>
          {MEDIA_ROWS.map((row) => (
            <Flex
              key={row.join("-")}
              direction={{ base: "column", md: "row" }}
              gap={{ base: 5, md: row.length > 1 ? 14 : 0 }}
              minW={0}
            >
              {row.map((kind, index) => (
                <Stack key={kind} spacing={1} flex={1} minW={0}>
                  <Text fontWeight="bold" fontSize="smaller">
                    {MEDIA_LABELS[kind].toUpperCase()}
                  </Text>
                  <Bookshelf
                    items={shelves[kind] ?? []}
                    activeSlug={activeSlug}
                    filterId={`paper-${kind}`}
                    onSelect={select}
                    split={
                      row.length > 1
                        ? index === 0
                          ? "start"
                          : "end"
                        : undefined
                    }
                  />
                </Stack>
              ))}
            </Flex>
          ))}
        </Flex>
        <Box
          w={{ md: "300px" }}
          flexShrink={0}
          alignSelf={{ md: "stretch" }}
          pl={{ md: 8 }}
        >
          <Flex h="100%" align="center" justify="center">
            {piece?.kind === "music" ? (
              <Fade in key={piece.slug}>
                <VinylPlayer
                  title={piece.title}
                  artist={piece.creator}
                  cover={piece.coverImage}
                  playing={playing}
                  onToggle={togglePlay}
                />
              </Fade>
            ) : piece ? (
              <Fade in key={piece.slug}>
                <VStack align="stretch" spacing={3} w="100%">
                  {piece.tag && (
                    <Text
                      fontSize="xs"
                      fontWeight="semibold"
                      letterSpacing="0.08em"
                      textTransform="uppercase"
                      color="gray.300"
                      border="1px solid"
                      borderColor="gray.600"
                      px={2}
                      py={0.5}
                      borderRadius="sm"
                      alignSelf="flex-start"
                    >
                      {piece.tag}
                    </Text>
                  )}
                  <Heading size="md">{piece.title}</Heading>
                  <Text color="gray.400">{piece.creator}</Text>
                  {piece.rating != null && (
                    <Text color="gray.300" fontSize="sm">
                      {letterboxdStars(piece.rating)} {piece.rating}
                      {ratingSource(piece.kind)
                        ? ` on ${ratingSource(piece.kind)}`
                        : ""}
                    </Text>
                  )}
                  {piece.blurb && (
                    <Text color="gray.200" textAlign="justify">
                      {piece.blurb}
                    </Text>
                  )}
                  {piece.review && (
                    <Text color="gray.400" fontSize="sm" textAlign="justify">
                      {piece.review}
                    </Text>
                  )}
                </VStack>
              </Fade>
            ) : (
              <Fade in>
                <RecommendForm />
              </Fade>
            )}
          </Flex>
        </Box>
      </Flex>
      {hint && <MediaHint />}
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
