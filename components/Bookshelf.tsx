import { Box, Flex, Heading, Image, HStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FAVORITES_HREF } from "../lib/site";

export interface ShelfItem {
  title: string;
  coverImage: string;
  spineColor: string;
  textColor: string;
  slug: string;
}

interface BookshelfProps {
  items: ShelfItem[];
  activeSlug?: string;
  compact?: boolean;
}

const RATIO = 41.5 / 220;

export function Bookshelf({ items, activeSlug, compact = false }: BookshelfProps) {
  const router = useRouter();
  const heightVh = compact ? 10.5 : 15;
  const height = `${heightVh}vh`;
  const spineWidth = `${heightVh * RATIO}vh`;
  const coverWidth = `${heightVh * RATIO * 4}vh`;

  return (
    <HStack overflowX="hidden" gap={1} align="center">
      {items.map((item) => {
        const isOpen = item.slug === activeSlug;

        return (
          <button
            key={item.slug}
            type="button"
            aria-label={item.title}
            onClick={() => router.push(isOpen ? FAVORITES_HREF : item.slug)}
            style={{
              display: "flex",
              flexShrink: 0,
              width: isOpen ? `${heightVh * RATIO * 5}vh` : spineWidth,
              height,
              perspective: 1000,
              WebkitPerspective: 1000,
              padding: 0,
              border: "none",
              background: "none",
              cursor: "pointer",
              outline: "none",
              transition: "width 500ms ease",
            }}
          >
            <Flex
              justify="center"
              width={spineWidth}
              height={height}
              flexShrink={0}
              transformOrigin="right"
              backgroundColor={item.spineColor}
              color={item.textColor}
              transform={`rotateY(${isOpen ? "-60deg" : "0deg"})`}
              transition="transform 500ms ease"
              filter="brightness(0.8) contrast(2)"
              style={{ transformStyle: "preserve-3d" }}
            >
              <Heading
                mt="0.4em"
                as="h2"
                fontSize="xs"
                fontFamily={`"DM Sans", sans-serif`}
                style={{ writingMode: "vertical-rl" }}
                userSelect="none"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                overflow="hidden"
                maxHeight={`calc(${height} - 0.8em)`}
              >
                {item.title}
              </Heading>
            </Flex>
            <Box
              position="relative"
              overflow="hidden"
              transformOrigin="left"
              transform={`rotateY(${isOpen ? "30deg" : "88.8deg"})`}
              transition="transform 500ms ease"
              filter="brightness(0.8) contrast(2)"
              style={{ transformStyle: "preserve-3d" }}
            >
              <Image
                src={item.coverImage}
                alt=""
                width={coverWidth}
                height={height}
              />
            </Box>
          </button>
        );
      })}
    </HStack>
  );
}
