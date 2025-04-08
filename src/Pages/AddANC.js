import { HStack, Text, Box, Flex, Select, Stack, useDisclosure, SimpleGrid, Tooltip } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import MainLayout from "../Layouts/Index";
import Seo from "../Utils/Seo";
import Button from "../Components/Button";
import Input from "../Components/Input";
import TextArea from "../Components/TextArea";
import LabRequestModal from "../Components/LabRequestModal";
import ShowToast from "../Components/ToastNotification";
import AncCards from "./AncCards";
import GeneralExaminationModal from "../Components/GeneralExaminationModal";
import IronGivenModal from "../Components/IronGivenModal";
import IptGivenModal from "../Components/IptGivenModal";
import TetanusGivenModal from "../Components/TetanusGivenModal";
import HealthEducationModal from "../Components/HealthEducationModal";
import HistoryNeuroModal from "../Components/HistoryNeuroModal";
import HistoryMskModal from "../Components/HistoryMskModal";
import ObstetricHistoryModal from "../Components/ObstetricHistoryModal";
import MedicalObstetricHistoryModal from "../Components/MedicalObstetricHistoryModal";
import CurrentHistoryModal from "../Components/CurrentHistoryModal";
import GeneralMedicalHistoryModal from "../Components/GeneralMedicalHistoryModal";
import GeneralPhysicalModal from "../Components/GeneralPhysicalModal";
import LaboratoryANCModal from "../Components/LaboratoryANCModal";
import GiExaminationModal from "../Components/GiExaminationModal";
import GuExaminationModal from "../Components/GuExaminationModal";
import NeuroExaminationModal from "../Components/NeuroExaminationModal";
import AdmissionModal from "../Components/AdmissionModal";
import RadiologyOrderRequestModal from "../Components/RadiologyOrderRequestModal";
import CreateProcedureModal from "../Components/CreateProcedureModal";
import CreateReferralModal from "../Components/CreateReferralModal";
import MskExaminationModal from "../Components/MskExaminationModal";
import PreviewANC from "../Components/PreviewANC";
import CreatePrescriptionModal from "../Components/CreatePrescriptionModal";
import { useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io"; 
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon, RadioGroup, Radio
} from '@chakra-ui/react'
import { SettingsApi, CreateAncAPI } from "../Utils/ApiCalls";
import { FaNoteSticky } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io";
import { FaTemperatureHigh, FaHeartCircleCheck } from "react-icons/fa6";
import { FaTextHeight, FaHeartbeat } from "react-icons/fa";
import { MdBloodtype } from "react-icons/md";
import { GiEnergyBreath } from "react-icons/gi";
import { GiWeight } from "react-icons/gi";
import { TbMichelinStarFilled } from "react-icons/tb";
import { MdDateRange } from "react-icons/md";
import { useParams } from 'react-router-dom';

