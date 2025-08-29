import React from "react";
import MainLayout from "../Layouts/Index";
import { HStack, Text } from "@chakra-ui/react";
import {
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    TabIndicator,
} from "@chakra-ui/react";
import Seo from "../Utils/Seo";
import BirthReport from "./MedicalReportPages/BirthReport";
import DeathReport from "./MedicalReportPages/DeathReport";
import InPatientReport from "./MedicalReportPages/InPatientReport";
import OutPatientReport from "./MedicalReportPages/OutPatientReport";
import LabInvestigationReport from "./MedicalReportPages/LabInvestigationReport";
import RadiologyReport from "./MedicalReportPages/RadiologyReport";
import ProcedureReport from "./MedicalReportPages/ProcedureReport";
import ImmunizationReport from "./MedicalReportPages/ImmunizationReport";
import PharmacyReport from "./MedicalReportPages/PharmacyReport";

export default function MedicalReport() {
    return (
        <MainLayout>
            <Seo title="Medical Report" description="Care Connect Medical Report" />

            <HStack>
                <Text color="#1F2937" fontWeight="600" fontSize="19px">
                    Medical Report
                </Text>
            </HStack>
            <Text color="#686C75" mt="9px" fontWeight="400" fontSize="15px">
                Access medical reports, clinical summaries, and patient care analytics across all departments.
            </Text>

            <Tabs mt="12px">
                <TabList color="#101828" pb="10px" flexWrap={"wrap"}>
                    <Tab
                        _focus={{ outline: "none" }}
                        _selected={{ color: "blue.blue500", fontWeight: "700" }}
                    >
                        Birth Report
                    </Tab>
                    <Tab
                        _focus={{ outline: "none" }}
                        _selected={{ color: "blue.blue500", fontWeight: "700" }}
                    >
                        Death Report
                    </Tab>
                    <Tab
                        _focus={{ outline: "none" }}
                        _selected={{ color: "blue.blue500", fontWeight: "700" }}
                    >
                        In-Patient
                    </Tab>
                    <Tab
                        _focus={{ outline: "none" }}
                        _selected={{ color: "blue.blue500", fontWeight: "700" }}
                    >
                        Out-Patient
                    </Tab>
                    <Tab
                        _focus={{ outline: "none" }}
                        _selected={{ color: "blue.blue500", fontWeight: "700" }}
                    >
                        Lab Investigation
                    </Tab>
                    <Tab
                        _focus={{ outline: "none" }}
                        _selected={{ color: "blue.blue500", fontWeight: "700" }}
                    >
                        Radiology Report
                    </Tab>
                    <Tab
                        _focus={{ outline: "none" }}
                        _selected={{ color: "blue.blue500", fontWeight: "700" }}
                    >
                        Procedure Report
                    </Tab>
                    <Tab
                        _focus={{ outline: "none" }}
                        _selected={{ color: "blue.blue500", fontWeight: "700" }}
                    >
                        Immunization Report
                    </Tab>
                    <Tab
                        _focus={{ outline: "none" }}
                        _selected={{ color: "blue.blue500", fontWeight: "700" }}
                    >
                        Pharmacy Report
                    </Tab>
                </TabList>
                <TabPanels>
                    <TabPanel p="0">
                        <BirthReport />
                    </TabPanel>
                    <TabPanel p="0">
                        <DeathReport />
                    </TabPanel>
                    <TabPanel p="0">
                        <InPatientReport />
                    </TabPanel>
                    <TabPanel p="0">
                        <OutPatientReport />
                    </TabPanel>
                    <TabPanel p="0">
                        <LabInvestigationReport />
                    </TabPanel>
                    <TabPanel p="0">
                        <RadiologyReport />
                    </TabPanel>
                    <TabPanel p="0">
                        <ProcedureReport />
                    </TabPanel>
                    <TabPanel p="0">
                        <ImmunizationReport />
                    </TabPanel>
                    <TabPanel p="0">
                        <PharmacyReport />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </MainLayout>
    );
}
