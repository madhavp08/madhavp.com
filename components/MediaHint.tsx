import { Box, Flex, Text } from "@chakra-ui/react";

export function MediaHint() {
  return (
    <Flex
      position="fixed"
      top="42%"
      left={0}
      zIndex={100}
      pointerEvents="none"
      align="center"
      sx={{
        animation: "media-flag-drift 5s linear forwards",
        "@media (prefers-reduced-motion: reduce)": {
          animation: "none",
          left: "50%",
          transform: "translateX(-50%)",
          opacity: 0.85,
        },
        "@keyframes media-flag-drift": {
          "0%": { transform: "translateX(-110%) translateY(0)" },
          "25%": { transform: "translateX(18vw) translateY(-6px)" },
          "50%": { transform: "translateX(45vw) translateY(5px)" },
          "75%": { transform: "translateX(78vw) translateY(-5px)" },
          "100%": { transform: "translateX(112vw) translateY(0)" },
        },
      }}
    >
      <Box
        w="3px"
        h="48px"
        bg="rgba(120, 158, 196, 0.45)"
        borderRadius="full"
        flexShrink={0}
      />
      <Flex
        align="center"
        justify="center"
        h="36px"
        px={5}
        bg="rgba(120, 158, 196, 0.2)"
        sx={{
          transformOrigin: "left center",
          clipPath:
            "polygon(12px 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 12px 100%, 0 50%)",
          animation: "media-flag-wave 2s ease-in-out infinite",
          "@keyframes media-flag-wave": {
            "0%, 100%": { transform: "skewY(0deg)" },
            "50%": { transform: "skewY(1.2deg)" },
          },
        }}
      >
        <Text
          color="whiteAlpha.800"
          fontSize="sm"
          whiteSpace="nowrap"
          letterSpacing="0.02em"
          px={2}
        >
          Click on a movie, book, song, or show
        </Text>
      </Flex>
    </Flex>
  );
}
