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
  tag?: string;
}

interface BookshelfProps {
  items: ShelfItem[];
  activeSlug?: string;
  filterId: string;
  onSelect: (slug?: string) => void;
  split?: "start" | "end";
}

const width = 41.5;
const height = 220;
const coverPx = width * 4;
const spineWidth = `${width}px`;
const coverWidth = `${coverPx}px`;
const bookWidth = `${width * 5}px`;
const itemHeight = `${height}px`;
const motion = "500ms ease";

export function Bookshelf({
  items,
  activeSlug,
  filterId,
  onSelect,
  split,
}: BookshelfProps) {
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const itemRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const itemIndex = items.findIndex((item) => item.slug === activeSlug);

  function scrollBy(amount: number) {
    viewportRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  }

  React.useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const openEl = itemIndex >= 0 ? itemRefs.current[itemIndex] : null;
    if (!viewport || !openEl) {
      return;
    }
    const shelf = viewport.getBoundingClientRect();
    const book = openEl.getBoundingClientRect();
    if (book.right > shelf.right) {
      viewport.scrollLeft += book.right - shelf.right + 8;
    }
    if (book.left < shelf.left) {
      viewport.scrollLeft += book.left - shelf.left - 8;
    }
  }, [itemIndex]);

  return (
    <>
      <svg width="0" height="0" aria-hidden="true">
        <defs>
          <filter id={filterId} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="3"
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
            _hover={{ bg: "whiteAlpha.200" }}
          >
            <Text fontSize="sm">‹</Text>
          </Center>
        </Box>
        <HStack
          ref={viewportRef}
          alignItems="center"
          gap={3}
          minH={itemHeight}
          overflowX="auto"
          css={{
            scrollbarWidth: "none",
            overscrollBehaviorX: "contain",
            WebkitOverflowScrolling: "touch",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {items.map((item, index) => {
            const isOpen = index === itemIndex;
            return (
              <button
                key={item.slug}
                type="button"
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
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
                  width: isOpen ? bookWidth : spineWidth,
                  height,
                  perspective: "1000px",
                  WebkitPerspective: "1000px",
                  gap: "0px",
                  padding: 0,
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  zIndex: isOpen ? 1 : 0,
                  transition: `width ${motion}`,
                }}
              >
                <Flex
                  position="relative"
                  alignItems="flex-start"
                  justifyContent="center"
                  width={spineWidth}
                  height={itemHeight}
                  flexShrink={0}
                  overflow="hidden"
                  transformOrigin="right"
                  backgroundColor={item.spineColor}
                  color={item.textColor}
                  transform={`rotateY(${isOpen ? "-60deg" : "0deg"})`}
                  transition={`transform ${motion}`}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <Image
                    src={item.coverImage}
                    alt=""
                    position="absolute"
                    inset={0}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    objectPosition="left center"
                    draggable={false}
                  />
                  <Box
                    position="absolute"
                    inset={0}
                    bg="blackAlpha.200"
                    pointerEvents="none"
                  />
                  {item.tag && (
                    <Box
                      position="absolute"
                      top={0}
                      left="50%"
                      ml="-5px"
                      w="10px"
                      h="20px"
                      bg="#c4a574"
                      zIndex={2}
                      clipPath="polygon(0 0, 100% 0, 100% 100%, 50% 72%, 0 100%)"
                      pointerEvents="none"
                    />
                  )}
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
                    position="relative"
                    zIndex={1}
                    userSelect="none"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                    overflow="hidden"
                    maxHeight={`${height - 24}px`}
                    textShadow="0 1px 2px rgba(0,0,0,0.85)"
                  >
                    {item.title}
                  </Heading>
                </Flex>
                <Box
                  position="relative"
                  flexShrink={0}
                  overflow="hidden"
                  width={coverWidth}
                  height={itemHeight}
                  transformOrigin="left"
                  transform={`rotateY(${isOpen ? "30deg" : "88.8deg"})`}
                  transition={`transform ${motion}`}
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
                      width: coverPx,
                      background:
                        "linear-gradient(to right, rgba(255, 255, 255, 0) 2px, rgba(255, 255, 255, 0.5) 3px, rgba(255, 255, 255, 0.25) 4px, rgba(255, 255, 255, 0.25) 6px, transparent 7px, transparent 9px, rgba(255, 255, 255, 0.25) 9px, transparent 12px)",
                    }}
                  />
                  <Image
                    src={item.coverImage}
                    alt=""
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    objectPosition="center"
                    draggable={false}
                  />
                </Box>
              </button>
            );
          })}
        </HStack>
        <Box
          position="absolute"
          right={
            split === "start"
              ? { base: "-28px", md: 0 }
              : { base: "-28px", md: "-36px" }
          }
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
    </>
  );
}
