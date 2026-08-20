import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import { useEffect, useRef } from "react";

interface LyricLine {
  t: number;
  text: string;
}

interface VinylPlayerProps {
  title: string;
  artist: string;
  cover: string;
  playing: boolean;
  currentTime: number;
  lyrics?: LyricLine[];
  duration: number;
  onToggle: () => void;
}

function clipLyrics(lyrics: LyricLine[], duration: number) {
  const synced = lyrics.some((line) => line.t > 0);
  if (!synced) {
    return lyrics;
  }
  const end = duration > 0 ? duration : 30;
  return lyrics.filter((line) => line.t <= end);
}

function activeIndex(lyrics: LyricLine[], time: number) {
  if (!lyrics.length || time < lyrics[0].t) {
    return -1;
  }
  let index = 0;
  for (let i = 0; i < lyrics.length; i += 1) {
    if (lyrics[i].t <= time) {
      index = i;
    } else {
      break;
    }
  }
  return index;
}

export function VinylPlayer({
  title,
  artist,
  cover,
  playing,
  currentTime,
  duration,
  lyrics,
  onToggle,
}: VinylPlayerProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const lines = clipLyrics(lyrics && lyrics.length ? lyrics : [], duration);
  const synced = lines.some((line) => line.t > 0);
  const current = synced ? activeIndex(lines, currentTime) : -1;

  useEffect(() => {
    if (current < 0) {
      return;
    }
    const scroller = scrollerRef.current;
    const line = lineRefs.current[current];
    if (!scroller || !line) {
      return;
    }
    scroller.scrollTo({
      top: line.offsetTop - scroller.clientHeight / 2 + line.offsetHeight / 2,
      behavior: "smooth",
    });
  }, [current]);

  useEffect(() => {
    lineRefs.current = lineRefs.current.slice(0, lines.length);
  }, [lines.length]);

  return (
    <Box position="relative" h="100%" w="100%" minH="320px" overflow="hidden">
      {lines.length > 0 && (
        <Box
          ref={scrollerRef}
          position="absolute"
          inset={0}
          overflowY="auto"
          px={4}
          css={{
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
            maskImage:
              "linear-gradient(to bottom, transparent, black 8%, black 92%, transparent)",
          }}
        >
          <Box h="42%" minH="140px" />
          {lines.map((line, index) => {
            const isCurrent = index === current;
            return (
              <Text
                key={`${line.t}-${index}`}
                ref={(el) => {
                  lineRefs.current[index] = el;
                }}
                textAlign="center"
                py={2}
                px={2}
                fontSize="lg"
                fontFamily="heading"
                fontWeight={isCurrent ? "semibold" : "normal"}
                color={isCurrent ? "white" : "gray.400"}
                opacity={isCurrent ? 1 : 0.85}
                textShadow={
                  isCurrent
                    ? "0 1px 18px rgba(0,0,0,0.85), 0 0 24px rgba(0,0,0,0.55)"
                    : "0 1px 10px rgba(0,0,0,0.55)"
                }
                transform={isCurrent ? "scale(1.06)" : undefined}
                transition="color 200ms ease, opacity 200ms ease, transform 200ms ease"
                lineHeight="short"
              >
                {line.text}
              </Text>
            );
          })}
          <Box h="42%" minH="140px" />
        </Box>
      )}

      <VStack
        position="relative"
        zIndex={1}
        h="100%"
        justify="center"
        spacing={4}
        pointerEvents="none"
      >
        <Box position="relative" w="248px" h="248px" pointerEvents="auto">
          <Box
            as="button"
            type="button"
            aria-label={playing ? `Pause ${title}` : `Play ${title}`}
            onClick={onToggle}
            position="absolute"
            left="16px"
            top="16px"
            w="216px"
            h="216px"
            borderRadius="full"
            overflow="hidden"
            cursor="pointer"
            bg="transparent"
            boxShadow="0 0 0 3px rgba(26,26,26,0.45), 0 0 0 4px rgba(90,90,90,0.4)"
            animation={playing ? "vinyl-spin 3.6s linear infinite" : undefined}
          >
            <Box
              position="absolute"
              inset={0}
              borderRadius="full"
              bg="rgba(12,12,12,0.22)"
              sx={{
                backgroundImage: `
                  radial-gradient(circle at 50% 50%, transparent 29%, rgba(255,255,255,0.1) 30%, transparent 31%),
                  repeating-radial-gradient(circle at 50% 50%, rgba(255,255,255,0.07) 0 1px, rgba(8,8,8,0.28) 2px, rgba(18,18,18,0.2) 3px)
                `,
              }}
            />
            <Box
              position="absolute"
              inset="32%"
              borderRadius="full"
              overflow="hidden"
              boxShadow="0 0 0 3px #c4a574"
              bgImage={`url(${cover})`}
              bgSize="cover"
              bgPosition="center"
            />
            <Box
              position="absolute"
              left="50%"
              top="50%"
              w="10px"
              h="10px"
              ml="-5px"
              mt="-5px"
              borderRadius="full"
              bg="#111"
              boxShadow="inset 0 0 0 2px #c4a574"
            />
            <Box
              position="absolute"
              inset={0}
              borderRadius="full"
              pointerEvents="none"
              bg="linear-gradient(135deg, rgba(255,255,255,0.18), transparent 42%, transparent 58%, rgba(0,0,0,0.18))"
            />
          </Box>
          <Box
            position="absolute"
            right="4px"
            top="2px"
            w="92px"
            h="14px"
            transformOrigin="12px 7px"
            animation={playing ? "needle-drop 700ms ease forwards" : undefined}
            transform={playing ? "rotate(18deg)" : "rotate(-28deg)"}
            transition="transform 500ms ease"
            pointerEvents="none"
          >
            <Box
              position="absolute"
              left="0"
              top="0"
              w="14px"
              h="14px"
              borderRadius="full"
              bg="#b8b8b8"
              boxShadow="0 0 0 2px #2a2a2a"
            />
            <Box
              position="absolute"
              left="10px"
              top="5px"
              w="78px"
              h="4px"
              bg="linear-gradient(90deg, #888, #ddd)"
              borderRadius="sm"
            />
            <Box
              position="absolute"
              right="-2px"
              top="2px"
              w="8px"
              h="10px"
              bg="#c0392b"
              borderRadius="sm"
            />
          </Box>
        </Box>
        {lines.length === 0 && (
          <VStack
            spacing={1}
            textAlign="center"
            bg="rgba(17,17,17,0.42)"
            backdropFilter="blur(6px)"
            px={4}
            py={1.5}
            borderRadius="md"
          >
            <Heading size="md">{title}</Heading>
            <Text color="gray.400">{artist}</Text>
          </VStack>
        )}
      </VStack>
    </Box>
  );
}
