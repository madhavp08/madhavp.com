import { Heading, Text, UnorderedList, ListItem, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { MEDIA_HREF, PROJECTS_HREF } from "../lib/site";

export default function Home() {
  return (
    <>
      <Heading
        as="h1"
        size="3xl"
        mt={0}
        mb={4}
        lineHeight={1}
        sx={{ marginTop: "0 !important" }}
      >
        Madhav Pillai
      </Heading>
      <Text fontWeight="bold" mt={12} mb={0}>
        About me:
      </Text>
      <UnorderedList spacing={6} mt={6} mb={0} ml={0} pl={4}>
        <ListItem>
          I&apos;m currently studying computer science and mathematics at the
          University of Maryland, College Park.
        </ListItem>
        <ListItem>
          This past summer, I interned at Sardine on their Merchant Risk team,
          where I spent most of my time writing code to help with
          client&apos;s compliance processes.
        </ListItem>
        <ListItem>
          Previously, I worked for a government contractor, where I helped
          build and ship an agent to solve IT issues. As of today, it has
          resolved 27% of tickets without the need for any human intervention.
        </ListItem>
        <ListItem>
          I love building things that I believe the world needs, thinking
          through design and product decisions, and seeing the vision come to
          life.
        </ListItem>
        <ListItem>
          I am a devotee of Krishna (ॐ) and am actively exploring the world of
          non-dualism through the teachings of Advaita Vedanta, Osho, and
          Ashtavakra.
        </ListItem>
      </UnorderedList>
      <Text fontWeight="bold" mt={14} mb={0}>
        Interests:
      </Text>
      <UnorderedList spacing={6} mt={6} mb={0}>
        <ListItem>
          <Text as="span" fontWeight="bold">
            Startups.{" "}
          </Text>
          I love learning and talking about startups, and I truly think that my
          life would be incomplete without trying to build a startup once in
          my lifetime.
        </ListItem>
        <ListItem>
          <Text as="span" fontWeight="bold">
            Teaching.{" "}
          </Text>
          I love explaining concepts to people and seeing their eyes light up.
        </ListItem>
        <ListItem>
          <Text as="span" fontWeight="bold">
            Singing.{" "}
          </Text>
          I sang a LOT growing up, won several competitions, and sang in
          honor choirs in India and the USA. Nowadays, I only sing for myself
          and those close to me.
        </ListItem>
        <ListItem>
          <Text as="span" fontWeight="bold">
            Soccer.{" "}
          </Text>
          I played a LOT of soccer growing up and used to be pretty good
          until COVID hit, and I stopped playing for two years. Nowadays, the
          only physical activity I do is going to the gym (sometimes).
        </ListItem>
      </UnorderedList>
      <Text mt={14}>
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
