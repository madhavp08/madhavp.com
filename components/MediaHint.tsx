import { Box, Flex, Text } from "@chakra-ui/react";

export function MediaHint() {
  return (
    <Flex
      position="fixed"
      inset={0}
      align="center"
      justify="center"
      zIndex={100}
      pointerEvents="none"
    >
      <Flex
        align="center"
        sx={{
          animation: "media-flag-float 5s ease-in-out forwards",
          "@keyframes media-flag-float": {
            "0%": {
              opacity: 0,
              transform: "translate(0, 6px) rotate(-1.5deg)",
            },
            "10%": {
              opacity: 1,
              transform: "translate(4px, -4px) rotate(1deg)",
            },
            "40%": {
              opacity: 1,
              transform: "translate(-8px, 6px) rotate(-1.2deg)",
            },
            "70%": {
              opacity: 1,
              transform: "translate(6px, -5px) rotate(0.8deg)",
            },
            "88%": {
              opacity: 1,
              transform: "translate(-2px, 2px) rotate(-0.6deg)",
            },
            "100%": {
              opacity: 0,
              transform: "translate(0, -4px) rotate(0deg)",
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
            animation: "media-flag-wave 1.8s ease-in-out infinite",
            "@keyframes media-flag-wave": {
              "0%, 100%": { transform: "skewY(0deg)" },
              "50%": { transform: "skewY(1.4deg)" },
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
    </Flex>
  );
}
