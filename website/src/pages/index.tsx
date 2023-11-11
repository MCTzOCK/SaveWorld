import {
  Box,
  Flex,
  Heading,
  Text,
  chakra,
  Image,
  Button,
  ButtonGroup,
} from "@chakra-ui/react";
import Logo from "@/components/Logo";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Box h={"100vh"} minH={"fit-content"} w={"100%"}>
        <Flex
          w={"100%"}
          h={"100%"}
          minH={"fit-content"}
          alignItems={"center"}
          justifyContent={"center"}
          direction={["column", "row"]}
          gap={4}
        >
          <Image
            src={"/maksim-shutov-cj0VP7HzQbw-unsplash.jpg"}
            width={"100%"}
            height={"100vh"}
            objectFit={"cover"}
            position={"absolute"}
            zIndex={-1}
            filter={"blur(10px)"}
            alt={""}
          />
          <Flex justifyContent={"center"} direction={"column"} gap={4} p={4}>
            <Heading
              color={"primary.500"}
              fontSize={["6xl", "8xl"]}
              fontWeight={900}
            >
              SaveWorld
            </Heading>
            <Text fontSize={["2xl", "4xl"]} fontWeight={700}>
              Unser Planet braucht deine{" "}
              <chakra.span color={"primary.500"} fontWeight={900}>
                Hilfe
              </chakra.span>
              !
            </Text>
            <Text fontSize={["2xl", "4xl"]} fontWeight={700}>
              Leiste deinen{" "}
              <chakra.span color={"primary.500"} fontWeight={900}>
                Beitrag
              </chakra.span>
              !
            </Text>
            <ButtonGroup w={"100%"} justifyContent={["center", "right"]}>
              <Button
                backgroundColor={"primary.600"}
                size={"lg"}
                _hover={{ backgroundColor: "primary.500" }}
                _active={{ backgroundColor: "primary.700" }}
                as={Link}
                href={"/download"}
                fontSize={"xl"}
              >
                Los geht's
              </Button>
            </ButtonGroup>
          </Flex>
        </Flex>
      </Box>
      <Box h={"100vh"} minH={"fit-content"} w={"100%"}>
        <Flex
          w={"100%"}
          h={"100%"}
          minH={"fit-content"}
          alignItems={"center"}
          justifyContent={"center"}
          direction={["column", "row"]}
          gap={4}
          p={4}
        >
          <Box w={["100%", "30%"]}>
            <Heading color={"primary.500"} fontWeight={900} fontSize={"6xl"}>
              Lernen.
            </Heading>
            <Text fontSize={"3xl"}>
              Lerne mittels{" "}
              <chakra.span fontWeight={900} color={"primary.500"}>
                Short-Form-Content
              </chakra.span>{" "}
              und spannenden Artikeln mehr über{" "}
              <chakra.span fontWeight={900} color={"primary.500"}>
                Nachhaltigkeit
              </chakra.span>
              !
              <br />
              Alle Inhalte sind{" "}
              <chakra.span fontWeight={900} color={"primary.500"}>
                kostenlos
              </chakra.span>
              verfügbar und werden auf Basis von{" "}
              <chakra.span fontWeight={900} color={"primary.500"}>
                Fakten
              </chakra.span>{" "}
              erstellt. Außerdem kannst du die{" "}
              <chakra.span fontWeight={900} color={"primary.500"}>
                Quellen
              </chakra.span>{" "}
              einsehen.
            </Text>
          </Box>

          <Box w={["100%", "60%"]}>
            <Image
              src={"/framed/sustainability.png"}
              rounded={"xl"}
              w={"100%"}
              h={"100%"}
              objectFit={"cover"}
            />
          </Box>
        </Flex>
      </Box>
    </>
  );
}
