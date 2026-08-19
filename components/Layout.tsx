import { Container, VStack, Text, Flex, HStack, Link } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { PropsWithChildren } from "react";
import { site } from "../lib/site";

function Navigation({
  link,
  children,
  isExternal,
}: {
  link: string;
  children: string;
  isExternal?: boolean;
}) {
  const router = useRouter();
  const isActive =
    link === "/" ? router.asPath === link : router.asPath.includes(link);

  return (
    <Link
      href={link}
      target={isExternal ? "_blank" : "_self"}
      color={isActive ? "black" : "gray.500"}
      _hover={{ color: "black" }}
    >
      <Text fontSize="lg">{children}</Text>
    </Link>
  );
}

function NavList() {
  return (
    <>
      <VStack align="flex-start">
        <Text fontWeight="bold" fontSize="smaller">
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
          <Text fontWeight="bold" fontSize="smaller">
            FIND ME ON
          </Text>
          {site.socials.map((item) => (
            <Navigation key={item.href} link={item.href} isExternal>
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
    <Container
      position="relative"
      mt={{ base: 14, lg: 8 }}
      pb={{ base: 6, lg: 8 }}
    >
      <Flex
        position="absolute"
        right="100%"
        mr="160px"
        display={{ base: "none", lg: "flex" }}
      >
        <VStack position="fixed" align="flex-start" spacing={10}>
          <NavList />
        </VStack>
      </Flex>
      <Container width={{ md: "container.md" }} position="relative">
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
          borderBottomColor="gray.200"
          bg="white"
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
        {children}
      </Container>
    </Container>
  );
}

export default Layout;
