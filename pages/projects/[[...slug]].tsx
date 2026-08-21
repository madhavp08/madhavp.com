import { Flex, Heading, Stack, Text, Box, Link, Fade } from "@chakra-ui/react";
import { GetStaticPropsContext, NextPageWithLayout } from "next";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { NextSeo } from "next-seo";
import { PROJECTS_HREF, site } from "../../lib/site";
import { getProjects, Project } from "../../lib/projects";

interface ProjectsProps {
  projects: Project[];
  initialSlug?: string;
}

function slugFromPath(path: string) {
  if (!path.startsWith(`${PROJECTS_HREF}/`)) {
    return undefined;
  }
  return path.slice(`${PROJECTS_HREF}/`.length);
}

const Projects: NextPageWithLayout<ProjectsProps> = ({
  projects,
  initialSlug,
}) => {
  const [activeSlug, setActiveSlug] = useState(initialSlug);
  const project = projects.find((item) => item.slug === activeSlug);

  function select(slug?: string) {
    setActiveSlug(slug);
    window.history.replaceState(
      null,
      "",
      slug ? `${PROJECTS_HREF}/${slug}` : PROJECTS_HREF
    );
  }

  useEffect(() => {
    function onPop() {
      setActiveSlug(slugFromPath(window.location.pathname));
    }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  return (
    <>
      <NextSeo
        title={
          project ? `${project.title} | ${site.name}` : `Projects | ${site.name}`
        }
        description={project ? project.blurb : site.description}
      />
      <Flex
        direction={{ base: "column", md: "row" }}
        align="flex-start"
        gap={{ base: 8, md: 10 }}
      >
        <Stack spacing={6} flex={1} minW={0}>
          {projects.map((item) => {
            const isActive = item.slug === activeSlug;
            return (
              <Box
                key={item.slug}
                as="button"
                type="button"
                width="100%"
                textAlign="left"
                onClick={() => select(isActive ? undefined : item.slug)}
                color={isActive ? "gray.50" : "gray.300"}
                _hover={{ color: "gray.50" }}
                transition="color 0.15s ease"
              >
                <Heading size="md">{item.title}</Heading>
                {item.tag && (
                  <Text
                    mt={1}
                    fontSize="xs"
                    fontWeight="semibold"
                    letterSpacing="0.08em"
                    textTransform="uppercase"
                    color={isActive ? "gray.300" : "gray.500"}
                  >
                    {item.tag}
                  </Text>
                )}
                <Text mt={1} color={isActive ? "gray.300" : "gray.500"}>
                  {item.blurb}
                </Text>
              </Box>
            );
          })}
        </Stack>
        <Box
          w={{ md: "280px" }}
          flexShrink={0}
          position={{ md: "sticky" }}
          top={{ md: 10 }}
          alignSelf={{ md: "flex-start" }}
        >
          <Fade in={Boolean(project)} unmountOnExit>
            {project && (
              <Stack spacing={3}>
                {project.tag && (
                  <Text
                    fontSize="xs"
                    fontWeight="semibold"
                    letterSpacing="0.08em"
                    textTransform="uppercase"
                    color="gray.300"
                    border="1px solid"
                    borderColor="gray.600"
                    px={2}
                    py={0.5}
                    borderRadius="sm"
                    alignSelf="flex-start"
                  >
                    {project.tag}
                  </Text>
                )}
                <Heading size="md">{project.title}</Heading>
                <Text color="gray.400">{project.blurb}</Text>
                {project.website && (
                  <Link href={project.website} isExternal color="blue.300">
                    Website
                  </Link>
                )}
                {project.github && (
                  <Link href={project.github} isExternal color="blue.300">
                    GitHub
                  </Link>
                )}
              </Stack>
            )}
          </Fade>
        </Box>
      </Flex>
    </>
  );
};

export default Projects;

Projects.getLayout = (page) => <Layout>{page}</Layout>;

export async function getStaticPaths() {
  const projects = getProjects();
  return {
    paths: [
      { params: { slug: [] } },
      ...projects.map((project) => ({
        params: { slug: [project.slug] },
      })),
    ],
    fallback: false,
  };
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const projects = getProjects();

  if (!params || !params.slug || params.slug.length === 0) {
    return { props: { projects } };
  }

  if (params.slug.length !== 1) {
    return { redirect: { destination: PROJECTS_HREF } };
  }

  const initialSlug = params.slug[0];
  const exists = projects.some((item) => item.slug === initialSlug);
  if (!exists) {
    return { redirect: { destination: PROJECTS_HREF } };
  }

  return { props: { projects, initialSlug } };
}
