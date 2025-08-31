import { HStack, Text } from "@chakra-ui/react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  TabIndicator,
  Image,
} from "@chakra-ui/react";
import React from "react";
import MainLayout from "../Layouts/Index";
import Seo from "../Utils/Seo";
import RadiologyInsurance from "../Components/Insurance/RadiologyInsurance";
import ProcedureInsurance from "../Components/Insurance/ProcedureInsurance";
import PharmacyInsurance from "../Components/Insurance/PharmacyInsurance";
import LabInsurance from "../Components/Insurance/LabInsurance";
import HistopathologyInsurance from "../Components/Insurance/HistopathologyInsurance";
import { useColors } from "../Utils/colors";

export default function Insurance() {
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
      <Seo title="Insurance" description="Care Connect Insurance" />

      <HStack>
        <Text color={titleTextColor} fontWeight="600" fontSize="19px">
          Insurance
        </Text>
      </HStack>
      <Text color={subTitleTextColor} mt="9px" fontWeight="400" fontSize="15px">
        Manage and view all insurance details and claims.
      </Text>

      <Tabs mt="12px">
        <TabList color={textColor} pb="10px" flexWrap={"wrap"}>
          <Tab
            _focus={{ outline: "none" }}
            _selected={{ color: primaryColor, fontWeight: "700" }}
          >
            Radiology
          </Tab>
          <Tab
            _focus={{ outline: "none" }}
            _selected={{ color: primaryColor, fontWeight: "700" }}
          >
            Procedure
          </Tab>
          <Tab
            _focus={{ outline: "none" }}
            _selected={{ color: primaryColor, fontWeight: "700" }}
          >
            Pharmacy
          </Tab>
          <Tab
            _focus={{ outline: "none" }}
            _selected={{ color: primaryColor, fontWeight: "700" }}
          >
            Lab
          </Tab>
          <Tab
            _focus={{ outline: "none" }}
            _selected={{ color: primaryColor, fontWeight: "700" }}
          >
            Histopathology
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel p="0">
            <RadiologyInsurance />
          </TabPanel>
          <TabPanel p="0">
            <ProcedureInsurance />
          </TabPanel>
          <TabPanel p="0">
            <PharmacyInsurance />
          </TabPanel>
          <TabPanel p="0">
            <LabInsurance />
          </TabPanel>
          <TabPanel p="0">
            <HistopathologyInsurance />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </MainLayout>
  );
}
