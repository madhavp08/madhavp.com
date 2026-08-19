import NextLink from "next/link";
import { Link } from "@chakra-ui/react";

export default function Custom404() {
  return (
    <Link as={NextLink} href="/" color="blue.300">
      Home
    </Link>
  );
}
