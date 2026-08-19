import {
  Box,
  Center,
  Flex,
  Heading,
  HStack,
  Image,
  Text,
} from "@chakra-ui/react";
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
  filterId: string;
  onSelect: (slug?: string) => void;
}

const width = 41.5;
const height = 220;
const spineWidth = `${width}px`;
const coverWidth = `${width * 4}px`;
const itemWidth = `${width * 5}px`;
const itemHeight = `${height}px`;

export function Bookshelf({
  items,
  activeSlug,
  filterId,
  onSelect,
}: BookshelfProps) {
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const itemIndex = items.findIndex((item) => item.slug === activeSlug);

  function scrollBy(amount: number) {
    viewportRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  }

  return (
    <>
      <svg
        style={{
          position: "absolute",
          inset: 0,
          visibility: "hidden",
        }}
      >
        <defs>
          <filter id={filterId} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="8"
              result="noise"
            />
            <feDiffuseLighting
              in="noise"
              lightingColor="white"
              surfaceScale="1"
              result="diffLight"
            >
              <feDistantLight azimuth="45" elevation="35" />
            </feDiffuseLighting>
          </filter>
        </defs>
      </svg>

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
            _hover={{ bg: "gray.100" }}
          >
            <Text fontSize="sm">‹</Text>
          </Center>
        </Box>
        <HStack
          ref={viewportRef}
          alignItems="center"
          gap={1}
          overflowX="auto"
          cursor="grab"
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
                onClick={() => onSelect(isOpen ? undefined : item.slug)}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  outline: "none",
                  flexShrink: 0,
                  width: isOpen ? itemWidth : spineWidth,
                  height,
                  perspective: "1000px",
                  WebkitPerspective: "1000px",
                  gap: "0px",
                  padding: 0,
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  transition: "width 500ms ease, transform 500ms ease",
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
                  transform={`rotateY(${isOpen ? "-60deg" : "0deg"})`}
                  transition="transform 500ms ease"
                  filter={isOpen ? "brightness(0.8) contrast(2)" : undefined}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {isOpen && (
                    <span
                      style={{
                        pointerEvents: "none",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        zIndex: 50,
                        height,
                        width,
                        opacity: 0.4,
                        filter: `url(#${filterId})`,
                      }}
                    />
                  )}
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
                {isOpen && (
                  <Box
                    position="relative"
                    flexShrink={0}
                    overflow="hidden"
                    transformOrigin="left"
                    transform="rotateY(30deg)"
                    filter="brightness(0.8) contrast(2)"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <span
                      style={{
                        pointerEvents: "none",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        zIndex: 50,
                        height,
                        width: width * 4,
                        background:
                          "linear-gradient(to right, rgba(255, 255, 255, 0) 2px, rgba(255, 255, 255, 0.5) 3px, rgba(255, 255, 255, 0.25) 4px, rgba(255, 255, 255, 0.25) 6px, transparent 7px, transparent 9px, rgba(255, 255, 255, 0.25) 9px, transparent 12px)",
                      }}
                    />
                    <Image
                      src={item.coverImage}
                      alt={item.title}
                      width={coverWidth}
                      height={itemHeight}
                    />
                  </Box>
                )}
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
            _hover={{ bg: "gray.100" }}
          >
            <Text fontSize="sm">›</Text>
          </Center>
        </Box>
      </Box>
    </>
  );
}
