import { Box, Center, Flex, Heading, HStack, Text } from "@chakra-ui/react";
import React from "react";
import { DM_Sans } from "next/font/google";

const dmSans = DM_Sans({ subsets: ["latin"], weight: "400" });

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
  onSelect: (slug?: string) => void;
}

const width = 41.5;
const height = 220;
const spineWidth = `${width}px`;
const itemHeight = `${height}px`;

export function Bookshelf({ items, activeSlug, onSelect }: BookshelfProps) {
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const itemIndex = items.findIndex((item) => item.slug === activeSlug);

  function scrollBy(amount: number) {
    viewportRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  }

  return (
    <Box position="relative">
      <Box
        position="absolute"
        left={{ base: "-28px", md: "-36px" }}
        height="100%"
        zIndex={2}
      >
        <Center
          as="button"
          type="button"
          aria-label="Scroll left"
          borderRadius="md"
          height="100%"
          width="28px"
          onClick={() => scrollBy(-(width + 12) * 4)}
          _hover={{ bg: "whiteAlpha.200" }}
        >
          <Text fontSize="sm">‹</Text>
        </Center>
      </Box>
      <HStack
        ref={viewportRef}
        alignItems="center"
        gap={1}
        overflowX="auto"
        css={{
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {items.map((item, index) => {
          const isOpen = index === itemIndex;
          return (
            <button
              key={item.slug}
              type="button"
              aria-label={item.title}
              aria-pressed={isOpen}
              onClick={() => onSelect(isOpen ? undefined : item.slug)}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                outline: "none",
                flexShrink: 0,
                width: spineWidth,
                height,
                perspective: "1000px",
                WebkitPerspective: "1000px",
                gap: "0px",
                padding: 0,
                border: "none",
                background: "none",
                cursor: "pointer",
              }}
            >
              <Flex
                position="relative"
                alignItems="flex-start"
                justifyContent="center"
                width={spineWidth}
                height={itemHeight}
                flexShrink={0}
                transformOrigin="right"
                backgroundColor={item.spineColor}
                color={item.textColor}
                transform={`rotateY(${isOpen ? "-28deg" : "0deg"})`}
                transition="transform 200ms ease"
                filter={isOpen ? "brightness(1.15)" : undefined}
                style={{ transformStyle: "preserve-3d" }}
              >
                <Heading
                  mt="12px"
                  as="h2"
                  fontSize="xs"
                  className={dmSans.className}
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
            </button>
          );
        })}
      </HStack>
      <Box
        position="absolute"
        right={{ base: "-28px", md: "-36px" }}
        pl="10px"
        height="100%"
        top={0}
        zIndex={2}
      >
        <Center
          as="button"
          type="button"
          aria-label="Scroll right"
          height="100%"
          borderRadius="md"
          width="28px"
          onClick={() => scrollBy((width + 12) * 4)}
          _hover={{ bg: "whiteAlpha.200" }}
        >
          <Text fontSize="sm">›</Text>
        </Center>
      </Box>
    </Box>
  );
}
