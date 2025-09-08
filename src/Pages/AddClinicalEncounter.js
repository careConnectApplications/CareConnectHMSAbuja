import { HStack, Text, Box, Flex, Select, Stack, useDisclosure, SimpleGrid, Tooltip, VStack, Badge } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import MainLayout from "../Layouts/Index";
import Seo from "../Utils/Seo";
import Button from "../Components/Button";
import Input from "../Components/Input";
import TextArea from "../Components/TextArea";
import LabRequestModal from "../Components/LabRequestModal";
import ShowToast from "../Components/ToastNotification";
import ClinicalEncounter from "./ClinicalEncounter";
import AdmissionModal from "../Components/AdmissionModal";
import RadiologyOrderRequestModal from "../Components/RadiologyOrderRequestModal";
import CreateProcedureModal from "../Components/CreateProcedureModal";
import CreateReferralModal from "../Components/CreateReferralModal";
import PreviewEncounter from "../Components/PreviewEncounter";
import CreatePrescriptionModal from "../Components/CreatePrescriptionModal";
import { useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import { SettingsApi, GetDiagnosisICApi, GetAllVitalsApi, AddClinicalEncounterAPI } from "../Utils/ApiCalls";
import { FaNoteSticky } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io";
import { FaTemperatureHigh, FaHeartCircleCheck, FaPen } from "react-icons/fa6";
import { FaTextHeight, FaHeartbeat } from "react-icons/fa";
import { MdBloodtype } from "react-icons/md";
import { GiEnergyBreath } from "react-icons/gi";
import { GiWeight } from "react-icons/gi";
import { useParams } from 'react-router-dom';
import PatientInfoCard from '../Components/PatientInfoCard';

export default function AddClinicalEncounter() {
    const { id } = useParams()
    const [Settings, setSettings] = useState({});
    const [OpenLabModal, setOpenLabModal] = useState(false);
    const [OpenPrescriptionModal, setOpenPrescriptionModal] = useState(false);
    const [OpenRadiologyModal, setOpenRadiologyModal] = useState(false);
    const [OpenProcedureModal, setOpenProcedureModal] = useState(false);
    const [OpenReferralModal, setOpenReferralModal] = useState(false);
    const [OpenPreview, setOpenPreview] = useState(false);
    const [SearchICD, setSearchICD] = useState("");
    const [selectedICDInfo, setSelectedICDInfo] = useState(null);
    const [icdSearchResults, setICDSearchResults] = useState([]);
    const [isLoadingICD, setIsLoadingICD] = useState(false);
    const [OpenAdmissionModal, setOpenAdmissionModal] = useState(false);
    const [Complaints, setComplaints] = useState([]);
    const [ClinicalNotes, setClinicalNotes] = useState([]);
    const [AssessmentNotes, setAssessmentNotes] = useState([]);
    const [DiagnosisNotes, setDiagnosisNotes] = useState([]);
    const [PlanNotes, setPlanNotes] = useState([]);
    const [DiagnosisICD, setDiagnosisICD] = useState([]);
    
    // Edit states for each note type
    const [EditingAssessment, setEditingAssessment] = useState({ isEditing: false, index: -1 });
    const [EditingDiagnosis, setEditingDiagnosis] = useState({ isEditing: false, index: -1 });
    const [EditingPlan, setEditingPlan] = useState({ isEditing: false, index: -1 });
    const [EditingClinical, setEditingClinical] = useState({ isEditing: false, index: -1 });
    const [NurseVitals, setNurseVitals] = useState({});
    const [Outcomes, setOutcomes] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [ModalState, setModalState] = useState("");
    const [Disabled, setDisabled] = useState(true);
    const [Loading, setLoading] = useState(false);
    const [LoadingCompleted, setLoadingCompleted] = useState(false);

    const [Payload, setPayload] = useState({
        diagnosisnote: "",
        diagnosisicd10: "",
        assessmentnote: "",
        clinicalnote: "",
        outcome: "",
        plannote: "",
        height: "",
        weight: "",
        temperature: "",
        bloodpressuresystolic: "",
        bloodpressurediastolic: "",
        respiration: "",
        saturation: "",
        heartrate: "",


    })

    const getAllICD = async (value) => {
        try {
            const result = await GetDiagnosisICApi({ diagnosis: value });
            setDiagnosisICD(result.queryresult);
        } catch (e) {
            console.error("Error fetching ICD codes:", e.message);
        }
    };

    // Handler for ICD selection from search results
    const handleICDSelect = (icdItem) => {
        setPayload((prev) => ({
            ...prev,
            diagnosisicd10: icdItem[1],
        }));
        setSelectedICDInfo({
            name: icdItem[0],
            code: icdItem[1],
        });
        setICDSearchResults([]); // Clear search results
        setSearchICD(`${icdItem[0]} (${icdItem[1]})`);
    };

    // Auto-search functionality with debouncing for ICD
    useEffect(() => {
        const searchICD = async (searchTerm) => {
            if (!searchTerm || searchTerm.trim().length < 2) {
                setICDSearchResults([]);
                return;
            }

            // Don't search if an ICD is already selected and the search term matches
            if (selectedICDInfo && searchTerm.includes(selectedICDInfo.code)) {
                return;
            }

            try {
                setIsLoadingICD(true);
                const result = await GetDiagnosisICApi({ diagnosis: searchTerm });
                if (result?.queryresult) {
                    setICDSearchResults(result.queryresult);
                } else {
                    setICDSearchResults([]);
                }
            } catch (e) {
                console.error("Error searching ICD codes:", e.message);
                setICDSearchResults([]);
            } finally {
                setIsLoadingICD(false);
            }
        };

        const timeoutId = setTimeout(() => {
            searchICD(SearchICD);
        }, 300); // 300ms debounce

        return () => clearTimeout(timeoutId);
    }, [SearchICD, selectedICDInfo]);

    // Handle search input change and clear selection if user starts typing new search
    const handleSearchInputChange = (e) => {
        const value = e.target.value;
        setSearchICD(value);

        // Clear selected ICD if user modifies the search significantly
        if (selectedICDInfo && !value.includes(selectedICDInfo.code)) {
            setSelectedICDInfo(null);
            setPayload((prev) => ({
                ...prev,
                diagnosisicd10: "",
            }));
        }
    };

    const handleSuccess = (message, status) => {
        setShowToast({ show: true, message, status });
        setTimeout(() => {
            setShowToast({ show: false, message: "", status: "" });
        }, 3000);

    };

    const handlePayload = (e) => {
        setPayload({ ...Payload, [e.target.id]: e.target.value })
        if (e.target.id === "presentingcompalintcode") {

            setComplaints([...Complaints, e.target.value])
        }
    }


    const addClinicalNotes = () => {
        if (EditingClinical.isEditing) {
            // Update existing note
            const updatedNotes = [...ClinicalNotes];
            updatedNotes[EditingClinical.index] = Payload.clinicalnote;
            setClinicalNotes(updatedNotes);
            setEditingClinical({ isEditing: false, index: -1 });
        } else {
            // Add new note
            setClinicalNotes([...ClinicalNotes, Payload.clinicalnote])
        }
        setPayload({ ...Payload, clinicalnote: "" })
    }
    const addAssessmentNotes = () => {
        if (EditingAssessment.isEditing) {
            // Update existing note
            const updatedNotes = [...AssessmentNotes];
            updatedNotes[EditingAssessment.index] = Payload.assessmentnote;
            setAssessmentNotes(updatedNotes);
            setEditingAssessment({ isEditing: false, index: -1 });
        } else {
            // Add new note
            setAssessmentNotes([...AssessmentNotes, Payload.assessmentnote])
        }
        setPayload({ ...Payload, assessmentnote: "" })
    }
    
    const addDiagnosisNotes = () => {
        if (EditingDiagnosis.isEditing) {
            // Update existing note
            const updatedNotes = [...DiagnosisNotes];
            updatedNotes[EditingDiagnosis.index] = Payload.diagnosisnote;
            setDiagnosisNotes(updatedNotes);
            setEditingDiagnosis({ isEditing: false, index: -1 });
        } else {
            // Add new note
            setDiagnosisNotes([...DiagnosisNotes, Payload.diagnosisnote])
        }
        setPayload({ ...Payload, diagnosisnote: "" })
    }
    
    const addPlanNotes = () => {
        if (EditingPlan.isEditing) {
            // Update existing note
            const updatedNotes = [...PlanNotes];
            updatedNotes[EditingPlan.index] = Payload.plannote;
            setPlanNotes(updatedNotes);
            setEditingPlan({ isEditing: false, index: -1 });
        } else {
            // Add new note
            setPlanNotes([...PlanNotes, Payload.plannote])
        }
        setPayload({ ...Payload, plannote: "" })
    }


    const getSettings = async () => {
        try {
            const result = await SettingsApi();
            let checker = result?.servicecategory?.filter(item => item.category === "Appointment")
            setSettings(result);
            setOutcomes(result.encounterplanoutcome);
        } catch (e) {

        }
    };
    const getAllVitals = async () => {
        try {
            const result = await GetAllVitalsApi(id);

            console.log("getAllVitals", result)

            setNurseVitals(result.queryresult);

            setPayload({
                height: result.queryresult?.height,
                weight: result.queryresult?.weight,
                temperature: result.queryresult?.temperature,
                bloodpressuresystolic: result.queryresult?.bloodpressuresystolic,
                bloodpressurediastolic: result.queryresult?.bloodpressurediastolic,
                respiration: result.queryresult?.respiration,
                saturation: result.queryresult?.saturation,
                heartrate: result.queryresult?.heartrate,
            })
        } catch (e) {
            console.error(e.message)
        }
    };

    // Helper functions for initiating edit mode
    const editAssessmentNote = (index) => {
        setEditingAssessment({ isEditing: true, index: index });
        setPayload({ ...Payload, assessmentnote: AssessmentNotes[index] });
    }

    const editDiagnosisNote = (index) => {
        setEditingDiagnosis({ isEditing: true, index: index });
        setPayload({ ...Payload, diagnosisnote: DiagnosisNotes[index] });
    }

    const editPlanNote = (index) => {
        setEditingPlan({ isEditing: true, index: index });
        setPayload({ ...Payload, plannote: PlanNotes[index] });
    }

    const editClinicalNote = (index) => {
        setEditingClinical({ isEditing: true, index: index });
        setPayload({ ...Payload, clinicalnote: ClinicalNotes[index] });
    }

    // Cancel functions for exiting edit mode
    const cancelEditAssessment = () => {
        setEditingAssessment({ isEditing: false, index: -1 });
        setPayload({ ...Payload, assessmentnote: "" });
    }

    const cancelEditDiagnosis = () => {
        setEditingDiagnosis({ isEditing: false, index: -1 });
        setPayload({ ...Payload, diagnosisnote: "" });
    }

    const cancelEditPlan = () => {
        setEditingPlan({ isEditing: false, index: -1 });
        setPayload({ ...Payload, plannote: "" });
    }

    const cancelEditClinical = () => {
        setEditingClinical({ isEditing: false, index: -1 });
        setPayload({ ...Payload, clinicalnote: "" });
    }

    const removeAssessment = (item) => {
        const updatedItems = AssessmentNotes.filter(id => id !== item);
        setAssessmentNotes(updatedItems);
        // Cancel edit if the item being removed is currently being edited
        if (EditingAssessment.isEditing && AssessmentNotes[EditingAssessment.index] === item) {
            cancelEditAssessment();
        }
    }

    const removeClinicalNotes = (item) => {
        const updatedItems = ClinicalNotes.filter(id => id !== item);
        setClinicalNotes(updatedItems);
        // Cancel edit if the item being removed is currently being edited
        if (EditingClinical.isEditing && ClinicalNotes[EditingClinical.index] === item) {
            cancelEditClinical();
        }
    }

    const removeDiagnosisNotes = (item) => {
        const updatedItems = DiagnosisNotes.filter(id => id !== item);
        setDiagnosisNotes(updatedItems);
        // Cancel edit if the item being removed is currently being edited
        if (EditingDiagnosis.isEditing && DiagnosisNotes[EditingDiagnosis.index] === item) {
            cancelEditDiagnosis();
        }
    }

    const removePlanNotes = (item) => {
        const updatedItems = PlanNotes.filter(id => id !== item);
        setPlanNotes(updatedItems);
        // Cancel edit if the item being removed is currently being edited
        if (EditingPlan.isEditing && PlanNotes[EditingPlan.index] === item) {
            cancelEditPlan();
        }
    }

    const [showToast, setShowToast] = useState({
        show: false,
        message: "",
        status: "",
    });

    const activateNotifications = (message, status) => {

        setShowToast({
            show: true,
            message: message,
            status: status,
        });

        setTimeout(() => {
            setShowToast({
                show: false,
            });

        }, 5000)
    }


    let pathName = localStorage.getItem("pathname");

    const handleInprogress = async () => {

        setLoading(true)
        try {
            const result = await AddClinicalEncounterAPI(
                {
                    ...Payload, status: "3",
                    diagnosisnote: DiagnosisNotes,
                    assessmentnote: AssessmentNotes,
                    clinicalnote: ClinicalNotes,
                    plannote: PlanNotes,
                }, id);


            if (result.status === 200) {
                setLoading(false)
                activateNotifications("Encounter Saved as Inprogress Successfully", "success")
                nav(`${pathName}`)

            }

        } catch (e) {
            setLoading(false)
            activateNotifications(e.message, "error")
        }
    }
    const handleCompleted = async () => {
        setLoadingCompleted(true)
        try {
            const result = await AddClinicalEncounterAPI({
                ...Payload, status: "1",
                diagnosisnote: DiagnosisNotes,
                assessmentnote: AssessmentNotes,
                clinicalnote: ClinicalNotes,
                plannote: PlanNotes,
            }, id);
            console.log("AddClinicalEncounterAPI", result)


            if (result.status === 200) {
                setLoadingCompleted(false)

                activateNotifications("Encounter Saved as Completed Successfully", "success")
                nav(`${pathName}`)

            }

        } catch (e) {
            setLoadingCompleted(false)
            activateNotifications(e.message, "error")
        }
    }


    useEffect(() => {
        getAllVitals()
        getSettings();
    }, []);

    // Clear search input and ICD list when component unmounts or resets
    useEffect(() => {
        return () => {
            setSearchICD("");
            setICDSearchResults([]);
            setSelectedICDInfo(null);
        };
    }, []);



    const nav = useNavigate()

    const pathname = localStorage.getItem("pathname")
    return (
        <MainLayout>
            {showToast.show && (
                <ShowToast message={showToast.message} status={showToast.status} />
            )}
            <Seo title="Doctor's Encounter" description="Care connect  Doctor's Encounter" />

            <Box>
                <Button leftIcon={<IoMdArrowRoundBack />} px="40px" w="100px" onClick={() => nav(`${pathname}`)}>Back</Button>
                <PatientInfoCard />

                <Stack spacing={5} mt="32px">
                    {/* Previous Clinical Encounter Section */}
                    <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
                        <Text fontSize="xl" fontWeight="bold" mb={4}>Previous Clinical Encounter</Text>
                        <ClinicalEncounter hide={true} />
                    </Box>

                    {/* Clinical Notes Section */}
                    <Box p={5} shadow="md" borderWidth="1px" borderRadius="md" bg={EditingClinical.isEditing ? "yellow.50" : "white"}>
                        <Text fontSize="xl" fontWeight="bold" mb={10}>Clinical Notes {EditingClinical.isEditing && <Badge colorScheme="yellow" ml={2}>Editing</Badge>}</Text>
                        <Stack spacing={4}>
                            <TextArea label="Clinical Note" value={Payload.clinicalnote} onChange={handlePayload} id="clinicalnote" />
                            <Flex justifyContent="flex-end" gap={2}>
                                {EditingClinical.isEditing && (
                                    <Button onClick={cancelEditClinical} variant="outline" colorScheme="gray" w={{ base: "100%", md: "120px" }}>
                                        Cancel
                                    </Button>
                                )}
                                <Button onClick={addClinicalNotes} w={{ base: "100%", md: "184px" }}>
                                    {EditingClinical.isEditing ? "Update" : "Add"}
                                </Button>
                            </Flex>
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
                                {ClinicalNotes?.map((item, i) => (
                                    <Flex 
                                        key={i} 
                                        cursor="pointer" 
                                        px="10px" 
                                        py="10px" 
                                        rounded="20px" 
                                        fontSize="12px" 
                                        _hover={{ bg: "blue.blue400" }} 
                                        bg={EditingClinical.isEditing && EditingClinical.index === i ? "yellow.200" : "blue.blue500"} 
                                        w="100%" 
                                        justifyContent="space-between" 
                                        alignItems="center"
                                    >
                                        <Text color={EditingClinical.isEditing && EditingClinical.index === i ? "gray.800" : "#fff"} fontWeight="500" textTransform="capitalize" >{item}</Text>
                                        <Flex gap={2}>
                                            <Box 
                                                fontSize="16px" 
                                                color={EditingClinical.isEditing && EditingClinical.index === i ? "blue.500" : "#fff"} 
                                                onClick={() => editClinicalNote(i)}
                                                _hover={{ transform: "scale(1.1)" }}
                                            >
                                                <FaPen />
                                            </Box>
                                            <Box 
                                                fontSize="20px" 
                                                color={EditingClinical.isEditing && EditingClinical.index === i ? "red.500" : "#fff"} 
                                                onClick={() => removeClinicalNotes(item)}
                                                _hover={{ transform: "scale(1.1)" }}
                                            >
                                                <IoIosCloseCircle />
                                            </Box>
                                        </Flex>
                                    </Flex>
                                ))}
                            </SimpleGrid>
                        </Stack>
                    </Box>


                    {/* Vitals Section */}
                    <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
                        <Text fontSize="xl" fontWeight="bold" mb={4}>Vitals</Text>
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} mb="42px">
                            <Input type="number" leftIcon={<FaTemperatureHigh />} label="Temperature (C)" value={Payload.temperature} val={Payload.temperature !== "" ? true : false} onChange={handlePayload} id="temperature" />
                            <Input type="number" leftIcon={<FaHeartbeat />} label="Heart Rate (bpm)" value={Payload.heartrate} val={Payload.heartrate !== "" ? true : false} onChange={handlePayload} id="heartrate" />
                            <Input type="number" leftIcon={<MdBloodtype />} label="Blood Pressure (systolic)(mmHg)" value={Payload.bloodpressuresystolic} val={Payload.bloodpressuresystolic !== "" ? true : false} onChange={handlePayload} id="bloodpressuresystolic" />
                            <Input type="number" leftIcon={<MdBloodtype />} label="Blood Pressure (Diastolic)(mmHg)" value={Payload.bloodpressurediastolic} val={Payload.bloodpressurediastolic !== "" ? true : false} onChange={handlePayload} id="bloodpressurediastolic" />
                            <Input type="number" leftIcon={<GiEnergyBreath />} label="Respiration (bpm)" value={Payload.respiration} val={Payload.respiration !== "" ? true : false} onChange={handlePayload} id="respiration" />
                            <Input type="number" leftIcon={<FaHeartCircleCheck />} label="O2 Saturation (%)" value={Payload.saturation} val={Payload.saturation !== "" ? true : false} onChange={handlePayload} id="saturation" />
                            <Input type="number" leftIcon={<FaTextHeight />} label="Height (cm)" value={Payload.height} val={Payload.height !== "" ? true : false} onChange={handlePayload} id="height" />
                            <Input type="number" leftIcon={<GiWeight />} label="Weight (kg)" value={Payload.weight} val={Payload.weight !== "" ? true : false} onChange={handlePayload} id="weight" />
                        </SimpleGrid>


                        <TextArea label="Vitals  Note" value={Payload.vitalNote} onChange={handlePayload} id="vitalNote" />
                        <Text color="red" mt="20px" >Note: Please add at least one vital information</Text>


                    </Box>


                    {/* Assessment Notes Section */}
                    <Box p={5} shadow="md" borderWidth="1px" borderRadius="md" bg={EditingAssessment.isEditing ? "yellow.50" : "white"}>
                        <Text fontSize="xl" fontWeight="bold" mb={10}>Assessment Notes {EditingAssessment.isEditing && <Badge colorScheme="yellow" ml={2}>Editing</Badge>}</Text>
                        <Stack spacing={4}>
                            <TextArea label="Assessment Note" value={Payload.assessmentnote} onChange={handlePayload} id="assessmentnote" />
                            <Flex justifyContent="flex-end" gap={2}>
                                {EditingAssessment.isEditing && (
                                    <Button onClick={cancelEditAssessment} variant="outline" colorScheme="gray" w={{ base: "100%", md: "120px" }}>
                                        Cancel
                                    </Button>
                                )}
                                <Button onClick={addAssessmentNotes} w={{ base: "100%", md: "184px" }}>
                                    {EditingAssessment.isEditing ? "Update" : "Add"}
                                </Button>
                            </Flex>
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
                                {AssessmentNotes?.map((item, i) => (
                                    <Flex 
                                        key={i} 
                                        cursor="pointer" 
                                        px="10px" 
                                        py="10px" 
                                        rounded="20px" 
                                        fontSize="12px" 
                                        _hover={{ bg: "blue.blue400" }} 
                                        bg={EditingAssessment.isEditing && EditingAssessment.index === i ? "yellow.200" : "blue.blue500"} 
                                        w="100%" 
                                        justifyContent="space-between" 
                                        alignItems="center"
                                    >
                                        <Text color={EditingAssessment.isEditing && EditingAssessment.index === i ? "gray.800" : "#fff"} fontWeight="500" textTransform="capitalize" >{item}</Text>
                                        <Flex gap={2}>
                                            <Box 
                                                fontSize="16px" 
                                                color={EditingAssessment.isEditing && EditingAssessment.index === i ? "blue.500" : "#fff"} 
                                                onClick={() => editAssessmentNote(i)}
                                                _hover={{ transform: "scale(1.1)" }}
                                            >
                                                <FaPen />
                                            </Box>
                                            <Box 
                                                fontSize="20px" 
                                                color={EditingAssessment.isEditing && EditingAssessment.index === i ? "red.500" : "#fff"} 
                                                onClick={() => removeAssessment(item)}
                                                _hover={{ transform: "scale(1.1)" }}
                                            >
                                                <IoIosCloseCircle />
                                            </Box>
                                        </Flex>
                                    </Flex>
                                ))}
                            </SimpleGrid>
                        </Stack>
                    </Box>

                    {/* Diagnosis Notes Section */}
                    <Box p={5} shadow="md" borderWidth="1px" borderRadius="md" bg={EditingDiagnosis.isEditing ? "yellow.50" : "white"}>
                        <Text fontSize="xl" fontWeight="bold" mb={10}>Diagnosis {EditingDiagnosis.isEditing && <Badge colorScheme="yellow" ml={2}>Editing</Badge>}</Text>
                        <Stack spacing={4}>
                            <TextArea label="Diagnosis" value={Payload.diagnosisnote} onChange={handlePayload} id="diagnosisnote" />
                            <Flex justifyContent="flex-end" gap={2}>
                                {EditingDiagnosis.isEditing && (
                                    <Button onClick={cancelEditDiagnosis} variant="outline" colorScheme="gray" w={{ base: "100%", md: "120px" }}>
                                        Cancel
                                    </Button>
                                )}
                                <Button onClick={addDiagnosisNotes} w={{ base: "100%", md: "184px" }}>
                                    {EditingDiagnosis.isEditing ? "Update" : "Add"}
                                </Button>
                            </Flex>
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
                                {DiagnosisNotes?.map((item, i) => (
                                    <Flex 
                                        key={i} 
                                        cursor="pointer" 
                                        px="10px" 
                                        py="10px" 
                                        rounded="20px" 
                                        fontSize="12px" 
                                        _hover={{ bg: "blue.blue400" }} 
                                        bg={EditingDiagnosis.isEditing && EditingDiagnosis.index === i ? "yellow.200" : "blue.blue500"} 
                                        w="100%" 
                                        justifyContent="space-between" 
                                        alignItems="center"
                                    >
                                        <Text color={EditingDiagnosis.isEditing && EditingDiagnosis.index === i ? "gray.800" : "#fff"} fontWeight="500" textTransform="capitalize" >{item}</Text>
                                        <Flex gap={2}>
                                            <Box 
                                                fontSize="16px" 
                                                color={EditingDiagnosis.isEditing && EditingDiagnosis.index === i ? "blue.500" : "#fff"} 
                                                onClick={() => editDiagnosisNote(i)}
                                                _hover={{ transform: "scale(1.1)" }}
                                            >
                                                <FaPen />
                                            </Box>
                                            <Box 
                                                fontSize="20px" 
                                                color={EditingDiagnosis.isEditing && EditingDiagnosis.index === i ? "red.500" : "#fff"} 
                                                onClick={() => removeDiagnosisNotes(item)}
                                                _hover={{ transform: "scale(1.1)" }}
                                            >
                                                <IoIosCloseCircle />
                                            </Box>
                                        </Flex>
                                    </Flex>
                                ))}
                            </SimpleGrid>
                        </Stack>
                    </Box>



                    {/* Plan Notes Section */}
                    <Box p={5} shadow="md" borderWidth="1px" borderRadius="md" bg={EditingPlan.isEditing ? "yellow.50" : "white"}>
                        <Text fontSize="xl" fontWeight="bold" mb={10}>Plan Notes {EditingPlan.isEditing && <Badge colorScheme="yellow" ml={2}>Editing</Badge>}</Text>
                        <Stack spacing={4}>
                            <TextArea label="Plan Note" value={Payload.plannote} onChange={handlePayload} id="plannote" />
                            <Flex justifyContent="flex-end" gap={2}>
                                {EditingPlan.isEditing && (
                                    <Button onClick={cancelEditPlan} variant="outline" colorScheme="gray" w={{ base: "100%", md: "120px" }}>
                                        Cancel
                                    </Button>
                                )}
                                <Button onClick={addPlanNotes} w={{ base: "100%", md: "184px" }}>
                                    {EditingPlan.isEditing ? "Update" : "Add"}
                                </Button>
                            </Flex>
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
                                {PlanNotes?.map((item, i) => (
                                    <Flex 
                                        key={i} 
                                        cursor="pointer" 
                                        px="10px" 
                                        py="10px" 
                                        rounded="20px" 
                                        fontSize="12px" 
                                        _hover={{ bg: "blue.blue400" }} 
                                        bg={EditingPlan.isEditing && EditingPlan.index === i ? "yellow.200" : "blue.blue500"} 
                                        w="100%" 
                                        justifyContent="space-between" 
                                        alignItems="center"
                                    >
                                        <Text color={EditingPlan.isEditing && EditingPlan.index === i ? "gray.800" : "#fff"} fontWeight="500" textTransform="capitalize" >{item}</Text>
                                        <Flex gap={2}>
                                            <Box 
                                                fontSize="16px" 
                                                color={EditingPlan.isEditing && EditingPlan.index === i ? "blue.500" : "#fff"} 
                                                onClick={() => editPlanNote(i)}
                                                _hover={{ transform: "scale(1.1)" }}
                                            >
                                                <FaPen />
                                            </Box>
                                            <Box 
                                                fontSize="20px" 
                                                color={EditingPlan.isEditing && EditingPlan.index === i ? "red.500" : "#fff"} 
                                                onClick={() => removePlanNotes(item)}
                                                _hover={{ transform: "scale(1.1)" }}
                                            >
                                                <IoIosCloseCircle />
                                            </Box>
                                        </Flex>
                                    </Flex>
                                ))}
                            </SimpleGrid>
                        </Stack>
                    </Box>

                    {/* Diagnosis ICD Section */}
                    <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
                        <Text fontSize="xl" fontWeight="bold" mb={4}>Diagnosis ICD 11</Text>
                        <Box position="relative">
                            <Input
                                label="Search ICD 11"
                                placeholder="Enter diagnosis name or ICD code"
                                value={SearchICD}
                                onChange={handleSearchInputChange}
                                leftIcon={<FiSearch size={16} color="blue.500" />}
                            />

                            {/* Selected ICD Display */}
                            {selectedICDInfo && (
                                <Box mt={2} p={3} bg="blue.50" borderRadius="md" border="1px solid" borderColor="blue.200">
                                    <HStack spacing={2}>
                                        <Badge colorScheme="blue" variant="solid">Selected</Badge>
                                        <Text fontWeight="medium">{selectedICDInfo.name}</Text>
                                        <Text fontSize="sm" color="gray.600">Code: {selectedICDInfo.code}</Text>
                                    </HStack>
                                </Box>
                            )}

                            {/* Search Results Dropdown */}
                            {icdSearchResults.length > 0 && !selectedICDInfo && (
                                <Box
                                    position="absolute"
                                    top="100%"
                                    left={0}
                                    right={0}
                                    zIndex={1000}
                                    bg="white"
                                    border="1px solid"
                                    borderColor="gray.200"
                                    borderRadius="md"
                                    boxShadow="xl"
                                    maxH="400px"
                                    overflowY="auto"
                                    mt={1}
                                >
                                    {icdSearchResults.map((item, index) => (
                                        <Box
                                            key={index}
                                            p={4}
                                            cursor="pointer"
                                            _hover={{ bg: "blue.50", borderColor: "blue.200" }}
                                            onClick={() => handleICDSelect(item)}
                                            borderBottom="1px solid"
                                            borderColor="gray.100"
                                            _last={{ borderBottom: "none" }}
                                            transition="all 0.2s"
                                        >
                                            <Text fontWeight="medium" fontSize="sm" color="gray.800">
                                                {item[0]}
                                            </Text>
                                            <Text fontSize="xs" color="blue.600" mt={1}>
                                                Code: {item[1]}
                                            </Text>
                                        </Box>
                                    ))}
                                </Box>
                            )}

                            {/* Loading Indicator */}
                            {isLoadingICD && (
                                <Box
                                    position="absolute"
                                    top="100%"
                                    left={0}
                                    right={0}
                                    zIndex={1000}
                                    bg="white"
                                    border="1px solid"
                                    borderColor="gray.200"
                                    borderRadius="md"
                                    boxShadow="lg"
                                    p={4}
                                    mt={1}
                                >
                                    <Text color="gray.500" fontSize="sm">Searching ICD codes...</Text>
                                </Box>
                            )}
                        </Box>
                    </Box>

                    {/* Plan Section */}
                    <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
                        <Text fontSize="xl" fontWeight="bold" mb={4}>Plan</Text>
                        <Stack spacing={4}>
                            <Select fontSize={Payload.outcome !== "" ? "16px" : "13px"} h="45px" borderWidth="2px" borderColor="#6B7280" id="outcome"
                                value={Payload.outcome} onChange={handlePayload} placeholder="Select outcome" >
                                {Outcomes?.map(item => (
                                    <option key={item} value={item}>{item}</option>
                                ))}
                            </Select>
                            <Flex justifyContent="space-between" flexWrap="wrap" gap={3}>
                                <Tooltip label='Lab Order'>
                                    <Box onClick={() => setOpenLabModal(true)} cursor="pointer" px="25px" py="10px" rounded="8px" border="1px solid #EA5937" color="blue.blue500" bg="orange.orange500">Lab</Box>
                                </Tooltip>
                                <Tooltip label='Radiology Order'>
                                    <Box onClick={() => setOpenRadiologyModal(true)} cursor="pointer" px="25px" py="10px" rounded="8px" border="1px solid #EA5937" color="blue.blue500" bg="orange.orange500">Radiology</Box>
                                </Tooltip>
                                <Tooltip label='Prescribe Drug'>
                                    <Box cursor="pointer" onClick={() => setOpenPrescriptionModal(true)} px="25px" py="10px" rounded="8px" border="1px solid #EA5937" color="blue.blue500" bg="orange.orange500">Prescription</Box>
                                </Tooltip>
                                <Tooltip label='Admit Patient'>
                                    <Box onClick={() => setOpenAdmissionModal(true)} cursor="pointer" px="25px" py="10px" rounded="8px" border="1px solid #EA5937" color="blue.blue500" bg="orange.orange500">Admission</Box>
                                </Tooltip>
                                <Tooltip label='Procedure'>
                                    <Box onClick={() => setOpenProcedureModal(true)} cursor="pointer" px="25px" py="10px" rounded="8px" border="1px solid #EA5937" color="blue.blue500" bg="orange.orange500">Procedure</Box>
                                </Tooltip>
                                <Tooltip label='Refer Patient To Another Doctor'>
                                    <Box onClick={() => setOpenReferralModal(true)} cursor="pointer" px="25px" py="10px" rounded="8px" border="1px solid #EA5937" color="blue.blue500" bg="orange.orange500">Referral</Box>
                                </Tooltip>
                            </Flex>
                        </Stack>
                    </Box>
                </Stack>

                <Flex justifyContent="center" mt={8}>
                    <Flex
                        justifyContent="space-between"
                        flexWrap="wrap"
                        w={{ base: "100%", md: "60%" }}
                        gap={4}
                    >
                        <Button
                            w={{ base: "100%", md: "184px" }}
                            onClick={handleInprogress}
                            isLoading={Loading}
                        >
                            Save as In-Progress
                        </Button>
                        <Button
                            onClick={handleCompleted}
                            isLoading={LoadingCompleted}
                            w={{ base: "100%", md: "184px" }}
                        >
                            Save as Completed
                        </Button>
                    </Flex>
                </Flex>

                {/* Modals */}
                <AdmissionModal isOpen={OpenAdmissionModal} oldPayload={{ _id: id, appointmentid: id }} onClose={() => setOpenAdmissionModal(false)} type={ModalState} activateNotifications={activateNotifications} />
                <RadiologyOrderRequestModal
                    isOpen={OpenRadiologyModal}
                    onClose={() => setOpenRadiologyModal(false)}
                    admissionId={null}
                    type={"create"}
                    initialData={null}
                    oldPayload={{ id: id }}
                    onSuccess={handleSuccess}
                />
                <CreateProcedureModal
                    isOpen={OpenProcedureModal}
                    onClose={() => setOpenProcedureModal(false)}
                    type={"new"}
                    activateNotifications={activateNotifications}
                    oldPayload={{ id: id }}
                />
                <CreateReferralModal isOpen={OpenReferralModal} onClose={() => setOpenReferralModal(false)} type={"new"} activateNotifications={activateNotifications} />
                <PreviewEncounter isOpen={OpenPreview} onClose={() => setOpenPreview(false)} setOldPayload={setPayload} oldPayload={Payload} />
                <LabRequestModal isOpen={OpenLabModal} oldPayload={{ _id: id, appointmentid: id }} onClose={() => setOpenLabModal(false)} type={ModalState} activateNotifications={activateNotifications} />
                <CreatePrescriptionModal
                    isOpen={OpenPrescriptionModal}
                    onClose={() => setOpenPrescriptionModal(false)}
                    onSuccess={activateNotifications}
                    oldPayload={{ id: id }}
                />

            </Box>
        </MainLayout>
    )
}
