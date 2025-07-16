import { HStack, Text, Box, Flex, Select, Stack, useDisclosure, SimpleGrid, Tooltip } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import MainLayout from "../Layouts/Index";
import Seo from "../Utils/Seo";
import Button from "../Components/Button";
import Input from "../Components/Input";
import TextArea from "../Components/TextArea";
import LabRequestModal from "../Components/LabRequestModal";
import ShowToast from "../Components/ToastNotification";
import Examine from "./Examine";
import GeneralExaminationModal from "../Components/GeneralExaminationModal";
import HistoryCvsModal from "../Components/HistoryCvsModal";
import HistoryRespModal from "../Components/HistoryRespModal";
import HistoryGiModal from "../Components/HistoryGiModal";
import HistoryGuModal from "../Components/HistoryGuModal";
import HistoryNeuroModal from "../Components/HistoryNeuroModal";
import HistoryMskModal from "../Components/HistoryMskModal";
import MedicalHistoryModal from "../Components/MedicalHistoryModal";
import PostnatalHistoryModal from "../Components/PostnatalHistoryModal";
import DevelopmentalHistoryModal from "../Components/DevelopmentalHistoryModal";
import ImmunizationHistoryModal from "../Components/ImmunizationHistoryModal";
import CvsExaminationModal from "../Components/CvsExaminationModal";
import RespExaminationModal from "../Components/RespExaminationModal";
import GiExaminationModal from "../Components/GiExaminationModal";
import GuExaminationModal from "../Components/GuExaminationModal";
import NeuroExaminationModal from "../Components/NeuroExaminationModal";
import AdmissionModal from "../Components/AdmissionModal";
import RadiologyOrderRequestModal from "../Components/RadiologyOrderRequestModal";
import CreateProcedureModal from "../Components/CreateProcedureModal";
import CreateReferralModal from "../Components/CreateReferralModal";
import MskExaminationModal from "../Components/MskExaminationModal";
import PreviewEncounter from "../Components/PreviewEncounter";
import CreatePrescriptionModal from "../Components/CreatePrescriptionModal";
import { useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io"; import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
} from '@chakra-ui/react'
import { SettingsApi, AddEncounterAPI } from "../Utils/ApiCalls";
import { FaNoteSticky } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io";
import { FaTemperatureHigh, FaHeartCircleCheck } from "react-icons/fa6";
import { FaTextHeight, FaHeartbeat } from "react-icons/fa";
import { MdBloodtype } from "react-icons/md";
import { GiEnergyBreath } from "react-icons/gi";
import { GiWeight } from "react-icons/gi";
import { TbMichelinStarFilled } from "react-icons/tb";
import { useParams } from 'react-router-dom';
import PatientInfoCard from '../Components/PatientInfoCard';