export default function AddANC() {
    const { id } = useParams()
    const [Settings, setSettings] = useState({});
    const [OpenLabModal, setOpenLabModal] = useState(false);
    const [OpenPrescriptionModal, setOpenPrescriptionModal] = useState(false);
    const [OpenRadiologyModal, setOpenRadiologyModal] = useState(false);
    const [OpenProcedureModal, setOpenProcedureModal] = useState(false);
    const [OpenReferralModal, setOpenReferralModal] = useState(false);
    const [OpenIronGivenModal, setOpenIronGivenModal] = useState(false);
    const [OpenIptGivenModal, setOpenIptGivenModal] = useState(false);
    const [OpenTetanusGivenModal, setOpenTetanusGivenModal] = useState(false);
    const [OpenHealthEducationModal, setOpenHealthEducationModal] = useState(false);
    const [OpenLaboratoryANCModal, setOpenLaboratoryANCModal] = useState(false);
    const [OpenGeneralPhysicalModal, setOpenGeneralPhysicalModal] = useState(false);
    const [OpenObstetricHistoryModal, setOpenObstetricHistoryModal] = useState(false);
    const [OpenMedicalObstetricHistoryModal, setOpenMedicalObstetricHistoryModal] = useState(false);
    const [OpenCurrentHistoryModal, setOpenCurrentHistoryModal] = useState(false);
    const [OpenGeneralMedicalHistoryModal, setOpenGeneralMedicalHistoryModal] = useState(false);
    const [OpenPreview, setOpenPreview] = useState(false);
    const [Complaints, setComplaints] = useState([]);
    const [ModalState, setModalState] = useState("");
    const [Disabled, setDisabled] = useState(true);
    const [LoadingCompleted, setLoadingCompleted] = useState(false);
    const [Payload, setPayload] = useState({
        currentmedication: "",
        allergies: "",
        lmp: "",
        cycle: "",
        edd: "",
        gravida: "",
        term: "",
        preterm: "",
        abortions: "",
        ectopic: "",
        stillbirths: "",
        noliving: ""


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





    const getSettings = async () => {
        try {
            const result = await SettingsApi();
            let checker = result?.servicecategory?.filter(item => item.category === "Appointment")
            setSettings(result);
        } catch (e) {

        }
    };



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

    
    const handleCompleted = async () => {
        setLoadingCompleted(true)
        try {
            const result = await CreateAncAPI(Payload, id);


            if (result.status === 200) {
                setLoadingCompleted(false)
                activateNotifications("ANC Created Successfully. Redirecting...", "success")
             
                setTimeout(() => {
                    nav(`${pathName}`)
        
                }, 3000)
                

            }

        } catch (e) {
            setLoadingCompleted(false)
            activateNotifications(e.message, "error")
        }
    }


    useEffect(() => {



        if (Object.values(Payload).some(value => value !== null && value !== "")) {
            setDisabled(false)
        } else {
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
            <Seo title="Create ANC" description="Care connect  ANC Creation " />

            <Box>
                <Button leftIcon={<IoMdArrowRoundBack />} px="40px" w="100px" onClick={() => nav(`${pathname}`)}>Back</Button>

                <Accordion defaultIndex={[2]} mt="32px" allowToggle>
                    <AccordionItem mb="15px" >

                        <AccordionButton _hover={{ border: "1px solid #EA5937", color: "#000" }} _focus={{ outline: "none" }} border="1px solid #fff" _expanded={{ rounded: "8px 8px 0px 0px", border: 0 }} bg="#fff" color="#000" rounded="8px">
                            <Box as='span' flex='1' textAlign='left'>
                                Previous ANC
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>

                        <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px" >
                            <AncCards hide={true} />
                        </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem mb="15px">

                        <AccordionButton _hover={{ border: "1px solid #EA5937", color: "#000" }} _focus={{ outline: "none" }} border="1px solid #fff" _expanded={{ rounded: "8px 8px 0px 0px", border: 0 }} bg="#fff" color="#000" rounded="8px">
                            <Box as='span' flex='1' textAlign='left'>
                                Pregnancy Summary
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>

                        <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
                            <Stack spacing={4}>

                                <SimpleGrid mt="12px" columns={{ base: 1, md: 2 }} spacing={2}>
                                    <Input leftIcon={<FaNoteSticky />}  label="Current medication" value={Payload.currentmedication} onChange={handlePayload} id="currentmedication" />
                                    <Input leftIcon={<FaNoteSticky />}  label="Allergies" value={Payload.allergies} onChange={handlePayload} id="allergies" />

                                </SimpleGrid> 
                                <SimpleGrid mt="12px" columns={{ base: 1, md: 2 }} spacing={2}>
                                    <Input leftIcon={<MdDateRange />} type="date" label="LMP" value={Payload.lmp} onChange={handlePayload} id="lmp" />
                                    <Input leftIcon={<MdDateRange />} type="date" label="EDD" value={Payload.edd} onChange={handlePayload} id="edd" />

                                </SimpleGrid>

                                <Input leftIcon={<FaNoteSticky />} label="Cycle" value={Payload.cycle} onChange={handlePayload} id="cycle" />
                                <Input leftIcon={<FaNoteSticky />} label="Gravida" value={Payload.gravida} onChange={handlePayload} id="gravida" />
                                <Input leftIcon={<FaNoteSticky />} label="Term" value={Payload.term} onChange={handlePayload} id="term" />
                                <Input leftIcon={<FaNoteSticky />} label="Preterm" value={Payload.preterm} onChange={handlePayload} id="preterm" />
                                <Input leftIcon={<FaNoteSticky />} label="Abortions (Spont or Induced)" value={Payload.abortions} onChange={handlePayload} id="abortions" />
                                <Input leftIcon={<FaNoteSticky />} label="Ectopic" value={Payload.ectopic} onChange={handlePayload} id="ectopic" />
                                <Input leftIcon={<FaNoteSticky />} label="Stillbirths" value={Payload.stillbirths} onChange={handlePayload} id="stillbirths" />
                                <Input leftIcon={<FaNoteSticky />} label="No lLiving" value={Payload.noliving} onChange={handlePayload} id="noliving" />



                                {/* <Stack spacing={5}>
                                    <RadioGroup onChange={(value) => handleRadioChange(value, 'pregnacylosses')} >
                                        <Text fontSize="15px" fontWeight={"700"}>Pregnancy losses</Text>
                                        <Stack direction='row'>
                                            <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Abortions'>Abortions (Spont or Induced)</Radio>
                                            <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Ectopic'>Ectopic</Radio>
                                            <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='Still Birth'>Still Birth</Radio>
                                            <Radio size='md' borderColor="#6B7280" colorScheme='orange' value='No Living'>No Living</Radio>

                                        </Stack>
                                    </RadioGroup>

                                </Stack> */}




                            </Stack>


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
                            <Flex justifyContent="space-between" flexWrap="wrap" mt={["10px", "10px", "10px", "10px"]} w={["100%", "100%", "100%", "100%"]} >
                                <Tooltip label='Obstetric'>
                                    <Box onClick={() => setOpenObstetricHistoryModal(true)} cursor="pointer" px="25px" py="10px" rounded="8px" border="1px solid #EA5937" color="blue.blue500" bg="orange.orange500">Obstetric History </Box>
                                </Tooltip>
                                <Tooltip label='Medical Obstetric'>
                                    <Box onClick={() => setOpenMedicalObstetricHistoryModal(true)} cursor="pointer" px="25px" py="10px" rounded="8px" border="1px solid #EA5937" color="blue.blue500" bg="orange.orange500">Medical Obstetric History</Box>
                                </Tooltip>
                                <Tooltip label='Current'>
                                    <Box onClick={() => setOpenCurrentHistoryModal(true)} cursor="pointer" px="25px" py="10px" rounded="8px" border="1px solid #EA5937" color="blue.blue500" bg="orange.orange500">Current History </Box>
                                </Tooltip>
                                <Tooltip label='General Medical'>
                                    <Box onClick={() => setOpenGeneralMedicalHistoryModal(true)} cursor="pointer" px="25px" py="10px" rounded="8px" border="1px solid #EA5937" color="blue.blue500" bg="orange.orange500">General Medical History </Box>
                                </Tooltip>


                            </Flex>

                            <ObstetricHistoryModal isOpen={OpenObstetricHistoryModal} onClose={() => setOpenObstetricHistoryModal(false)} setOldPayload={setPayload} oldPayload={Payload} type={ModalState} activateNotifications={activateNotifications} />
                            <MedicalObstetricHistoryModal isOpen={OpenMedicalObstetricHistoryModal} onClose={() => setOpenMedicalObstetricHistoryModal(false)} setOldPayload={setPayload} oldPayload={Payload} type={ModalState} activateNotifications={activateNotifications} />
                            <CurrentHistoryModal isOpen={OpenCurrentHistoryModal} onClose={() => setOpenCurrentHistoryModal(false)} setOldPayload={setPayload} oldPayload={Payload} type={ModalState} activateNotifications={activateNotifications} />
                            <GeneralMedicalHistoryModal isOpen={OpenGeneralMedicalHistoryModal} onClose={() => setOpenGeneralMedicalHistoryModal(false)} setOldPayload={setPayload} oldPayload={Payload} type={ModalState} activateNotifications={activateNotifications} />

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
                            <Flex justifyContent="space-between" flexWrap="wrap" mt={["10px", "10px", "10px", "10px"]} w={["100%", "100%", "100%", "100%"]} >
                                <Tooltip label='Physical Examination'>
                                    <Box onClick={() => setOpenGeneralPhysicalModal(true)} cursor="pointer" px="25px" py="10px" rounded="8px" border="1px solid #EA5937" color="blue.blue500" bg="orange.orange500">Physical Examination </Box>
                                </Tooltip>
                                <Tooltip label='Laboratory'>
                                    <Box onClick={() => setOpenLaboratoryANCModal(true)} cursor="pointer" px="25px" py="10px" rounded="8px" border="1px solid #EA5937" color="blue.blue500" bg="orange.orange500">Laboratory</Box>
                                </Tooltip>
                                <Tooltip label='Health Education Topics Covered'>
                                    <Box onClick={() => setOpenHealthEducationModal(true)} cursor="pointer" px="25px" py="10px" rounded="8px" border="1px solid #EA5937" color="blue.blue500" bg="orange.orange500">Health Education  </Box>
                                </Tooltip>
                                <Tooltip label='Tetanus Given'>
                                    <Box onClick={() => setOpenTetanusGivenModal(true)} cursor="pointer" px="25px" py="10px" rounded="8px" border="1px solid #EA5937" color="blue.blue500" bg="orange.orange500">Tetanus</Box>
                                </Tooltip>
                                <Tooltip label='Ipt Given'>
                                    <Box onClick={() => setOpenIptGivenModal(true)} cursor="pointer" px="25px" py="10px" rounded="8px" border="1px solid #EA5937" color="blue.blue500" bg="orange.orange500">Ipt</Box>
                                </Tooltip>
                                <Tooltip label='Iron Folate  Given'>
                                    <Box onClick={() => setOpenIronGivenModal(true)} cursor="pointer" px="25px" py="10px" rounded="8px" border="1px solid #EA5937" color="blue.blue500" bg="orange.orange500">Iron Folate</Box>
                                </Tooltip>


                            </Flex>

                            <GeneralPhysicalModal isOpen={OpenGeneralPhysicalModal} onClose={() => setOpenGeneralPhysicalModal(false)} setOldPayload={setPayload} oldPayload={Payload} type={ModalState} activateNotifications={activateNotifications} />
                            <LaboratoryANCModal isOpen={OpenLaboratoryANCModal} onClose={() => setOpenLaboratoryANCModal(false)} setOldPayload={setPayload} oldPayload={Payload} type={ModalState} activateNotifications={activateNotifications} />
                            <HealthEducationModal isOpen={OpenHealthEducationModal} onClose={() => setOpenHealthEducationModal(false)} setOldPayload={setPayload} oldPayload={Payload} type={ModalState} activateNotifications={activateNotifications} />
                            <TetanusGivenModal isOpen={OpenTetanusGivenModal} onClose={() => setOpenTetanusGivenModal(false)} setOldPayload={setPayload} oldPayload={Payload} type={ModalState} activateNotifications={activateNotifications} />
                            <IptGivenModal isOpen={OpenIptGivenModal} onClose={() => setOpenIptGivenModal(false)} setOldPayload={setPayload} oldPayload={Payload} type={ModalState} activateNotifications={activateNotifications} />
                            <IronGivenModal isOpen={OpenIronGivenModal} onClose={() => setOpenIronGivenModal(false)} setOldPayload={setPayload} oldPayload={Payload} type={ModalState} activateNotifications={activateNotifications} />


                        </AccordionPanel>

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
                            disabled={Disabled}
                            onClick={handleCompleted}
                            isLoading={LoadingCompleted}
                            w={["100%", "100%", "184px", "184px"]}

                        >
                            Submit
                        </Button>

                    </Flex>
                </Flex>
                <PreviewANC isOpen={OpenPreview} onClose={() => setOpenPreview(false)} setOldPayload={setPayload} oldPayload={Payload} />

            </Box>
        </MainLayout>
    )
}
