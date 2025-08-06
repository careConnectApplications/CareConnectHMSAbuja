import React, { useState, useEffect } from "react";
import {
  HStack,
  Text,
  Box,
  Flex,
  Stack,
  SimpleGrid,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import MainLayout from "../Layouts/Index";
import Seo from "../Utils/Seo";
import Button from "../Components/Button";
import TextArea from "../Components/TextArea";
import ShowToast from "../Components/ToastNotification";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdArrowRoundBack, IoIosCloseCircle } from "react-icons/io";
import { CreatePsychiatricEvaluationApi, SettingsApi } from "../Utils/ApiCalls";
import PsychiatricEvaluations from "./PsychiatricEvaluations";
import { Tooltip } from "@chakra-ui/react";
import LabRequestModal from "../Components/LabRequestModal";
import RadiologyOrderRequestModal from "../Components/RadiologyOrderRequestModal";
import CreateProcedureModal from "../Components/CreateProcedureModal";
import CreateReferralModal from "../Components/CreateReferralModal";
import AdmissionModal from "../Components/AdmissionModal";
import CreatePrescriptionModal from "../Components/CreatePrescriptionModal";

export default function AddPsychiatricEvaluation() {
  const { id } = useParams();
  const [Settings, setSettings] = useState({});
  const [LoadingCompleted, setLoadingCompleted] = useState(false);
  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    status: "",
  });
  const [Payload, setPayload] = useState({
    presentingcomplaints: "",
    historyofpresentingcomplaints: "",
    pastpsychiatrichistory: "",
    pastmedicalandsurgicalhistory: "",
    familyhistory: "",
    personaldevelopmenthistory: "",
    educationhistory: "",
    occupationhistory: "",
    psychosocialhistory: "",
    substanceusehistory: "",
    forensichistory: "",
    premorbidhistory: "",
    assessmentdiagnosis: "",
    planmanagement: "",
  });
  const [PresentingComplaints, setPresentingComplaints] = useState([]);
  const [HistoryOfPresentingComplaints, setHistoryOfPresentingComplaints] =
    useState([]);
  const [PastPsychiatricHistory, setPastPsychiatricHistory] = useState([]);
  const [PastMedicalAndSurgicalHistory, setPastMedicalAndSurgicalHistory] =
    useState([]);
  const [FamilyHistory, setFamilyHistory] = useState([]);
  const [PersonalDevelopmentHistory, setPersonalDevelopmentHistory] = useState(
    []
  );
  const [EducationHistory, setEducationHistory] = useState([]);
  const [OccupationHistory, setOccupationHistory] = useState([]);
  const [PsychosocialHistory, setPsychosocialHistory] = useState([]);
  const [SubstanceUseHistory, setSubstanceUseHistory] = useState([]);
  const [ForensicHistory, setForensicHistory] = useState([]);
  const [PremorbidHistory, setPremorbidHistory] = useState([]);
  const [AssessmentDiagnosis, setAssessmentDiagnosis] = useState([]);
  const [PlanManagement, setPlanManagement] = useState([]);
  const [Disabled, setDisabled] = useState(true);

  const [OpenLabModal, setOpenLabModal] = useState(false);
  const [OpenPrescriptionModal, setOpenPrescriptionModal] = useState(false);
  const [OpenRadiologyModal, setOpenRadiologyModal] = useState(false);
  const [OpenProcedureModal, setOpenProcedureModal] = useState(false);
  const [OpenReferralModal, setOpenReferralModal] = useState(false);
  const [OpenAdmissionModal, setOpenAdmissionModal] = useState(false);
  const [ModalState, setModalState] = useState("");

  const nav = useNavigate();
  const pathname = localStorage.getItem("pathname");
  const appointmentId = localStorage.getItem("appointmentId");

  const handlePayload = (e) => {
    setPayload({ ...Payload, [e.target.id]: e.target.value });
  };

  const addPresentingComplaint = () => {
    if (Payload.presentingcomplaints.trim()) {
      setPresentingComplaints([
        ...PresentingComplaints,
        Payload.presentingcomplaints,
      ]);
      setPayload({ ...Payload, presentingcomplaints: "" });
    }
  };

  const addHistoryOfPresentingComplaint = () => {
    if (Payload.historyofpresentingcomplaints.trim()) {
      setHistoryOfPresentingComplaints([
        ...HistoryOfPresentingComplaints,
        Payload.historyofpresentingcomplaints,
      ]);
      setPayload({ ...Payload, historyofpresentingcomplaints: "" });
    }
  };

  const addPastPsychiatricHistory = () => {
    if (Payload.pastpsychiatrichistory.trim()) {
      setPastPsychiatricHistory([
        ...PastPsychiatricHistory,
        Payload.pastpsychiatrichistory,
      ]);
      setPayload({ ...Payload, pastpsychiatrichistory: "" });
    }
  };

  const addPastMedicalAndSurgicalHistory = () => {
    if (Payload.pastmedicalandsurgicalhistory.trim()) {
      setPastMedicalAndSurgicalHistory([
        ...PastMedicalAndSurgicalHistory,
        Payload.pastmedicalandsurgicalhistory,
      ]);
      setPayload({ ...Payload, pastmedicalandsurgicalhistory: "" });
    }
  };

  const addFamilyHistory = () => {
    if (Payload.familyhistory.trim()) {
      setFamilyHistory([...FamilyHistory, Payload.familyhistory]);
      setPayload({ ...Payload, familyhistory: "" });
    }
  };

  const addPersonalDevelopmentHistory = () => {
    if (Payload.personaldevelopmenthistory.trim()) {
      setPersonalDevelopmentHistory([
        ...PersonalDevelopmentHistory,
        Payload.personaldevelopmenthistory,
      ]);
      setPayload({ ...Payload, personaldevelopmenthistory: "" });
    }
  };

  const addEducationHistory = () => {
    if (Payload.educationhistory.trim()) {
      setEducationHistory([...EducationHistory, Payload.educationhistory]);
      setPayload({ ...Payload, educationhistory: "" });
    }
  };

  const addOccupationHistory = () => {
    if (Payload.occupationhistory.trim()) {
      setOccupationHistory([...OccupationHistory, Payload.occupationhistory]);
      setPayload({ ...Payload, occupationhistory: "" });
    }
  };

  const addPsychosocialHistory = () => {
    if (Payload.psychosocialhistory.trim()) {
      setPsychosocialHistory([
        ...PsychosocialHistory,
        Payload.psychosocialhistory,
      ]);
      setPayload({ ...Payload, psychosocialhistory: "" });
    }
  };

  const addSubstanceUseHistory = () => {
    if (Payload.substanceusehistory.trim()) {
      setSubstanceUseHistory([
        ...SubstanceUseHistory,
        Payload.substanceusehistory,
      ]);
      setPayload({ ...Payload, substanceusehistory: "" });
    }
  };

  const addForensicHistory = () => {
    if (Payload.forensichistory.trim()) {
      setForensicHistory([...ForensicHistory, Payload.forensichistory]);
      setPayload({ ...Payload, forensichistory: "" });
    }
  };

  const addPremorbidHistory = () => {
    if (Payload.premorbidhistory.trim()) {
      setPremorbidHistory([...PremorbidHistory, Payload.premorbidhistory]);
      setPayload({ ...Payload, premorbidhistory: "" });
    }
  };

  const addAssessmentDiagnosis = () => {
    if (Payload.assessmentdiagnosis.trim()) {
      setAssessmentDiagnosis([
        ...AssessmentDiagnosis,
        Payload.assessmentdiagnosis,
      ]);
      setPayload({ ...Payload, assessmentdiagnosis: "" });
    }
  };

  const addPlanManagement = () => {
    if (Payload.planmanagement.trim()) {
      setPlanManagement([...PlanManagement, Payload.planmanagement]);
      setPayload({ ...Payload, planmanagement: "" });
    }
  };

  const removePresentingComplaint = (item) => {
    setPresentingComplaints(PresentingComplaints.filter((i) => i !== item));
  };

  const removeHistoryOfPresentingComplaint = (item) => {
    setHistoryOfPresentingComplaints(
      HistoryOfPresentingComplaints.filter((i) => i !== item)
    );
  };

  const removePastPsychiatricHistory = (item) => {
    setPastPsychiatricHistory(PastPsychiatricHistory.filter((i) => i !== item));
  };

  const removePastMedicalAndSurgicalHistory = (item) => {
    setPastMedicalAndSurgicalHistory(
      PastMedicalAndSurgicalHistory.filter((i) => i !== item)
    );
  };

  const removeFamilyHistory = (item) => {
    setFamilyHistory(FamilyHistory.filter((i) => i !== item));
  };

  const removePersonalDevelopmentHistory = (item) => {
    setPersonalDevelopmentHistory(
      PersonalDevelopmentHistory.filter((i) => i !== item)
    );
  };

  const removeEducationHistory = (item) => {
    setEducationHistory(EducationHistory.filter((i) => i !== item));
  };

  const removeOccupationHistory = (item) => {
    setOccupationHistory(OccupationHistory.filter((i) => i !== item));
  };

  const removePsychosocialHistory = (item) => {
    setPsychosocialHistory(PsychosocialHistory.filter((i) => i !== item));
  };

  const removeSubstanceUseHistory = (item) => {
    setSubstanceUseHistory(SubstanceUseHistory.filter((i) => i !== item));
  };

  const removeForensicHistory = (item) => {
    setForensicHistory(ForensicHistory.filter((i) => i !== item));
  };

  const removePremorbidHistory = (item) => {
    setPremorbidHistory(PremorbidHistory.filter((i) => i !== item));
  };

  const removeAssessmentDiagnosis = (item) => {
    setAssessmentDiagnosis(AssessmentDiagnosis.filter((i) => i !== item));
  };

  const removePlanManagement = (item) => {
    setPlanManagement(PlanManagement.filter((i) => i !== item));
  };

  const activateNotifications = (message, status) => {
    setShowToast({
      show: true,
      message: message,
      status: status,
    });
    setTimeout(() => {
      setShowToast({ show: false });
    }, 5000);
  };

  const getSettings = async () => {
    try {
      const result = await SettingsApi();
      setSettings(result);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCompleted = async () => {
    setLoadingCompleted(true);
    const apiPayload = {
      presentingcomplaints: PresentingComplaints,
      historyofpresentingcomplaints: HistoryOfPresentingComplaints,
      pastpsychiatrichistory: PastPsychiatricHistory,
      pastmedicalandsurgicalhistory: PastMedicalAndSurgicalHistory,
      familyhistory: FamilyHistory,
      personaldevelopmenthistory: PersonalDevelopmentHistory,
      educationhistory: EducationHistory,
      occupationhistory: OccupationHistory,
      psychosocialhistory: PsychosocialHistory,
      substanceusehistory: SubstanceUseHistory,
      forensichistory: ForensicHistory,
      premorbidhistory: PremorbidHistory,
      assessmentdiagnosis: AssessmentDiagnosis,
      planmanagement: PlanManagement,
      appointmentoradmissionunderscoreid: appointmentId,
    };
    console.log("Payload sent to CreatePsychiatricEvaluationApi:", apiPayload);
    try {
      const result = await CreatePsychiatricEvaluationApi(id, apiPayload);
      console.log("Response from CreatePsychiatricEvaluationApi:", result);
      if (result.status === 200) {
        setLoadingCompleted(false);
        activateNotifications(
          "Psychiatric Evaluation Created Successfully. Redirecting...",
          "success"
        );
        setTimeout(() => {
          nav(pathname || `/dashboard/psychiatric-evaluations/${id}`);
        }, 3000);
      } else {
        setLoadingCompleted(false);
        activateNotifications(
          "Failed to create psychiatric evaluation.",
          "error"
        );
      }
    } catch (e) {
      setLoadingCompleted(false);
      console.log("Error from CreatePsychiatricEvaluationApi:", e);
      activateNotifications(e.message, "error");
    }
  };

  useEffect(() => {
    const hasData =
      Object.values(Payload).some((value) => value !== "") ||
      [
        PresentingComplaints,
        HistoryOfPresentingComplaints,
        PastPsychiatricHistory,
        PastMedicalAndSurgicalHistory,
        FamilyHistory,
        PersonalDevelopmentHistory,
        EducationHistory,
        OccupationHistory,
        PsychosocialHistory,
        SubstanceUseHistory,
        ForensicHistory,
        PremorbidHistory,
        AssessmentDiagnosis,
        PlanManagement,
      ].some((arr) => arr.length > 0);
    setDisabled(!hasData);
    getSettings();
  }, [
    Payload,
    PresentingComplaints,
    HistoryOfPresentingComplaints,
    PastPsychiatricHistory,
    PastMedicalAndSurgicalHistory,
    FamilyHistory,
    PersonalDevelopmentHistory,
    EducationHistory,
    OccupationHistory,
    PsychosocialHistory,
    SubstanceUseHistory,
    ForensicHistory,
    PremorbidHistory,
    AssessmentDiagnosis,
    PlanManagement,
  ]);

  return (
    <MainLayout>
      {showToast.show && (
        <ShowToast message={showToast.message} status={showToast.status} />
      )}
      <Seo
        title="Create Psychiatric Evaluation"
        description="Psychiatric Evaluation Creation"
      />
      <Box>
        <Button
          leftIcon={<IoMdArrowRoundBack />}
          px="40px"
          w="100px"
          onClick={() =>
            nav(pathname || `/dashboard/psychiatric-evaluations/${id}`)
          }
        >
          Back
        </Button>

        <Accordion defaultIndex={[]} mt="32px" allowToggle>
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
                Previous Psychiatric Evaluations
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
              <PsychiatricEvaluations hide={true} />
            </AccordionPanel>
          </AccordionItem>

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
                Presenting Complaints
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
              <Stack spacing={4}>
                <TextArea
                  placeholder="Presenting Complaints"
                  value={Payload.presentingcomplaints}
                  onChange={handlePayload}
                  id="presentingcomplaints"
                />
                <Flex justifyContent="flex-end" mt="2">
                  <Button
                    onClick={addPresentingComplaint}
                    w={["100%", "100%", "184px", "184px"]}
                  >
                    Add
                  </Button>
                </Flex>
                <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>
                  {PresentingComplaints.map((item, i) => (
                    <Flex
                      key={i}
                      cursor="pointer"
                      px="10px"
                      py="10px"
                      rounded="20px"
                      fontSize="12px"
                      _hover={{ bg: "blue.blue400" }}
                      bg="blue.blue500"
                      w="100%"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Text
                        color="#fff"
                        fontWeight="500"
                        textTransform="capitalize"
                      >
                        {item}
                      </Text>
                      <Box
                        fontSize="20px"
                        color="#fff"
                        onClick={() => removePresentingComplaint(item)}
                      >
                        <IoIosCloseCircle />
                      </Box>
                    </Flex>
                  ))}
                </SimpleGrid>
              </Stack>
            </AccordionPanel>
          </AccordionItem>

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
                History of Presenting Complaints
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
              <Stack spacing={4}>
                <TextArea
                  placeholder="History of Presenting Complaints"
                  value={Payload.historyofpresentingcomplaints}
                  onChange={handlePayload}
                  id="historyofpresentingcomplaints"
                />
                <Flex justifyContent="flex-end" mt="2">
                  <Button
                    onClick={addHistoryOfPresentingComplaint}
                    w={["100%", "100%", "184px", "184px"]}
                  >
                    Add
                  </Button>
                </Flex>
                <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>
                  {HistoryOfPresentingComplaints.map((item, i) => (
                    <Flex
                      key={i}
                      cursor="pointer"
                      px="10px"
                      py="10px"
                      rounded="20px"
                      fontSize="12px"
                      _hover={{ bg: "blue.blue400" }}
                      bg="blue.blue500"
                      w="100%"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Text
                        color="#fff"
                        fontWeight="500"
                        textTransform="capitalize"
                      >
                        {item}
                      </Text>
                      <Box
                        fontSize="20px"
                        color="#fff"
                        onClick={() => removeHistoryOfPresentingComplaint(item)}
                      >
                        <IoIosCloseCircle />
                      </Box>
                    </Flex>
                  ))}
                </SimpleGrid>
              </Stack>
            </AccordionPanel>
          </AccordionItem>

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
                Past Psychiatric History
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
              <Stack spacing={4}>
                <TextArea
                  placeholder="Past Psychiatric History"
                  value={Payload.pastpsychiatrichistory}
                  onChange={handlePayload}
                  id="pastpsychiatrichistory"
                />
                <Flex justifyContent="flex-end" mt="2">
                  <Button
                    onClick={addPastPsychiatricHistory}
                    w={["100%", "100%", "184px", "184px"]}
                  >
                    Add
                  </Button>
                </Flex>
                <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>
                  {PastPsychiatricHistory.map((item, i) => (
                    <Flex
                      key={i}
                      cursor="pointer"
                      px="10px"
                      py="10px"
                      rounded="20px"
                      fontSize="12px"
                      _hover={{ bg: "blue.blue400" }}
                      bg="blue.blue500"
                      w="100%"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Text
                        color="#fff"
                        fontWeight="500"
                        textTransform="capitalize"
                      >
                        {item}
                      </Text>
                      <Box
                        fontSize="20px"
                        color="#fff"
                        onClick={() => removePastPsychiatricHistory(item)}
                      >
                        <IoIosCloseCircle />
                      </Box>
                    </Flex>
                  ))}
                </SimpleGrid>
              </Stack>
            </AccordionPanel>
          </AccordionItem>

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
                Past Medical and Surgical History
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
              <Stack spacing={4}>
                <TextArea
                  placeholder="Past Medical and Surgical History"
                  value={Payload.pastmedicalandsurgicalhistory}
                  onChange={handlePayload}
                  id="pastmedicalandsurgicalhistory"
                />
                <Flex justifyContent="flex-end" mt="2">
                  <Button
                    onClick={addPastMedicalAndSurgicalHistory}
                    w={["100%", "100%", "184px", "184px"]}
                  >
                    Add
                  </Button>
                </Flex>
                <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>
                  {PastMedicalAndSurgicalHistory.map((item, i) => (
                    <Flex
                      key={i}
                      cursor="pointer"
                      px="10px"
                      py="10px"
                      rounded="20px"
                      fontSize="12px"
                      _hover={{ bg: "blue.blue400" }}
                      bg="blue.blue500"
                      w="100%"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Text
                        color="#fff"
                        fontWeight="500"
                        textTransform="capitalize"
                      >
                        {item}
                      </Text>
                      <Box
                        fontSize="20px"
                        color="#fff"
                        onClick={() =>
                          removePastMedicalAndSurgicalHistory(item)
                        }
                      >
                        <IoIosCloseCircle />
                      </Box>
                    </Flex>
                  ))}
                </SimpleGrid>
              </Stack>
            </AccordionPanel>
          </AccordionItem>

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
                Family History
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
              <Stack spacing={4}>
                <TextArea
                  placeholder="Family History"
                  value={Payload.familyhistory}
                  onChange={handlePayload}
                  id="familyhistory"
                />
                <Flex justifyContent="flex-end" mt="2">
                  <Button
                    onClick={addFamilyHistory}
                    w={["100%", "100%", "184px", "184px"]}
                  >
                    Add
                  </Button>
                </Flex>
                <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>
                  {FamilyHistory.map((item, i) => (
                    <Flex
                      key={i}
                      cursor="pointer"
                      px="10px"
                      py="10px"
                      rounded="20px"
                      fontSize="12px"
                      _hover={{ bg: "blue.blue400" }}
                      bg="blue.blue500"
                      w="100%"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Text
                        color="#fff"
                        fontWeight="500"
                        textTransform="capitalize"
                      >
                        {item}
                      </Text>
                      <Box
                        fontSize="20px"
                        color="#fff"
                        onClick={() => removeFamilyHistory(item)}
                      >
                        <IoIosCloseCircle />
                      </Box>
                    </Flex>
                  ))}
                </SimpleGrid>
              </Stack>
            </AccordionPanel>
          </AccordionItem>

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
                Personal Development History
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
              <Stack spacing={4}>
                <TextArea
                  placeholder="Personal Development History"
                  value={Payload.personaldevelopmenthistory}
                  onChange={handlePayload}
                  id="personaldevelopmenthistory"
                />
                <Flex justifyContent="flex-end" mt="2">
                  <Button
                    onClick={addPersonalDevelopmentHistory}
                    w={["100%", "100%", "184px", "184px"]}
                  >
                    Add
                  </Button>
                </Flex>
                <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>
                  {PersonalDevelopmentHistory.map((item, i) => (
                    <Flex
                      key={i}
                      cursor="pointer"
                      px="10px"
                      py="10px"
                      rounded="20px"
                      fontSize="12px"
                      _hover={{ bg: "blue.blue400" }}
                      bg="blue.blue500"
                      w="100%"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Text
                        color="#fff"
                        fontWeight="500"
                        textTransform="capitalize"
                      >
                        {item}
                      </Text>
                      <Box
                        fontSize="20px"
                        color="#fff"
                        onClick={() => removePersonalDevelopmentHistory(item)}
                      >
                        <IoIosCloseCircle />
                      </Box>
                    </Flex>
                  ))}
                </SimpleGrid>
              </Stack>
            </AccordionPanel>
          </AccordionItem>

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
                Education History
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
              <Stack spacing={4}>
                <TextArea
                  placeholder="Education History"
                  value={Payload.educationhistory}
                  onChange={handlePayload}
                  id="educationhistory"
                />
                <Flex justifyContent="flex-end" mt="2">
                  <Button
                    onClick={addEducationHistory}
                    w={["100%", "100%", "184px", "184px"]}
                  >
                    Add
                  </Button>
                </Flex>
                <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>
                  {EducationHistory.map((item, i) => (
                    <Flex
                      key={i}
                      cursor="pointer"
                      px="10px"
                      py="10px"
                      rounded="20px"
                      fontSize="12px"
                      _hover={{ bg: "blue.blue400" }}
                      bg="blue.blue500"
                      w="100%"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Text
                        color="#fff"
                        fontWeight="500"
                        textTransform="capitalize"
                      >
                        {item}
                      </Text>
                      <Box
                        fontSize="20px"
                        color="#fff"
                        onClick={() => removeEducationHistory(item)}
                      >
                        <IoIosCloseCircle />
                      </Box>
                    </Flex>
                  ))}
                </SimpleGrid>
              </Stack>
            </AccordionPanel>
          </AccordionItem>

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
                Occupation History
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
              <Stack spacing={4}>
                <TextArea
                  placeholder="Occupation History"
                  value={Payload.occupationhistory}
                  onChange={handlePayload}
                  id="occupationhistory"
                />
                <Flex justifyContent="flex-end" mt="2">
                  <Button
                    onClick={addOccupationHistory}
                    w={["100%", "100%", "184px", "184px"]}
                  >
                    Add
                  </Button>
                </Flex>
                <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>
                  {OccupationHistory.map((item, i) => (
                    <Flex
                      key={i}
                      cursor="pointer"
                      px="10px"
                      py="10px"
                      rounded="20px"
                      fontSize="12px"
                      _hover={{ bg: "blue.blue400" }}
                      bg="blue.blue500"
                      w="100%"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Text
                        color="#fff"
                        fontWeight="500"
                        textTransform="capitalize"
                      >
                        {item}
                      </Text>
                      <Box
                        fontSize="20px"
                        color="#fff"
                        onClick={() => removeOccupationHistory(item)}
                      >
                        <IoIosCloseCircle />
                      </Box>
                    </Flex>
                  ))}
                </SimpleGrid>
              </Stack>
            </AccordionPanel>
          </AccordionItem>

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
                Psychosocial History
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
              <Stack spacing={4}>
                <TextArea
                  placeholder="Psychosocial History"
                  value={Payload.psychosocialhistory}
                  onChange={handlePayload}
                  id="psychosocialhistory"
                />
                <Flex justifyContent="flex-end" mt="2">
                  <Button
                    onClick={addPsychosocialHistory}
                    w={["100%", "100%", "184px", "184px"]}
                  >
                    Add
                  </Button>
                </Flex>
                <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>
                  {PsychosocialHistory.map((item, i) => (
                    <Flex
                      key={i}
                      cursor="pointer"
                      px="10px"
                      py="10px"
                      rounded="20px"
                      fontSize="12px"
                      _hover={{ bg: "blue.blue400" }}
                      bg="blue.blue500"
                      w="100%"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Text
                        color="#fff"
                        fontWeight="500"
                        textTransform="capitalize"
                      >
                        {item}
                      </Text>
                      <Box
                        fontSize="20px"
                        color="#fff"
                        onClick={() => removePsychosocialHistory(item)}
                      >
                        <IoIosCloseCircle />
                      </Box>
                    </Flex>
                  ))}
                </SimpleGrid>
              </Stack>
            </AccordionPanel>
          </AccordionItem>

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
                Substance Use History
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
              <Stack spacing={4}>
                <TextArea
                  placeholder="Substance Use History"
                  value={Payload.substanceusehistory}
                  onChange={handlePayload}
                  id="substanceusehistory"
                />
                <Flex justifyContent="flex-end" mt="2">
                  <Button
                    onClick={addSubstanceUseHistory}
                    w={["100%", "100%", "184px", "184px"]}
                  >
                    Add
                  </Button>
                </Flex>
                <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>
                  {SubstanceUseHistory.map((item, i) => (
                    <Flex
                      key={i}
                      cursor="pointer"
                      px="10px"
                      py="10px"
                      rounded="20px"
                      fontSize="12px"
                      _hover={{ bg: "blue.blue400" }}
                      bg="blue.blue500"
                      w="100%"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Text
                        color="#fff"
                        fontWeight="500"
                        textTransform="capitalize"
                      >
                        {item}
                      </Text>
                      <Box
                        fontSize="20px"
                        color="#fff"
                        onClick={() => removeSubstanceUseHistory(item)}
                      >
                        <IoIosCloseCircle />
                      </Box>
                    </Flex>
                  ))}
                </SimpleGrid>
              </Stack>
            </AccordionPanel>
          </AccordionItem>

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
                Forensic History
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
              <Stack spacing={4}>
                <TextArea
                  placeholder="Forensic History"
                  value={Payload.forensichistory}
                  onChange={handlePayload}
                  id="forensichistory"
                />
                <Flex justifyContent="flex-end" mt="2">
                  <Button
                    onClick={addForensicHistory}
                    w={["100%", "100%", "184px", "184px"]}
                  >
                    Add
                  </Button>
                </Flex>
                <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>
                  {ForensicHistory.map((item, i) => (
                    <Flex
                      key={i}
                      cursor="pointer"
                      px="10px"
                      py="10px"
                      rounded="20px"
                      fontSize="12px"
                      _hover={{ bg: "blue.blue400" }}
                      bg="blue.blue500"
                      w="100%"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Text
                        color="#fff"
                        fontWeight="500"
                        textTransform="capitalize"
                      >
                        {item}
                      </Text>
                      <Box
                        fontSize="20px"
                        color="#fff"
                        onClick={() => removeForensicHistory(item)}
                      >
                        <IoIosCloseCircle />
                      </Box>
                    </Flex>
                  ))}
                </SimpleGrid>
              </Stack>
            </AccordionPanel>
          </AccordionItem>

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
                Premorbid History
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
              <Stack spacing={4}>
                <TextArea
                  placeholder="Premorbid History"
                  value={Payload.premorbidhistory}
                  onChange={handlePayload}
                  id="premorbidhistory"
                />
                <Flex justifyContent="flex-end" mt="2">
                  <Button
                    onClick={addPremorbidHistory}
                    w={["100%", "100%", "184px", "184px"]}
                  >
                    Add
                  </Button>
                </Flex>
                <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>
                  {PremorbidHistory.map((item, i) => (
                    <Flex
                      key={i}
                      cursor="pointer"
                      px="10px"
                      py="10px"
                      rounded="20px"
                      fontSize="12px"
                      _hover={{ bg: "blue.blue400" }}
                      bg="blue.blue500"
                      w="100%"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Text
                        color="#fff"
                        fontWeight="500"
                        textTransform="capitalize"
                      >
                        {item}
                      </Text>
                      <Box
                        fontSize="20px"
                        color="#fff"
                        onClick={() => removePremorbidHistory(item)}
                      >
                        <IoIosCloseCircle />
                      </Box>
                    </Flex>
                  ))}
                </SimpleGrid>
              </Stack>
            </AccordionPanel>
          </AccordionItem>

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
                Assessment Diagnosis
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
              <Stack spacing={4}>
                <TextArea
                  placeholder="Assessment Diagnosis"
                  value={Payload.assessmentdiagnosis}
                  onChange={handlePayload}
                  id="assessmentdiagnosis"
                />
                <Flex justifyContent="flex-end" mt="2">
                  <Button
                    onClick={addAssessmentDiagnosis}
                    w={["100%", "100%", "184px", "184px"]}
                  >
                    Add
                  </Button>
                </Flex>
                <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>
                  {AssessmentDiagnosis.map((item, i) => (
                    <Flex
                      key={i}
                      cursor="pointer"
                      px="10px"
                      py="10px"
                      rounded="20px"
                      fontSize="12px"
                      _hover={{ bg: "blue.blue400" }}
                      bg="blue.blue500"
                      w="100%"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Text
                        color="#fff"
                        fontWeight="500"
                        textTransform="capitalize"
                      >
                        {item}
                      </Text>
                      <Box
                        fontSize="20px"
                        color="#fff"
                        onClick={() => removeAssessmentDiagnosis(item)}
                      >
                        <IoIosCloseCircle />
                      </Box>
                    </Flex>
                  ))}
                </SimpleGrid>
              </Stack>
            </AccordionPanel>
          </AccordionItem>

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
                Plan Management
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
              <Stack spacing={4}>
                <TextArea
                  placeholder="Plan Management"
                  value={Payload.planmanagement}
                  onChange={handlePayload}
                  id="planmanagement"
                />
                <Flex justifyContent="flex-end" mt="2">
                  <Button
                    onClick={addPlanManagement}
                    w={["100%", "100%", "184px", "184px"]}
                  >
                    Add
                  </Button>
                </Flex>
                <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>
                  {PlanManagement.map((item, i) => (
                    <Flex
                      key={i}
                      cursor="pointer"
                      px="10px"
                      py="10px"
                      rounded="20px"
                      fontSize="12px"
                      _hover={{ bg: "blue.blue400" }}
                      bg="blue.blue500"
                      w="100%"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Text
                        color="#fff"
                        fontWeight="500"
                        textTransform="capitalize"
                      >
                        {item}
                      </Text>
                      <Box
                        fontSize="20px"
                        color="#fff"
                        onClick={() => removePlanManagement(item)}
                      >
                        <IoIosCloseCircle />
                      </Box>
                    </Flex>
                  ))}
                </SimpleGrid>
                <Flex
                  justifyContent="space-between"
                  flexWrap="wrap"
                  mt="15px"
                  w={["100%", "100%", "100%", "100%"]}
                >
                  <Tooltip label="Lab Order">
                    <Box
                      onClick={() => setOpenLabModal(true)}
                      cursor="pointer"
                      px="25px"
                      py="10px"
                      rounded="8px"
                      border="1px solid #EA5937"
                      color="blue.blue500"
                      bg="orange.orange500"
                    >
                      Lab
                    </Box>
                  </Tooltip>
                  <Tooltip label="Radiology Order">
                    <Box
                      onClick={() => setOpenRadiologyModal(true)}
                      cursor="pointer"
                      px="25px"
                      py="10px"
                      rounded="8px"
                      border="1px solid #EA5937"
                      color="blue.blue500"
                      bg="orange.orange500"
                    >
                      Radiology
                    </Box>
                  </Tooltip>
                  <Tooltip label="Prescribe Drug">
                    <Box
                      cursor="pointer"
                      onClick={() => setOpenPrescriptionModal(true)}
                      px="25px"
                      py="10px"
                      rounded="8px"
                      border="1px solid #EA5937"
                      color="blue.blue500"
                      bg="orange.orange500"
                    >
                      Prescription
                    </Box>
                  </Tooltip>
                  <Tooltip label="Admit Patient">
                    <Box
                      onClick={() => setOpenAdmissionModal(true)}
                      cursor="pointer"
                      px="25px"
                      py="10px"
                      rounded="8px"
                      border="1px solid #EA5937"
                      color="blue.blue500"
                      bg="orange.orange500"
                    >
                      Admission
                    </Box>
                  </Tooltip>
                  <Tooltip label="Procedure">
                    <Box
                      onClick={() => setOpenProcedureModal(true)}
                      cursor="pointer"
                      px="25px"
                      py="10px"
                      rounded="8px"
                      border="1px solid #EA5937"
                      color="blue.blue500"
                      bg="orange.orange500"
                    >
                      Procedure
                    </Box>
                  </Tooltip>
                  <Tooltip label="Refer Patient To Another Doctor">
                    <Box
                      onClick={() => setOpenReferralModal(true)}
                      cursor="pointer"
                      px="25px"
                      py="10px"
                      rounded="8px"
                      border="1px solid #EA5937"
                      color="blue.blue500"
                      bg="orange.orange500"
                    >
                      Referral
                    </Box>
                  </Tooltip>
                </Flex>
              </Stack>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
        <AdmissionModal
          isOpen={OpenAdmissionModal}
          oldPayload={{ _id: id, appointmentid: id }}
          onClose={() => setOpenAdmissionModal(false)}
          type={ModalState}
          activateNotifications={activateNotifications}
        />

        <RadiologyOrderRequestModal
          isOpen={OpenRadiologyModal}
          onClose={() => setOpenRadiologyModal(false)}
          admissionId={null}
          type={"create"}
          initialData={null}
          oldPayload={{ id: id }}
          onSuccess={activateNotifications}
        />

        <CreateProcedureModal
          isOpen={OpenProcedureModal}
          onClose={() => setOpenProcedureModal(false)}
          type={"new"}
          activateNotifications={activateNotifications}
          oldPayload={{ id: id }}
        />

        <CreateReferralModal
          isOpen={OpenReferralModal}
          onClose={() => setOpenReferralModal(false)}
          type={ModalState}
          activateNotifications={activateNotifications}
        />

        <LabRequestModal
          isOpen={OpenLabModal}
          oldPayload={{ _id: id, appointmentid: id }}
          onClose={() => setOpenLabModal(false)}
          type={ModalState}
          activateNotifications={activateNotifications}
        />

        <CreatePrescriptionModal
          isOpen={OpenPrescriptionModal}
          onClose={() => setOpenPrescriptionModal(false)}
          onSuccess={activateNotifications}
          oldPayload={{ id: id }}
        />

        <Flex justifyContent="flex-end" mt="32px">
          <Button
            onClick={handleCompleted}
            isLoading={LoadingCompleted}
            isDisabled={Disabled}
            w={["100%", "100%", "184px", "184px"]}
          >
            Complete
          </Button>
        </Flex>
      </Box>
    </MainLayout>
  );
}
