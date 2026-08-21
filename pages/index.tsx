import { Heading, Text, UnorderedList, ListItem, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { MEDIA_HREF, PROJECTS_HREF } from "../lib/site";

export default function Home() {
  return (
    <>
      <Heading as="h1">Madhav Pillai</Heading>
      <Text fontWeight="bold" mt={10}>
        About me:
      </Text>
      <UnorderedList spacing={5}>
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
          life. My highest level of achievement would be starting and
          running a successful company that employs 50 people.
        </ListItem>
        <ListItem>
          I am a devotee of Krishna ॐ and am actively exploring the world of
          non-dualism through the teachings of Advaita Vedanta, Osho, and
          Ashtavakra.
        </ListItem>
      </UnorderedList>
      <Text fontWeight="bold" mt={12}>
        Interests:
      </Text>
      <UnorderedList spacing={5}>
        <ListItem>
          <Text as="span" fontWeight="bold">
            Startups.{" "}
          </Text>
          I love learning and talking about startups, and I truly think that my
          life would be incomplete without trying to build a startup that will
          &quot;change the world.&quot;
        </ListItem>
        <ListItem>
          <Text as="span" fontWeight="bold">
            Teaching.{" "}
          </Text>
          I love explaining concepts to people and seeing their eyes light up.
          I like to think I&apos;m above average at it.
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
      <Text mt={12}>
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
