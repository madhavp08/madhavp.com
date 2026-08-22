import { Container, VStack, Text, Flex, Box, HStack, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { PropsWithChildren, useState } from "react";
import { site } from "../lib/site";

function Navigation({
  link,
  children,
  isExternal,
  copy,
}: {
  link?: string;
  children: string;
  isExternal?: boolean;
  copy?: string;
}) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const isActive =
    Boolean(link) &&
    (link === "/"
      ? router.pathname === "/"
      : router.asPath.startsWith(link ?? ""));

  if (copy) {
    return (
      <Link
        as="button"
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(copy);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1400);
          } catch {
            setCopied(false);
          }
        }}
        color={copied ? "gray.50" : "gray.400"}
        textDecoration="none"
        _hover={{ color: "gray.50", textDecoration: "none" }}
        bg="transparent"
        border="none"
        p={0}
        cursor="pointer"
        fontFamily="inherit"
      >
        <Text fontSize="md">{copied ? "Copied" : children}</Text>
      </Link>
    );
  }

  if (isExternal && link) {
    return (
      <Link
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        color={isActive ? "gray.50" : "gray.400"}
        _hover={{ color: "gray.50" }}
        transition="color 0.15s ease"
      >
        <Text fontSize="md">{children}</Text>
      </Link>
    );
  }

  return (
    <Link
      as={NextLink}
      href={link ?? "/"}
      color={isActive ? "gray.50" : "gray.400"}
      _hover={{ color: "gray.50" }}
      transition="color 0.15s ease"
    >
      <Text fontSize="md">{children}</Text>
    </Link>
  );
}

function NavList() {
  return (
    <>
      <VStack align="flex-start">
        <Text fontWeight="bold" fontSize="lg" lineHeight={1}>
          NAVIGATION
        </Text>
        {site.navigation.map((item) => (
          <Navigation key={item.href} link={item.href}>
            {item.label}
          </Navigation>
        ))}
      </VStack>
      {site.socials.length > 0 && (
        <VStack align="flex-start">
          <Text fontWeight="bold" fontSize="lg">
            SOCIALS
          </Text>
          {site.socials.map((item) => (
            <Navigation
              key={item.label}
              link={item.href}
              copy={item.copy}
              isExternal={Boolean(item.href)}
            >
              {item.label}
            </Navigation>
          ))}
        </VStack>
      )}
    </>
  );
}

function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Flex
        position="fixed"
        top={0}
        display={{ base: "flex", lg: "none" }}
        height={12}
        zIndex={50}
        left={0}
        width="100%"
        align="center"
        borderBottom="1px solid"
        borderBottomColor="gray.700"
        bg="#111111"
      >
        <Container px={8}>
          <HStack spacing={8}>
            {site.navigation.map((item) => (
              <Navigation key={item.href} link={item.href}>
                {item.label}
              </Navigation>
            ))}
          </HStack>
        </Container>
      </Flex>
      <Flex
        maxW="1240px"
        mx="auto"
        mt={{ base: 16, lg: 8 }}
        pb={{ base: 4, md: 4 }}
        px={{ base: 5, md: 8 }}
        gap={{ lg: 10 }}
        align="flex-start"
      >
        <Box display={{ base: "none", lg: "block" }} w="168px" flexShrink={0}>
          <VStack position="sticky" top={10} align="flex-start" spacing={10}>
            <NavList />
          </VStack>
        </Box>
        <Box flex={1} minW={0}>
          {children}
        </Box>
      </Flex>
    </>
  );
}

export default Layout;
