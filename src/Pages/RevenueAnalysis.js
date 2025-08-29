import React from "react";
import MainLayout from "../Layouts/Index";
import { HStack, Text } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import Seo from "../Utils/Seo";
import FinancialReport from "./RevenueAnalysisPages/FinancialReport";

export default function RevenueAnalysis() {
  return (
    <MainLayout>
      <Seo
        title="Revenue Analysis"
        description="Care Connect Revenue Analysis"
      />

      <HStack>
        <Text color="#1F2937" fontWeight="600" fontSize="19px">
          Revenue Analysis
        </Text>
      </HStack>
      <Text color="#686C75" mt="9px" fontWeight="400" fontSize="15px">
        Access financial reports, revenue summaries, and analytics across all
        departments.
      </Text>

      <Tabs mt="12px">
        <TabList color="#101828" pb="10px" flexWrap={"wrap"}>
          <Tab
            _focus={{ outline: "none" }}
            _selected={{ color: "blue.blue500", fontWeight: "700" }}
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
