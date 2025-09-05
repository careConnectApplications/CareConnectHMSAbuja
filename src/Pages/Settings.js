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
import PriceSettings from "./PriceSettings";
import ClinicSettings from "./ClinicSettings";
import ServiceTypeSettings from "./ServiceTypeSettings";
import WardManagement from "./WardManagement";
import TheatreManagement from "./TheatreManagement";
import InsuranceManagement from "./InsuranceManagement";
import HMOPatientManagement from "./HMOPatientManagement";
import LabResultManagement from "./LabResultManagement";
import AuditManagement from "./AuditManagement";
import PricingModelSettings from "./PricingModelSettings";
import OutreachMedicationSettings from "./OutreachMedicationSettings";
import BedManagement from "./BedManagement";
import InsuranceCoverManagement from "./InsuranceCoverManagement";
import UnitSettings from "./UnitSettings";
import { useColors } from "../Utils/colors";

export default function Settings() {
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
      <Seo title="Settings" description="Care Connect Settings" />

      <HStack>
        <Text color={titleTextColor} fontWeight="600" fontSize="19px">
          Settings
        </Text>
      </HStack>
      <Text color={subTitleTextColor} mt="9px" fontWeight="400" fontSize="15px">
        Organize, manage and view all settings to suit what is needed at anytime
        at your convenience.
      </Text>

      <Tabs mt="12px">
        <TabList color={textColor} pb="10px" flexWrap={"wrap"}>
          <Tab
            _focus={{ outline: "none" }}
            _selected={{ color: primaryColor, fontWeight: "700" }}
          >
            Price{" "}
          </Tab>
          <Tab
            _focus={{ outline: "none" }}
            _selected={{ color: primaryColor, fontWeight: "700" }}
          >
            Clinic/Pharmacy/Department
          </Tab>
          <Tab
            _focus={{ outline: "none" }}
            _selected={{ color: primaryColor, fontWeight: "700" }}
          >
            Service Type{" "}
          </Tab>
          <Tab
            _focus={{ outline: "none" }}
            _selected={{ color: primaryColor, fontWeight: "700" }}
          >
            Ward Management
          </Tab>
          <Tab
            _focus={{ outline: "none" }}
            _selected={{ color: primaryColor, fontWeight: "700" }}
          >
            Theatre Management
          </Tab>
          <Tab
            _focus={{ outline: "none" }}
            _selected={{ color: primaryColor, fontWeight: "700" }}
          >
            Insurance Management
          </Tab>
          <Tab
            _focus={{ outline: "none" }}
            _selected={{ color: primaryColor, fontWeight: "700" }}
          >
            HMO Patient Management
          </Tab>
          <Tab
            _focus={{ outline: "none" }}
            _selected={{ color: primaryColor, fontWeight: "700" }}
          >
            Lab Result Management
          </Tab>
          <Tab
            _focus={{ outline: "none" }}
            _selected={{ color: primaryColor, fontWeight: "700" }}
          >
            Audit
          </Tab>
          <Tab
            _focus={{ outline: "none" }}
            _selected={{ color: primaryColor, fontWeight: "700" }}
          >
            Pricing Model
          </Tab>
          <Tab
            _focus={{ outline: "none" }}
            _selected={{ color: primaryColor, fontWeight: "700" }}
          >
            Outreach Medication
          </Tab>
          <Tab
            _focus={{ outline: "none" }}
            _selected={{ color: primaryColor, fontWeight: "700" }}
          >
            Bed Management
          </Tab>
          <Tab
            _focus={{ outline: "none" }}
            _selected={{ color: primaryColor, fontWeight: "700" }}
          >
            Insurance Cover Management
          </Tab>
          <Tab
            _focus={{ outline: "none" }}
            _selected={{ color: primaryColor, fontWeight: "700" }}
          >
            Unit Management
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel p="0">
            <PriceSettings />
          </TabPanel>
          <TabPanel p="0">
            <ClinicSettings />
          </TabPanel>
          <TabPanel p="0">
            <ServiceTypeSettings />
          </TabPanel>
          <TabPanel p="0">
            <WardManagement />
          </TabPanel>
          <TabPanel p="0">
            <TheatreManagement />
          </TabPanel>
          <TabPanel p="0">
            <InsuranceManagement />
          </TabPanel>
          <TabPanel p="0">
            <HMOPatientManagement />
          </TabPanel>
          <TabPanel p="0">
            <LabResultManagement />
          </TabPanel>
          <TabPanel p="0">
            <AuditManagement />
          </TabPanel>
          <TabPanel p="0">
            <PricingModelSettings />
          </TabPanel>
          <TabPanel p="0">
            <OutreachMedicationSettings />
          </TabPanel>
          <TabPanel p="0">
            <BedManagement />
          </TabPanel>
          <TabPanel p="0">
            <InsuranceCoverManagement />
          </TabPanel>
          <TabPanel p="0">
            <UnitSettings />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </MainLayout>
  );
}
