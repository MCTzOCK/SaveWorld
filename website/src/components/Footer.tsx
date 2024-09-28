/**
 * website/src/components/Footer.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 11.11.2023
 *
 */

import * as React from "react";
import {
  Box,
  Button,
  chakra,
  Divider,
  Flex,
  Heading,
  HStack,
  IconButton,
  Image,
  Link,
  LinkProps,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";

export default function Footer() {
  return (
    <>
      <Box w={"100%"} backgroundColor={"black"}>
        <Divider />
        <Box p={{ base: 5, md: 8 }} maxW="7xl" marginInline="auto">
          <Stack
            spacing={{ base: 8, md: 0 }}
            justifyContent="space-between"
            direction={{ base: "column", md: "row" }}
            gap={24}
          >
            <Box maxW="300px">
              <Heading
                as="h1"
                fontSize={"4xl"}
                fontFamily="Inter"
                fontWeight={1000}
                color={"primary.500"}
              >
                SaveWorld
              </Heading>
              <Text mt={2} color="white" fontSize="md">
                Developed by Ben Siebert.
                <br />
                Made with ❤ and ☕ in Hattingen.
              </Text>
            </Box>
            <HStack
              spacing={8}
              display={"flex"}
              justifyContent={{ sm: "space-between", md: "normal" }}
              direction={{ base: "column", md: "row" }}
            >
              <VStack spacing={4} alignItems="flex-start">
                <Text fontSize="md" fontWeight="bold">
                  Über
                </Text>
                <VStack spacing={2} alignItems="flex-start" color="white">
                  <CustomLink href={"/about"}>Über SaveWorld</CustomLink>
                  <CustomLink href={"/contact"}>Kontakt</CustomLink>
                  <CustomLink href={"/news"}>News</CustomLink>
                  <CustomLink href={"/legal/notice"}>Impressum</CustomLink>
                  <CustomLink href={"/legal/privacy"}>Datenschutz</CustomLink>
                </VStack>
              </VStack>
              <VStack spacing={4} alignItems="flex-start">
                <Text fontSize="md" fontWeight="bold">
                  Weiteres
                </Text>
                <VStack spacing={2} alignItems="flex-start" color="white">
                  <CustomLink href={"https://app.saveworld.one"}>
                    Web-App
                  </CustomLink>
                  <CustomLink href={"/download"}>Download</CustomLink>
                  <CustomLink href={"/technical"}>
                    Technische Umsetzung
                  </CustomLink>
                  <CustomLink href={"/paper"}>Schriftliche Arbeit</CustomLink>
                  <CustomLink href={"#"}>&nbsp;</CustomLink>
                </VStack>
              </VStack>
            </HStack>
          </Stack>

          <Divider my={4} />

          <Stack
            direction={{ base: "column", md: "row" }}
            spacing={3}
            justifyContent="space-between"
          >
            <Text fontSize="md">
              Copyright &copy;&nbsp;{new Date().getFullYear()}&nbsp;
              <Link
                href="https://ben-siebert.de"
                _hover={{ textDecoration: "underline" }}
                isExternal
              >
                Ben Siebert
              </Link>
            </Text>
            <Stack spacing={2} direction={{ base: "column", md: "row" }}>
              <IconButton
                aria-label={"Instagram"}
                as={Link}
                target={"_blank"}
                href={"https://instagram.com/saveworld.one"}
                icon={<FaInstagram />}
              />
            </Stack>
          </Stack>
          <Stack
            spacing={2}
            direction={{ base: "column", md: "row" }}
            gap={4}
            justifyContent={"center"}
          >
            <Text fontSize="md">Ausgezeichnet durch:</Text>
            <Link>
              <Image
                src={"//codeup.space/_static/images/logos/jugend-forscht.svg"}
                alt={"Jugend Forscht"}
                width={"150px"}
              />
              <Image
                src={"/buw.jpg"}
                alt={"BundesUmweltWettbewerb"}
                width={"150px"}
              />
            </Link>
          </Stack>
        </Box>
      </Box>
    </>
  );
}

const CustomLink = ({ children, ...props }: LinkProps) => {
  return (
    <Link
      href="#"
      fontSize="sm"
      _hover={{ textDecoration: "underline" }}
      {...props}
    >
      {children}
    </Link>
  );
};
