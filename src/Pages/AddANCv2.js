import { HStack, Text, Box, Flex, Select, Stack, useDisclosure, SimpleGrid, Tooltip } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import MainLayout from "../Layouts/Index";
import Seo from "../Utils/Seo";
import Button from "../Components/Button";
import Input from "../Components/Input";
import TextArea from "../Components/TextArea";
import ShowToast from "../Components/ToastNotification";
import ANC from "./ANC";
import PastObstetricHistoryModal from "../Components/PastObstetricHistoryModal";
import GeneralMedicalHistoryModalv2 from "../Components/GeneralMedicalHistoryModalv2";
import PreviewANC from "../Components/PreviewANC";
import { useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon, RadioGroup, Radio
} from '@chakra-ui/react'
import { SettingsApi, CreateAncV2API } from "../Utils/ApiCalls";
import { FaNoteSticky } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io";
import { MdDateRange } from "react-icons/md";
import { useParams } from 'react-router-dom';

export default function AddANCv2() {
    const { id } = useParams()
    const [Settings, setSettings] = useState({});
    const [OpenObstetricHistoryModal, setOpenObstetricHistoryModal] = useState(false);
    const [OpenGeneralMedicalHistoryModal, setOpenGeneralMedicalHistoryModal] = useState(false);
    const [OpenPreview, setOpenPreview] = useState(false);
    const [Complaints, setComplaints] = useState([]);
    const [HistoryComplaints, setHistoryComplaints] = useState([]);
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
        cycle: "",
        edd: "",
        gravidity: "",
        ega: "",
        lcb: "",
        bookingstatus: "",



    })




    const handleSuccess = (message, status) => {
        setShowToast({ show: true, message, status });
        setTimeout(() => {
            setShowToast({ show: false, message: "", status: "" });
        }, 3000);

    };

    const handlePayload = (e) => {
        setPayload({ ...Payload, [e.target.id]: e.target.value })

    }

    const addPresentingComplaints = () => {
        setComplaints([...Complaints, Payload.presentingcomplaints])
        setPayload({ ...Payload, presentingcomplaints: "" })
    }
    const addHistoryPresentingComplaints = () => {
        setHistoryComplaints([...HistoryComplaints, Payload.historyofpresentingcomplaints])
        setPayload({ ...Payload, historyofpresentingcomplaints: "" })
    }
    const addHistoryIndexPregnancy = () => {
        setHistoryIndexPreg([...HistoryIndexPreg, Payload.historyofindexpregnancy])
        setPayload({ ...Payload, historyofindexpregnancy: "" })
    }
    const addGyneHistory = () => {
        setGyneHistory([...GyneHistory, Payload.gynaehistory])
        setPayload({ ...Payload, gynaehistory: "" })
    }
    const addPastSurgicalHistory = () => {
        setPastSurgicalHistory([...PastSurgicalHistory, Payload.passsurgicalhistory])
        setPayload({ ...Payload, passsurgicalhistory: "" })
    }
    const addDrugHistory = () => {
        setDrugHistory([...DrugHistory, Payload.drughistory])
        setPayload({ ...Payload, drughistory: "" })
    }
    const addFamilySocialHistory = () => {
        setFamilySocialHistory([...FamilySocialHistory, Payload.familyandsocialhistory])
        setPayload({ ...Payload, familyandsocialhistory: "" })
    }
    const addSystematicReview = () => {
        setSystematicReview([...SystematicReview, Payload.systematicreview])
        setPayload({ ...Payload, systematicreview: "" })
    }
    const addSummary = () => {
        setSummary([...Summary, Payload.summary])
        setPayload({ ...Payload, summary: "" })
    }



    const [RadioGroups, setRadioGroups] = useState({
        pregnacylosses: ""

    });

    const handleRadioChange = (value, radioGroup) => {
        setRadioGroups((prevRadioGroup) => ({
            ...prevRadioGroup, [radioGroup]: value
        }))

    }


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
    const removeHistoryComplaint = (item) => {


        const updatedItems = HistoryComplaints.filter(id => id !== item);
        setHistoryComplaints(updatedItems);
    }
    const removeHistoryIndexPreg = (item) => {


        const updatedItems = HistoryIndexPreg.filter(id => id !== item);
        setHistoryIndexPreg(updatedItems);
    }
    const removeGyneHistory = (item) => {


        const updatedItems = GyneHistory.filter(id => id !== item);
        setGyneHistory(updatedItems);
    }
    const removePastSurgicalHistory = (item) => {


        const updatedItems = PastSurgicalHistory.filter(id => id !== item);
        setPastSurgicalHistory(updatedItems);
    }
    const removeDrugHistory = (item) => {


        const updatedItems = DrugHistory.filter(id => id !== item);
        setDrugHistory(updatedItems);
    }
    const removeFamilySocialHistory = (item) => {


        const updatedItems = FamilySocialHistory.filter(id => id !== item);
        setFamilySocialHistory(updatedItems);
    }
    const removeSystematicReview = (item) => {


        const updatedItems = SystematicReview.filter(id => id !== item);
        setSystematicReview(updatedItems);
    }
    const removeSummary = (item) => {


        const updatedItems = Summary.filter(id => id !== item);
        setSummary(updatedItems);
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
            const result = await CreateAncV2API({
                ...Payload,
                presentingcomplaints: Complaints,
                historyofpresentingcomplaints: HistoryComplaints,
                historyofindexpregnancy: HistoryIndexPreg,
                gynaehistory: GyneHistory,
                passsurgicalhistory: PastSurgicalHistory,
                drughistory: DrugHistory,
                familyandsocialhistory: FamilySocialHistory,
                systematicreview: SystematicReview,
                summary: Summary,

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
                            <ANC hide={true} />
                        </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem mb="15px">

                        <AccordionButton _hover={{ border: "1px solid #EA5937", color: "#000" }} _focus={{ outline: "none" }} border="1px solid #fff" _expanded={{ rounded: "8px 8px 0px 0px", border: 0 }} bg="#fff" color="#000" rounded="8px">
                            <Box as='span' flex='1' textAlign='left'>
                                Reproductive Profile
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>

                        <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
                            <Stack spacing={4}>

                                <Select fontSize={Payload.bookingstatus !== "" ? "16px" : "13px"}
                                    h="45px"
                                    borderWidth="2px"
                                    borderColor="#6B7280"
                                    id="bookingstatus"
                                    value={Payload.bookingstatus}
                                    onChange={handlePayload}
                                    placeholder="Select Booking Status"
                                >

                                    {
                                        Settings?.bookingstatus?.map((item, i) => (
                                            <option value={`${item}`} key={i}>{item}</option>

                                        ))
                                    }



                                </Select>

                                <Input leftIcon={<FaNoteSticky />} label="Gravidity" value={Payload.gravidity} onChange={handlePayload} id="gravidity" />

                                <SimpleGrid mt="12px" columns={{ base: 1, md: 2 }} spacing={2}>
                                    <Input leftIcon={<MdDateRange />} type="date" label="LMP" value={Payload.lmp} onChange={handlePayload} id="lmp" />
                                    <Input leftIcon={<MdDateRange />} type="date" label="EDD" value={Payload.edd} onChange={handlePayload} id="edd" />

                                </SimpleGrid>

                                <Input leftIcon={<FaNoteSticky />} label="EGA" value={Payload.ega} onChange={handlePayload} id="ega" />
                                <Input leftIcon={<FaNoteSticky />} label="LCB" value={Payload.lcb} onChange={handlePayload} id="lcb" />
                                {/* <Input leftIcon={<FaNoteSticky />} label="Cycle" value={Payload.cycle} onChange={handlePayload} id="cycle" /> */}







                            </Stack>


                        </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem mb="15px">

                        <AccordionButton _hover={{ border: "1px solid #EA5937", color: "#000" }} _focus={{ outline: "none" }} border="1px solid #fff" _expanded={{ rounded: "8px 8px 0px 0px", border: 0 }} bg="#fff" color="#000" rounded="8px">
                            <Box as='span' flex='1' textAlign='left'>
                                Presenting Complaints
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>

                        <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
                            <Stack spacing={4} pt="10">

                                <TextArea label="Presenting Complaints" value={Payload.presentingcomplaints} onChange={handlePayload} id="presentingcomplaints" />



                            </Stack>
                            <Flex justifyContent={"flex-end"} mt="2">
                                <Button

                                    onClick={addPresentingComplaints}

                                    w={["100%", "100%", "184px", "184px"]}

                                >
                                    Add
                                </Button>
                            </Flex>



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


                        </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem mb="15px">

                        <AccordionButton _hover={{ border: "1px solid #EA5937", color: "#000" }} _focus={{ outline: "none" }} border="1px solid #fff" _expanded={{ rounded: "8px 8px 0px 0px", border: 0 }} bg="#fff" color="#000" rounded="8px">
                            <Box as='span' flex='1' textAlign='left'>
                                History Of Presenting Complaints
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>

                        <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
                            <Stack spacing={4} pt="10">

                                <TextArea label="History Of Presenting Complaints" value={Payload.historyofpresentingcomplaints} onChange={handlePayload} id="historyofpresentingcomplaints" />



                            </Stack>
                            <Flex justifyContent={"flex-end"} mt="2">
                                <Button

                                    onClick={addHistoryPresentingComplaints}

                                    w={["100%", "100%", "184px", "184px"]}

                                >
                                    Add
                                </Button>
                            </Flex>



                            <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>

                                {
                                    HistoryComplaints?.map((item, i) => (

                                        <Flex key={i} cursor="pointer" px="10px" py="10px" rounded={"20px"} fontSize="12px" _hover={{ bg: "blue.blue400" }} bg="blue.blue500" w="100%" justifyContent="space-between" alignItems="center" >
                                            <Text color="#fff" fontWeight="500" textTransform="capitalize" >{item}</Text>
                                            <Box fontSize="20px" color="#fff" onClick={() => removeHistoryComplaint(item)}><IoIosCloseCircle /></Box>
                                        </Flex>
                                    ))
                                }

                            </SimpleGrid>


                        </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem mb="15px">

                        <AccordionButton _hover={{ border: "1px solid #EA5937", color: "#000" }} _focus={{ outline: "none" }} border="1px solid #fff" _expanded={{ rounded: "8px 8px 0px 0px", border: 0 }} bg="#fff" color="#000" rounded="8px">
                            <Box as='span' flex='1' textAlign='left'>
                                History Of Index Pregnancy
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>

                        <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
                            <Stack spacing={4} pt="10">

                                <TextArea label="History Of Index Pregnancy" value={Payload.historyofindexpregnancy} onChange={handlePayload} id="historyofindexpregnancy" />



                            </Stack>
                            <Flex justifyContent={"flex-end"} mt="2">
                                <Button

                                    onClick={addHistoryIndexPregnancy}

                                    w={["100%", "100%", "184px", "184px"]}

                                >
                                    Add
                                </Button>
                            </Flex>



                            <SimpleGrid my="15px" columns={{ base: 2, md: 2 }} spacing={2}>

                                {
                                    HistoryIndexPreg?.map((item, i) => (

                                        <Flex key={i} cursor="pointer" px="10px" py="10px" rounded={"20px"} fontSize="12px" _hover={{ bg: "blue.blue400" }} bg="blue.blue500" w="100%" justifyContent="space-between" alignItems="center" >
                                            <Text color="#fff" fontWeight="500" textTransform="capitalize" >{item}</Text>
                                            <Box fontSize="20px" color="#fff" onClick={() => removeHistoryIndexPreg(item)}><IoIosCloseCircle /></Box>
                                        </Flex>
                                    ))
                                }

                            </SimpleGrid>

                            <Tooltip label='Past Obstetric' >
                                <Box onClick={() => setOpenObstetricHistoryModal(true)} cursor="pointer" px="25px" py="10px" rounded="8px" border="1px solid #EA5937" color="blue.blue500" bg="orange.orange500">Past Obstetric History </Box>
                            </Tooltip>


                        </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem mb="15px">

                        <AccordionButton _hover={{ border: "1px solid #EA5937", color: "#000" }} _focus={{ outline: "none" }} border="1px solid #fff" _expanded={{ rounded: "8px 8px 0px 0px", border: 0 }} bg="#fff" color="#000" rounded="8px">
                            <Box as='span' flex='1' textAlign='left'>
                                Gynae History
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>

                        <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
                            <Stack spacing={4} pt="10">

                                <TextArea label="Gynae History" value={Payload.gynaehistory} onChange={handlePayload} id="gynaehistory" />



                            </Stack>
                            <Flex justifyContent={"flex-end"} mt="2">
                                <Button

                                    onClick={addGyneHistory}

                                    w={["100%", "100%", "184px", "184px"]}

                                >
                                    Add
                                </Button>
                            </Flex>



                            <SimpleGrid my="15px" columns={{ base: 2, md: 2 }} spacing={2}>

                                {
                                    GyneHistory?.map((item, i) => (

                                        <Flex key={i} cursor="pointer" px="10px" py="10px" rounded={"20px"} fontSize="12px" _hover={{ bg: "blue.blue400" }} bg="blue.blue500" w="100%" justifyContent="space-between" alignItems="center" >
                                            <Text color="#fff" fontWeight="500" textTransform="capitalize" >{item}</Text>
                                            <Box fontSize="20px" color="#fff" onClick={() => removeGyneHistory(item)}><IoIosCloseCircle /></Box>
                                        </Flex>
                                    ))
                                }

                            </SimpleGrid>

                            <Tooltip label='Past Medical'>
                                <Box onClick={() => setOpenGeneralMedicalHistoryModal(true)} cursor="pointer" px="25px" py="10px" rounded="8px" border="1px solid #EA5937" color="blue.blue500" bg="orange.orange500">Past Medical History </Box>
                            </Tooltip>


                        </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem mb="15px">

                        <AccordionButton _hover={{ border: "1px solid #EA5937", color: "#000" }} _focus={{ outline: "none" }} border="1px solid #fff" _expanded={{ rounded: "8px 8px 0px 0px", border: 0 }} bg="#fff" color="#000" rounded="8px">
                            <Box as='span' flex='1' textAlign='left'>
                                Past Surgical History
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>

                        <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
                            <Stack spacing={4} pt="10">

                                <TextArea label="Past Surgical History" value={Payload.passsurgicalhistory} onChange={handlePayload} id="passsurgicalhistory" />



                            </Stack>
                            <Flex justifyContent={"flex-end"} mt="2">
                                <Button

                                    onClick={addPastSurgicalHistory}

                                    w={["100%", "100%", "184px", "184px"]}

                                >
                                    Add
                                </Button>
                            </Flex>



                            <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>

                                {
                                    PastSurgicalHistory?.map((item, i) => (

                                        <Flex key={i} cursor="pointer" px="10px" py="10px" rounded={"20px"} fontSize="12px" _hover={{ bg: "blue.blue400" }} bg="blue.blue500" w="100%" justifyContent="space-between" alignItems="center" >
                                            <Text color="#fff" fontWeight="500" textTransform="capitalize" >{item}</Text>
                                            <Box fontSize="20px" color="#fff" onClick={() => removePastSurgicalHistory(item)}><IoIosCloseCircle /></Box>
                                        </Flex>
                                    ))
                                }

                            </SimpleGrid>


                        </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem mb="15px">

                        <AccordionButton _hover={{ border: "1px solid #EA5937", color: "#000" }} _focus={{ outline: "none" }} border="1px solid #fff" _expanded={{ rounded: "8px 8px 0px 0px", border: 0 }} bg="#fff" color="#000" rounded="8px">
                            <Box as='span' flex='1' textAlign='left'>
                                Drug History
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>

                        <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
                            <Stack spacing={4} pt="10">

                                <TextArea label="Drug History" value={Payload.drughistory} onChange={handlePayload} id="drughistory" />



                            </Stack>
                            <Flex justifyContent={"flex-end"} mt="2">
                                <Button

                                    onClick={addDrugHistory}

                                    w={["100%", "100%", "184px", "184px"]}

                                >
                                    Add
                                </Button>
                            </Flex>



                            <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>

                                {
                                    DrugHistory?.map((item, i) => (

                                        <Flex key={i} cursor="pointer" px="10px" py="10px" rounded={"20px"} fontSize="12px" _hover={{ bg: "blue.blue400" }} bg="blue.blue500" w="100%" justifyContent="space-between" alignItems="center" >
                                            <Text color="#fff" fontWeight="500" textTransform="capitalize" >{item}</Text>
                                            <Box fontSize="20px" color="#fff" onClick={() => removeDrugHistory(item)}><IoIosCloseCircle /></Box>
                                        </Flex>
                                    ))
                                }

                            </SimpleGrid>


                        </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem mb="15px">

                        <AccordionButton _hover={{ border: "1px solid #EA5937", color: "#000" }} _focus={{ outline: "none" }} border="1px solid #fff" _expanded={{ rounded: "8px 8px 0px 0px", border: 0 }} bg="#fff" color="#000" rounded="8px">
                            <Box as='span' flex='1' textAlign='left'>
                                Family And Social History
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>

                        <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
                            <Stack spacing={4} pt="10">

                                <TextArea label="Family and Social History" value={Payload.familyandsocialhistory} onChange={handlePayload} id="familyandsocialhistory" />



                            </Stack>
                            <Flex justifyContent={"flex-end"} mt="2">
                                <Button

                                    onClick={addFamilySocialHistory}

                                    w={["100%", "100%", "184px", "184px"]}

                                >
                                    Add
                                </Button>
                            </Flex>



                            <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>

                                {
                                    FamilySocialHistory?.map((item, i) => (

                                        <Flex key={i} cursor="pointer" px="10px" py="10px" rounded={"20px"} fontSize="12px" _hover={{ bg: "blue.blue400" }} bg="blue.blue500" w="100%" justifyContent="space-between" alignItems="center" >
                                            <Text color="#fff" fontWeight="500" textTransform="capitalize" >{item}</Text>
                                            <Box fontSize="20px" color="#fff" onClick={() => removeFamilySocialHistory(item)}><IoIosCloseCircle /></Box>
                                        </Flex>
                                    ))
                                }

                            </SimpleGrid>


                        </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem mb="15px">

                        <AccordionButton _hover={{ border: "1px solid #EA5937", color: "#000" }} _focus={{ outline: "none" }} border="1px solid #fff" _expanded={{ rounded: "8px 8px 0px 0px", border: 0 }} bg="#fff" color="#000" rounded="8px">
                            <Box as='span' flex='1' textAlign='left'>
                                Systematic Review
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>

                        <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
                            <Stack spacing={4} pt="10">

                                <TextArea label="Systematic Review" value={Payload.systematicreview} onChange={handlePayload} id="systematicreview" />



                            </Stack>
                            <Flex justifyContent={"flex-end"} mt="2">
                                <Button

                                    onClick={addSystematicReview}

                                    w={["100%", "100%", "184px", "184px"]}

                                >
                                    Add
                                </Button>
                            </Flex>



                            <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>

                                {
                                    SystematicReview?.map((item, i) => (

                                        <Flex key={i} cursor="pointer" px="10px" py="10px" rounded={"20px"} fontSize="12px" _hover={{ bg: "blue.blue400" }} bg="blue.blue500" w="100%" justifyContent="space-between" alignItems="center" >
                                            <Text color="#fff" fontWeight="500" textTransform="capitalize" >{item}</Text>
                                            <Box fontSize="20px" color="#fff" onClick={() => removeSystematicReview(item)}><IoIosCloseCircle /></Box>
                                        </Flex>
                                    ))
                                }

                            </SimpleGrid>


                        </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem mb="15px">

                        <AccordionButton _hover={{ border: "1px solid #EA5937", color: "#000" }} _focus={{ outline: "none" }} border="1px solid #fff" _expanded={{ rounded: "8px 8px 0px 0px", border: 0 }} bg="#fff" color="#000" rounded="8px">
                            <Box as='span' flex='1' textAlign='left'>
                                Summary
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>

                        <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
                            <Stack spacing={4} pt="10">

                                <TextArea label="Summary" value={Payload.summary} onChange={handlePayload} id="summary" />



                            </Stack>
                            <Flex justifyContent={"flex-end"} mt="2">
                                <Button

                                    onClick={addSummary}

                                    w={["100%", "100%", "184px", "184px"]}

                                >
                                    Add
                                </Button>
                            </Flex>



                            <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>

                                {
                                    Summary?.map((item, i) => (

                                        <Flex key={i} cursor="pointer" px="10px" py="10px" rounded={"20px"} fontSize="12px" _hover={{ bg: "blue.blue400" }} bg="blue.blue500" w="100%" justifyContent="space-between" alignItems="center" >
                                            <Text color="#fff" fontWeight="500" textTransform="capitalize" >{item}</Text>
                                            <Box fontSize="20px" color="#fff" onClick={() => removeSummary(item)}><IoIosCloseCircle /></Box>
                                        </Flex>
                                    ))
                                }

                            </SimpleGrid>

                            <PastObstetricHistoryModal isOpen={OpenObstetricHistoryModal} onClose={() => setOpenObstetricHistoryModal(false)} setOldPayload={setPayload} oldPayload={Payload} type={ModalState} activateNotifications={activateNotifications} />
                            <GeneralMedicalHistoryModalv2 isOpen={OpenGeneralMedicalHistoryModal} onClose={() => setOpenGeneralMedicalHistoryModal(false)} setOldPayload={setPayload} oldPayload={Payload} type={ModalState} activateNotifications={activateNotifications} />

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
                            onClick={() => {
                                setOpenPreview(true)

                            }
                            }
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
