import { Heading, Text, UnorderedList, ListItem, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { MEDIA_HREF, PROJECTS_HREF } from "../lib/site";

export default function Home() {
  return (
    <>
      <Heading as="h1">Madhav Pillai</Heading>
      <Text fontWeight="bold" mt={4}>
        Some things about me:
      </Text>
      <UnorderedList>
        <ListItem>
          I&apos;m currently a software engineering intern at Sardine.
        </ListItem>
        <ListItem>
          Before this I interned at Easy Dynamics. I&apos;m studying computer
          science and mathematics at the University of Maryland, College Park
          [expected May 2028].
        </ListItem>
        <ListItem>I like building software.</ListItem>
      </UnorderedList>
      <Text fontWeight="bold" mt={4}>
        Some things I&apos;m interested in:
      </Text>
      <UnorderedList>
        <ListItem>Singing, soccer, Fortnite, music, and movies.</ListItem>
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
