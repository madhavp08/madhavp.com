import { Box, Flex, Text } from "@chakra-ui/react";

export function MediaHint() {
  return (
    <Flex
      position="fixed"
      top="38%"
      left={0}
      zIndex={100}
      pointerEvents="none"
      align="center"
      sx={{
        animation: "media-flag-fly 5s linear forwards",
        "@keyframes media-flag-fly": {
          "0%": {
            transform: "translateX(-110%) translateY(10px) rotate(-8deg)",
          },
          "22%": {
            transform: "translateX(16vw) translateY(-14px) rotate(5deg)",
          },
          "48%": {
            transform: "translateX(42vw) translateY(12px) rotate(-6deg)",
          },
          "74%": {
            transform: "translateX(72vw) translateY(-10px) rotate(4deg)",
          },
          "100%": {
            transform: "translateX(112vw) translateY(8px) rotate(-5deg)",
          },
        },
      }}
    >
      <Box
        w="3px"
        h="52px"
        bg="whiteAlpha.500"
        borderRadius="full"
        flexShrink={0}
      />
      <Flex
        align="center"
        h="36px"
        pl={3}
        pr={7}
        bg="whiteAlpha.200"
        sx={{
          transformOrigin: "left center",
          clipPath:
            "polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%)",
          animation: "media-flag-wave 0.65s ease-in-out infinite",
          "@keyframes media-flag-wave": {
            "0%, 100%": { transform: "skewY(0deg)" },
            "50%": { transform: "skewY(3deg)" },
          },
        }}
      >
        <Text
          color="whiteAlpha.800"
          fontSize="sm"
          whiteSpace="nowrap"
          letterSpacing="0.02em"
        >
          Click on a movie, book, song, or show
        </Text>
      </Flex>
    </Flex>
  );
}
