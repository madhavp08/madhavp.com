import type { AppProps } from "next/app";
import { ChakraProvider, extendTheme, useColorMode } from "@chakra-ui/react";
import { Prose, withProse } from "@nikolovlazar/chakra-ui-prose";
import Layout from "../components/Layout";
import { useEffect, type ReactElement, type ReactNode } from "react";
import type { NextPage } from "next";
import { DefaultSeo } from "next-seo";
import { Lora } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { site } from "../lib/site";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const lora = Lora({ subsets: ["latin"], display: "swap" });

const theme = extendTheme(
  {
    config: {
      initialColorMode: "dark",
      useSystemColorMode: false,
    },
    styles: {
      global: {
        html: {
          bg: "#111111",
        },
        body: {
          bg: "#111111",
          color: "gray.100",
        },
        "@keyframes vinyl-spin": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "@keyframes needle-drop": {
          from: { transform: "rotate(-28deg)" },
          to: { transform: "rotate(18deg)" },
        },
      },
    },
    fonts: {
      heading: lora.style.fontFamily,
      body: lora.style.fontFamily,
    },
    components: {
      Heading: {
        baseStyle: {
          color: "gray.50",
        },
      },
    },
  },
  withProse({
    baseStyle: {
      color: "gray.100",
      "h1, h2, h3, h4, h5, h6": {
        mt: 4,
        mb: 4,
        color: "gray.50",
      },
      p: {
        my: 3,
        color: "gray.200",
      },
      li: {
        color: "gray.200",
      },
      a: {
        color: "blue.300",
        _focus: {
          boxShadow: "none !important",
        },
      },
    },
  })
);

function ForceDark() {
  const { colorMode, setColorMode } = useColorMode();
  useEffect(() => {
    if (colorMode !== "dark") {
      setColorMode("dark");
    }
  }, [colorMode, setColorMode]);
  return null;
}

const getDefaultLayout = (page: ReactElement) => (
  <Layout>
    <Prose>{page}</Prose>
  </Layout>
);

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || getDefaultLayout;

  return (
    <ChakraProvider theme={theme}>
      <ForceDark />
      <DefaultSeo
        title={site.name}
        description={site.description}
        openGraph={{
          title: site.name,
          description: site.description,
          siteName: site.name,
        }}
      />
      {getLayout(<Component {...pageProps} />)}
      <Analytics />
    </ChakraProvider>
  );
}
