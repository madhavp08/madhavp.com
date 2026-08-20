import { Box, Heading, Text, VStack } from "@chakra-ui/react";

interface VinylPlayerProps {
  title: string;
  artist: string;
  cover: string;
  playing: boolean;
  onToggle: () => void;
}

export function VinylPlayer({
  title,
  artist,
  cover,
  playing,
  onToggle,
}: VinylPlayerProps) {
  return (
    <VStack align="center" spacing={5} w="100%">
      <Box position="relative" w="220px" h="240px">
        <Box
          position="absolute"
          left="18px"
          top="18px"
          w="184px"
          h="184px"
          borderRadius="full"
          bg="black"
          opacity={0.55}
          filter="blur(14px)"
        />
        <Box
          as="button"
          type="button"
          aria-label={playing ? `Pause ${title}` : `Play ${title}`}
          onClick={onToggle}
          position="absolute"
          left="10px"
          top="8px"
          w="200px"
          h="200px"
          borderRadius="full"
          overflow="hidden"
          cursor="pointer"
          boxShadow="0 0 0 3px #1a1a1a, 0 0 0 4px #3a3a3a"
          bg="#111"
          animation={playing ? "vinyl-spin 3.6s linear infinite" : undefined}
          sx={{
            backgroundImage: `
              radial-gradient(circle at 50% 50%, transparent 28%, rgba(255,255,255,0.04) 29%, transparent 30%),
              repeating-radial-gradient(circle at 50% 50%, #0a0a0a 0 1px, #161616 2px, #0d0d0d 3px),
              linear-gradient(135deg, rgba(255,255,255,0.16), transparent 42%)
            `,
          }}
        >
          <Box
            position="absolute"
            inset="31%"
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
        </Box>
        <Box
          position="absolute"
          right="6px"
          top="-6px"
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
      <VStack spacing={1} textAlign="center">
        <Heading size="md">{title}</Heading>
        <Text color="gray.400">{artist}</Text>
      </VStack>
    </VStack>
  );
}