export default function Encounter() {
    const { id } = useParams()
    const [Settings, setSettings] = useState({});
    const [OpenLabModal, setOpenLabModal] = useState(false);
    const [OpenPrescriptionModal, setOpenPrescriptionModal] = useState(false);
    const [OpenRadiologyModal, setOpenRadiologyModal] = useState(false);
    const [OpenProcedureModal, setOpenProcedureModal] = useState(false);
    const [OpenReferralModal, setOpenReferralModal] = useState(false);
    const [OpenHistoryCvsModal, setOpenHistoryCvsModal] = useState(false);
    const [OpenHistoryRespModal, setOpenHistoryRespModal] = useState(false);
    const [OpenHistoryGiModal, setOpenHistoryGiModal] = useState(false);
    const [OpenHistoryGuModal, setOpenHistoryGuModal] = useState(false);
    const [OpenHistoryNeuroModal, setOpenHistoryNeuroModal] = useState(false);
    const [OpenHistoryMskModal, setOpenHistoryMskModal] = useState(false);
    const [OpenMedicalHistoryModal, setOpenMedicalHistoryModal] = useState(false);
    const [OpenPostnatalHistoryModal, setOpenPostnatalHistoryModal] = useState(false);
    const [OpenDevelopmentalHistoryModal, setOpenDevelopmentalHistoryModal] = useState(false);
    const [OpenImmunizationHistoryModal, setOpenImmunizationHistoryModal] = useState(false);
    const [OpenCvsModal, setOpenCvsModal] = useState(false);
    const [OpenRespModal, setOpenRespModal] = useState(false);
    const [OpenGiModal, setOpenGiModal] = useState(false);
    const [OpenGuModal, setOpenGuModal] = useState(false);
    const [OpenNeuroModal, setOpenNeuroModal] = useState(false);
    const [OpenPreview, setOpenPreview] = useState(false);
    const [OpenMskModal, setOpenMskModal] = useState(false);
    const [OpenAdmissionModal, setOpenAdmissionModal] = useState(false);
    const [Complaints, setComplaints] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [ModalState, setModalState] = useState("");
    const [Disabled, setDisabled] = useState(true);
    const [Loading, setLoading] = useState(false);
    const [LoadingCompleted, setLoadingCompleted] = useState(false);
    const [Payload, setPayload] = useState({
        presentingcomplaints: "",
        presentingcompalintcode: "",
        pastmedicalhistory: "",
        drugandallergyhistory: "",
        familyandsocialhistory: "",
        nutritionhistory: "",
        spirituality: "",
        height: "",
        weight: "",
        temperature: "",
        bloodpressuresystolic: "",
        bloodpressurediastolic: "",
        respiration: "",
        saturation: "",
        heart: "",
        hair: "",
        hairnote: "",
        face: "",
        facenote: "",
        jaundice: "",
        jaundicenote: "",
        cyanosis: "",
        cyanosisnote: "",
        pallor: "",
        pallornote: "",
        oral: "",
        oralnote: "",
        lymphnodes: "",
        lymphnodesnote: "",
        ederma: "",
        edermanote: "",
        lastmenstrationperiod: "",
        lastmenstrationperiodnote: "",
        generalphysicalexamination: "",
        assessment: "",
        assessmentnote: "",
        diagosis: "",
        diagosisnote: "",
        icpc2: "",
        icpc2note: "",
        outcome: "",
        plannote: "",
        additionalnote: ""

    })

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
    console.log("Encounter Payload: ", Payload)

    const getSettings = async () => {
        try {
            const result = await SettingsApi();
            let checker = result?.servicecategory?.filter(item => item.category === "Appointment")
            setSettings(result);
        } catch (e) {

        }
    };

    const removeComplaint = (item) => {


        const updatedComplaints = Complaints.filter(id => id !== item);
        setComplaints(updatedComplaints);


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
            const result = await AddEncounterAPI(
                { ...Payload, status: "3", presentingcompalintcode: Complaints }, id);
            console.log("AddEncounterAPI", result)


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
            const result = await AddEncounterAPI({ ...Payload, status: "1", presentingcompalintcode: Complaints }, id);
            console.log("AddEncounterAPI", result)


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



        if (Object.values(Payload).some(value => value !== null && value !== "")) {
            console.log('Payload has values');
            setDisabled(false)
        } else {
            console.log('Payload is empty');
            setDisabled(true)
        }



        getSettings();

    }, [Payload]);



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
                <Accordion defaultIndex={[7]} mt="32px" allowToggle>
                    <AccordionItem mb="15px" >

                        <AccordionButton _hover={{ border: "1px solid #EA5937", color: "#000" }} _focus={{ outline: "none" }} border="1px solid #fff" _expanded={{ rounded: "8px 8px 0px 0px", border: 0 }} bg="#fff" color="#000" rounded="8px">
                            <Box as='span' flex='1' textAlign='left'>
                                Previous Encounter
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>

                        <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px" >
                            <Examine hide={true} />
                        </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem mb="15px">

                        <AccordionButton _hover={{ border: "1px solid #EA5937", color: "#000" }} _focus={{ outline: "none" }} border="1px solid #fff" _expanded={{ rounded: "8px 8px 0px 0px", border: 0 }} bg="#fff" color="#000" rounded="8px">
                            <Box as='span' flex='1' textAlign='left'>
                                History
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>

                        <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
                            <Stack spacing={4}>
                                <Input leftIcon={<FaNoteSticky />} label="Presenting Complaints" value={Payload.presentingcomplaints} onChange={handlePayload} id="presentingcomplaints" />

                                <Select fontSize={Payload.presentingcompalintcode !== "" ? "16px" : "13px"}
                                    h="45px"
                                    borderWidth="2px"
                                    borderColor="#6B7280"
                                    id="presentingcompalintcode"
                                    value={Payload.presentingcompalintcode}
                                    onChange={handlePayload}
                                    placeholder="Select Presenting Complaints Code"
                                >

                                    {
                                        Settings?.presentingcompalintcode?.map((item, i) => (
                                            <option value={`${item}`} key={i}>{item}</option>

                                        ))
                                    }



                                </Select>
                                <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>

                                    {
                                        Complaints?.map((item, i) => (

                                            <Flex key={i} cursor="pointer" px="10px" py="10px" rounded={"20px"} fontSize="12px" _hover={{ bg: "blue.blue400" }} bg="blue.blue500" w="100%" justifyContent="space-between" alignItems="center" >
                                                <Text color="#fff" fontWeight="500" textTransform="capitalize" >{item}</Text>
                                                <Box fontSize="20px" color="#fff" onClick={() => removeComplaint(item)}><IoIosCloseCircle /></Box>
                                            </Flex>
                                        ))
                                    }

                                </SimpleGrid>


                                <Flex justifyContent="space-between" flexWrap="wrap" mt={["10px", "10px", "10px", "10px"]} w={["100%", "100%", "60%", "60%"]} >
                                    <Tooltip label='Cardiovascular'>
                                        <Box onClick={() => setOpenHistoryCvsModal(true)} cursor="pointer" px="25px" py="10px" rounded="8px" border="1px solid #EA5937" color="blue.blue500" bg="orange.orange500">CVS </Box>
                                    </Tooltip>
                                    <Tooltip label='Respiratory Assessment'>
                                        <Box onClick={() => setOpenHistoryRespModal(true)} cursor="pointer" px="25px" py="10px" rounded="8px" border="1px solid #EA5937" color="blue.blue500" bg="orange.orange500">Resp </Box>
                                    </Tooltip>
                                    <Tooltip label='Gastro-intestinal Assessment'>
                                        <Box onClick={() => setOpenHistoryGiModal(true)} cursor="pointer" px="25px" py="10px" rounded="8px" border="1px solid #EA5937" color="blue.blue500" bg="orange.orange500">GI </Box>
                                    </Tooltip>
                                    <Tooltip label='Genitourinary'>
                                        <Box onClick={() => setOpenHistoryGuModal(true)} cursor="pointer" px="25px" py="10px" rounded="8px" border="1px solid #EA5937" color="blue.blue500" bg="orange.orange500">GU </Box>
                                    </Tooltip>
                                    <Tooltip label='Neurology'>
                                        <Box onClick={() => setOpenHistoryNeuroModal(true)} cursor="pointer" px="25px" py="10px" rounded="8px" border="1px solid #EA5937" color="blue.blue500" bg="orange.orange500">Neuro </Box>
                                    </Tooltip>
                                    <Tooltip label='Musculoskeletal'>
                                        <Box onClick={() => setOpenHistoryMskModal(true)} cursor="pointer" px="25px" py="10px" rounded="8px" border="1px solid #EA5937" color="blue.blue500" bg="orange.orange500">MSK </Box>
                                    </Tooltip>
                                </Flex>

                                <Input leftIcon={<FaNoteSticky />} label="Past Medical History" value={Payload.pastmedicalhistory} onChange={handlePayload} id="pastmedicalhistory" />
                                <Input leftIcon={<FaNoteSticky />} label="Drug and Allergy history" value={Payload.drugandallergyhistory} onChange={handlePayload} id="drugandallergyhistory" />
                                <Input leftIcon={<FaNoteSticky />} label="Family and Social History" value={Payload.familyandsocialhistory} onChange={handlePayload} id="familyandsocialhistory" />
                                <Input leftIcon={<FaNoteSticky />} label="Nutrition History" value={Payload.nutritionhistory} onChange={handlePayload} id="nutritionhistory" />
                                <Input leftIcon={<FaNoteSticky />} label="Spirituality" value={Payload.spirituality} onChange={handlePayload} id="spirituality" />

                            </Stack>
                            <HistoryCvsModal isOpen={OpenHistoryCvsModal} onClose={() => setOpenHistoryCvsModal(false)} setOldPayload={setPayload} oldPayload={Payload} type={ModalState} activateNotifications={activateNotifications} />
                            <HistoryRespModal isOpen={OpenHistoryRespModal} onClose={() => setOpenHistoryRespModal(false)} setOldPayload={setPayload} oldPayload={Payload} type={ModalState} activateNotifications={activateNotifications} />
                            <HistoryGiModal isOpen={OpenHistoryGiModal} onClose={() => setOpenHistoryGiModal(false)} setOldPayload={setPayload} oldPayload={Payload} type={ModalState} activateNotifications={activateNotifications} />
                            <HistoryGuModal isOpen={OpenHistoryGuModal} onClose={() => setOpenHistoryGuModal(false)} setOldPayload={setPayload} oldPayload={Payload} type={ModalState} activateNotifications={activateNotifications} />
                            <HistoryNeuroModal isOpen={OpenHistoryNeuroModal} onClose={() => setOpenHistoryNeuroModal(false)} setOldPayload={setPayload} oldPayload={Payload} type={ModalState} activateNotifications={activateNotifications} />
                            <HistoryMskModal isOpen={OpenHistoryMskModal} onClose={() => setOpenHistoryMskModal(false)} setOldPayload={setPayload} oldPayload={Payload} type={ModalState} activateNotifications={activateNotifications} />

                        </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem mb="15px">

                        <AccordionButton _hover={{ border: "1px solid #EA5937", color: "#000" }} _focus={{ outline: "none" }} border="1px solid #fff" _expanded={{ rounded: "8px 8px 0px 0px", border: 0 }} bg="#fff" color="#000" rounded="8px">
                            <Box as='span' flex='1' textAlign='left'>
                                Pediatrics
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>

                        <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
                            <Flex justifyContent="space-between" flexWrap="wrap" mt={["10px", "10px", "10px", "10px"]} w={["100%", "100%", "100%", "100%"]} >
                                <Tooltip label='Medical'>
                                    <Box onClick={() => setOpenMedicalHistoryModal(true)} cursor="pointer" px="25px" py="10px" rounded="8px" border="1px solid #EA5937" color="blue.blue500" bg="orange.orange500">Medical History </Box>
                                </Tooltip>
                                <Tooltip label='Prenatal'>
                                    <Box onClick={() => setOpenPostnatalHistoryModal(true)} cursor="pointer" px="25px" py="10px" rounded="8px" border="1px solid #EA5937" color="blue.blue500" bg="orange.orange500">Pre/Postnatal History </Box>
                                </Tooltip>
                                <Tooltip label='Developmental'>
                                    <Box onClick={() => setOpenDevelopmentalHistoryModal(true)} cursor="pointer" px="25px" py="10px" rounded="8px" border="1px solid #EA5937" color="blue.blue500" bg="orange.orange500">Developmental/Milestone History </Box>
                                </Tooltip>
                                <Tooltip label='Immunization'>
                                    <Box onClick={() => setOpenImmunizationHistoryModal(true)} cursor="pointer" px="25px" py="10px" rounded="8px" border="1px solid #EA5937" color="blue.blue500" bg="orange.orange500">Immunization History </Box>
                                </Tooltip>

                            </Flex>

                            <MedicalHistoryModal isOpen={OpenMedicalHistoryModal} onClose={() => setOpenMedicalHistoryModal(false)} setOldPayload={setPayload} oldPayload={Payload} type={ModalState} activateNotifications={activateNotifications} />
                            <PostnatalHistoryModal isOpen={OpenPostnatalHistoryModal} onClose={() => setOpenPostnatalHistoryModal(false)} setOldPayload={setPayload} oldPayload={Payload} type={ModalState} activateNotifications={activateNotifications} />
                            <DevelopmentalHistoryModal isOpen={OpenDevelopmentalHistoryModal} onClose={() => setOpenDevelopmentalHistoryModal(false)} setOldPayload={setPayload} oldPayload={Payload} type={ModalState} activateNotifications={activateNotifications} />
                            <ImmunizationHistoryModal isOpen={OpenImmunizationHistoryModal} onClose={() => setOpenImmunizationHistoryModal(false)} setOldPayload={setPayload} oldPayload={Payload} type={ModalState} activateNotifications={activateNotifications} />

                        </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem mb="15px">

                        <AccordionButton _hover={{ border: "1px solid #EA5937", color: "#000" }} _focus={{ outline: "none" }} border="1px solid #fff" _expanded={{ rounded: "8px 8px 0px 0px", border: 0 }} bg="#fff" color="#000" rounded="8px">
                            <Box as='span' flex='1' textAlign='left'>
                                Vital
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>

                        <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
                            <SimpleGrid mt="32px" columns={{ base: 1, md: 2 }} spacing={5}>
                                <Input type="number" leftIcon={<FaTemperatureHigh />} label="Temperature (C)" value={Payload.temperature} onChange={handlePayload} id="temperature" />
                                <Input type="number" leftIcon={<FaHeartbeat />} label="Heart Rate (bpm)" value={Payload.heart} onChange={handlePayload} id="heart" />
                                <Input type="number" leftIcon={<MdBloodtype />} label="Blood Pressure (systolic)(mmHg)" value={Payload.bloodpressuresystolic} onChange={handlePayload} id="bloodpressuresystolic" />
                                <Input type="number" leftIcon={<MdBloodtype />} label="Blood Pressure (Diastolic)(mmHg)" value={Payload.bloodpressurediastolic} onChange={handlePayload} id="bloodpressurediastolic" />
                                <Input type="number" leftIcon={<GiEnergyBreath />} label="Respiration (bpm)" value={Payload.respiration} onChange={handlePayload} id="respiration" />
                                <Input type="number" leftIcon={<FaHeartCircleCheck />} label="O2 Saturation (%)" value={Payload.saturation} onChange={handlePayload} id="saturation" />
                                <Input type="number" leftIcon={<FaTextHeight />} label="Height (cm)" value={Payload.height} onChange={handlePayload} id="height" />
                                <Input type="number" leftIcon={<GiWeight />} label="Weight (kg)" value={Payload.weight} onChange={handlePayload} id="weight" />


                            </SimpleGrid>
                            <Text color="red" mt="20px">Note: Please add at least one vital information </Text>
                        </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem mb="15px">

                        <AccordionButton _hover={{ border: "1px solid #EA5937", color: "#000" }} _focus={{ outline: "none" }} border="1px solid #fff" _expanded={{ rounded: "8px 8px 0px 0px", border: 0 }} bg="#fff" color="#000" rounded="8px">
                            <Box as='span' flex='1' textAlign='left'>
                                General Physical Examinations
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>

                        <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
                            <SimpleGrid mt="12px" mb={5} columns={{ base: 1, md: 2 }} spacing={5}>

                                <Select fontSize={Payload.hair !== "" ? "16px" : "13px"} h="45px" borderWidth="2px" borderColor="#6B7280" id="hair"
                                    value={Payload.hair} onChange={handlePayload} placeholder="Select Hair Examination" >
                                    {
                                        Settings?.generalphysicalexaminations?.main?.filter(item => item.type === "hair")[0]?.options?.map((item, i) => (

                                            <option value={`${item}`}>{item}</option>
                                        ))
                                    }

                                </Select>
                                <Input leftIcon={<FaNoteSticky />} label="Hair Note" value={Payload.hairnote} onChange={handlePayload} id="hairnote" />

                                <Select fontSize={Payload.face !== "" ? "16px" : "13px"} h="45px" borderWidth="2px" borderColor="#6B7280" id="face"
                                    value={Payload.face} onChange={handlePayload} placeholder="Select Face Examination" >
                                    {
                                        Settings?.generalphysicalexaminations?.main?.filter(item => item.type === "face")[0]?.options?.map((item, i) => (

                                            <option value={`${item}`}>{item}</option>
                                        ))
                                    }

                                </Select>
                                <Input leftIcon={<FaNoteSticky />} label="Face Note" value={Payload.facenote} onChange={handlePayload} id="facenote" />

                                <Select fontSize={Payload.jaundice !== "" ? "16px" : "13px"} h="45px" borderWidth="2px" borderColor="#6B7280" id="jaundice"
                                    value={Payload.jaundice} onChange={handlePayload} placeholder="Select Jaundice Examination" >
                                    {
                                        Settings?.generalphysicalexaminations?.main?.filter(item => item.type === "jaundice")[0]?.options?.map((item, i) => (

                                            <option value={`${item}`}>{item}</option>
                                        ))
                                    }

                                </Select>
                                <Input leftIcon={<FaNoteSticky />} label="Jaundice Note" value={Payload.jaundicenote} onChange={handlePayload} id="jaundicenote" />

                                <Select fontSize={Payload.cyanosis !== "" ? "16px" : "13px"} h="45px" borderWidth="2px" borderColor="#6B7280" id="cyanosis"
                                    value={Payload.cyanosis} onChange={handlePayload} placeholder="Select Cyanosis Examination" >
                                    {
                                        Settings?.generalphysicalexaminations?.main?.filter(item => item.type === "cyanosis")[0]?.options?.map((item, i) => (

                                            <option value={`${item}`}>{item}</option>
                                        ))
                                    }

                                </Select>
                                <Input leftIcon={<FaNoteSticky />} label="Cyanosis Note" value={Payload.cyanosisnote} onChange={handlePayload} id="cyanosisnote" />

                                <Select fontSize={Payload.pallor !== "" ? "16px" : "13px"} h="45px" borderWidth="2px" borderColor="#6B7280" id="pallor"
                                    value={Payload.pallor} onChange={handlePayload} placeholder="Select Pallor Examination" >
                                    {
                                        Settings?.generalphysicalexaminations?.main?.filter(item => item.type === "pallor")[0]?.options?.map((item, i) => (

                                            <option value={`${item}`}>{item}</option>
                                        ))
                                    }

                                </Select>
                                <Input leftIcon={<FaNoteSticky />} label="Pallor Note" value={Payload.pallornote} onChange={handlePayload} id="pallornote" />

                                <Select fontSize={Payload.oral !== "" ? "16px" : "13px"} h="45px" borderWidth="2px" borderColor="#6B7280" id="oral"
                                    value={Payload.oral} onChange={handlePayload} placeholder="Select Oral Examination" >
                                    {
                                        Settings?.generalphysicalexaminations?.main?.filter(item => item.type === "oral")[0]?.options?.map((item, i) => (

                                            <option value={`${item}`}>{item}</option>
                                        ))
                                    }

                                </Select>
                                <Input leftIcon={<FaNoteSticky />} label="Oral Note" value={Payload.oralnote} onChange={handlePayload} id="oralnote" />

                                <Select fontSize={Payload.lymphnodes !== "" ? "16px" : "13px"} h="45px" borderWidth="2px" borderColor="#6B7280" id="lymphnodes"
                                    value={Payload.lymphnodes} onChange={handlePayload} placeholder="Select Lymphnodes Examination" >
                                    {
                                        Settings?.generalphysicalexaminations?.main?.filter(item => item.type === "lymphnodes")[0]?.options?.map((item, i) => (

                                            <option value={`${item}`}>{item}</option>
                                        ))
                                    }

                                </Select>
                                <Input leftIcon={<FaNoteSticky />} label="Lymphnodes Note" value={Payload.lymphnodesnote} onChange={handlePayload} id="lymphnodesnote" />

                                <Select fontSize={Payload.ederma !== "" ? "16px" : "13px"} h="45px" borderWidth="2px" borderColor="#6B7280" id="ederma"
                                    value={Payload.ederma} onChange={handlePayload} placeholder="Select Ederma Examination" >
                                    {
                                        Settings?.generalphysicalexaminations?.main?.filter(item => item.type === "ederma")[0]?.options?.map((item, i) => (

                                            <option value={`${item}`}>{item}</option>
                                        ))
                                    }

                                </Select>
                                <Input leftIcon={<FaNoteSticky />} label="Ederma Note" value={Payload.edermanote} onChange={handlePayload} id="edermanote" />
                                <Input leftIcon={<FaNoteSticky />} type="date" label="Last Menstration Period Date" value={Payload.lastmenstrationperiod} onChange={handlePayload} id="lastmenstrationperiod" />
                                <Input leftIcon={<FaNoteSticky />} label="Last Menstration Period Note" value={Payload.lastmenstrationperiodnote} onChange={handlePayload} id="lastmenstrationperiodnote" />

                            </SimpleGrid>
                            <Input leftIcon={<FaNoteSticky />} label="General Physical Examination(others)" value={Payload.generalphysicalexamination} onChange={handlePayload} id="generalphysicalexamination" />

                            <Button mt="15px" w="150px" onClick={() => onOpen()} >Pediatrics Specifics</Button>

                            <GeneralExaminationModal isOpen={isOpen} onClose={onClose} setOldPayload={setPayload} oldPayload={Payload} type={ModalState} activateNotifications={activateNotifications} />
                        </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem mb="15px">

                        <AccordionButton _hover={{ border: "1px solid #EA5937", color: "#000" }} _focus={{ outline: "none" }} border="1px solid #fff" _expanded={{ rounded: "8px 8px 0px 0px", border: 0 }} bg="#fff" color="#000" rounded="8px">
                            <Box as='span' flex='1' textAlign='left'>
                                Physical Examination (Systems)
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>

                        <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
                            <Flex justifyContent="space-between" flexWrap="wrap" mt={["10px", "10px", "10px", "10px"]} mb="12px" w={["100%", "100%", "80%", "60%"]} >
                                <Tooltip label='Cardiovascular'>
                                    <Box onClick={() => setOpenCvsModal(true)} cursor="pointer" px="25px" py="10px" rounded="8px" border="1px solid #EA5937" color="blue.blue500" bg="orange.orange500">CVS </Box>
                                </Tooltip>
                                <Tooltip label='Respiratory Assessment'>
                                    <Box onClick={() => setOpenRespModal(true)} cursor="pointer" px="25px" py="10px" rounded="8px" border="1px solid #EA5937" color="blue.blue500" bg="orange.orange500">Resp </Box>
                                </Tooltip>
                                <Tooltip label='Gastro-intestinal Assessment'>
                                    <Box onClick={() => setOpenGiModal(true)} cursor="pointer" px="25px" py="10px" rounded="8px" border="1px solid #EA5937" color="blue.blue500" bg="orange.orange500">GI </Box>
                                </Tooltip>
                                <Tooltip label='Genitourinary'>
                                    <Box onClick={() => setOpenGuModal(true)} cursor="pointer" px="25px" py="10px" rounded="8px" border="1px solid #EA5937" color="blue.blue500" bg="orange.orange500">GU </Box>
                                </Tooltip>
                                <Tooltip label='Neurology'>
                                    <Box onClick={() => setOpenNeuroModal(true)} cursor="pointer" px="25px" py="10px" rounded="8px" border="1px solid #EA5937" color="blue.blue500" bg="orange.orange500">Neuro </Box>
                                </Tooltip>
                                <Tooltip label='Musculoskeletal'>
                                    <Box onClick={() => setOpenMskModal(true)} cursor="pointer" px="25px" py="10px" rounded="8px" border="1px solid #EA5937" color="blue.blue500" bg="orange.orange500">MSK </Box>
                                </Tooltip>
                            </Flex>

                            <Input leftIcon={<FaNoteSticky />} label="Physical Examination Note" value={Payload.physicalexaminationnote} onChange={handlePayload} id="physicalexaminationnote" />

                            <CvsExaminationModal isOpen={OpenCvsModal} onClose={() => setOpenCvsModal(false)} setOldPayload={setPayload} oldPayload={Payload} type={ModalState} activateNotifications={activateNotifications} />
                            <RespExaminationModal isOpen={OpenRespModal} onClose={() => setOpenRespModal(false)} setOldPayload={setPayload} oldPayload={Payload} type={ModalState} activateNotifications={activateNotifications} />
                            <GiExaminationModal isOpen={OpenGiModal} onClose={() => setOpenGiModal(false)} setOldPayload={setPayload} oldPayload={Payload} type={ModalState} activateNotifications={activateNotifications} />
                            <GuExaminationModal isOpen={OpenGuModal} onClose={() => setOpenGuModal(false)} setOldPayload={setPayload} oldPayload={Payload} type={ModalState} activateNotifications={activateNotifications} />
                            <NeuroExaminationModal isOpen={OpenNeuroModal} onClose={() => setOpenNeuroModal(false)} setOldPayload={setPayload} oldPayload={Payload} type={ModalState} activateNotifications={activateNotifications} />
                            <MskExaminationModal isOpen={OpenMskModal} onClose={() => setOpenMskModal(false)} setOldPayload={setPayload} oldPayload={Payload} type={ModalState} activateNotifications={activateNotifications} />

                        </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem mb="15px">

                        <AccordionButton _hover={{ border: "1px solid #EA5937", color: "#000" }} _focus={{ outline: "none" }} border="1px solid #fff" _expanded={{ rounded: "8px 8px 0px 0px", border: 0 }} bg="#fff" color="#000" rounded="8px">
                            <Box as='span' flex='1' textAlign='left'>
                                Assessment & Diagnosis
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>

                        <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
                            <SimpleGrid mt="12px" mb={5} columns={{ base: 1, md: 2 }} spacing={5}>
                                <Select fontSize={Payload.assessment !== "" ? "16px" : "13px"} h="45px" borderWidth="2px" borderColor="#6B7280" id="assessment"
                                    value={Payload.assessment} onChange={handlePayload} placeholder="Select Assessment" >
                                    {
                                        Settings?.assessment?.map((item, i) => (

                                            <option value={`${item}`}>{item}</option>
                                        ))
                                    }

                                </Select>
                                <Input leftIcon={<FaNoteSticky />} label="Assessment Note" value={Payload.assessmentnote} onChange={handlePayload} id="assessmentnote" />
                                <Select fontSize={Payload.diagosis !== "" ? "16px" : "13px"} h="45px" borderWidth="2px" borderColor="#6B7280" id="diagosis"
                                    value={Payload.diagosis} onChange={handlePayload} placeholder="Select Diagnosis" >
                                    {
                                        Settings?.diagonosis?.map((item, i) => (

                                            <option value={`${item}`}>{item}</option>
                                        ))
                                    }

                                </Select>
                                <Input leftIcon={<FaNoteSticky />} label="Diagnosis Note" value={Payload.diagosisnote} onChange={handlePayload} id="diagosisnote" />

                                <Select fontSize={Payload.icpc2 !== "" ? "16px" : "13px"} h="45px" borderWidth="2px" borderColor="#6B7280" id="icpc2"
                                    value={Payload.icpc2} onChange={handlePayload} placeholder="Select ICPC2" >
                                    {
                                        Settings?.icpc2?.map((item, i) => (

                                            <option value={`${item}`}>{item}</option>
                                        ))
                                    }

                                </Select>
                                <Input leftIcon={<FaNoteSticky />} label="ICPC2 Note" value={Payload.icpc2note} onChange={handlePayload} id="icpc2note" />
                            </SimpleGrid>
                        </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem mb="15px">

                        <AccordionButton _hover={{ border: "1px solid #EA5937", color: "#000" }} _focus={{ outline: "none" }} border="1px solid #fff" _expanded={{ rounded: "8px 8px 0px 0px", border: 0 }} bg="#fff" color="#000" rounded="8px">
                            <Box as='span' flex='1' textAlign='left'>
                                Note
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>

                        <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
                            <SimpleGrid mt="32px" mb={2} columns={{ base: 1, md: 1 }} spacing={2}>

                                <TextArea leftIcon={<FaNoteSticky />} label="Additional Note" value={Payload.additionalnote} onChange={handlePayload} id="additionalnote" />


                            </SimpleGrid>

                        </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem mb="15px">

                        <AccordionButton _hover={{ border: "1px solid #EA5937", color: "#000" }} _focus={{ outline: "none" }} border="1px solid #fff" _expanded={{ rounded: "8px 8px 0px 0px", border: 0 }} bg="#fff" color="#000" rounded="8px">
                            <Box as='span' flex='1' textAlign='left'>
                                Plan
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>

                        <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
                            <SimpleGrid mt="12px" mb={2} columns={{ base: 1, md: 2 }} spacing={2}>
                                <Select fontSize={Payload.outcome !== "" ? "16px" : "13px"} h="45px" borderWidth="2px" borderColor="#6B7280" id="outcome"
                                    value={Payload.outcome} onChange={handlePayload} placeholder="Select outcome" >
                                    <option value={`Treated`}>Treated</option>
                                    <option value={`Admitted`}>Admitted</option>
                                    <option value={`Referred`}>Referred</option>
                                    <option value={`Deceased`}>Deceased</option>
                                    <option value={`Other`}>Other</option>

                                </Select>
                                <Input leftIcon={<FaNoteSticky />} label="Plan Note" value={Payload.plannote} onChange={handlePayload} id="plannote" />


                            </SimpleGrid>
                            <Flex justifyContent="space-between" flexWrap="wrap" mt="15px" w={["100%", "100%", "100%", "100%"]} >
                                <Tooltip label='Lab Order'>
                                    <Box onClick={() => setOpenLabModal(true)} cursor="pointer" px="25px" py="10px" rounded="8px" border="1px solid #EA5937" color="blue.blue500" bg="orange.orange500">Lab </Box>

                                </Tooltip>
                                <Tooltip label='Radiology Order'>
                                    <Box onClick={() => setOpenRadiologyModal(true)} cursor="pointer" px="25px" py="10px" rounded="8px" border="1px solid #EA5937" color="blue.blue500" bg="orange.orange500">Radiology </Box>
                                </Tooltip>
                                <Tooltip label='Prescribe Drug'>
                                    <Box cursor="pointer" onClick={() => setOpenPrescriptionModal(true)} px="25px" py="10px" rounded="8px" border="1px solid #EA5937" color="blue.blue500" bg="orange.orange500">Prescription </Box>
                                </Tooltip>
                                <Tooltip label='Admit Patient'>
                                    <Box onClick={() => setOpenAdmissionModal(true)} cursor="pointer" px="25px" py="10px" rounded="8px" border="1px solid #EA5937" color="blue.blue500" bg="orange.orange500">Admission </Box>
                                </Tooltip>
                                <Tooltip label='Procedure'>
                                    <Box onClick={() => setOpenProcedureModal(true)} cursor="pointer" px="25px" py="10px" rounded="8px" border="1px solid #EA5937" color="blue.blue500" bg="orange.orange500">Procedure </Box>
                                </Tooltip>
                                <Tooltip label='Refer Patient To Another Doctor'>
                                    <Box onClick={() => setOpenReferralModal(true)} cursor="pointer" px="25px" py="10px" rounded="8px" border="1px solid #EA5937" color="blue.blue500" bg="orange.orange500">Referral </Box>
                                </Tooltip>
                            </Flex>
                        </AccordionPanel>
                        <AdmissionModal isOpen={OpenAdmissionModal} oldPayload={{ _id: id, appointmentid: id }} onClose={() => setOpenAdmissionModal(false)} type={ModalState} activateNotifications={activateNotifications} />

                        <RadiologyOrderRequestModal
                            isOpen={OpenRadiologyModal}
                            onClose={() => setOpenRadiologyModal(false)}
                            admissionId={null}
                            type={"create"}
                            initialData={null}
                            onSuccess={handleSuccess}
                        />

                        <CreateProcedureModal
                            isOpen={OpenProcedureModal}
                            onClose={() => setOpenProcedureModal(false)}
                            type={"new"}
                            activateNotifications={activateNotifications}
                           
                        />

         <CreateReferralModal isOpen={OpenReferralModal} onClose={()=>setOpenReferralModal(false)} type={"new"} activateNotifications={activateNotifications} oldPayload={{ id: id }} />

                    </AccordionItem>


                </Accordion>

                <Flex justifyContent="center">

                    <Flex
                        justifyContent="space-between"
                        flexWrap="wrap"
                        mt={["10px", "10px", "10px", "10px"]}
                        w={["100%", "100%", "60%", "60%"]}
                    >
                        <Button
                            mt={["10px", "10px", "0px", "0px"]}

                            background="#f8ddd1 "
                            border="1px solid #EA5937"
                            color="blue.blue500"
                            w={["100%", "100%", "144px", "144px"]}
                            onClick={() => setOpenPreview(true)}
                        >
                            Preview
                        </Button>
                        <Button
                            w={["100%", "100%", "184px", "184px"]}
                            onClick={handleInprogress}
                            isLoading={Loading}
                            disabled={Disabled}

                        >
                            Save as In-Progress
                        </Button>
                        <Button
                            disabled={Disabled}
                            onClick={handleCompleted}
                            isLoading={LoadingCompleted}
                            w={["100%", "100%", "184px", "184px"]}

                        >
                            Save as Completed
                        </Button>

                    </Flex>
                </Flex>
                <LabRequestModal isOpen={OpenLabModal} oldPayload={{ _id: id, appointmentid: id }} onClose={() => setOpenLabModal(false)} type={ModalState} activateNotifications={activateNotifications} />
                <PreviewEncounter isOpen={OpenPreview} onClose={() => setOpenPreview(false)} setOldPayload={setPayload} oldPayload={Payload} />
                <CreatePrescriptionModal
                    isOpen={OpenPrescriptionModal}
                    onClose={() => setOpenPrescriptionModal(false)}
                    onSuccess={activateNotifications}
                />

            </Box>
        </MainLayout>
    )
}
