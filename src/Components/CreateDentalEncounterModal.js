import {
  Text,
  Box,
  Tag,
  TagLabel,
  TagCloseButton,
  useToast,
  Textarea,
  Stack,
  SimpleGrid,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  HStack,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import Input from "./Input";
import Button from "./Button";
import { FaNoteSticky, FaTeeth } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { GiTooth } from "react-icons/gi";
import { SlPlus } from "react-icons/sl";
import {
  CreateDentalEncounterApi,
  UpdateDentalEncounterApi,
  GetDentalEncountersByPatientIdApi,
  SettingsApi,
} from "../Utils/ApiCalls";
import LabRequestModal from "./LabRequestModal";
import { GetDiagnosisICApi } from "../Utils/ApiCalls";

export default function CreateDentalEncounterModal({
  isOpen,
  onClose,
  setOldPayload,
  activateNotifications,
  type,
  oldPayload,
}) {
  const toast = useToast();
  const [Loading, setLoading] = useState(false);
  const [Settings, setSettings] = useState(null);

  const [SearchICD, setSearchICD] = useState("");
  const [DiagnosisICD, setDiagnosisICD] = useState([]);

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

  const date = Date.now();
  const currentDate = new Date(date).toISOString().split("T")[0];
  const patientId = localStorage.getItem("patientId");
  const appointmentId = localStorage.getItem("appointmentId") || ""; // Retrieve appointmentId from localStorage

  const initialPayload = {
    chiefComplaint: [],
    dentalHistoryNotes: [],
    previousDentalProcedure: [],
    allergies: [],
    lastDentalVisit: currentDate,
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
    procedureDate: currentDate,
    descriptionOfProcedure: [],
    toothNumbersTreated: "",
    anesthesiaDetails: "",
    materialsUsed: "",
    procedureNotes: "",
    postProcedureCareInstructions: "",
    appointmentoradmissionunderscoreid: appointmentId, // Set appointmentunderscoreid from localStorage
  };

  const [Payload, setPayload] = useState(initialPayload);
  const [UpdatedPayload, setUpdatedPayload] = useState(initialPayload);

  // Only these specific fields should be dropdowns
  const DROPDOWN_FIELDS = {
    gingivalAssessment: {
      label: "Gingival Assessment",
      options: Settings?.gIassessmentimpression || [],
      icon: <GiTooth />,
    },
    tmjAssessment: {
      label: "TMJ Assessment",
      options: Settings?.tmjAssessment || [],
      icon: <GiTooth />,
    },
    oralCancerScreening: {
      label: "Oral Cancer Screening",
      options: Settings?.oralCancerScreening || [],
      icon: <GiTooth />,
    },
    intraOral: {
      label: "Intraoral",
      options: Settings?.intraOral || [],
      icon: <GiTooth />,
    },
    priorityAndUrgency: {
      label: "Priority and Urgency",
      options: Settings?.priority || [],
      icon: <FaNoteSticky />,
    },
  };
  const getAllICD = async (value) => {
    try {
      const result = await GetDiagnosisICApi({ diagnosis: value });
      setDiagnosisICD(result.queryresult || []);
    } catch (e) {
      console.error("Failed to fetch ICD codes:", e);
      activateNotifications("Failed to fetch diagnosis codes", "error");
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
      if (type === "new") {
        setPayload({ ...Payload, diagnosisList: newArray });
      } else {
        setUpdatedPayload({ ...UpdatedPayload, diagnosisList: newArray });
      }
      setSearchICD("");
      setDiagnosisICD([]);
    }
  };

  useEffect(() => {
    getSettings();

    if (type === "edit" || type === "view") {
      const populateForm = async () => {
        try {
          if (!oldPayload && type !== "new") {
            const result = await GetDentalEncountersByPatientIdApi(patientId);
            if (result && result.queryresult?.encounters?.length > 0) {
              oldPayload = result.queryresult.encounters[0];
            }
          }

          if (oldPayload) {
            setUpdatedPayload({
              ...initialPayload,
              ...oldPayload,
              lastDentalVisit: oldPayload.lastDentalVisit || currentDate,
              procedureDate: oldPayload.procedureDate || currentDate,
              appointmentoradmissionunderscoreid:
                oldPayload.appointmentoradmissionunderscoreid || appointmentId, // Use existing or fallback to localStorage
            });

            // Set selected arrays for multi-select fields
            const newSelectedArrays = {};
            Object.keys(selectedArrays).forEach((key) => {
              newSelectedArrays[key] = Array.isArray(oldPayload[key])
                ? oldPayload[key]
                : [];
            });
            setSelectedArrays(newSelectedArrays);
          }
        } catch (error) {
          console.error("Error fetching dental encounter:", error);
          activateNotifications(
            "Failed to load dental encounter data",
            "error"
          );
        }
      };

      populateForm();
    } else {
      setPayload(initialPayload);
      setUpdatedPayload(initialPayload);
      // Reset all selected arrays and input values
      setSelectedArrays({
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
      setInputValues({
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
    }
  }, [isOpen, type, oldPayload]);

  const handlePayload = (e) => {
    const { id, value } = e.target;
    setPayload({ ...Payload, [id]: value });
    console.log("Payload updated (new):", { ...Payload, [id]: value });
  };

  const handleUpdatedPayload = (e) => {
    const { id, value } = e.target;
    setUpdatedPayload({ ...UpdatedPayload, [id]: value });
  };

  const handleInputChange = (field, value) => {
    setInputValues({ ...inputValues, [field]: value });
  };

  const handleAddItem = (field) => {
    const value = inputValues[field].trim();
    if (value) {
      const newArray = [...selectedArrays[field], value];
      setSelectedArrays({ ...selectedArrays, [field]: newArray });
      if (type === "new") {
        setPayload({ ...Payload, [field]: newArray });
      } else {
        setUpdatedPayload({ ...UpdatedPayload, [field]: newArray });
      }
      setInputValues({ ...inputValues, [field]: "" });
    }
  };

  const handleRemoveItem = (field, index) => {
    const newArray = selectedArrays[field].filter((_, i) => i !== index);
    setSelectedArrays({ ...selectedArrays, [field]: newArray });
    if (type === "new") {
      setPayload({ ...Payload, [field]: newArray });
    } else {
      setUpdatedPayload({ ...UpdatedPayload, [field]: newArray });
    }
  };

  const getSettings = async () => {
    try {
      const result = await SettingsApi();
      setSettings(result);
    } catch (e) {
      console.error("Failed to fetch settings:", e);
    }
  };

  const handleSubmitNew = async () => {
    if (!Payload.appointmentoradmissionunderscoreid) {
      activateNotifications("Appointment ID is required", "error");
      return;
    }
    console.log("Payload being sent to Create API:", Payload);
    setLoading(true);
    try {
      const result = await CreateDentalEncounterApi(patientId, Payload);
      if (result.status === 200) {
        setLoading(false);
        activateNotifications(
          "Dental encounter created successfully",
          "success"
        );
        onClose();
      }
    } catch (e) {
      setLoading(false);
      if (e.response?.data?.msg) {
        activateNotifications(e.response.data.msg, "error");
      } else if (e.response?.data) {
        activateNotifications(e.response.data, "error");
      } else if (e.request) {
        activateNotifications("No response from server", "error");
      } else {
        activateNotifications(e.message, "error");
      }
    }
  };

  const handleSubmitUpdate = async () => {
    if (!UpdatedPayload.appointmentoradmissionunderscoreid) {
      activateNotifications("Appointment ID is required", "error");
      return;
    }
    setLoading(true);
    try {
      const result = await UpdateDentalEncounterApi(
        oldPayload._id,
        UpdatedPayload
      );
      if (result.status === 200) {
        setLoading(false);
        activateNotifications(
          "Dental encounter updated successfully",
          "success"
        );
        onClose();
      }
    } catch (e) {
      setLoading(false);
      if (e.response?.data?.msg) {
        activateNotifications(e.response.data.msg, "error");
      } else if (e.response?.data) {
        activateNotifications(e.response.data, "error");
      } else if (e.request) {
        activateNotifications("No response from server", "error");
      } else {
        activateNotifications(e.message, "error");
      }
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
          leftIcon={config.icon}
          h="45px"
          w="100%"
          borderWidth="2px"
          fontSize={
            (type === "new" ? Payload[field] : UpdatedPayload[field]) !== ""
              ? "16px"
              : "13px"
          }
          borderColor="#6B7280"
          id={field}
          value={type === "new" ? Payload[field] : UpdatedPayload[field]}
          onChange={type === "new" ? handlePayload : handleUpdatedPayload}
          placeholder={`Select ${config.label}`}
          isDisabled={type === "view"}
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
          leftIcon={<FaNoteSticky />}
          type={type}
          value={type === "new" ? Payload[field] : UpdatedPayload[field]}
          onChange={type === "new" ? handlePayload : handleUpdatedPayload}
          id={field}
          isDisabled={type === "view"}
          w="100%"
          h="50px"
          fontSize="16px"
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
          value={type === "new" ? Payload[field] : UpdatedPayload[field]}
          onChange={type === "new" ? handlePayload : handleUpdatedPayload}
          id={field}
          isDisabled={type === "view"}
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
            leftIcon={<FaNoteSticky />}
            value={inputValues[field]}
            onChange={(e) => handleInputChange(field, e.target.value)}
            placeholder={`Enter ${label}`}
            isDisabled={type === "view"}
            w={{ base: "85%", md: "90%" }}
            h="50px"
            fontSize="16px"
          />
          {type !== "view" && (
            <Button
              rightIcon={<SlPlus />}
              onClick={() => handleAddItem(field)}
              isDisabled={!inputValues[field].trim()}
              w="50px"
              h="40px"
              fontSize="12px"
              minW="50px"
            >
              Add
            </Button>
          )}
        </HStack>
        <HStack wrap="wrap">
          {selectedArrays[field].map((item, index) => (
            <Tag
              key={index}
              size="md"
              borderRadius="full"
              variant="solid"
              colorScheme="blue"
              bg="blue.blue500"
              color="white"
              m="1"
            >
              <TagLabel>{item}</TagLabel>
              {type !== "view" && (
                <TagCloseButton
                  onClick={() => handleRemoveItem(field, index)}
                />
              )}
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
            leftIcon={<FaNoteSticky />}
            value={SearchICD}
            onChange={handleSearch}
            placeholder="Search ICD 11"
            isDisabled={type === "view"}
            w="100%"
            h="50px"
            fontSize="16px"
          />
          <Select
            h="45px"
            w="100%"
            borderWidth="2px"
            borderColor="#6B7280"
            fontSize={selectedArrays.diagnosisList.length > 0 ? "16px" : "13px"}
            onChange={handleDiagnosisSelect}
            placeholder="Select diagnosis ICD 11"
            isDisabled={type === "view"}
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
              colorScheme="blue"
              bg="blue.blue500"
              color="white"
              m="1"
            >
              <TagLabel>{item}</TagLabel>
              {type !== "view" && (
                <TagCloseButton
                  onClick={() => handleRemoveItem("diagnosisList", index)}
                />
              )}
            </Tag>
          ))}
        </HStack>
      </Box>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      size="xl"
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent maxW={{ base: "90%", md: "80%" }} maxH="90vh">
        <ModalHeader>
          {type === "new"
            ? "Add New Dental Encounter"
            : type === "edit"
            ? "Edit Dental Encounter"
            : "Dental Encounter Details"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontSize="18px" fontWeight={"700"} color="blue.blue500">
            Patient Information
          </Text>

          <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2 }} spacing={3}>
            {renderArrayInput("chiefComplaint", "Chief Complaint(s)")}
            {renderArrayInput("dentalHistoryNotes", "Dental History Notes")}
            {renderArrayInput(
              "previousDentalProcedure",
              "Previous Dental Procedures"
            )}
            {renderArrayInput("allergies", "Allergies")}
            {renderArrayInput("additionalComplaints", "Additional Complaints")}
            {renderInput("lastDentalVisit", "Last Dental Visit", "date")}
            {renderTextarea("currentMedications", "Current Medications")}
            {renderTextarea("otherDentalHistory", "Other Dental History")}
          </SimpleGrid>

          <Text fontSize="18px" fontWeight={"700"} color="blue.blue500">
            Quadrant Notes
          </Text>

          <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2 }} spacing={3}>
            {renderArrayInput("firstQuadrantNote", "First Quadrant Notes")}
            {renderArrayInput("secondQuadrantNote", "Second Quadrant Notes")}
            {renderArrayInput("thirdQuadrantNote", "Third Quadrant Notes")}
            {renderArrayInput("fourthQuadrantNote", "Fourth Quadrant Notes")}
          </SimpleGrid>

          <Text fontSize="18px" fontWeight={"700"} color="blue.blue500">
            Medical Information
          </Text>

          <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2 }} spacing={3}>
            {renderTextarea("medicalConditions", "Medical Conditions")}
            {renderTextarea("alerts", "Alerts")}
          </SimpleGrid>

          <Text fontSize="18px" fontWeight={"700"} color="blue.blue500">
            Clinical Examination
          </Text>

          <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2 }} spacing={3}>
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
            {renderInput("crownBridgeRestoration", "Crown/Bridge Restoration")}
            {renderInput("dentures", "Dentures")}
            {renderInput("calculus", "Calculus")}
            {renderArrayInput("otherFindings", "Other Findings")}
            {renderArrayInput("notes", "Notes")}
          </SimpleGrid>

          <Text fontSize="18px" fontWeight={"700"} color="blue.blue500">
            Intraoral Examination
          </Text>

          <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2 }} spacing={3}>
            {renderDropdown("intraOral")}
            {renderTextarea("tongue", "Tongue")}
            {renderTextarea("mucosa", "Mucosa")}
            {renderArrayInput("otherIntraOral", "Other Intraoral")}
          </SimpleGrid>

          <Text fontSize="18px" fontWeight={"700"} color="blue.blue500">
            Diagnosis & Treatment Plan
          </Text>

          <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2 }} spacing={3}>
            {renderArrayInput("overallImpression", "Overall Impression")}
            {renderArrayInput("provisionalDiagnosis", "Provisional Diagnosis")}
            {renderDiagnosisList()}
            {renderArrayInput("diagnosisNotes", "Diagnosis Notes")}
            {renderArrayInput("proposedTreatments", "Proposed Treatments")}
            {renderDropdown("priorityAndUrgency", "Priority")}
          </SimpleGrid>

          <Text fontSize="18px" fontWeight={"700"} color="blue.blue500">
            Procedure Details
          </Text>

          <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2 }} spacing={3}>
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

          {type !== "view" && (
            <Button
              mt="32px"
              isLoading={Loading}
              onClick={type === "new" ? handleSubmitNew : handleSubmitUpdate}
              w="100px"
              h="40px"
              fontSize="14px"
            >
              {type === "new" ? "Create" : "Update"}
            </Button>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
