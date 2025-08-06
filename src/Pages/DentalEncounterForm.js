import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Text,
  Flex,
  HStack,
  SimpleGrid,
  Stack,
  Tag,
  TagLabel,
  TagCloseButton,
  Select,
  Button,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { FaNoteSticky, FaTeeth, FaCalendarAlt } from "react-icons/fa6";
import { GiTooth } from "react-icons/gi";
import { SlPlus } from "react-icons/sl";
import { IoIosCloseCircle } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import MainLayout from "../Layouts/Index";
import Seo from "../Utils/Seo";
import ShowToast from "../Components/ToastNotification";
import PatientInfoCard from "../Components/PatientInfoCard";
import {
  CreateDentalEncounterApi,
  SettingsApi,
  GetDiagnosisICApi,
} from "../Utils/ApiCalls";

export default function DentalEncounterForm() {
  const { id } = useParams();
  const [Loading, setLoading] = useState(false);
  const [SearchICD, setSearchICD] = useState("");
  const [DiagnosisICD, setDiagnosisICD] = useState([]);
  const nav = useNavigate();
  const pathname = localStorage.getItem("pathname");

  // Selected values for multi-select fields
  const [selectedArrays, setSelectedArrays] = useState({
    chiefComplaint: [],
    dentalHistoryNotes: [],
    previousDentalProcedure: [],
    allergies: [],
    additionalComplaints: [],
    firstQuadrantNote: [],
    secondQuadrantNote: [],
    thirdQuadrantNote: [],
    fourthQuadrantNote: [],
    otherFindings: [],
    notes: [],
    otherIntraOral: [],
    overallImpression: [],
    provisionalDiagnosis: [],
    diagnosisList: [],
    diagnosisNotes: [],
    proposedTreatments: [],
    descriptionOfProcedure: [],
  });

  // Input values for adding new items to arrays
  const [inputValues, setInputValues] = useState({
    chiefComplaint: "",
    dentalHistoryNotes: "",
    previousDentalProcedure: "",
    allergies: "",
    additionalComplaints: "",
    firstQuadrantNote: "",
    secondQuadrantNote: "",
    thirdQuadrantNote: "",
    fourthQuadrantNote: "",
    otherFindings: "",
    notes: "",
    otherIntraOral: "",
    overallImpression: "",
    provisionalDiagnosis: "",
    diagnosisList: "",
    diagnosisNotes: "",
    proposedTreatments: "",
    descriptionOfProcedure: "",
  });

  const [Payload, setPayload] = useState({
    chiefComplaint: [],
    dentalHistoryNotes: [],
    previousDentalProcedure: [],
    allergies: [],
    lastDentalVisit: new Date().toISOString().split("T")[0],
    currentMedications: "",
    additionalComplaints: [],
    otherDentalHistory: "",
    firstQuadrantNote: [],
    secondQuadrantNote: [],
    thirdQuadrantNote: [],
    fourthQuadrantNote: [],
    medicalConditions: "",
    alerts: "",
    gingivalAssessment: "",
    periodontalProbing: "",
    xrayRadiographicFindings: "",
    cariesDetection: "",
    occlusalAnalysis: "",
    oralCancerScreening: "",
    tmjAssessment: "",
    teethPresent: "",
    missingTeeth: "",
    mobileTeeth: "",
    cariousTeeth: "",
    retainedRoots: "",
    fracturedTeeth: "",
    impactedTeeth: "",
    tenderToPercussion: "",
    filledTeeth: "",
    periodontalPockets: "",
    cervicalAbrasions: "",
    crownBridgeRestoration: "",
    dentures: "",
    calculus: "",
    otherFindings: [],
    notes: [],
    intraOral: "",
    tongue: "",
    mucosa: "",
    otherIntraOral: [],
    overallImpression: [],
    provisionalDiagnosis: [],
    diagnosisList: [],
    diagnosisNotes: [],
    proposedTreatments: [],
    priorityAndUrgency: "",
    procedureDate: new Date().toISOString().split("T")[0],
    descriptionOfProcedure: [],
    toothNumbersTreated: "",
    anesthesiaDetails: "",
    materialsUsed: "",
    procedureNotes: "",
    postProcedureCareInstructions: "",
    appointmentoradmissionunderscoreid:
      localStorage.getItem("appointmentId") || "",
  });

  const DROPDOWN_FIELDS = {
    gingivalAssessment: {
      label: "Gingival Assessment",
      options: [
        "Healthy",
        "Inflamed",
        "Receding",
        "Bleeding",
        "Periodontal Pockets",
      ],
      icon: <GiTooth />,
    },
    tmjAssessment: {
      label: "TMJ Assessment",
      options: ["Normal", "Clicking", "Painful", "Limited Movement", "Other"],
      icon: <GiTooth />,
    },
    oralCancerScreening: {
      label: "Oral Cancer Screening",
      options: ["Normal", "Abnormal", "Biopsy Recommended"],
      icon: <GiTooth />,
    },
    intraOral: {
      label: "Intraoral",
      options: [
        "Swollen Gum",
        "Recession",
        "Tenderness",
        "Hyperemic Gum",
        "Periodontal Pockets",
      ],
      icon: <GiTooth />,
    },
    priorityAndUrgency: {
      label: "Priority and Urgency",
      options: ["Urgent", "Routine", "Elective"],
      icon: <FaNoteSticky />,
    },
  };

  const getAllICD = async (value) => {
    try {
      const result = await GetDiagnosisICApi({ diagnosis: value });
      setDiagnosisICD(result.queryresult || []);
    } catch (e) {
      console.error("Failed to fetch ICD codes:", e);
      ShowToast("Failed to fetch diagnosis codes", "error");
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchICD(value);
    if (value.trim()) {
      getAllICD(value);
    } else {
      setDiagnosisICD([]);
    }
  };

  const handleDiagnosisSelect = (e) => {
    const value = e.target.value;
    if (value && !selectedArrays.diagnosisList.includes(value)) {
      const newArray = [...selectedArrays.diagnosisList, value];
      setSelectedArrays({ ...selectedArrays, diagnosisList: newArray });
      setPayload({ ...Payload, diagnosisList: newArray });
      setSearchICD("");
      setDiagnosisICD([]);
    }
  };

  const handlePayload = (e) => {
    const { id, value } = e.target;
    setPayload({ ...Payload, [id]: value });
  };

  const handleInputChange = (field, value) => {
    setInputValues({ ...inputValues, [field]: value });
  };

  const handleAddItem = (field) => {
    const value = inputValues[field].trim();
    if (value) {
      const newArray = [...selectedArrays[field], value];
      setSelectedArrays({ ...selectedArrays, [field]: newArray });
      setPayload({ ...Payload, [field]: newArray });
      setInputValues({ ...inputValues, [field]: "" });
    }
  };

  const handleRemoveItem = (field, index) => {
    const newArray = selectedArrays[field].filter((_, i) => i !== index);
    setSelectedArrays({ ...selectedArrays, [field]: newArray });
    setPayload({ ...Payload, [field]: newArray });
  };

  const handleSubmit = async () => {
    if (!Payload.appointmentoradmissionunderscoreid) {
      ShowToast("Appointment ID is required", "error");
      return;
    }

    setLoading(true);

    try {
      const result = await CreateDentalEncounterApi(id, {
        ...Payload,
        status: "completed",
      });

      if (result.status === 200) {
        ShowToast("Dental encounter submitted successfully", "success");
        nav(`${pathname}`);
      }
    } catch (e) {
      if (e.response?.data?.msg) {
        ShowToast(e.response.data.msg, "error");
      } else if (e.response?.data) {
        ShowToast(e.response.data, "error");
      } else if (e.request) {
        ShowToast("No response from server", "error");
      } else {
        ShowToast(e.message, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const renderDropdown = (field) => {
    const config = DROPDOWN_FIELDS[field];
    return (
      <Box>
        <Text fontSize="14px" fontWeight="500" mb="8px">
          {config.label}
        </Text>
        <Select
          h="45px"
          w="100%"
          borderWidth="2px"
          fontSize={Payload[field] !== "" ? "16px" : "13px"}
          borderColor="#6B7280"
          id={field}
          value={Payload[field]}
          onChange={handlePayload}
          placeholder={`Select ${config.label}`}
        >
          {config.options.map((option, i) => (
            <option key={i} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </Box>
    );
  };

  const renderInput = (field, label, type = "text") => {
    return (
      <Box>
        <Text fontSize="14px" fontWeight="500" mb="8px">
          {label}
        </Text>
        <Input
          type={type}
          value={Payload[field]}
          onChange={handlePayload}
          id={field}
          w="100%"
          h="50px"
          fontSize="16px"
          borderWidth="2px"
          borderColor="#6B7280"
          placeholder={`Enter ${label}`}
        />
      </Box>
    );
  };

  const renderTextarea = (field, label) => {
    return (
      <Box>
        <Text fontSize="14px" fontWeight="500" mb="8px">
          {label}
        </Text>
        <Textarea
          value={Payload[field]}
          onChange={handlePayload}
          id={field}
          w="100%"
          minH="100px"
          borderWidth="2px"
          borderColor="#6B7280"
          fontSize="16px"
          placeholder={`Enter ${label}`}
        />
      </Box>
    );
  };

  const renderArrayInput = (field, label) => {
    return (
      <Box>
        <Text fontSize="14px" fontWeight="500" mb="8px">
          {label}
        </Text>
        <HStack spacing={2} alignItems="flex-start" mb="2">
          <Input
            value={inputValues[field]}
            onChange={(e) => handleInputChange(field, e.target.value)}
            placeholder={`Enter ${label}`}
            w={{ base: "85%", md: "90%" }}
            h="50px"
            fontSize="16px"
            borderWidth="2px"
            borderColor="#6B7280"
          />
          <Button
            rightIcon={<SlPlus />}
            onClick={() => handleAddItem(field)}
            isDisabled={!inputValues[field].trim()}
            w="50px"
            h="40px"
            fontSize="12px"
            minW="50px"
            bg="#EA5937"
            color="white"
            _hover={{ bg: "#d04a2a" }}
          >
            Add
          </Button>
        </HStack>
        <HStack wrap="wrap">
          {selectedArrays[field].map((item, index) => (
            <Tag
              key={index}
              size="md"
              borderRadius="full"
              variant="solid"
              bg="#EA5937"
              color="white"
              m={1}
            >
              <TagLabel>{item}</TagLabel>
              <TagCloseButton onClick={() => handleRemoveItem(field, index)} />
            </Tag>
          ))}
        </HStack>
      </Box>
    );
  };

  const renderDiagnosisList = () => {
    return (
      <Box>
        <Text fontSize="14px" fontWeight="500" mb="8px">
          Diagnosis List
        </Text>
        <Stack spacing={2}>
          <Input
            value={SearchICD}
            onChange={handleSearch}
            placeholder="Search ICD 11"
            w="100%"
            h="50px"
            fontSize="16px"
            borderWidth="2px"
            borderColor="#6B7280"
          />
          <Select
            h="45px"
            w="100%"
            borderWidth="2px"
            borderColor="#6B7280"
            fontSize={selectedArrays.diagnosisList.length > 0 ? "16px" : "13px"}
            onChange={handleDiagnosisSelect}
            placeholder="Select diagnosis ICD 11"
          >
            {DiagnosisICD.map((item, i) => (
              <option key={i} value={item[1]}>
                {`${item[0]} ~ ${item[1]}`}
              </option>
            ))}
          </Select>
        </Stack>
        <HStack wrap="wrap" mt="2">
          {selectedArrays.diagnosisList.map((item, index) => (
            <Tag
              key={index}
              size="md"
              borderRadius="full"
              variant="solid"
              bg="#EA5937"
              color="white"
              m={1}
            >
              <TagLabel>{item}</TagLabel>
              <TagCloseButton
                onClick={() => handleRemoveItem("diagnosisList", index)}
              />
            </Tag>
          ))}
        </HStack>
      </Box>
    );
  };

  return (
    <MainLayout>
      <Seo title="Add Dental Encounter" description="Dental Encounter Form" />
      <Box>
        <Button
          leftIcon={<IoMdArrowRoundBack />}
          px="40px"
          w="100px"
          onClick={() => nav(`${pathname}`)}
          mb="4"
          bg="#EA5937"
          color="white"
          _hover={{ bg: "#d04a2a" }}
        >
          Back
        </Button>
        <PatientInfoCard />

        <Accordion defaultIndex={[0]} mt="32px" allowToggle>
          {/* Patient Information */}
          <AccordionItem mb="15px">
            <AccordionButton
              _hover={{ border: "1px solid #EA5937", color: "#000" }}
              _focus={{ outline: "none" }}
              border="1px solid #fff"
              _expanded={{ rounded: "8px 8px 0px 0px", border: 0 }}
              bg="#fff"
              color="#000"
              rounded="8px"
            >
              <Box as="span" flex="1" textAlign="left">
                Patient Information
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                {renderArrayInput("chiefComplaint", "Chief Complaint(s)")}
                {renderArrayInput("dentalHistoryNotes", "Dental History Notes")}
                {renderArrayInput(
                  "previousDentalProcedure",
                  "Previous Dental Procedures"
                )}
                {renderArrayInput("allergies", "Allergies")}
                {renderArrayInput(
                  "additionalComplaints",
                  "Additional Complaints"
                )}
                {renderInput("lastDentalVisit", "Last Dental Visit", "date")}
                {renderTextarea("currentMedications", "Current Medications")}
                {renderTextarea("otherDentalHistory", "Other Dental History")}
              </SimpleGrid>
            </AccordionPanel>
          </AccordionItem>

          {/* Quadrant Notes */}
          <AccordionItem mb="15px">
            <AccordionButton
              _hover={{ border: "1px solid #EA5937", color: "#000" }}
              _focus={{ outline: "none" }}
              border="1px solid #fff"
              _expanded={{ rounded: "8px 8px 0px 0px", border: 0 }}
              bg="#fff"
              color="#000"
              rounded="8px"
            >
              <Box as="span" flex="1" textAlign="left">
                Quadrant Notes
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                {renderArrayInput("firstQuadrantNote", "First Quadrant Notes")}
                {renderArrayInput(
                  "secondQuadrantNote",
                  "Second Quadrant Notes"
                )}
                {renderArrayInput("thirdQuadrantNote", "Third Quadrant Notes")}
                {renderArrayInput(
                  "fourthQuadrantNote",
                  "Fourth Quadrant Notes"
                )}
              </SimpleGrid>
            </AccordionPanel>
          </AccordionItem>

          {/* Medical Information */}
          <AccordionItem mb="15px">
            <AccordionButton
              _hover={{ border: "1px solid #EA5937", color: "#000" }}
              _focus={{ outline: "none" }}
              border="1px solid #fff"
              _expanded={{ rounded: "8px 8px 0px 0px", border: 0 }}
              bg="#fff"
              color="#000"
              rounded="8px"
            >
              <Box as="span" flex="1" textAlign="left">
                Medical Information
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                {renderTextarea("medicalConditions", "Medical Conditions")}
                {renderTextarea("alerts", "Alerts")}
              </SimpleGrid>
            </AccordionPanel>
          </AccordionItem>

          {/* Clinical Examination */}
          <AccordionItem mb="15px">
            <AccordionButton
              _hover={{ border: "1px solid #EA5937", color: "#000" }}
              _focus={{ outline: "none" }}
              border="1px solid #fff"
              _expanded={{ rounded: "8px 8px 0px 0px", border: 0 }}
              bg="#fff"
              color="#000"
              rounded="8px"
            >
              <Box as="span" flex="1" textAlign="left">
                Clinical Examination
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                {renderDropdown("gingivalAssessment")}
                {renderDropdown("oralCancerScreening")}
                {renderDropdown("tmjAssessment")}
                {renderTextarea("periodontalProbing", "Periodontal Probing")}
                {renderTextarea(
                  "xrayRadiographicFindings",
                  "X-ray/Radiographic Findings"
                )}
                {renderTextarea("cariesDetection", "Caries Detection")}
                {renderTextarea("occlusalAnalysis", "Occlusal Analysis")}
                {renderInput("teethPresent", "Teeth Present")}
                {renderInput("missingTeeth", "Missing Teeth")}
                {renderInput("mobileTeeth", "Mobile Teeth")}
                {renderInput("cariousTeeth", "Carious Teeth")}
                {renderInput("retainedRoots", "Retained Roots")}
                {renderInput("fracturedTeeth", "Fractured Teeth")}
                {renderInput("impactedTeeth", "Impacted Teeth")}
                {renderInput("tenderToPercussion", "Tender to Percussion")}
                {renderInput("filledTeeth", "Filled Teeth")}
                {renderInput("periodontalPockets", "Periodontal Pockets")}
                {renderInput("cervicalAbrasions", "Cervical Abrasions")}
                {renderInput(
                  "crownBridgeRestoration",
                  "Crown/Bridge Restoration"
                )}
                {renderInput("dentures", "Dentures")}
                {renderInput("calculus", "Calculus")}
                {renderArrayInput("otherFindings", "Other Findings")}
                {renderArrayInput("notes", "Notes")}
              </SimpleGrid>
            </AccordionPanel>
          </AccordionItem>

          {/* Intraoral Examination */}
          <AccordionItem mb="15px">
            <AccordionButton
              _hover={{ border: "1px solid #EA5937", color: "#000" }}
              _focus={{ outline: "none" }}
              border="1px solid #fff"
              _expanded={{ rounded: "8px 8px 0px 0px", border: 0 }}
              bg="#fff"
              color="#000"
              rounded="8px"
            >
              <Box as="span" flex="1" textAlign="left">
                Intraoral Examination
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                {renderDropdown("intraOral")}
                {renderTextarea("tongue", "Tongue")}
                {renderTextarea("mucosa", "Mucosa")}
                {renderArrayInput("otherIntraOral", "Other Intraoral")}
              </SimpleGrid>
            </AccordionPanel>
          </AccordionItem>

          {/* Diagnosis & Treatment Plan */}
          <AccordionItem mb="15px">
            <AccordionButton
              _hover={{ border: "1px solid #EA5937", color: "#000" }}
              _focus={{ outline: "none" }}
              border="1px solid #fff"
              _expanded={{ rounded: "8px 8px 0px 0px", border: 0 }}
              bg="#fff"
              color="#000"
              rounded="8px"
            >
              <Box as="span" flex="1" textAlign="left">
                Diagnosis & Treatment Plan
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                {renderArrayInput("overallImpression", "Overall Impression")}
                {renderArrayInput(
                  "provisionalDiagnosis",
                  "Provisional Diagnosis"
                )}
                {renderDiagnosisList()}
                {renderArrayInput("diagnosisNotes", "Diagnosis Notes")}
                {renderArrayInput("proposedTreatments", "Proposed Treatments")}
                {renderDropdown("priorityAndUrgency")}
              </SimpleGrid>
            </AccordionPanel>
          </AccordionItem>

          {/* Procedure Details */}
          <AccordionItem mb="15px">
            <AccordionButton
              _hover={{ border: "1px solid #EA5937", color: "#000" }}
              _focus={{ outline: "none" }}
              border="1px solid #fff"
              _expanded={{ rounded: "8px 8px 0px 0px", border: 0 }}
              bg="#fff"
              color="#000"
              rounded="8px"
            >
              <Box as="span" flex="1" textAlign="left">
                Procedure Details
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                {renderInput("procedureDate", "Procedure Date", "date")}
                {renderInput("toothNumbersTreated", "Tooth Numbers Treated")}
                {renderArrayInput(
                  "descriptionOfProcedure",
                  "Description of Procedure"
                )}
                {renderTextarea("anesthesiaDetails", "Anesthesia Details")}
                {renderTextarea("materialsUsed", "Materials Used")}
                {renderTextarea("procedureNotes", "Procedure Notes")}
                {renderTextarea(
                  "postProcedureCareInstructions",
                  "Post Procedure Care Instructions"
                )}
              </SimpleGrid>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>

        <Flex justifyContent="center" mt="10px">
          <Button
            w={["100%", "100%", "200px", "200px"]}
            onClick={handleSubmit}
            isLoading={Loading}
            bg="#EA5937"
            color="white"
            _hover={{ bg: "#d04a2a" }}
            size="lg"
          >
            Submit
          </Button>
        </Flex>
      </Box>
    </MainLayout>
  );
}
