/**
 * website/src/components/presentation/Presentation.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 04.02.2024
 *
 */

import * as React from "react";
import { Box, Flex, Grid, IconButton, Text } from "@chakra-ui/react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaTable,
  FaTableCellsLarge,
} from "react-icons/fa6";
import { AnimatePresence, motion } from "framer-motion";
import { FaBoxes } from "react-icons/fa";
import { BiFullscreen } from "react-icons/bi";

export default function Presentation(props: { children: React.ReactNode }) {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [slides, setSlides] = React.useState<React.ReactNode[]>([]);

  const [overview, setOverview] = React.useState(false);

  React.useEffect(() => {
    setSlides(React.Children.toArray(props.children));
  }, [props.children]);

  // arrow navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        if (currentSlide < slides.length - 1) {
          setCurrentSlide(currentSlide + 1);
        }
      } else if (e.key === "ArrowLeft") {
        if (currentSlide > 0) {
          setCurrentSlide(currentSlide - 1);
        }
      } else if (e.keyCode === 27) {
        setOverview(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide]);

  return (
    <Box>
      <Box w={"100%"} h={"100vh"} display={overview ? "initial" : "none"}>
        <Grid
          templateColumns={["repeat(2, 1fr)"]}
          gap={4}
          p={4}
          w={"100%"}
          h={"100%"}
        >
          {slides.map((slide, index) => (
            <>
              <Box
                onClick={() => {
                  setCurrentSlide(index);
                  setOverview(false);
                }}
                cursor={"pointer"}
                borderRadius={8}
                boxShadow={"md"}
                border={"1px solid #e0e0e0"}
                maxH={"600px"}
                w={"100%"}
                overflow={"hidden"}
              >
                <Box
                  style={{
                    transform: "scale(1)",
                    overflow: "hidden",
                  }}
                >
                  {slide}
                </Box>
              </Box>
            </>
          ))}
        </Grid>
      </Box>
      <Box w={"100%"} h={"100vh"} display={overview ? "none" : "inherit"}>
        {slides[currentSlide]}
      </Box>
      <Box
        position={"fixed"}
        bottom={0}
        w={"100%"}
        p={4}
        display={overview ? "none" : "initial"}
      >
        <Flex alignItems={"center"} justifyContent={"center"} gap={4}>
          <IconButton
            aria-label={"Slide overview"}
            icon={<FaTableCellsLarge />}
            onClick={() => setOverview(true)}
          />
        </Flex>
        <Flex alignItems={"center"} justifyContent={"center"} gap={4}>
          <IconButton
            aria-label={"Previous Slide"}
            icon={<FaArrowLeft />}
            onClick={() => setCurrentSlide(currentSlide - 1)}
            isDisabled={currentSlide === 0}
          />
          <Text textAlign={"center"}>
            {currentSlide + 1} / {slides.length}
          </Text>
          <IconButton
            aria-label={"Next Slide"}
            icon={<FaArrowRight />}
            onClick={() => setCurrentSlide(currentSlide + 1)}
            isDisabled={currentSlide === slides.length - 1}
          />
        </Flex>
      </Box>
      <Box
        position={"fixed"}
        bottom={0}
        right={0}
        p={4}
        display={overview ? "none" : "initial"}
      >
        <Flex alignItems={"center"} justifyContent={"center"} gap={4}>
          <IconButton
            aria-label={"Slide overview"}
            icon={<BiFullscreen />}
            onClick={() => {
              if (document.fullscreenElement) {
                document.exitFullscreen();
              } else {
                document.documentElement.requestFullscreen();
              }
            }}
          />
        </Flex>
      </Box>
    </Box>
  );
}
