import React from "react";
import MainLayout from "../Layouts/Index";
import { HStack, Text } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import Seo from "../Utils/Seo";
import FinancialReport from "./RevenueAnalysisPages/FinancialReport";
import { useColors } from "../Utils/colors";

export default function RevenueAnalysis() {
  const {
    bgColor,
    textColor,
    borderColor,
    titleTextColor,
    subTitleTextColor,
    primaryColor,
  } = useColors();
  return (
    <MainLayout>
      <Seo
        title="Revenue Analysis"
        description="Care Connect Revenue Analysis"
      />

      <HStack>
        <Text color={titleTextColor} fontWeight="600" fontSize="18px">
          Revenue Analysis
        </Text>
      </HStack>
      <Text color={subTitleTextColor} mt="9px" fontWeight="400" fontSize="12px">
        Access financial reports, revenue summaries, and analytics across all
        departments.
      </Text>

      <Tabs mt="12px">
        <TabList color={textColor} pb="10px" flexWrap={"wrap"}>
          <Tab
            _focus={{ outline: "none" }}
            _selected={{ color: primaryColor, fontWeight: "700" }}
          >
            Financial Report
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel p="0">
            <FinancialReport />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </MainLayout>
  );
}
