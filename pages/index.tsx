import { Heading, Text, UnorderedList, ListItem, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { MEDIA_HREF, PROJECTS_HREF } from "../lib/site";

export default function Home() {
  return (
    <>
      <Heading as="h1">Madhav Pillai</Heading>
      <Text fontWeight="bold" mt={4}>
        About me:
      </Text>
      <UnorderedList>
        <ListItem>coming soon...</ListItem>
      </UnorderedList>
      <Text fontWeight="bold" mt={4}>
        Interests:
      </Text>
      <UnorderedList>
        <ListItem>coming soon...</ListItem>
      </UnorderedList>
      <Text mt={4}>
        Check out my{" "}
        <Link as={NextLink} href={MEDIA_HREF} color="blue.300">
          media
        </Link>{" "}
        and{" "}
        <Link as={NextLink} href={PROJECTS_HREF} color="blue.300">
          projects
        </Link>
        .
      </Text>
    </>
  );
}
