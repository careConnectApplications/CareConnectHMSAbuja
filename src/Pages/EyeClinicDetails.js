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
import Examine from "./Examine";
import EyePreliminaryTest from "./EyePreliminaryTest";
import EyeExamination from "./EyeExamination";
import SingleLabReport from "./SingleLabReport";
import Prescription from "./Prescription";
import SingleAdmission from "./SingleAdmission";
import SinglePathograph from "./SinglePathograph";
import Immunization from "./Immunization";
import SingleFamilyPlanning from "./SingleFamilyPlanning";
import AncCards from "./AncCards";
import ANC from "./ANC";
import ANC3 from "./ANC3";
import LabAppointment from "./LabAppointment";
import { useNavigate, useParams } from "react-router-dom";
import SingleVitalChart from "./SingleVitalChart";
import SingleMedicationChart from "./SingleMedicationChart";
import Radiology from "./Radiology";
import SingleProcedure from "./SingleProcedure";
import PathographyChart from "./PathographyChart";
import SingleReferral from "./SingleReferral";
import SingleDeliveryNote from "./SingleDeliveryNote";
import ReferTheatreAdmissionPage from "./ReferTheatreAdmissionPage";
import NutritionPage from "./NutritionPage";
import PsychiatricEvaluations from "./PsychiatricEvaluations";

export default function EyeClinicDetails() {
  const { id } = useParams();

  localStorage.setItem("patientId", id);
  let patientName = localStorage.getItem("PatientName");
  let pathName = localStorage.getItem("pathLocation");
  let patientDetails = JSON.parse(localStorage.getItem("patientDetails"));

  const nav = useNavigate();
  return (
    <MainLayout>
      <Seo
        title="Eye Clinic Schedule Details"
        description="Care Connect Eye Clinic Schedule Details"
      />

      <HStack cursor="pointer">
        <Text
          fontSize="15px"
          onClick={() => nav(`${pathName}`)}
          fontWeight="500"
          color="blue.blue500"
        >
          Patient Timeline{" "}
        </Text>
        <Text fontSize="15px" fontWeight="400" color="#8A8D8E">
          {" "}
          {`> ${patientName} >  MRN: ${patientDetails?.MRN} > Gender: ${patientDetails?.gender} > Age: ${patientDetails?.age} `}{" "}
        </Text>
      </HStack>

      <Text color="#686C75" mt="9px" fontWeight="400" fontSize="15px">
        Give review, notes, findings and diagnosis about patient
      </Text>

      <Tabs mt="12px">
        <TabList color="#101828" pb="10px" flexWrap={"wrap"}>
         
          <Tab
            _focus={{ outline: "none" }}
            _selected={{ color: "blue.blue500", fontWeight: "700" }}
          >
            Preliminary Tests{" "}
          </Tab>
          <Tab
            _focus={{ outline: "none" }}
            _selected={{ color: "blue.blue500", fontWeight: "700" }}
          >
            Examination{" "}
          </Tab>
          <Tab
            _focus={{ outline: "none" }}
            _selected={{ color: "blue.blue500", fontWeight: "700" }}
          >
           Operational Note{" "}
          </Tab>
          <Tab
            _focus={{ outline: "none" }}
            _selected={{ color: "blue.blue500", fontWeight: "700" }}
          >
            Lens prescription{" "}
          </Tab>
         
        </TabList>
        {/* <TabIndicator mt='-1.5px' height='2px' bg='blue.blue500' borderRadius='1px' /> */}
        <TabPanels>
          
          <TabPanel p="0">
            <EyePreliminaryTest  />
          </TabPanel>
          
          <TabPanel p="0">
            <EyeExamination  />
          </TabPanel>
        
        </TabPanels>
      </Tabs>
    </MainLayout>
  );
}
