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
  Select,
  Tooltip,
} from "@chakra-ui/react";
import MainLayout from "../Layouts/Index";
import Seo from "../Utils/Seo";
import Button from "../Components/Button";
import TextArea from "../Components/TextArea";
import ShowToast from "../Components/ToastNotification";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdArrowRoundBack, IoIosCloseCircle } from "react-icons/io";
import {
  CreatePhysiotherapyAssessmentApi,
  SettingsApi,
  GetDiagnosisICApi,
} from "../Utils/ApiCalls";
import PhysiotherapyAssessments from "./PhysiotherapyAssessments";
import LabRequestModal from "../Components/LabRequestModal";
import RadiologyOrderRequestModal from "../Components/RadiologyOrderRequestModal";
import CreateProcedureModal from "../Components/CreateProcedureModal";
import CreateReferralModal from "../Components/CreateReferralModal";
import AdmissionModal from "../Components/AdmissionModal";
import CreatePrescriptionModal from "../Components/CreatePrescriptionModal";
import Input from "../Components/Input";

export default function AddPhysiotherapyAssessment() {
  const { id } = useParams();
  const [Settings, setSettings] = useState({});
  const [LoadingCompleted, setLoadingCompleted] = useState(false);
  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    status: "",
  });
  const [Payload, setPayload] = useState({
    chiefComplaint: "",
    historyOfPresentCondition: "",
    medicalHistory: "",
    surgicalHistory: "",
    medications: "",
    previousTreatments: "",
    bloodPressure: "",
    pulse: "",
    respiratoryRate: "",
    temperature: "",
    muscleStrengthTesting: "",
    posturalAssessment: "",
    gaitAnalysis: "",
    palpationFindings: "",
    specialTests: "",
    functionalLimitations: "",
    visualAnalogScaleForPain: "",
    oswestryDisabilityIndex: "",
    timeUpAndGoTest: "",
    sixMinutesWalkTest: "",
    outcomeMeasureNotes: "",
    diagnosisICDEleven: "",
    primaryDiagnosisNotes: "",
    secondaryDiagnosisNotes: "",
    clinicalImpressions: "",
    shortTermGoals: "",
    longTermGoals: "",
    intervention: "",
    affectedBodyPart: "",
    slideOfBody: "",
    jointName: "",
    movementType: "",
    activeRangeOfMotion: "",
    passiveRangeOfMotion: "",
    normalRangeOfMotion: "",
    ROMDeficit: "",
    painLevelDuringMovement: "",
    endFeel: "",
    assessmentToolUsed: "",
    functionalImpact: "",
    progressNotes: "",
    notes: "",
  });

  // Arrays for multi-input fields
  const [ChiefComplaint, setChiefComplaint] = useState([]);
  const [HistoryOfPresentCondition, setHistoryOfPresentCondition] = useState(
    []
  );
  const [MedicalHistory, setMedicalHistory] = useState([]);
  const [SurgicalHistory, setSurgicalHistory] = useState([]);
  const [Medications, setMedications] = useState([]);
  const [PreviousTreatments, setPreviousTreatments] = useState([]);
  const [MuscleStrengthTesting, setMuscleStrengthTesting] = useState([]);
  const [PosturalAssessment, setPosturalAssessment] = useState([]);
  const [GaitAnalysis, setGaitAnalysis] = useState([]);
  const [PalpationFindings, setPalpationFindings] = useState([]);
  const [SpecialTests, setSpecialTests] = useState([]);
  const [FunctionalLimitations, setFunctionalLimitations] = useState([]);
  const [OutcomeMeasureNotes, setOutcomeMeasureNotes] = useState([]);
  const [DiagnosisICDEleven, setDiagnosisICDEleven] = useState([]);
  const [PrimaryDiagnosisNotes, setPrimaryDiagnosisNotes] = useState([]);
  const [SecondaryDiagnosisNotes, setSecondaryDiagnosisNotes] = useState([]);
  const [ClinicalImpressions, setClinicalImpressions] = useState([]);
  const [ShortTermGoals, setShortTermGoals] = useState([]);
  const [LongTermGoals, setLongTermGoals] = useState([]);
  const [Intervention, setIntervention] = useState([]);
  const [Notes, setNotes] = useState([]);
  const [SearchICD, setSearchICD] = useState("");
  const [DiagnosisICD, setDiagnosisICD] = useState([]);

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

  // Add functions for each array field
  const addChiefComplaint = () => {
    if (Payload.chiefComplaint.trim()) {
      setChiefComplaint([...ChiefComplaint, Payload.chiefComplaint]);
      setPayload({ ...Payload, chiefComplaint: "" });
    }
  };

  const addHistoryOfPresentCondition = () => {
    if (Payload.historyOfPresentCondition.trim()) {
      setHistoryOfPresentCondition([
        ...HistoryOfPresentCondition,
        Payload.historyOfPresentCondition,
      ]);
      setPayload({ ...Payload, historyOfPresentCondition: "" });
    }
  };

  const addMedicalHistory = () => {
    if (Payload.medicalHistory.trim()) {
      setMedicalHistory([...MedicalHistory, Payload.medicalHistory]);
      setPayload({ ...Payload, medicalHistory: "" });
    }
  };

  const addSurgicalHistory = () => {
    if (Payload.surgicalHistory.trim()) {
      setSurgicalHistory([...SurgicalHistory, Payload.surgicalHistory]);
      setPayload({ ...Payload, surgicalHistory: "" });
    }
  };

  const addMedications = () => {
    if (Payload.medications.trim()) {
      setMedications([...Medications, Payload.medications]);
      setPayload({ ...Payload, medications: "" });
    }
  };

  const addPreviousTreatments = () => {
    if (Payload.previousTreatments.trim()) {
      setPreviousTreatments([
        ...PreviousTreatments,
        Payload.previousTreatments,
      ]);
      setPayload({ ...Payload, previousTreatments: "" });
    }
  };

  const addMuscleStrengthTesting = () => {
    if (Payload.muscleStrengthTesting.trim()) {
      setMuscleStrengthTesting([
        ...MuscleStrengthTesting,
        Payload.muscleStrengthTesting,
      ]);
      setPayload({ ...Payload, muscleStrengthTesting: "" });
    }
  };

  const addPosturalAssessment = () => {
    if (Payload.posturalAssessment.trim()) {
      setPosturalAssessment([
        ...PosturalAssessment,
        Payload.posturalAssessment,
      ]);
      setPayload({ ...Payload, posturalAssessment: "" });
    }
  };

  const addGaitAnalysis = () => {
    if (Payload.gaitAnalysis.trim()) {
      setGaitAnalysis([...GaitAnalysis, Payload.gaitAnalysis]);
      setPayload({ ...Payload, gaitAnalysis: "" });
    }
  };

  const addPalpationFindings = () => {
    if (Payload.palpationFindings.trim()) {
      setPalpationFindings([...PalpationFindings, Payload.palpationFindings]);
      setPayload({ ...Payload, palpationFindings: "" });
    }
  };

  const addSpecialTests = () => {
    if (Payload.specialTests.trim()) {
      setSpecialTests([...SpecialTests, Payload.specialTests]);
      setPayload({ ...Payload, specialTests: "" });
    }
  };

  const addFunctionalLimitations = () => {
    if (Payload.functionalLimitations.trim()) {
      setFunctionalLimitations([
        ...FunctionalLimitations,
        Payload.functionalLimitations,
      ]);
      setPayload({ ...Payload, functionalLimitations: "" });
    }
  };

  const addOutcomeMeasureNotes = () => {
    if (Payload.outcomeMeasureNotes.trim()) {
      setOutcomeMeasureNotes([
        ...OutcomeMeasureNotes,
        Payload.outcomeMeasureNotes,
      ]);
      setPayload({ ...Payload, outcomeMeasureNotes: "" });
    }
  };

  const addDiagnosisICDEleven = () => {
    if (Payload.diagnosisICDEleven.trim()) {
      setDiagnosisICDEleven([
        ...DiagnosisICDEleven,
        Payload.diagnosisICDEleven,
      ]);
      setPayload({ ...Payload, diagnosisICDEleven: "" });
    }
  };

  const addPrimaryDiagnosisNotes = () => {
    if (Payload.primaryDiagnosisNotes.trim()) {
      setPrimaryDiagnosisNotes([
        ...PrimaryDiagnosisNotes,
        Payload.primaryDiagnosisNotes,
      ]);
      setPayload({ ...Payload, primaryDiagnosisNotes: "" });
    }
  };

  const addSecondaryDiagnosisNotes = () => {
    if (Payload.secondaryDiagnosisNotes.trim()) {
      setSecondaryDiagnosisNotes([
        ...SecondaryDiagnosisNotes,
        Payload.secondaryDiagnosisNotes,
      ]);
      setPayload({ ...Payload, secondaryDiagnosisNotes: "" });
    }
  };

  const addClinicalImpressions = () => {
    if (Payload.clinicalImpressions.trim()) {
      setClinicalImpressions([
        ...ClinicalImpressions,
        Payload.clinicalImpressions,
      ]);
      setPayload({ ...Payload, clinicalImpressions: "" });
    }
  };

  const addShortTermGoals = () => {
    if (Payload.shortTermGoals.trim()) {
      setShortTermGoals([...ShortTermGoals, Payload.shortTermGoals]);
      setPayload({ ...Payload, shortTermGoals: "" });
    }
  };

  const addLongTermGoals = () => {
    if (Payload.longTermGoals.trim()) {
      setLongTermGoals([...LongTermGoals, Payload.longTermGoals]);
      setPayload({ ...Payload, longTermGoals: "" });
    }
  };

  const addIntervention = () => {
    if (Payload.intervention.trim()) {
      setIntervention([...Intervention, Payload.intervention]);
      setPayload({ ...Payload, intervention: "" });
    }
  };

  const addNotes = () => {
    if (Payload.notes.trim()) {
      setNotes([...Notes, Payload.notes]);
      setPayload({ ...Payload, notes: "" });
    }
  };
  const getAllICD = async (value) => {
    try {
      const result = await GetDiagnosisICApi({ diagnosis: value });
      setDiagnosisICD(result.queryresult);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSearch = (e) => {
    setSearchICD(e.target.value);
    getAllICD(e.target.value);
  };

  // Remove functions for each array field
  const removeChiefComplaint = (item) => {
    setChiefComplaint(ChiefComplaint.filter((i) => i !== item));
  };

  const removeHistoryOfPresentCondition = (item) => {
    setHistoryOfPresentCondition(
      HistoryOfPresentCondition.filter((i) => i !== item)
    );
  };

  const removeMedicalHistory = (item) => {
    setMedicalHistory(MedicalHistory.filter((i) => i !== item));
  };

  const removeSurgicalHistory = (item) => {
    setSurgicalHistory(SurgicalHistory.filter((i) => i !== item));
  };

  const removeMedications = (item) => {
    setMedications(Medications.filter((i) => i !== item));
  };

  const removePreviousTreatments = (item) => {
    setPreviousTreatments(PreviousTreatments.filter((i) => i !== item));
  };

  const removeMuscleStrengthTesting = (item) => {
    setMuscleStrengthTesting(MuscleStrengthTesting.filter((i) => i !== item));
  };

  const removePosturalAssessment = (item) => {
    setPosturalAssessment(PosturalAssessment.filter((i) => i !== item));
  };

  const removeGaitAnalysis = (item) => {
    setGaitAnalysis(GaitAnalysis.filter((i) => i !== item));
  };

  const removePalpationFindings = (item) => {
    setPalpationFindings(PalpationFindings.filter((i) => i !== item));
  };

  const removeSpecialTests = (item) => {
    setSpecialTests(SpecialTests.filter((i) => i !== item));
  };

  const removeFunctionalLimitations = (item) => {
    setFunctionalLimitations(FunctionalLimitations.filter((i) => i !== item));
  };

  const removeOutcomeMeasureNotes = (item) => {
    setOutcomeMeasureNotes(OutcomeMeasureNotes.filter((i) => i !== item));
  };

  const removeDiagnosisICDEleven = (item) => {
    setDiagnosisICDEleven(DiagnosisICDEleven.filter((i) => i !== item));
  };

  const removePrimaryDiagnosisNotes = (item) => {
    setPrimaryDiagnosisNotes(PrimaryDiagnosisNotes.filter((i) => i !== item));
  };

  const removeSecondaryDiagnosisNotes = (item) => {
    setSecondaryDiagnosisNotes(
      SecondaryDiagnosisNotes.filter((i) => i !== item)
    );
  };

  const removeClinicalImpressions = (item) => {
    setClinicalImpressions(ClinicalImpressions.filter((i) => i !== item));
  };

  const removeShortTermGoals = (item) => {
    setShortTermGoals(ShortTermGoals.filter((i) => i !== item));
  };

  const removeLongTermGoals = (item) => {
    setLongTermGoals(LongTermGoals.filter((i) => i !== item));
  };

  const removeIntervention = (item) => {
    setIntervention(Intervention.filter((i) => i !== item));
  };

  const removeNotes = (item) => {
    setNotes(Notes.filter((i) => i !== item));
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
      appointmentoradmissionunderscoreid: appointmentId,
      chiefComplaint: ChiefComplaint,
      historyOfPresentCondition: HistoryOfPresentCondition,
      medicalHistory: MedicalHistory,
      surgicalHistory: SurgicalHistory,
      medications: Medications,
      previousTreatments: PreviousTreatments,
      bloodPressure: Payload.bloodPressure,
      pulse: Payload.pulse,
      respiratoryRate: Payload.respiratoryRate,
      temperature: Payload.temperature,
      muscleStrengthTesting: MuscleStrengthTesting,
      posturalAssessment: PosturalAssessment,
      gaitAnalysis: GaitAnalysis,
      palpationFindings: PalpationFindings,
      specialTests: SpecialTests,
      functionalLimitations: FunctionalLimitations,
      visualAnalogScaleForPain: Payload.visualAnalogScaleForPain,
      oswestryDisabilityIndex: Payload.oswestryDisabilityIndex,
      timeUpAndGoTest: Payload.timeUpAndGoTest,
      sixMinutesWalkTest: Payload.sixMinutesWalkTest,
      outcomeMeasureNotes: OutcomeMeasureNotes,
      diagnosisICDEleven: DiagnosisICDEleven,
      primaryDiagnosisNotes: PrimaryDiagnosisNotes,
      secondaryDiagnosisNotes: SecondaryDiagnosisNotes,
      clinicalImpressions: ClinicalImpressions,
      shortTermGoals: ShortTermGoals,
      longTermGoals: LongTermGoals,
      intervention: Intervention,
      affectedBodyPart: Payload.affectedBodyPart,
      slideOfBody: Payload.slideOfBody,
      jointName: Payload.jointName,
      movementType: Payload.movementType,
      activeRangeOfMotion: Payload.activeRangeOfMotion,
      passiveRangeOfMotion: Payload.passiveRangeOfMotion,
      normalRangeOfMotion: Payload.normalRangeOfMotion,
      ROMDeficit: Payload.ROMDeficit,
      painLevelDuringMovement: Payload.painLevelDuringMovement,
      endFeel: Payload.endFeel,
      assessmentToolUsed: Payload.assessmentToolUsed,
      functionalImpact: Payload.functionalImpact,
      progressNotes: Payload.progressNotes,
      notes: Notes,
    };

    try {
      const result = await CreatePhysiotherapyAssessmentApi(id, apiPayload);

      // Check either HTTP status code or data.status
      if (result.status === 201 || result.data.status === true) {
        setLoadingCompleted(false);
        activateNotifications(
          "Physiotherapy Assessment Created Successfully. Redirecting...",
          "success"
        );
        setTimeout(() => {
          nav(pathname || `/dashboard/physiotherapy-assessments/${id}`);
        }, 3000);
      } else {
        setLoadingCompleted(false);
        activateNotifications(
          "Failed to create physiotherapy assessment.",
          "error"
        );
      }
    } catch (e) {
      setLoadingCompleted(false);
      activateNotifications(
        e.response?.data?.message || e.message || "An error occurred",
        "error"
      );
    }
  };

  useEffect(() => {
    const hasData =
      Object.values(Payload).some((value) => value !== "") ||
      [
        ChiefComplaint,
        HistoryOfPresentCondition,
        MedicalHistory,
        SurgicalHistory,
        Medications,
        PreviousTreatments,
        MuscleStrengthTesting,
        PosturalAssessment,
        GaitAnalysis,
        PalpationFindings,
        SpecialTests,
        FunctionalLimitations,
        OutcomeMeasureNotes,
        DiagnosisICDEleven,
        PrimaryDiagnosisNotes,
        SecondaryDiagnosisNotes,
        ClinicalImpressions,
        ShortTermGoals,
        LongTermGoals,
        Intervention,
        Notes,
      ].some((arr) => arr.length > 0);
    setDisabled(!hasData);
    getSettings();
  }, [
    Payload,
    ChiefComplaint,
    HistoryOfPresentCondition,
    MedicalHistory,
    SurgicalHistory,
    Medications,
    PreviousTreatments,
    MuscleStrengthTesting,
    PosturalAssessment,
    GaitAnalysis,
    PalpationFindings,
    SpecialTests,
    FunctionalLimitations,
    OutcomeMeasureNotes,
    DiagnosisICDEleven,
    PrimaryDiagnosisNotes,
    SecondaryDiagnosisNotes,
    ClinicalImpressions,
    ShortTermGoals,
    LongTermGoals,
    Intervention,
    Notes,
  ]);

  return (
    <MainLayout>
      {showToast.show && (
        <ShowToast message={showToast.message} status={showToast.status} />
      )}
      <Seo
        title="Create Physiotherapy Assessment"
        description="Physiotherapy Assessment Creation"
      />
      <Box>
        <Button
          leftIcon={<IoMdArrowRoundBack />}
          px="40px"
          w="100px"
          onClick={() =>
            nav(pathname || `/dashboard/physiotherapy-assessments/${id}`)
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
                Previous Physiotherapy Assessments
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
              <PhysiotherapyAssessments hide={true} />
            </AccordionPanel>
          </AccordionItem>

          {/* Chief Complaint */}
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
                Chief Complaint
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
              <Stack spacing={4}>
                <TextArea
                  placeholder="Chief Complaint"
                  value={Payload.chiefComplaint}
                  onChange={handlePayload}
                  id="chiefComplaint"
                />
                <Flex justifyContent="flex-end" mt="2">
                  <Button
                    onClick={addChiefComplaint}
                    w={["100%", "100%", "184px", "184px"]}
                  >
                    Add
                  </Button>
                </Flex>
                <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>
                  {ChiefComplaint.map((item, i) => (
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
                        onClick={() => removeChiefComplaint(item)}
                      >
                        <IoIosCloseCircle />
                      </Box>
                    </Flex>
                  ))}
                </SimpleGrid>
              </Stack>
            </AccordionPanel>
          </AccordionItem>

          {/* History of Present Condition */}
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
                History of Present Condition
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
              <Stack spacing={4}>
                <TextArea
                  placeholder="History of Present Condition"
                  value={Payload.historyOfPresentCondition}
                  onChange={handlePayload}
                  id="historyOfPresentCondition"
                />
                <Flex justifyContent="flex-end" mt="2">
                  <Button
                    onClick={addHistoryOfPresentCondition}
                    w={["100%", "100%", "184px", "184px"]}
                  >
                    Add
                  </Button>
                </Flex>
                <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>
                  {HistoryOfPresentCondition.map((item, i) => (
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
                        onClick={() => removeHistoryOfPresentCondition(item)}
                      >
                        <IoIosCloseCircle />
                      </Box>
                    </Flex>
                  ))}
                </SimpleGrid>
              </Stack>
            </AccordionPanel>
          </AccordionItem>

          {/* Medical History */}
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
                Medical History
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
              <Stack spacing={4}>
                <TextArea
                  placeholder="Medical History"
                  value={Payload.medicalHistory}
                  onChange={handlePayload}
                  id="medicalHistory"
                />
                <Flex justifyContent="flex-end" mt="2">
                  <Button
                    onClick={addMedicalHistory}
                    w={["100%", "100%", "184px", "184px"]}
                  >
                    Add
                  </Button>
                </Flex>
                <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>
                  {MedicalHistory.map((item, i) => (
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
                        onClick={() => removeMedicalHistory(item)}
                      >
                        <IoIosCloseCircle />
                      </Box>
                    </Flex>
                  ))}
                </SimpleGrid>
              </Stack>
            </AccordionPanel>
          </AccordionItem>

          {/* Surgical History */}
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
                Surgical History
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
              <Stack spacing={4}>
                <TextArea
                  placeholder="Surgical History"
                  value={Payload.surgicalHistory}
                  onChange={handlePayload}
                  id="surgicalHistory"
                />
                <Flex justifyContent="flex-end" mt="2">
                  <Button
                    onClick={addSurgicalHistory}
                    w={["100%", "100%", "184px", "184px"]}
                  >
                    Add
                  </Button>
                </Flex>
                <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>
                  {SurgicalHistory.map((item, i) => (
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
                        onClick={() => removeSurgicalHistory(item)}
                      >
                        <IoIosCloseCircle />
                      </Box>
                    </Flex>
                  ))}
                </SimpleGrid>
              </Stack>
            </AccordionPanel>
          </AccordionItem>

          {/* Medications */}
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
                Medications
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
              <Stack spacing={4}>
                <TextArea
                  placeholder="Medications"
                  value={Payload.medications}
                  onChange={handlePayload}
                  id="medications"
                />
                <Flex justifyContent="flex-end" mt="2">
                  <Button
                    onClick={addMedications}
                    w={["100%", "100%", "184px", "184px"]}
                  >
                    Add
                  </Button>
                </Flex>
                <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>
                  {Medications.map((item, i) => (
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
                        onClick={() => removeMedications(item)}
                      >
                        <IoIosCloseCircle />
                      </Box>
                    </Flex>
                  ))}
                </SimpleGrid>
              </Stack>
            </AccordionPanel>
          </AccordionItem>

          {/* Previous Treatments */}
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
                Previous Treatments
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
              <Stack spacing={4}>
                <TextArea
                  placeholder="Previous Treatments"
                  value={Payload.previousTreatments}
                  onChange={handlePayload}
                  id="previousTreatments"
                />
                <Flex justifyContent="flex-end" mt="2">
                  <Button
                    onClick={addPreviousTreatments}
                    w={["100%", "100%", "184px", "184px"]}
                  >
                    Add
                  </Button>
                </Flex>
                <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>
                  {PreviousTreatments.map((item, i) => (
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
                        onClick={() => removePreviousTreatments(item)}
                      >
                        <IoIosCloseCircle />
                      </Box>
                    </Flex>
                  ))}
                </SimpleGrid>
              </Stack>
            </AccordionPanel>
          </AccordionItem>

          {/* Vital Signs */}
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
                Vital Signs
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <Input
                  label="Blood Pressure"
                  value={Payload.bloodPressure}
                  onChange={handlePayload}
                  id="bloodPressure"
                  placeholder="Blood Pressure"
                />
                <Input
                  label="Pulse"
                  value={Payload.pulse}
                  onChange={handlePayload}
                  id="pulse"
                  placeholder="Pulse"
                />
                <Input
                  label="Respiratory Rate"
                  value={Payload.respiratoryRate}
                  onChange={handlePayload}
                  id="respiratoryRate"
                  placeholder="Respiratory Rate"
                />
                <Input
                  label="Temperature"
                  value={Payload.temperature}
                  onChange={handlePayload}
                  id="temperature"
                  placeholder="Temperature"
                />
              </SimpleGrid>
            </AccordionPanel>
          </AccordionItem>

          {/* Muscle Strength Testing */}
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
                Muscle Strength Testing
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
              <Stack spacing={4}>
                <TextArea
                  placeholder="Muscle Strength Testing"
                  value={Payload.muscleStrengthTesting}
                  onChange={handlePayload}
                  id="muscleStrengthTesting"
                />
                <Flex justifyContent="flex-end" mt="2">
                  <Button
                    onClick={addMuscleStrengthTesting}
                    w={["100%", "100%", "184px", "184px"]}
                  >
                    Add
                  </Button>
                </Flex>
                <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>
                  {MuscleStrengthTesting.map((item, i) => (
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
                        onClick={() => removeMuscleStrengthTesting(item)}
                      >
                        <IoIosCloseCircle />
                      </Box>
                    </Flex>
                  ))}
                </SimpleGrid>
              </Stack>
            </AccordionPanel>
          </AccordionItem>

          {/* Postural Assessment */}
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
                Postural Assessment
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
              <Stack spacing={4}>
                <TextArea
                  placeholder="Postural Assessment"
                  value={Payload.posturalAssessment}
                  onChange={handlePayload}
                  id="posturalAssessment"
                />
                <Flex justifyContent="flex-end" mt="2">
                  <Button
                    onClick={addPosturalAssessment}
                    w={["100%", "100%", "184px", "184px"]}
                  >
                    Add
                  </Button>
                </Flex>
                <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>
                  {PosturalAssessment.map((item, i) => (
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
                        onClick={() => removePosturalAssessment(item)}
                      >
                        <IoIosCloseCircle />
                      </Box>
                    </Flex>
                  ))}
                </SimpleGrid>
              </Stack>
            </AccordionPanel>
          </AccordionItem>

          {/* Gait Analysis */}
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
                Gait Analysis
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
              <Stack spacing={4}>
                <TextArea
                  placeholder="Gait Analysis"
                  value={Payload.gaitAnalysis}
                  onChange={handlePayload}
                  id="gaitAnalysis"
                />
                <Flex justifyContent="flex-end" mt="2">
                  <Button
                    onClick={addGaitAnalysis}
                    w={["100%", "100%", "184px", "184px"]}
                  >
                    Add
                  </Button>
                </Flex>
                <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>
                  {GaitAnalysis.map((item, i) => (
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
                        onClick={() => removeGaitAnalysis(item)}
                      >
                        <IoIosCloseCircle />
                      </Box>
                    </Flex>
                  ))}
                </SimpleGrid>
              </Stack>
            </AccordionPanel>
          </AccordionItem>

          {/* Palpation Findings */}
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
                Palpation Findings
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
              <Stack spacing={4}>
                <TextArea
                  placeholder="Palpation Findings"
                  value={Payload.palpationFindings}
                  onChange={handlePayload}
                  id="palpationFindings"
                />
                <Flex justifyContent="flex-end" mt="2">
                  <Button
                    onClick={addPalpationFindings}
                    w={["100%", "100%", "184px", "184px"]}
                  >
                    Add
                  </Button>
                </Flex>
                <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>
                  {PalpationFindings.map((item, i) => (
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
                        onClick={() => removePalpationFindings(item)}
                      >
                        <IoIosCloseCircle />
                      </Box>
                    </Flex>
                  ))}
                </SimpleGrid>
              </Stack>
            </AccordionPanel>
          </AccordionItem>

          {/* Special Tests */}
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
                Special Tests
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
              <Stack spacing={4}>
                <TextArea
                  placeholder="Special Tests"
                  value={Payload.specialTests}
                  onChange={handlePayload}
                  id="specialTests"
                />
                <Flex justifyContent="flex-end" mt="2">
                  <Button
                    onClick={addSpecialTests}
                    w={["100%", "100%", "184px", "184px"]}
                  >
                    Add
                  </Button>
                </Flex>
                <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>
                  {SpecialTests.map((item, i) => (
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
                        onClick={() => removeSpecialTests(item)}
                      >
                        <IoIosCloseCircle />
                      </Box>
                    </Flex>
                  ))}
                </SimpleGrid>
              </Stack>
            </AccordionPanel>
          </AccordionItem>

          {/* Functional Limitations */}
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
                Functional Limitations
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
              <Stack spacing={4}>
                <TextArea
                  placeholder="Functional Limitations"
                  value={Payload.functionalLimitations}
                  onChange={handlePayload}
                  id="functionalLimitations"
                />
                <Flex justifyContent="flex-end" mt="2">
                  <Button
                    onClick={addFunctionalLimitations}
                    w={["100%", "100%", "184px", "184px"]}
                  >
                    Add
                  </Button>
                </Flex>
                <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>
                  {FunctionalLimitations.map((item, i) => (
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
                        onClick={() => removeFunctionalLimitations(item)}
                      >
                        <IoIosCloseCircle />
                      </Box>
                    </Flex>
                  ))}
                </SimpleGrid>
              </Stack>
            </AccordionPanel>
          </AccordionItem>

          {/* Outcome Measures */}
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
                Outcome Measures
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <Input
                  label="Visual Analog Scale for Pain"
                  value={Payload.visualAnalogScaleForPain}
                  onChange={handlePayload}
                  id="visualAnalogScaleForPain"
                  placeholder="Visual Analog Scale for Pain"
                />
                <Input
                  label="Oswestry Disability Index"
                  value={Payload.oswestryDisabilityIndex}
                  onChange={handlePayload}
                  id="oswestryDisabilityIndex"
                  placeholder="Oswestry Disability Index"
                />
                <Input
                  label="Time Up and Go Test"
                  value={Payload.timeUpAndGoTest}
                  onChange={handlePayload}
                  id="timeUpAndGoTest"
                  placeholder="Time Up and Go Test"
                />
                <Input
                  label="Six Minutes Walk Test"
                  value={Payload.sixMinutesWalkTest}
                  onChange={handlePayload}
                  id="sixMinutesWalkTest"
                  placeholder="Six Minutes Walk Test"
                />
              </SimpleGrid>
              <Stack spacing={4} mt="4">
                <TextArea
                  placeholder="Outcome Measure Notes"
                  value={Payload.outcomeMeasureNotes}
                  onChange={handlePayload}
                  id="outcomeMeasureNotes"
                />
                <Flex justifyContent="flex-end" mt="2">
                  <Button
                    onClick={addOutcomeMeasureNotes}
                    w={["100%", "100%", "184px", "184px"]}
                  >
                    Add
                  </Button>
                </Flex>
                <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>
                  {OutcomeMeasureNotes.map((item, i) => (
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
                        onClick={() => removeOutcomeMeasureNotes(item)}
                      >
                        <IoIosCloseCircle />
                      </Box>
                    </Flex>
                  ))}
                </SimpleGrid>
              </Stack>
            </AccordionPanel>
          </AccordionItem>

          {/* Diagnosis */}
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
                Diagnosis
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
              <SimpleGrid
                mt="12px"
                pt="12px"
                columns={{ base: 1, md: 1 }}
                spacing={2}
              >
                <Input
                  label="Search ICD 11"
                  value={SearchICD}
                  onChange={handleSearch}
                  placeholder="Search for diagnosis codes"
                />

                <Select
                  fontSize={Payload.diagnosisICDEleven !== "" ? "16px" : "13px"}
                  h="45px"
                  borderWidth="2px"
                  borderColor="#6B7280"
                  id="diagnosisICDEleven"
                  value={Payload.diagnosisICDEleven}
                  onChange={handlePayload}
                  placeholder="Select diagnosis ICD 11"
                >
                  {DiagnosisICD.map((item, i) => (
                    <option
                      key={i}
                      value={`${item[1]}`}
                    >{`${item[0]} ~ ${item[1]}`}</option>
                  ))}
                </Select>
              </SimpleGrid>

              <Stack spacing={4} mt="4">
                <TextArea
                  placeholder="Primary Diagnosis Notes"
                  value={Payload.primaryDiagnosisNotes}
                  onChange={handlePayload}
                  id="primaryDiagnosisNotes"
                />
                <Flex justifyContent="flex-end" mt="2">
                  <Button
                    onClick={addPrimaryDiagnosisNotes}
                    w={["100%", "100%", "184px", "184px"]}
                  >
                    Add
                  </Button>
                </Flex>
                <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>
                  {PrimaryDiagnosisNotes.map((item, i) => (
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
                        onClick={() => removePrimaryDiagnosisNotes(item)}
                      >
                        <IoIosCloseCircle />
                      </Box>
                    </Flex>
                  ))}
                </SimpleGrid>
              </Stack>

              <Stack spacing={4} mt="4">
                <TextArea
                  placeholder="Secondary Diagnosis Notes"
                  value={Payload.secondaryDiagnosisNotes}
                  onChange={handlePayload}
                  id="secondaryDiagnosisNotes"
                />
                <Flex justifyContent="flex-end" mt="2">
                  <Button
                    onClick={addSecondaryDiagnosisNotes}
                    w={["100%", "100%", "184px", "184px"]}
                  >
                    Add
                  </Button>
                </Flex>
                <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>
                  {SecondaryDiagnosisNotes.map((item, i) => (
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
                        onClick={() => removeSecondaryDiagnosisNotes(item)}
                      >
                        <IoIosCloseCircle />
                      </Box>
                    </Flex>
                  ))}
                </SimpleGrid>
              </Stack>
            </AccordionPanel>
          </AccordionItem>

          {/* Clinical Impressions */}
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
                Clinical Impressions
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
              <Stack spacing={4}>
                <TextArea
                  placeholder="Clinical Impressions"
                  value={Payload.clinicalImpressions}
                  onChange={handlePayload}
                  id="clinicalImpressions"
                />
                <Flex justifyContent="flex-end" mt="2">
                  <Button
                    onClick={addClinicalImpressions}
                    w={["100%", "100%", "184px", "184px"]}
                  >
                    Add
                  </Button>
                </Flex>
                <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>
                  {ClinicalImpressions.map((item, i) => (
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
                        onClick={() => removeClinicalImpressions(item)}
                      >
                        <IoIosCloseCircle />
                      </Box>
                    </Flex>
                  ))}
                </SimpleGrid>
              </Stack>
            </AccordionPanel>
          </AccordionItem>

          {/* Treatment Plan */}
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
                Treatment Plan
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
              <Stack spacing={4}>
                <TextArea
                  placeholder="Short Term Goals"
                  value={Payload.shortTermGoals}
                  onChange={handlePayload}
                  id="shortTermGoals"
                />
                <Flex justifyContent="flex-end" mt="2">
                  <Button
                    onClick={addShortTermGoals}
                    w={["100%", "100%", "184px", "184px"]}
                  >
                    Add
                  </Button>
                </Flex>
                <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>
                  {ShortTermGoals.map((item, i) => (
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
                        onClick={() => removeShortTermGoals(item)}
                      >
                        <IoIosCloseCircle />
                      </Box>
                    </Flex>
                  ))}
                </SimpleGrid>
              </Stack>
              <Stack spacing={4} mt="4">
                <TextArea
                  placeholder="Long Term Goals"
                  value={Payload.longTermGoals}
                  onChange={handlePayload}
                  id="longTermGoals"
                />
                <Flex justifyContent="flex-end" mt="2">
                  <Button
                    onClick={addLongTermGoals}
                    w={["100%", "100%", "184px", "184px"]}
                  >
                    Add
                  </Button>
                </Flex>
                <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>
                  {LongTermGoals.map((item, i) => (
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
                        onClick={() => removeLongTermGoals(item)}
                      >
                        <IoIosCloseCircle />
                      </Box>
                    </Flex>
                  ))}
                </SimpleGrid>
              </Stack>
              <Stack spacing={4} mt="4">
                <TextArea
                  placeholder="Intervention"
                  value={Payload.intervention}
                  onChange={handlePayload}
                  id="intervention"
                />
                <Flex justifyContent="flex-end" mt="2">
                  <Button
                    onClick={addIntervention}
                    w={["100%", "100%", "184px", "184px"]}
                  >
                    Add
                  </Button>
                </Flex>
                <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>
                  {Intervention.map((item, i) => (
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
                        onClick={() => removeIntervention(item)}
                      >
                        <IoIosCloseCircle />
                      </Box>
                    </Flex>
                  ))}
                </SimpleGrid>
              </Stack>
            </AccordionPanel>
          </AccordionItem>

          {/* Range of Motion Assessment */}
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
                Range of Motion Assessment
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <Input
                  label="Affected Body Part"
                  value={Payload.affectedBodyPart}
                  onChange={handlePayload}
                  id="affectedBodyPart"
                  placeholder="Affected Body Part"
                />
                <Input
                  label="Side of Body"
                  value={Payload.slideOfBody}
                  onChange={handlePayload}
                  id="slideOfBody"
                  placeholder="Side of Body"
                />
                <Input
                  label="Joint Name"
                  value={Payload.jointName}
                  onChange={handlePayload}
                  id="jointName"
                  placeholder="Joint Name"
                />
                <Select
                  label="Movement Type"
                  value={Payload.movementType}
                  onChange={handlePayload}
                  id="movementType"
                  placeholder="Select Movement Type"
                >
                  <option value="Flexion">Flexion</option>
                  <option value="Extension">Extension</option>
                  <option value="Abduction">Abduction</option>
                  <option value="Adduction">Adduction</option>
                  <option value="Internal">Internal</option>
                  <option value="External">External</option>
                  <option value="Circumduction">Circumduction</option>
                  <option value="Elevation">Elevation</option>
                  <option value="Depression">Depression</option>
                </Select>
                <Input
                  label="Active Range of Motion"
                  value={Payload.activeRangeOfMotion}
                  onChange={handlePayload}
                  id="activeRangeOfMotion"
                  placeholder="Active Range of Motion"
                />
                <Input
                  label="Passive Range of Motion"
                  value={Payload.passiveRangeOfMotion}
                  onChange={handlePayload}
                  id="passiveRangeOfMotion"
                  placeholder="Passive Range of Motion"
                />
                <Input
                  label="Normal Range of Motion"
                  value={Payload.normalRangeOfMotion}
                  onChange={handlePayload}
                  id="normalRangeOfMotion"
                  placeholder="Normal Range of Motion"
                />
                <Input
                  label="ROM Deficit"
                  value={Payload.ROMDeficit}
                  onChange={handlePayload}
                  id="ROMDeficit"
                  placeholder="ROM Deficit"
                />
                <Select
                  label="Pain Level During Movement"
                  value={Payload.painLevelDuringMovement}
                  onChange={handlePayload}
                  id="painLevelDuringMovement"
                  placeholder="Select Pain Level"
                >
                  <option value="1">1 - No pain</option>
                  <option value="2">2 - Mild pain</option>
                  <option value="3">3 - Moderate pain</option>
                  <option value="4">4 - Severe pain</option>
                  <option value="5">5 - Very severe pain</option>
                  <option value="6">6 - Worst possible pain</option>
                </Select>
                <Input
                  label="End Feel"
                  value={Payload.endFeel}
                  onChange={handlePayload}
                  id="endFeel"
                  placeholder="End Feel"
                />
                <Input
                  label="Assessment Tool Used"
                  value={Payload.assessmentToolUsed}
                  onChange={handlePayload}
                  id="assessmentToolUsed"
                  placeholder="Assessment Tool Used"
                />
                <Input
                  label="Functional Impact"
                  value={Payload.functionalImpact}
                  onChange={handlePayload}
                  id="functionalImpact"
                  placeholder="Functional Impact"
                />
                <Input
                  label="Progress Notes"
                  value={Payload.progressNotes}
                  onChange={handlePayload}
                  id="progressNotes"
                  placeholder="Progress Notes"
                />
              </SimpleGrid>
            </AccordionPanel>
          </AccordionItem>

          {/* Notes */}
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
                Notes
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
              <Stack spacing={4}>
                <TextArea
                  placeholder="Notes"
                  value={Payload.notes}
                  onChange={handlePayload}
                  id="notes"
                />
                <Flex justifyContent="flex-end" mt="2">
                  <Button
                    onClick={addNotes}
                    w={["100%", "100%", "184px", "184px"]}
                  >
                    Add
                  </Button>
                </Flex>
                <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>
                  {Notes.map((item, i) => (
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
                        onClick={() => removeNotes(item)}
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
