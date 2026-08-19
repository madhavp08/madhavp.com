import { Box, Flex, Heading, Image, HStack } from "@chakra-ui/react";
import { useRouter } from "next/router";

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
}

const spineWidth = 41.5;
const coverWidth = spineWidth * 4;
const height = 220;

export function Bookshelf({ items, activeSlug }: BookshelfProps) {
  const router = useRouter();

  return (
    <HStack overflowX="auto" gap={1} align="center" py={1}>
      {items.map((item) => {
        const isOpen = item.slug === activeSlug;

        return (
          <button
            key={item.slug}
            type="button"
            aria-label={item.title}
            onClick={() => router.push(isOpen ? "/art" : item.slug)}
            style={{
              display: "flex",
              flexShrink: 0,
              width: isOpen ? spineWidth * 5 : spineWidth,
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
              width={`${spineWidth}px`}
              height={`${height}px`}
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
                mt="12px"
                as="h2"
                fontSize="xs"
                fontFamily={`"DM Sans", sans-serif`}
                style={{ writingMode: "vertical-rl" }}
                userSelect="none"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                overflow="hidden"
                maxHeight={`${height - 24}px`}
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
                width={`${coverWidth}px`}
                height={`${height}px`}
              />
            </Box>
          </button>
        );
      })}
    </HStack>
  );
}
