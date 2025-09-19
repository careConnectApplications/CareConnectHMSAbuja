import {
  HStack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Box,
  Flex,
} from "@chakra-ui/react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  TabIndicator,
  Image,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import MainLayout from "../Layouts/Index";
import Seo from "../Utils/Seo";
import ANC3 from "./ANC3";
import FirstStageLabour from "./FirstStageLabour";
import SecondStageLabour from "./SecondStageLabour";
import ThirdStageLabour from "./ThirdStageLabour";
import BirthRegister from "./BirthRegister";
import PostnatalCare from "./PostnatalCare";
import MortalityRegister from "./MortalityRegister";
import SingleVitalChart from "./SingleVitalChart";
import SingleMedicationChart from "./SingleMedicationChart";
import { useNavigate, useParams } from "react-router-dom";
import { useColors } from "../Utils/colors";

export default function MaternityTimeline() {
  const {
    bgColor,
    textColor,
    borderColor,
    titleTextColor,
    subTitleTextColor,
    chartFillColor,
    primaryColor,
    secondaryColor,
    NavListBg,
  } = useColors();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { id } = useParams();
  const [audio] = React.useState(new Audio("/beep.mp3"));

  localStorage.setItem("patientId", id);
  let patientName = localStorage.getItem("PatientName");
  let pathName = localStorage.getItem("pathLocation");
  let patientDetails = JSON.parse(localStorage.getItem("patientDetails"));

  useEffect(() => {
    if (patientDetails?.specialNeeds) {
      audio.loop = true;
      audio.play();
    }
    return () => {
      audio.pause();
    };
  }, [audio, patientDetails?.specialNeeds]);

  const nav = useNavigate();
  return (
    <MainLayout>
      <Seo
        title="Maternity Timeline"
        description="Care Connect Maternity Timeline"
      />
      {patientDetails?.specialNeeds && (
        <Flex
          justifyContent="center"
          alignItems="center"
          p="2"
          bg="red.100"
          cursor="pointer"
          onClick={() => {
            onOpen();
            audio.pause();
          }}
        >
          <div className="blinking-dot"></div>
          <Text ml="2" color="red.600" fontWeight="bold">
            This patient has special needs. Click to view.
          </Text>
        </Flex>
      )}

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Special Needs</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>{patientDetails?.specialNeeds}</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue.blue500" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <HStack cursor="pointer">
        <Text
          fontSize="15px"
          onClick={() => nav(`${pathName}`)}
          fontWeight="500"
          color="blue.blue500"
        >
          Maternity Timeline{" "}
        </Text>
        <Text fontSize="15px" fontWeight="400" color="#8A8D8E">
          {" "}
          {`> ${patientName} >  MRN: ${patientDetails?.MRN} > Gender: ${patientDetails?.gender} > Age: ${patientDetails?.age} `}{" "}
        </Text>
      </HStack>

      <Text color="#686C75" mt="9px" fontWeight="400" fontSize="15px">
        Comprehensive maternity care management and monitoring
      </Text>

      <Tabs mt="12px">
        <TabList color={textColor} pb="10px" flexWrap={"wrap"}>
          <Tab
            _focus={{ outline: "none" }}
            _selected={{ color: primaryColor, fontWeight: "700" }}
          >
            ANC
          </Tab>

          <Tab
            _focus={{ outline: "none" }}
            _selected={{ color: primaryColor, fontWeight: "700" }}
          >
            First Stage Labour
          </Tab>

          <Tab
            _focus={{ outline: "none" }}
            _selected={{ color: primaryColor, fontWeight: "700" }}
          >
            Second Stage Labour
          </Tab>

          <Tab
            _focus={{ outline: "none" }}
            _selected={{ color: primaryColor, fontWeight: "700" }}
          >
            Third Stage Labour
          </Tab>

          <Tab
            _focus={{ outline: "none" }}
            _selected={{ color: primaryColor, fontWeight: "700" }}
          >
            Birth Register
          </Tab>

          <Tab
            _focus={{ outline: "none" }}
            _selected={{ color: primaryColor, fontWeight: "700" }}
          >
            Postnatal Care
          </Tab>

          <Tab
            _focus={{ outline: "none" }}
            _selected={{ color: primaryColor, fontWeight: "700" }}
          >
            Mortality Register
          </Tab>

          <Tab
            _focus={{ outline: "none" }}
            _selected={{ color: primaryColor, fontWeight: "700" }}
          >
            Medication
          </Tab>

          <Tab
            _focus={{ outline: "none" }}
            _selected={{ color: primaryColor, fontWeight: "700" }}
          >
            Vitals
          </Tab>
        </TabList>
        
        <TabPanels>
          <TabPanel p="0">
            <ANC3 id={id} />
          </TabPanel>
          <TabPanel p="0">
            <FirstStageLabour id={id} />
          </TabPanel>
          <TabPanel p="0">
            <SecondStageLabour id={id} />
          </TabPanel>
          <TabPanel p="0">
            <ThirdStageLabour id={id} />
          </TabPanel>
          <TabPanel p="0">
            <BirthRegister id={id} />
          </TabPanel>
          <TabPanel p="0">
            <PostnatalCare id={id} />
          </TabPanel>
          <TabPanel p="0">
            <MortalityRegister id={id} />
          </TabPanel>
          <TabPanel p="0">
            <SingleMedicationChart />
          </TabPanel>
          <TabPanel p="0">
            <SingleVitalChart />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </MainLayout>
  );
}
