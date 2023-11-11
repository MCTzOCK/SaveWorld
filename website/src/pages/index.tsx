import { Box, Flex, Heading, Text, chakra, Image } from "@chakra-ui/react";
import Logo from "@/components/Logo";

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
          <Flex
            maxW={["100%", "30%"]}
            justifyContent={"center"}
            direction={"column"}
            gap={4}
          >
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
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
