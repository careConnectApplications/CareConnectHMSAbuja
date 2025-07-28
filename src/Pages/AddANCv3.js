import { HStack, Text, Box, Flex, Select, Stack, useDisclosure, SimpleGrid, Tooltip } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import MainLayout from "../Layouts/Index";
import Seo from "../Utils/Seo";
import Button from "../Components/Button";
import Input from "../Components/Input";
import TextArea from "../Components/TextArea";
import ShowToast from "../Components/ToastNotification";
import ANC3 from "./ANC3";
import PreviousPregnancyModal from "../Components/PreviousPregnancyModal";
import GeneralMedicalHistoryModalv2 from "../Components/GeneralMedicalHistoryModalv2";
import PreviewANC from "../Components/PreviewANC";
import { useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";
import { RadioGroup, Radio } from '@chakra-ui/react'
import { SettingsApi, CreateAncV3API } from "../Utils/ApiCalls";
import { FaNoteSticky } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io";
import { MdDateRange } from "react-icons/md";
import { useParams } from 'react-router-dom';
import PatientInfoCard from '../Components/PatientInfoCard';


export default function AddANCv3() {
    const { id } = useParams()
    const [Settings, setSettings] = useState({});
    const [OpenObstetricHistoryModal, setOpenObstetricHistoryModal] = useState(false);
    const [OpenGeneralMedicalHistoryModal, setOpenGeneralMedicalHistoryModal] = useState(false);
    const [OpenPreview, setOpenPreview] = useState(false);
    const [PostMedicalHistory, setPostMedicalHistory] = useState([]);
    const [HistoryPresentPregnancy, setHistoryPresentPregnancy] = useState([]);
    const [HistoryIndexPreg, setHistoryIndexPreg] = useState([]);
    const [GyneHistory, setGyneHistory] = useState([]);
    const [PastSurgicalHistory, setPastSurgicalHistory] = useState([]);
    const [DrugHistory, setDrugHistory] = useState([]);
    const [FamilySocialHistory, setFamilySocialHistory] = useState([]);
    const [SystematicReview, setSystematicReview] = useState([]);
    const [Summary, setSummary] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [ModalState, setModalState] = useState("");
    const [Disabled, setDisabled] = useState(true);
    const [Loading, setLoading] = useState(false);
    const [LoadingCompleted, setLoadingCompleted] = useState(false);


    const [Payload, setPayload] = useState({

        lmp: "",
        edd: "",
        gravidity: "",
        cycle: "",
        breasts: "",
        height: "",
        weight: "",
        cvs: "",
        rs: "",
        pelvis: "",
        abdomen: "",
        retroviral: "",
        bp: "",
        urine: "",
        hb: "",
        bloodGroup: "",
        groupRh: "",
        genotype: "",
        VDRL: "",
        others: "",
        comments: "",
        bleeding: "",
        discharge: "",
        swellingAnkles: "",
        urinarySymtoms: "",
        bookingDate: "",
        indication: "",
        specialPoint: "",
        para: "",
        consultant: "",
    })




    const handleSuccess = (message, status) => {
        setShowToast({ show: true, message, status });
        setTimeout(() => {
            setShowToast({ show: false, message: "", status: "" });
        }, 3000);

    };

    const handlePayload = (e) => {
        const { id, value } = e.target;
        if (id === 'lmp' && value === '') {
            setPayload({ ...Payload, lmp: '', edd: '' });
        } else {
            setPayload({ ...Payload, [id]: value });
        }
    }

    const addPostMedicalHistory = () => {
        setPostMedicalHistory([...PostMedicalHistory, Payload.postmedicalorsurgicalhistory])
        setPayload({ ...Payload, postmedicalorsurgicalhistory: "" })
    }
    const addHistoryPresentPregnancy = () => {
        setHistoryPresentPregnancy([...HistoryPresentPregnancy, Payload.historyofpresentpregnancy])
        setPayload({ ...Payload, historyofpresentpregnancy: "" })
    }




    const getSettings = async () => {
        try {
            const result = await SettingsApi();
            let checker = result?.servicecategory?.filter(item => item.category === "Appointment")
            setSettings(result);
        } catch (e) {

        }
    };

    const removePostMedicalHistory = (item) => {


        const updatedPostMedicalHistory = PostMedicalHistory.filter(id => id !== item);
        setPostMedicalHistory(updatedPostMedicalHistory);
    }
    const removeHistoryPresentPregnancy = (item) => {


        const updatedItems = HistoryPresentPregnancy.filter(id => id !== item);
        setHistoryPresentPregnancy(updatedItems);
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


    const handleCompleted = async () => {
        setLoadingCompleted(true)
        try {
            const result = await CreateAncV3API({
                ...Payload,
                postmedicalorsurgicalhistory: PostMedicalHistory,
                historyofpresentpregnancy: HistoryPresentPregnancy,

            }, id);


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


    useEffect(() => {
        if (Payload.lmp) {
            const lmpDate = new Date(Payload.lmp);
            lmpDate.setMonth(lmpDate.getMonth() + 9);
            lmpDate.setDate(lmpDate.getDate() + 7);
            const eddDate = lmpDate.toISOString().split('T')[0];
            setPayload(prev => ({ ...prev, edd: eddDate }));
        }
    }, [Payload.lmp]);



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

                <PatientInfoCard />

                <Stack spacing={5} mt="32px">
                    {/* Previous ANC Section */}
                    <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
                        <Text fontSize="xl" fontWeight="bold" mb={4}>Previous ANC</Text>
                        <ANC3 hide={true} />
                    </Box>

                    {/* General Examination Section */}
                    <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
                        <Text fontSize="xl" fontWeight="bold" mb={4}>General Examination</Text>
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                            <Input leftIcon={<FaNoteSticky />} label="Cycle" value={Payload.cycle} onChange={handlePayload} id="cycle" />
                            <Input leftIcon={<FaNoteSticky />} label="Breasts" value={Payload.breasts} onChange={handlePayload} id="breasts" />
                            <Input leftIcon={<FaNoteSticky />} label="Height" value={Payload.height} onChange={handlePayload} id="height" />
                            <Input leftIcon={<FaNoteSticky />} label="weight" value={Payload.weight} onChange={handlePayload} id="weight" />
                            <Input leftIcon={<FaNoteSticky />} label="CVS" value={Payload.cvs} onChange={handlePayload} id="cvs" />
                            <Input leftIcon={<FaNoteSticky />} label="RS" value={Payload.rs} onChange={handlePayload} id="rs" />
                            <Input leftIcon={<FaNoteSticky />} label="Pelvis" value={Payload.pelvis} onChange={handlePayload} id="pelvis" />
                            <Input leftIcon={<FaNoteSticky />} label="Abdomen" value={Payload.abdomen} onChange={handlePayload} id="abdomen" />
                            <Input leftIcon={<FaNoteSticky />} label="Retroviral" value={Payload.retroviral} onChange={handlePayload} id="retroviral" />
                            <Input leftIcon={<FaNoteSticky />} label="bp" value={Payload.bp} onChange={handlePayload} id="bp" />
                            <Input leftIcon={<FaNoteSticky />} label="urine" value={Payload.urine} onChange={handlePayload} id="urine" />
                            <Input leftIcon={<FaNoteSticky />} label="hb" value={Payload.hb} onChange={handlePayload} id="hb" />
                            <Input leftIcon={<FaNoteSticky />} label="bloodGroup" value={Payload.bloodGroup} onChange={handlePayload} id="bloodGroup" />
                            <Input leftIcon={<FaNoteSticky />} label="groupRh" value={Payload.groupRh} onChange={handlePayload} id="groupRh" />
                            <Input leftIcon={<FaNoteSticky />} label="genotype" value={Payload.genotype} onChange={handlePayload} id="genotype" />
                            <Input leftIcon={<FaNoteSticky />} label="VDRL" value={Payload.VDRL} onChange={handlePayload} id="VDRL" />
                            <Input leftIcon={<FaNoteSticky />} label="others" value={Payload.others} onChange={handlePayload} id="others" />
                            <Input leftIcon={<FaNoteSticky />} label="comments" value={Payload.comments} onChange={handlePayload} id="comments" />
                        </SimpleGrid>
                    </Box>

                    {/* Present Pregnancy Section */}
                    <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
                        <Text fontSize="xl" fontWeight="bold" mb={4}>Present Pregnancy</Text>
                        <Stack spacing={4}>
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
                                <Input leftIcon={<FaNoteSticky />} label="bleeding" value={Payload.bleeding} onChange={handlePayload} id="bleeding" />
                                <Input leftIcon={<FaNoteSticky />} type="text" label="discharge" value={Payload.discharge} onChange={handlePayload} id="discharge" />
                                <Input leftIcon={<FaNoteSticky />} type="text" label="swelling Ankles" value={Payload.swellingAnkles} onChange={handlePayload} id="swellingAnkles" />
                                <Input leftIcon={<FaNoteSticky />} type="text" label="urinary Symtoms" value={Payload.urinarySymtoms} onChange={handlePayload} id="urinarySymtoms" />
                            </SimpleGrid>
                        </Stack>
                    </Box>
                    {/* Booking Information  Section */}
                    <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
                        <Text fontSize="xl" fontWeight="bold" mb={4}>Booking Information </Text>
                        <Stack spacing={4}>
                            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={2}>
                                <Input leftIcon={<MdDateRange />} type="date" label="booking Date" value={Payload.bookingDate} onChange={handlePayload} id="bookingDate" />
                                <Input leftIcon={<MdDateRange />} type="date" label="LMP" value={Payload.lmp} onChange={handlePayload} id="lmp" />
                                <Input leftIcon={<MdDateRange />} type="date" label="EDD" value={Payload.edd} val={Payload.edd !=="" ? true: false} onChange={handlePayload} id="edd" readOnly={true} />
                            </SimpleGrid>
                            <Input leftIcon={<FaNoteSticky />} label="Gravidity" value={Payload.gravidity} onChange={handlePayload} id="gravidity" />
                            <Input leftIcon={<FaNoteSticky />} label="indication" value={Payload.indication} onChange={handlePayload} id="indication" />
                            <Input leftIcon={<FaNoteSticky />} label="specialPoint" value={Payload.specialPoint} onChange={handlePayload} id="specialPoint" />
                            <Input leftIcon={<FaNoteSticky />} label="consultant" value={Payload.consultant} onChange={handlePayload} id="consultant" />
                        </Stack>
                    </Box>

                    {/* Post Medical History Section */}
                    <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
                        <Text fontSize="xl" fontWeight="bold" mb={4}>Post Medical History</Text>
                        <Stack spacing={4} mt="10">
                            <TextArea label="Post Medical History" value={Payload.postmedicalorsurgicalhistory} onChange={handlePayload} id="postmedicalorsurgicalhistory" />
                            <Flex justifyContent={"flex-end"}>
                                <Button onClick={addPostMedicalHistory} w={{ base: "100%", md: "184px" }}>
                                    Add
                                </Button>
                            </Flex>
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
                                {PostMedicalHistory?.map((item, i) => (
                                    <Flex key={i} cursor="pointer" px="10px" py="10px" rounded={"20px"} fontSize="12px" _hover={{ bg: "blue.blue400" }} bg="blue.blue500" w="100%" justifyContent="space-between" alignItems="center" >
                                        <Text color="#fff" fontWeight="500" textTransform="capitalize" >{item}</Text>
                                        <Box fontSize="20px" color="#fff" onClick={() => removePostMedicalHistory(item)}><IoIosCloseCircle /></Box>
                                    </Flex>
                                ))}
                            </SimpleGrid>
                        </Stack>
                    </Box>

                    {/* History Of Present Pregnancy Section */}
                    <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
                        <Text fontSize="xl" fontWeight="bold" mb={4}>History Of Present Pregnancy</Text>
                        <Stack spacing={4} mt="10">
                            <TextArea label="History Of Present Pregnancy" value={Payload.historyofpresentpregnancy} onChange={handlePayload} id="historyofpresentpregnancy" />
                            <Flex justifyContent={"flex-end"}>
                                <Button onClick={addHistoryPresentPregnancy} w={{ base: "100%", md: "184px" }}>
                                    Add
                                </Button>
                            </Flex>
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
                                {HistoryPresentPregnancy?.map((item, i) => (
                                    <Flex key={i} cursor="pointer" px="10px" py="10px" rounded={"20px"} fontSize="12px" _hover={{ bg: "blue.blue400" }} bg="blue.blue500" w="100%" justifyContent="space-between" alignItems="center" >
                                        <Text color="#fff" fontWeight="500" textTransform="capitalize" >{item}</Text>
                                        <Box fontSize="20px" color="#fff" onClick={() => removeHistoryPresentPregnancy(item)}><IoIosCloseCircle /></Box>
                                    </Flex>
                                ))}
                            </SimpleGrid>
                        </Stack>
                    </Box>

                    {/* Previous Pregnancy Section */}
                    <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
                        <Text fontSize="xl" fontWeight="bold" mb={4}>Previous Pregnancy</Text>
                        <Tooltip label='Previous Pregnancy'>
                            <Box onClick={() => setOpenObstetricHistoryModal(true)} cursor="pointer" px="25px" py="10px" rounded="8px" border="1px solid #EA5937" color="blue.blue500" bg="orange.orange500" textAlign="center">
                                Previous Pregnancy
                            </Box>
                        </Tooltip>
                    </Box>
                </Stack>

                <PreviousPregnancyModal isOpen={OpenObstetricHistoryModal} onClose={() => setOpenObstetricHistoryModal(false)} setOldPayload={setPayload} oldPayload={Payload} type={ModalState} activateNotifications={activateNotifications} />

                <Flex justifyContent="center" mt={8}>
                    <Flex
                        justifyContent="space-between"
                        flexWrap="wrap"
                        w={{ base: "100%", md: "60%" }}
                    >
                        <Button
                            mt={{ base: "10px", md: "0px" }}
                            background="#f8ddd1"
                            border="1px solid #EA5937"
                            color="blue.blue500"
                            w={{ base: "100%", md: "144px" }}
                            onClick={() => setOpenPreview(true)}
                        >
                            Preview
                        </Button>

                        <Button
                            disabled={Disabled}
                            onClick={handleCompleted}
                            isLoading={LoadingCompleted}
                            w={{ base: "100%", md: "184px" }}
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
