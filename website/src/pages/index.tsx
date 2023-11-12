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
import LearnSegment from "@/components/homepage/LearnSegment";
import DownloadButton from "@/components/DownloadButton";
import TrackerSegment from "@/components/homepage/TrackerSegment";
import HeaderSegment from "@/components/homepage/HeaderSegment";
import ArticlesSegment from "@/components/homepage/ArticlesSegment";
import EcoProjectsSegment from "@/components/homepage/EcoProjectsSegment";
import CommunitySegment from "@/components/homepage/CommunitySegment";

export default function Home() {
  const p = [32, 16];
  return (
    <>
      <HeaderSegment />
      <Box p={p}></Box>
      <LearnSegment />
      <Box p={p}></Box>
      <ArticlesSegment />
      <Box p={p}></Box>
      <TrackerSegment />
      <Box p={p}></Box>
      <EcoProjectsSegment />
      <Box p={p}></Box>
      <CommunitySegment />
      <Box p={p}></Box>
    </>
  );
}
