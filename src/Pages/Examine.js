import React, { useState, useEffect } from 'react'
import { Text, Flex, HStack, Box, useDisclosure } from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, SimpleGrid, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import moment from "moment";
import TableRow from "../Components/TableRow";
import Button from "../Components/Button";
import ExamineModal from "../Components/ExamineModal";
import ExamineDetails from "../Components/ExamineDetails";
import LabRequestModal from "../Components/LabRequestModal";
import Input from "../Components/Input";
import PreviewCard from "../Components/PreviewCard";
import ShowToast from "../Components/ToastNotification";
import { IoFilter } from "react-icons/io5";
import { BiSearch } from "react-icons/bi";
import { GetPreviousEncounterApi } from "../Utils/ApiCalls";
import Pagination from "../Components/Pagination";
import { configuration } from '../Utils/Helpers'
import Preloader from "../Components/Preloader";
import { SlPlus } from "react-icons/sl";
import { useNavigate, useLocation } from 'react-router-dom';
import { FaClock } from "react-icons/fa";
import { BsCalendar2DateFill } from "react-icons/bs";


export default function Examine({ hide = false, index }) {
    const [IsLoading, setIsLoading] = useState(true);
    const [All, setAll] = useState(true);
    const [InProgress, setInProgress] = useState(false);
    const [Completed, setCompleted] = useState(false);
    const [Data, setData] = useState([]);
    const [OpenView, setOpenView] = useState(false);
    const [ModalState, setModalState] = useState("");
    const [OpenModal, setOpenModal] = useState(false);
    const [OldPayload, setOldPayload] = useState({});
    const [FilterData, setFilterData] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [Trigger, setTrigger] = useState(false);

    // Pagination settings to follow
    const [CurrentPage, setCurrentPage] = useState(1);
    const [PostPerPage, setPostPerPage] = useState(configuration.sizePerPage);

    //get current post
    const indexOfLastSra = CurrentPage * PostPerPage;
    const indexOfFirstSra = indexOfLastSra - PostPerPage;
    const PaginatedData = FilterData.slice(indexOfFirstSra, indexOfLastSra);
    //change page 
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    // Pagination settings to follow end here 


    // Search Filter settings to follow 
    const [SearchInput, setSearchInput] = useState("");

    const [FilteredData, setFilteredData] = useState(null);


    const filterBy = (title) => {

        if (title === "appointmentId") {
            let filter = Data.filter(item => item.appointmentid?.toLowerCase().includes(SearchInput.toLowerCase()))
            setFilteredData(filter)

        } else if (title === "appointmentCategory") {
            let filter = Data.filter(item => item.appointmentcategory?.toLowerCase().includes(SearchInput.toLowerCase()))
            setFilteredData(filter)

        } else if (title === "appointmentType") {
            let filter = Data.filter(item => item.appointmenttype?.toLowerCase().includes(SearchInput.toLowerCase()) || item.lastName?.toLowerCase().includes(SearchInput.toLowerCase()))
            setFilteredData(filter)

        }


    }

    // Search Filter settings to follow end here

    let id = localStorage.getItem("patientId")
    
    let AppointmentID = localStorage.getItem("appointmentId")

    let AppointmentStatus = localStorage.getItem("appointmentStatus")



    const [showToast, setShowToast] = useState({
        show: false,
        message: "",
        status: "",
    });


    const GetSinglePatientHistory = async () => {
        setIsLoading(true)
        try {
            const result = await GetPreviousEncounterApi(id);

            console.log("GetSinglePatientHistory", result.queryresult.appointmentdetails);

            if (result.status === true) {
                setIsLoading(false)
                setFilterData(result.queryresult.appointmentdetails)
                setData(result.queryresult.appointmentdetails)


            }



        } catch (e) {

            activateNotifications(e.message, "error")
        }
    };


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

        }, 10000)
    }


    const filterAll = () => {
        setAll(true);
        setInProgress(false);
        setCompleted(false);
        setFilterData(Data);
    };


    const filterInProgress = () => {
        setAll(false);
        setInProgress(true);
        setCompleted(false);

        const filterData = Data.filter((item) => item.status === "inprogress");

        setFilterData(filterData);
    };
    const filterCompleted = () => {
        setAll(false);
        setInProgress(false);
        setCompleted(true);

        const filterData = Data.filter((item) => item.status === "complete");

        setFilterData(filterData);
    };


    const nav = useNavigate()
    const { pathname } = useLocation()

    const AddEncounter = () => {

        if (AppointmentStatus === "complete") {

            activateNotifications(`Encounter has taken place with current status ${AppointmentStatus}`, "error")

         
        } else {
            nav(`/dashboard/doctor-encounter/${AppointmentID}`)
            localStorage.setItem("pathname", pathname)
        }



    }




    useEffect(() => {

        GetSinglePatientHistory();




    }, [isOpen, Trigger, index]);

    return (
        <Box
            bg="#fff"
            border="1px solid #EFEFEF"
            mt="10px"
            py="17px"
            px={["18px", "18px"]}
            rounded="10px"
        >
            {
                IsLoading && (
                    <Preloader />
                )
            }

            {showToast.show && (
                <ShowToast message={showToast.message} status={showToast.status} />
            )}
            {/* filter section  */}
            <Flex justifyContent="space-between" flexWrap="wrap">
                <Flex
                    alignItems="center"
                    flexWrap="wrap"
                    bg="#E4F3FF"
                    rounded="7px"
                    py="3.5px"
                    px="5px"
                    cursor="pointer"
                    mt={["10px", "10px", "0px", "0px"]}
                >
                    <Box borderRight="1px solid #EDEFF2" pr="5px" onClick={filterAll}>
                        <Text
                            py="8.5px"
                            px="12px"
                            bg={All ? "#fff" : "transparent"}
                            rounded="7px"
                            color={"#1F2937"}
                            fontWeight={"500"}
                            fontSize={"13px"}
                        >
                            All{" "}
                            <Box color="#667085" as="span" fontWeight="400" fontSize="13px">
                                ({Data?.length})
                            </Box>
                        </Text>
                    </Box>

                    <Box
                        borderRight="1px solid #EDEFF2"
                        pr="5px"
                        onClick={filterInProgress}
                    >
                        <Text
                            py="8.5px"
                            px="12px"
                            bg={InProgress ? "#fff" : "transparent"}
                            rounded="7px"
                            color={"#1F2937"}
                            fontWeight={"500"}
                            fontSize={"13px"}
                        >
                            In Progress
                        </Text>
                    </Box>
                    <Box
                        borderRight="1px solid #EDEFF2"
                        pr="5px"
                        onClick={filterCompleted}
                    >
                        <Text
                            py="8.5px"
                            px="12px"
                            bg={Completed ? "#fff" : "transparent"}
                            rounded="7px"
                            color={"#1F2937"}
                            fontWeight={"500"}
                            fontSize={"13px"}
                        >
                            Completed
                        </Text>
                    </Box>
                </Flex>

                {hide === false && (
                    <Flex
                        flexWrap="wrap"
                        mt={["10px", "10px", "0px", "0px"]}
                        alignItems="center"
                        justifyContent={"flex-end"}
                    >
                        <HStack>
                            <Input label="Search" onChange={(e) => setSearchInput(e.target.value)} value={SearchInput} bColor="#E4E4E4" leftIcon={<BiSearch />} />


                            <Menu isLazy>
                                <MenuButton as={Box}>

                                    <HStack
                                        border="1px solid #EA5937"
                                        rounded="7px"
                                        cursor="pointer"
                                        py="11.64px"
                                        px="16.98px"
                                        bg="#f8ddd1"
                                        color="blue.blue500"
                                        fontWeight="500"
                                        fontSize="14px"
                                    >
                                        <Text>Filter</Text>
                                        <IoFilter />
                                    </HStack>
                                </MenuButton>
                                <MenuList >

                                    <MenuItem onClick={() => filterBy("appointmentId")} textTransform="capitalize" fontWeight={"500"} color='#2F2F2F' _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}>
                                        <HStack fontSize="14px">

                                            <Text>by Appointment ID</Text>
                                        </HStack>
                                    </MenuItem>
                                    <MenuItem onClick={() => filterBy("appointmentCategory")} textTransform="capitalize" fontWeight={"500"} color='#2F2F2F' _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}>
                                        <HStack fontSize="14px">

                                            <Text>by Appointment Category</Text>
                                        </HStack>
                                    </MenuItem>
                                    <MenuItem onClick={() => filterBy("appointmentType")} textTransform="capitalize" fontWeight={"500"} color='#2F2F2F' _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}>
                                        <HStack fontSize="14px">

                                            <Text>by Appointment Type</Text>
                                        </HStack>
                                    </MenuItem>
                                    <MenuItem onClick={() => {
                                        setFilteredData(null)
                                        setSearchInput("")
                                    }} textTransform="capitalize" fontWeight={"500"} color='#2F2F2F' _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}>
                                        <HStack fontSize="14px">

                                            <Text>clear filter</Text>
                                        </HStack>
                                    </MenuItem>



                                </MenuList>
                            </Menu>
                        </HStack>
                    </Flex>
                )}
            </Flex>

            {
                hide === false && (

                    <Flex
                        justifyContent="space-between"
                        flexWrap="wrap"
                        mt={["10px", "10px", "10px", "10px"]}
                        w={["100%", "100%", "50%", "37%"]}
                    >
                        <Button

                            w={["100%", "100%", "144px", "144px"]}
                            onClick={AddEncounter}
                            rightIcon={<SlPlus />}
                        >
                            Add Encounter
                        </Button>


                    </Flex>
                )
            }

            {/* filter section end here */}

            <Box
                bg="#fff"
                border="1px solid #EFEFEF"
                mt="12px"
                py="15px"
                px="15px"
                rounded="10px"
                overflowX="auto"
            >

                <Text mb="20px" fontWeight="700" fontSize="16px" color="blue.blue500">Previous Encounter </Text>
                {
                    FilterData.map((item, i) => (
                        <Box key={i} mt="20px">
                            <HStack bg="orange.orange500" py="10px" px="10px" rounded="10px" color="blue.blue500" justifyContent="space-between" fontStyle="italic" fontSize="14px" fontWeight="500">
                                <HStack>

                                    <Box color="blue.blue500"><BsCalendar2DateFill /></Box>
                                    <Text textAlign="center">{moment(item.appointmentdate).format("L")} </Text>
                                    <Box color="blue.blue500"><FaClock /></Box>
                                    <Text textAlign="center"> {moment(item.appointmentdate).format("LT")} </Text>
                                </HStack>

                                <Text textAlign="center"> {item.appointmenttype} </Text>
                            </HStack>
                            {
                                item.doctor && (
                                    <Box>
                                        <Text fontSize="15px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">Doctors Details</Text>
                                        <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                            <PreviewCard title="first name" value={item.doctor?.firstName} />
                                            <PreviewCard title="last name" value={item.doctor?.lastName} />
                                            <PreviewCard title="email" value={item.doctor?.email} />
                                            <PreviewCard title="phone number" value={item.doctor?.phoneNumber} />
                                            <PreviewCard title="Specialization details" value={item.doctor?.specializationDetails} />
                                            <PreviewCard title="staff id" value={item.doctor?.staffId} />
                                        </SimpleGrid>
                                    </Box>
                                )
                            }

                            {
                                item.encounter.history && (
                                    <Box>

                                        <Text fontSize="15px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">History</Text>
                                        <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                            <PreviewCard title="presenting complaints" value={item.encounter.history?.presentingcomplaints} />
                                            {
                                                item.encounter.history?.presentingcompalintcode?.map((code, index) => (

                                                    <PreviewCard title="presenting compalintcode" value={code} />
                                                ))
                                            }
                                            <PreviewCard title="past medical history" value={item.encounter.history?.pastmedicalhistory} />
                                            <PreviewCard title="drug and allergy history" value={item.encounter.history?.drugandallergyhistory} />
                                            <PreviewCard title="family and social history" value={item.encounter.history?.familyandsocialhistory} />
                                            <PreviewCard title="nutrition history" value={item.encounter.history?.nutritionhistory} />
                                            <PreviewCard title="spirituality" value={item.encounter.history?.spirituality} />
                                        </SimpleGrid>
                                    </Box>
                                )
                            }
                            {
                                item.encounter.history?.cvs && (
                                    <Box>

                                        <Text fontSize="15px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">History ~ CVS</Text>
                                        <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                            <PreviewCard title="cvs assessment impression" value={item.encounter.history?.cvs?.cvsassessmentimpression} />
                                            <PreviewCard title="history of cvs disorder" value={item.encounter.history?.cvs?.historyofcvsdisorder} />
                                            <PreviewCard title="history of cvs surgical procedures" value={item.encounter.history?.cvs?.historyofcvssurgicalprocedures} />
                                            <PreviewCard title="history cvs remark" value={item.encounter.history?.cvs?.historycvsremark} />

                                        </SimpleGrid>
                                    </Box>
                                )
                            }
                            {
                                item.encounter.history?.gi && (
                                    <Box>

                                        <Text fontSize="15px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">History ~ GI</Text>
                                        <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                            <PreviewCard title="nausea" value={item.encounter.history?.gi?.nausea} />
                                            <PreviewCard title="type of diet" value={item.encounter.history?.gi?.typeofdiet} />
                                            <PreviewCard title="gi bowel elimination pattern" value={item.encounter.history?.gi?.giboweleliminationpattern} />
                                            <PreviewCard title="bm frequency" value={item.encounter.history?.gi?.bmfrequency} />
                                            <PreviewCard title="bm usual time of the day" value={item.encounter.history?.gi?.bmusualtimeoftheday} />
                                            <PreviewCard title="bm regularity" value={item.encounter.history?.gi?.bmregularity} />
                                            <PreviewCard title="usual consistency" value={item.encounter.history?.gi?.usualconsistency} />
                                            <PreviewCard title="date of last bm" value={item.encounter.history?.gi?.dateoflastbm} />
                                            <PreviewCard title="consistency" value={item.encounter.history?.gi?.consistency} />
                                            <PreviewCard title="color" value={item.encounter.history?.gi?.color} />
                                            <PreviewCard title="amount" value={item.encounter.history?.gi?.amount} />
                                            <PreviewCard title="appearance" value={item.encounter.history?.gi?.appearance} />
                                            <PreviewCard title="history of gi disorders" value={item.encounter.history?.gi?.historyofgidisorders} />
                                            <PreviewCard title="history of surgical procedure of gi system" value={item.encounter.history?.gi?.historyofsurgicalprocedureofgisystem} />
                                            <PreviewCard title="history gi remark" value={item.encounter.history?.gi?.historygiremark} />

                                        </SimpleGrid>
                                    </Box>
                                )
                            }
                            {
                                item.encounter.history?.gu && (
                                    <Box>

                                        <Text fontSize="15px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">History ~ GU</Text>
                                        <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                            <PreviewCard title="history of genitourinary disorders" value={item.encounter.history?.gu?.historyofgenitourinarydisorders} />
                                            <PreviewCard title="history of surgical procedure for gu system" value={item.encounter.history?.gu?.historyofsrgicalprocedureforgusyetm} />
                                            <PreviewCard title="number stools" value={item.encounter.history?.gu?.numberstools} />
                                            <PreviewCard title="fluid output emesis" value={item.encounter.history?.gu?.fluidoutputemesis} />
                                            <PreviewCard title="gu bowel elimination pattern" value={item.encounter.history?.gu?.guboweleliminationpattern} />
                                            <PreviewCard title="consistency stool" value={item.encounter.history?.gu?.consistencystool} />
                                            <PreviewCard title="history gu remark" value={item.encounter.history?.gu?.historyguremark} />

                                        </SimpleGrid>
                                    </Box>
                                )
                            }
                            {
                                item.encounter.history?.resp && (
                                    <Box>

                                        <Text fontSize="15px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">History ~ RESP</Text>
                                        <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                            <PreviewCard title="history of respiratory disorders" value={item.encounter.history?.resp?.historyofrespiratorydisorders} />
                                            <PreviewCard title="resp remark" value={item.encounter.history?.resp?.respremark} />


                                        </SimpleGrid>
                                    </Box>
                                )
                            }
                            {
                                item.encounter.history?.neuro && (
                                    <Box>

                                        <Text fontSize="15px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">History ~ NEURO</Text>
                                        <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                            <PreviewCard title="history of neurologic disorders" value={item.encounter.history?.neuro?.historyofneurologicdisorders} />
                                            <PreviewCard title="history of surgical procedures of nervous system" value={item.encounter.history?.neuro?.historyofsurgicalproceduresofnervoussystem} />
                                            <PreviewCard title="history neuro remark" value={item.encounter.history?.neuro?.historyneuroremark} />


                                        </SimpleGrid>
                                    </Box>
                                )
                            }
                            {
                                item.encounter.history?.msk && (
                                    <Box>

                                        <Text fontSize="15px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">History ~ MSK</Text>
                                        <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                            <PreviewCard title="history of musculo skeletal disorders" value={item.encounter.history?.msk?.historyofmusculoskeletaldisorders} />
                                            <PreviewCard title="history of surgical procedures of msk system" value={item.encounter.history?.msk?.historyofsurgicalproceduresofmsksystem} />
                                            <PreviewCard title="history msk remarks" value={item.encounter.history?.msk?.historymskremarks} />


                                        </SimpleGrid>
                                    </Box>
                                )
                            }
                            {
                                item.encounter.vitals && (
                                    <Box>

                                        <Text fontSize="15px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">Vitals</Text>
                                        <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                            <PreviewCard title="vital date" value={moment(Date.now()).format("ll")} />
                                            <PreviewCard title="height" value={item.encounter.vitals.height} />
                                            <PreviewCard title="weight" value={item.encounter.vitals.weight} />
                                            <PreviewCard title="temperature" value={item.encounter.vitals.temperature} />
                                            <PreviewCard title="Blood Pressure Systolic" value={item.encounter.vitals.bloodpressuresystolic} />
                                            <PreviewCard title="Blood Pressure Diastolic" value={item.encounter.vitals.bloodpressurediastolic} />
                                            <PreviewCard title="Heart Rate" value={item.encounter.vitals.heart} />
                                            <PreviewCard title="O2 Saturation" value={item.encounter.vitals.saturation} />
                                            <PreviewCard title="respiration" value={item.encounter.vitals.respiration} />
                                            <PreviewCard title="bmi" value={item.encounter.vitals.bmi} />
                                        </SimpleGrid>
                                    </Box>
                                )
                            }

                            {
                                item.encounter.generalphysicalexamination && (
                                    <Box>

                                        <Text fontSize="15px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">General Physical Examination</Text>
                                        <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                            <PreviewCard title="hair" value={item.encounter.generalphysicalexamination?.hair} />
                                            <PreviewCard title="hair note" value={item.encounter.generalphysicalexamination?.hairnote} />
                                            <PreviewCard title="face" value={item.encounter.generalphysicalexamination?.face} />
                                            <PreviewCard title="face note" value={item.encounter.generalphysicalexamination?.facenote} />
                                            <PreviewCard title="jaundice" value={item.encounter.generalphysicalexamination?.jaundice} />
                                            <PreviewCard title="jaundice note" value={item.encounter.generalphysicalexamination?.jaundicenote} />
                                            <PreviewCard title="cyanosis" value={item.encounter.generalphysicalexamination?.cyanosis} />
                                            <PreviewCard title="cyanosis note" value={item.encounter.generalphysicalexamination?.cyanosisnote} />
                                            <PreviewCard title="pallor" value={item.encounter.generalphysicalexamination?.pallor} />
                                            <PreviewCard title="pallor note" value={item.encounter.generalphysicalexamination?.pallornote} />
                                            <PreviewCard title="oral" value={item.encounter.generalphysicalexamination?.oral} />
                                            <PreviewCard title="oral note" value={item.encounter.generalphysicalexamination?.oralnote} />
                                            <PreviewCard title="lymphnodes" value={item.encounter.generalphysicalexamination?.lymphnodes} />
                                            <PreviewCard title="lymphnodes note" value={item.encounter.generalphysicalexamination?.lymphnodesnote} />
                                            <PreviewCard title="ederma" value={item.encounter.generalphysicalexamination?.ederma} />
                                            <PreviewCard title="ederma note" value={item.encounter.generalphysicalexamination?.edermanote} />
                                            <PreviewCard title="last menstration period" value={item.encounter.generalphysicalexamination?.lastmenstrationperiod} />
                                            <PreviewCard title="last menstration period note" value={item.encounter.generalphysicalexamination?.lastmenstrationperiodnote} />
                                            <PreviewCard title="general physical examination" value={item.encounter.generalphysicalexamination?.generalphysicalexamination} />

                                        </SimpleGrid>
                                    </Box>
                                )
                            }
                            {
                                item.encounter.paediatricsspecific && (
                                    <Box>

                                        <Text fontSize="15px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">Pediatrics Specifics</Text>
                                        <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                            <PreviewCard title="current length height" value={item.encounter.paediatricsspecific?.currentlengthheight} />
                                            <PreviewCard title="current length height percentage" value={item.encounter.paediatricsspecific?.currentlengthheightpercentage} />
                                            <PreviewCard title="current length height note" value={item.encounter.paediatricsspecific?.currentlengthheightenote} />
                                            <PreviewCard title="current weight" value={item.encounter.paediatricsspecific?.currentweight} />
                                            <PreviewCard title="current weight note" value={item.encounter.paediatricsspecific?.currentweightnote} />
                                            <PreviewCard title="percentage of weight expected" value={item.encounter.paediatricsspecific?.percentageofweightexpected} />
                                            <PreviewCard title="head circumference" value={item.encounter.paediatricsspecific?.headcircumference} />
                                            <PreviewCard title="anterior fontanelle" value={item.encounter.paediatricsspecific?.anteriorfontanelle} />
                                            <PreviewCard title="posterior fontanelle" value={item.encounter.paediatricsspecific?.posteriorfontanelle} />
                                            <PreviewCard title="chest circumference" value={item.encounter.paediatricsspecific?.chestcircumference} />
                                            <PreviewCard title="limb examination" value={item.encounter.paediatricsspecific?.limbexamination} />
                                            <PreviewCard title="general note" value={item.encounter.paediatricsspecific?.generalnote} />
                                            <PreviewCard title="neuro note" value={item.encounter.paediatricsspecific?.neuronote} />
                                            <PreviewCard title="reflexes" value={item.encounter.paediatricsspecific?.reflexes} />
                                            <PreviewCard title="rootingreflexes" value={item.encounter.paediatricsspecific?.rootingreflexes} />
                                            <PreviewCard title="suckreflexes" value={item.encounter.paediatricsspecific?.suckreflexes} />
                                            <PreviewCard title="mororeflexes" value={item.encounter.paediatricsspecific?.mororeflexes} />
                                            <PreviewCard title="tonicneckreflexes" value={item.encounter.paediatricsspecific?.tonicneckreflexes} />
                                            <PreviewCard title="graspreflexes" value={item.encounter.paediatricsspecific?.graspreflexes} />
                                            <PreviewCard title="steppingreflexes" value={item.encounter.paediatricsspecific?.steppingreflexes} />

                                        </SimpleGrid>
                                    </Box>
                                )
                            }
                            {
                                item.encounter.assessmentdiagnosis && (
                                    <Box>

                                        <Text fontSize="15px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">Assessment Diagnosis</Text>
                                        <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                            <PreviewCard title="assessment" value={item.encounter.assessmentdiagnosis?.assessment} />
                                            <PreviewCard title="assessment note" value={item.encounter.assessmentdiagnosis?.assessmentnote} />
                                            <PreviewCard title="diagnosis" value={item.encounter.assessmentdiagnosis?.diagosis} />
                                            <PreviewCard title="diagnosis note" value={item.encounter.assessmentdiagnosis?.diagosisnote} />
                                            <PreviewCard title="icpc2" value={item.encounter.assessmentdiagnosis?.icpc2} />
                                            <PreviewCard title="icpc2 note" value={item.encounter.assessmentdiagnosis?.icpc2note} />


                                        </SimpleGrid>
                                    </Box>
                                )
                            }
                            {
                                item.encounter.paediatrics?.medicalhistory && (
                                    <Box>

                                        <Text fontSize="15px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">Paediatrics ~ Medical History</Text>
                                        <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                            <PreviewCard title="attention deficit disorder  " value={item.encounter.paediatrics?.medicalhistory?.attentiondeficitdisorderhyperactivitydisorder} />
                                            <PreviewCard title="attention deficit disorder  note" value={item.encounter.paediatrics?.medicalhistory?.attentiondeficitdisorderhyperactivitydisordernote} />
                                            <PreviewCard title="constipation" value={item.encounter.paediatrics?.medicalhistory?.constipation} />
                                            <PreviewCard title="constipatio nnote" value={item.encounter.paediatrics?.medicalhistory?.constipationnote} />
                                            <PreviewCard title="fatigue" value={item.encounter.paediatrics?.medicalhistory?.fatigue} />
                                            <PreviewCard title="fatigue note" value={item.encounter.paediatrics?.medicalhistory?.fatiguenote} />
                                            <PreviewCard title="orthopedic conditions" value={item.encounter.paediatrics?.medicalhistory?.orthopedicconditions} />
                                            <PreviewCard title="orthopedic conditions note" value={item.encounter.paediatrics?.medicalhistory?.orthopedicconditionsnote} />
                                            <PreviewCard title="allergies" value={item.encounter.paediatrics?.medicalhistory?.allergies} />
                                            <PreviewCard title="allergies note" value={item.encounter.paediatrics?.medicalhistory?.allergiesnote} />
                                            <PreviewCard title="diabetes" value={item.encounter.paediatrics?.medicalhistory?.diabetes} />
                                            <PreviewCard title="diabetes note" value={item.encounter.paediatrics?.medicalhistory?.diabetesnote} />
                                            <PreviewCard title="headaches" value={item.encounter.paediatrics?.medicalhistory?.headaches} />
                                            <PreviewCard title="head aches note" value={item.encounter.paediatrics?.medicalhistory?.headachesnote} />
                                            <PreviewCard title="scoliosis" value={item.encounter.paediatrics?.medicalhistory?.scoliosis} />
                                            <PreviewCard title="scoliosis note" value={item.encounter.paediatrics?.medicalhistory?.scoliosisnote} />
                                            <PreviewCard title="asthma" value={item.encounter.paediatrics?.medicalhistory?.asthma} />
                                            <PreviewCard title="asthma note" value={item.encounter.paediatrics?.medicalhistory?.asthmanote} />
                                            <PreviewCard title="digestive problems" value={item.encounter.paediatrics?.medicalhistory?.digestiveproblems} />
                                            <PreviewCard title="digestiveproblems note" value={item.encounter.paediatrics?.medicalhistory?.digestiveproblemsnote} />
                                            <PreviewCard title="hearing difficulties" value={item.encounter.paediatrics?.medicalhistory?.hearingdifficulties} />
                                            <PreviewCard title="hearing difficulties note" value={item.encounter.paediatrics?.medicalhistory?.hearingdifficultiesnote} />
                                            <PreviewCard title="seizures" value={item.encounter.paediatrics?.medicalhistory?.seizures} />
                                            <PreviewCard title="seizures note" value={item.encounter.paediatrics?.medicalhistory?.seizuresnote} />
                                            <PreviewCard title="blood disorder" value={item.encounter.paediatrics?.medicalhistory?.blooddisorder} />
                                            <PreviewCard title="blood disorder note" value={item.encounter.paediatrics?.medicalhistory?.blooddisordernote} />
                                            <PreviewCard title="depression anxiety" value={item.encounter.paediatrics?.medicalhistory?.depressionanxiety} />
                                            <PreviewCard title="depression anxiety note" value={item.encounter.paediatrics?.medicalhistory?.depressionanxietynote} />
                                            <PreviewCard title="heart problems" value={item.encounter.paediatrics?.medicalhistory?.heartproblems} />
                                            <PreviewCard title="heart problems note" value={item.encounter.paediatrics?.medicalhistory?.heartproblemsnote} />
                                            <PreviewCard title="sleep disturbances" value={item.encounter.paediatrics?.medicalhistory?.sleepdisturbances} />
                                            <PreviewCard title="sleep disturbances note" value={item.encounter.paediatrics?.medicalhistory?.sleepdisturbancesnote} />
                                            <PreviewCard title="chroniccolds" value={item.encounter.paediatrics?.medicalhistory?.chroniccolds} />
                                            <PreviewCard title="dyslexia" value={item.encounter.paediatrics?.medicalhistory?.dyslexia} />
                                            <PreviewCard title="dyslexia note" value={item.encounter.paediatrics?.medicalhistory?.dyslexianote} />
                                            <PreviewCard title="kidney disorders" value={item.encounter.paediatrics?.medicalhistory?.kidneydisorders} />
                                            <PreviewCard title="kidney disorders note" value={item.encounter.paediatrics?.medicalhistory?.kidneydisordersnote} />
                                            <PreviewCard title="colic" value={item.encounter.paediatrics?.medicalhistory?.colic} />
                                            <PreviewCard title="colic note" value={item.encounter.paediatrics?.medicalhistory?.colicnote} />
                                            <PreviewCard title="torticollis" value={item.encounter.paediatrics?.medicalhistory?.torticollis} />
                                            <PreviewCard title="ear infections" value={item.encounter.paediatrics?.medicalhistory?.earinfections} />
                                            <PreviewCard title="ear infections note" value={item.encounter.paediatrics?.medicalhistory?.earinfectionsnote} />
                                            <PreviewCard title="lymph disorders" value={item.encounter.paediatrics?.medicalhistory?.lymphdisorders} />
                                            <PreviewCard title="lymph disorders note" value={item.encounter.paediatrics?.medicalhistory?.lymphdisordersnote} />
                                            <PreviewCard title="vision difficulties" value={item.encounter.paediatrics?.medicalhistory?.visiondifficulties} />
                                            <PreviewCard title="vision difficulties note" value={item.encounter.paediatrics?.medicalhistory?.visiondifficultiesnote} />
                                            <PreviewCard title="autism" value={item.encounter.paediatrics?.medicalhistory?.autism} />
                                            <PreviewCard title="autism note" value={item.encounter.paediatrics?.medicalhistory?.autismnote} />
                                            <PreviewCard title="sensory processing challenges" value={item.encounter.paediatrics?.medicalhistory?.sensoryprocessingchallenges} />
                                            <PreviewCard title="sensory processing challenges note" value={item.encounter.paediatrics?.medicalhistory?.sensoryprocessingchallengesnote} />


                                        </SimpleGrid>
                                    </Box>
                                )
                            }
                            {
                                item.encounter.paediatrics?.prepostnatalhistory && (
                                    <Box>

                                        <Text fontSize="15px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">Paediatrics ~ Pre/Postnatal History</Text>
                                        <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                            <PreviewCard title="stressors" value={item.encounter.paediatrics?.prepostnatalhistory?.stressors} />
                                            <PreviewCard title="stressors note" value={item.encounter.paediatrics?.prepostnatalhistory?.stressorsnote} />
                                            <PreviewCard title="pregnancy medication" value={item.encounter.paediatrics?.prepostnatalhistory?.pregnancymedication} />
                                            <PreviewCard title="pregnancy medication note" value={item.encounter.paediatrics?.prepostnatalhistory?.pregnancymedicationnote} />
                                            <PreviewCard title="cigarette alcohol use" value={item.encounter.paediatrics?.prepostnatalhistory?.cigarettealcoholuse} />
                                            <PreviewCard title="cigarette alcohol use note" value={item.encounter.paediatrics?.prepostnatalhistory?.cigarettealcoholusenote} />
                                            <PreviewCard title="delivery" value={item.encounter.paediatrics?.prepostnatalhistory?.delivery} />
                                            <PreviewCard title="delivery note" value={item.encounter.paediatrics?.prepostnatalhistory?.deliverynote} />
                                            <PreviewCard title="delivery type" value={item.encounter.paediatrics?.prepostnatalhistory?.deliverytype} />
                                            <PreviewCard title="delivery type note" value={item.encounter.paediatrics?.prepostnatalhistory?.deliverytypenote} />
                                            <PreviewCard title="emergency delivery" value={item.encounter.paediatrics?.prepostnatalhistory?.emergencydelivery} />
                                            <PreviewCard title="emergency delivery note" value={item.encounter.paediatrics?.prepostnatalhistory?.emergencydeliverynote} />
                                            <PreviewCard title="labour induction" value={item.encounter.paediatrics?.prepostnatalhistory?.labourinduction} />
                                            <PreviewCard title="labour induction note" value={item.encounter.paediatrics?.prepostnatalhistory?.labourinductionnote} />
                                            <PreviewCard title="birth history medication" value={item.encounter.paediatrics?.prepostnatalhistory?.birthhistorymedication} />
                                            <PreviewCard title="birth history medication note" value={item.encounter.paediatrics?.prepostnatalhistory?.birthhistorymedicationnote} />
                                            <PreviewCard title="birth weight" value={item.encounter.paediatrics?.prepostnatalhistory?.birthweight} />
                                            <PreviewCard title="birth length height" value={item.encounter.paediatrics?.prepostnatalhistory?.birthlengthheight} />
                                            <PreviewCard title="assisted delivery" value={item.encounter.paediatrics?.prepostnatalhistory?.assisteddelivery} />
                                            <PreviewCard title="assisted delivery note" value={item.encounter.paediatrics?.prepostnatalhistory?.assisteddeliverynote} />
                                            <PreviewCard title="type of assisted delivery" value={item.encounter.paediatrics?.prepostnatalhistory?.typeofassisteddelivery} />
                                            <PreviewCard title="type of assisted delivery note" value={item.encounter.paediatrics?.prepostnatalhistory?.typeofassisteddeliverynote} />
                                            <PreviewCard title="complications during delivery note" value={item.encounter.paediatrics?.prepostnatalhistory?.complicationsduringdeliverynote} />
                                            <PreviewCard title="complications during delivery" value={item.encounter.paediatrics?.prepostnatalhistory?.complicationsduringdelivery} />
                                            <PreviewCard title="apgar score after one minute" value={item.encounter.paediatrics?.prepostnatalhistory?.apgarscoreafteroneminute} />
                                            <PreviewCard title="apgar score after five minutes" value={item.encounter.paediatrics?.prepostnatalhistory?.apgarscoreafterfiveminutes} />
                                            <PreviewCard title="use of oxygen afterbirth" value={item.encounter.paediatrics?.prepostnatalhistory?.useofoxygenafterbirth} />
                                            <PreviewCard title="feeding of the child" value={item.encounter.paediatrics?.prepostnatalhistory?.feedingofthechild} />
                                            <PreviewCard title="feeding of the child note" value={item.encounter.paediatrics?.prepostnatalhistory?.feedingofthechildnote} />
                                            <PreviewCard title="difficultyinlatchingsucking" value={item.encounter.paediatrics?.prepostnatalhistory?.difficultyinlatchingsucking} />
                                            <PreviewCard title="difficulty in latching suckingnote" value={item.encounter.paediatrics?.prepostnatalhistory?.difficultyinlatchingsuckingnote} />

                                        </SimpleGrid>
                                    </Box>
                                )
                            }
                            {
                                item.encounter.paediatrics?.developmentmilestonehistorydetails && (
                                    <Box>

                                        <Text fontSize="15px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">Paediatrics ~ Developmental History</Text>
                                        <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                            <PreviewCard title="age when rolled over" value={item.encounter.paediatrics?.developmentmilestonehistorydetails?.agewhenrolledover} />
                                            <PreviewCard title="sat up unsupported" value={item.encounter.paediatrics?.developmentmilestonehistorydetails?.satupunsupported} />
                                            <PreviewCard title="crawled" value={item.encounter.paediatrics?.developmentmilestonehistorydetails?.crawled} />
                                            <PreviewCard title="walked" value={item.encounter.paediatrics?.developmentmilestonehistorydetails?.walked} />
                                            <PreviewCard title="spoke first word" value={item.encounter.paediatrics?.developmentmilestonehistorydetails?.spokefirstword} />
                                            <PreviewCard title="spoke in sentences" value={item.encounter.paediatrics?.developmentmilestonehistorydetails?.spokeinsentences} />
                                            <PreviewCard title="total trianed" value={item.encounter.paediatrics?.developmentmilestonehistorydetails?.totaltrianed} />
                                            <PreviewCard title="any food allergies" value={item.encounter.paediatrics?.developmentmilestonehistorydetails?.anyfoodallergies} />
                                            <PreviewCard title="any food allergies note" value={item.encounter.paediatrics?.developmentmilestonehistorydetails?.anyfoodallergiesnote} />
                                            <PreviewCard title="contact type sport" value={item.encounter.paediatrics?.developmentmilestonehistorydetails?.contacttypesport} />
                                            <PreviewCard title="contact type sport note" value={item.encounter.paediatrics?.developmentmilestonehistorydetails?.contacttypesportnote} />
                                            <PreviewCard title="history of car accident" value={item.encounter.paediatrics?.developmentmilestonehistorydetails?.historyofcaraccident} />
                                            <PreviewCard title="history of car accident note" value={item.encounter.paediatrics?.developmentmilestonehistorydetails?.historyofcaraccidentnote} />
                                            <PreviewCard title="ever been seen on emergency" value={item.encounter.paediatrics?.developmentmilestonehistorydetails?.everbeenseenonemergency} />
                                            <PreviewCard title="ever been seen on emergency note" value={item.encounter.paediatrics?.developmentmilestonehistorydetails?.everbeenseenonemergencynote} />
                                            <PreviewCard title="other history of trauma" value={item.encounter.paediatrics?.developmentmilestonehistorydetails?.otherhistoryoftrauma} />
                                            <PreviewCard title="other history of trauma note" value={item.encounter.paediatrics?.developmentmilestonehistorydetails?.otherhistoryoftraumanote} />
                                            <PreviewCard title="history of frequent falls" value={item.encounter.paediatrics?.developmentmilestonehistorydetails?.historyoffrequentfalls} />
                                            <PreviewCard title="history of frequent falls note" value={item.encounter.paediatrics?.developmentmilestonehistorydetails?.historyoffrequentfallsnote} />
                                            <PreviewCard title="any sign of muscle weakness note" value={item.encounter.paediatrics?.developmentmilestonehistorydetails?.anysignofmuscleweaknessnote} />
                                            <PreviewCard title="any sign of muscle weakness" value={item.encounter.paediatrics?.developmentmilestonehistorydetails?.anysignofmuscleweakness} />
                                        </SimpleGrid>
                                    </Box>
                                )
                            }
                            {
                                item.encounter.paediatrics?.immunizationhistory && (
                                    <Box>

                                        <Text fontSize="15px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">Paediatrics ~ Immunization History</Text>
                                        <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                            <PreviewCard title="immunization" value={item.encounter.paediatrics?.immunizationhistory?.immunization} />
                                            <PreviewCard title="hepb0" value={item.encounter.paediatrics?.immunizationhistory?.hepb0 ? "yes" : ""} />
                                            <PreviewCard title="opv0" value={item.encounter.paediatrics?.immunizationhistory?.opv0 ? "yes" : ""} />
                                            <PreviewCard title="bcg" value={item.encounter.paediatrics?.immunizationhistory?.bcg ? "yes" : ""} />
                                            <PreviewCard title="opv1" value={item.encounter.paediatrics?.immunizationhistory?.opv1 ? "yes" : ""} />
                                            <PreviewCard title="penta1" value={item.encounter.paediatrics?.immunizationhistory?.penta1 ? "yes" : ""} />
                                            <PreviewCard title="pcv1" value={item.encounter.paediatrics?.immunizationhistory?.pcv1 ? "yes" : ""} />
                                            <PreviewCard title="rota1" value={item.encounter.paediatrics?.immunizationhistory?.rota1 ? "yes" : ""} />
                                            <PreviewCard title="opv2" value={item.encounter.paediatrics?.immunizationhistory?.opv2 ? "yes" : ""} />
                                            <PreviewCard title="pcv2" value={item.encounter.paediatrics?.immunizationhistory?.pcv2 ? "yes" : ""} />
                                            <PreviewCard title="rota2" value={item.encounter.paediatrics?.immunizationhistory?.rota2 ? "yes" : ""} />
                                            <PreviewCard title="opv3" value={item.encounter.paediatrics?.immunizationhistory?.opv3 ? "yes" : ""} />
                                            <PreviewCard title="penta3" value={item.encounter.paediatrics?.immunizationhistory?.penta3 ? "yes" : ""} />
                                            <PreviewCard title="pcv3" value={item.encounter.paediatrics?.immunizationhistory?.pcv3 ? "yes" : ""} />
                                            <PreviewCard title="rota3" value={item.encounter.paediatrics?.immunizationhistory?.rota3 ? "yes" : ""} />
                                            <PreviewCard title="ipv" value={item.encounter.paediatrics?.immunizationhistory?.ipv ? "yes" : ""} />
                                            <PreviewCard title="vitamina1" value={item.encounter.paediatrics?.immunizationhistory?.vitamina1 ? "yes" : ""} />
                                            <PreviewCard title="vitamina2" value={item.encounter.paediatrics?.immunizationhistory?.vitamina2 ? "yes" : ""} />
                                            <PreviewCard title="measles" value={item.encounter.paediatrics?.immunizationhistory?.measles ? "yes" : ""} />
                                            <PreviewCard title="yellowfever" value={item.encounter.paediatrics?.immunizationhistory?.yellowfever ? "yes" : ""} />
                                            <PreviewCard title="mena" value={item.encounter.paediatrics?.immunizationhistory?.mena ? "yes" : ""} />
                                            <PreviewCard title="measles2" value={item.encounter.paediatrics?.immunizationhistory?.measles2 ? "yes" : ""} />
                                            <PreviewCard title="hpv914" value={item.encounter.paediatrics?.immunizationhistory?.hpv914 ? "yes" : ""} />
                                            <PreviewCard title="llin" value={item.encounter.paediatrics?.immunizationhistory?.llin ? "yes" : ""} />
                                        </SimpleGrid>
                                    </Box>
                                )
                            }
                            {
                                item.encounter?.physicalexamination?.cvs && (
                                    <Box>

                                        <Text fontSize="15px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">physical examination ~ CVS</Text>
                                        <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                            <PreviewCard title="bp diastolic" value={item.encounter.physicalexamination?.cvs?.bpdiastolic} />
                                            <PreviewCard title="bp systolic" value={item.encounter.physicalexamination?.cvs?.bpsystolic} />
                                            <PreviewCard title="capillary refill time" value={item.encounter.physicalexamination?.cvs?.capillaryrefilltime} />
                                            <PreviewCard title="cvs remark" value={item.encounter.physicalexamination?.cvs?.cvsremark} />
                                            <PreviewCard title="edema" value={item.encounter.physicalexamination?.cvs?.edema} />
                                            <PreviewCard title="heart murmur grade" value={item.encounter.physicalexamination?.cvs?.heartmurmurgrade} />
                                            <PreviewCard title="heart murmur pitch" value={item.encounter.physicalexamination?.cvs?.heartmurmurpitch} />
                                            <PreviewCard title="heart murmur quality" value={item.encounter.physicalexamination?.cvs?.heartmurmurquality} />
                                            <PreviewCard title="heart murmur timing" value={item.encounter.physicalexamination?.cvs?.heartmurmurtiming} />
                                            <PreviewCard title="heart rate" value={item.encounter.physicalexamination?.cvs?.heartrate} />
                                            <PreviewCard title="heart rate rhythm" value={item.encounter.physicalexamination?.cvs?.heartraterhythm} />
                                            <PreviewCard title="heart sound" value={item.encounter.physicalexamination?.cvs?.heartsound} />
                                            <PreviewCard title="jugular vein distention" value={item.encounter.physicalexamination?.cvs?.jugularveindistention} />
                                            <PreviewCard title="jugular vein distention head up 30 degree" value={item.encounter.physicalexamination?.cvs?.jugularveindistentionheadup30degree} />
                                            <PreviewCard title="hear murmur location auscultation sound" value={item.encounter.physicalexamination?.cvs?.heartsound} />
                                            <PreviewCard title="murmur radiating to body location" value={item.encounter.physicalexamination?.cvs?.murmurradiatingtobodylocation} />
                                            <PreviewCard title="temperature extrmities" value={item.encounter.physicalexamination?.cvs?.temperatureextrmities} />



                                        </SimpleGrid>
                                    </Box>
                                )
                            }
                            {
                                item.encounter?.physicalexamination?.gi && (
                                    <Box>

                                        <Text fontSize="15px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">physical examination ~ GI</Text>
                                        <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                            <PreviewCard title="bowel sound auscultation" value={item.encounter.physicalexamination?.gi?.bowelsoundauscultation} />
                                            <PreviewCard title="bowel sound by quality auscultation" value={item.encounter.physicalexamination?.gi?.bowelsoundbyqualityauscultation} />
                                            <PreviewCard title="bs quad auscultation" value={item.encounter.physicalexamination?.gi?.bsquadauscultation} />
                                            <PreviewCard title="gi assessment impression" value={item.encounter.physicalexamination?.gi?.giassessmentimpression} />
                                            <PreviewCard title="gi remarks" value={item.encounter.physicalexamination?.gi?.giremarks} />
                                            <PreviewCard title="physiologic finding by palpation" value={item.encounter.physicalexamination?.gi?.physiologicfindingbypalpation} />


                                        </SimpleGrid>
                                    </Box>
                                )
                            }
                            {
                                item.encounter?.physicalexamination?.gu && (
                                    <Box>

                                        <Text fontSize="15px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">physical examination ~ GU</Text>
                                        <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                            <PreviewCard title="appearance urine" value={item.encounter.physicalexamination?.gu?.appearanceurine} />
                                            <PreviewCard title="blood loss volume" value={item.encounter.physicalexamination?.gu?.bloodlossvolume} />
                                            <PreviewCard title="color urine" value={item.encounter.physicalexamination?.gu?.colorurine} />
                                            <PreviewCard title="diaper count" value={item.encounter.physicalexamination?.gu?.diapercount} />
                                            <PreviewCard title="genitourinary assessment impression" value={item.encounter.physicalexamination?.gu?.genitourinaryassessmentimpression} />
                                            <PreviewCard title="genitouring assessment impressions" value={item.encounter.physicalexamination?.gu?.genitouringassessmentimpressions} />
                                            <PreviewCard title="incontinent void surinary" value={item.encounter.physicalexamination?.gu?.incontinentvoidsurinary} />
                                            <PreviewCard title="number voids" value={item.encounter.physicalexamination?.gu?.numbervoids} />
                                            <PreviewCard title="other urine" value={item.encounter.physicalexamination?.gu?.otherurine} />
                                            <PreviewCard title="perineal pads count" value={item.encounter.physicalexamination?.gu?.perinealpadscount} />
                                            <PreviewCard title="urine collectio ndevice" value={item.encounter.physicalexamination?.gu?.urinecollectiondevice} />
                                            <PreviewCard title="urine color" value={item.encounter.physicalexamination?.gu?.urinecolor} />
                                            <PreviewCard title="urine odor" value={item.encounter.physicalexamination?.gu?.urineodor} />
                                            <PreviewCard title="urine turbidity" value={item.encounter.physicalexamination?.gu?.urineturbidity} />
                                            <PreviewCard title="voiding pattern" value={item.encounter.physicalexamination?.gu?.voidingpattern} />
                                            <PreviewCard title="voiding pattern gu" value={item.encounter.physicalexamination?.gu?.voidingpatterngu} />
                                            <PreviewCard title="gu remark" value={item.encounter.physicalexamination?.gu?.guremark} />



                                        </SimpleGrid>
                                    </Box>
                                )
                            }
                            {
                                item.encounter?.physicalexamination?.resp && (
                                    <Box>

                                        <Text fontSize="15px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">physical examination ~ RESP</Text>
                                        <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                            <PreviewCard title="breath sounds auscultation" value={item.encounter.physicalexamination?.resp?.breathsoundsauscultation} />
                                            <PreviewCard title="localized breath sounds" value={item.encounter.physicalexamination?.resp?.localizedbreathsounds} />
                                            <PreviewCard title="respiratory assessment impression" value={item.encounter.physicalexamination?.resp?.respiratoryassessmentimpression} />
                                            <PreviewCard title="respiratory effort" value={item.encounter.physicalexamination?.resp?.respiratoryeffort} />
                                            <PreviewCard title="respiratory rate" value={item.encounter.physicalexamination?.resp?.respiratoryrate} />
                                            <PreviewCard title="respiratory rhthm" value={item.encounter.physicalexamination?.resp?.respiratoryrhthm} />
                                            <PreviewCard title="resp remarks" value={item.encounter.physicalexamination?.resp?.respremarks} />




                                        </SimpleGrid>
                                    </Box>
                                )
                            }
                            {
                                item.encounter?.physicalexamination?.neuro && (
                                    <Box>

                                        <Text fontSize="15px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">physical examination ~ NEURO</Text>
                                        <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                            <PreviewCard title="ability to concentrate" value={item.encounter.physicalexamination?.neuro?.abilitytoconcentrate} />
                                            <PreviewCard title="ability to direct attention" value={item.encounter.physicalexamination?.neuro?.abilitytodirectattention} />
                                            <PreviewCard title="cniexam" value={item.encounter.physicalexamination?.neuro?.cniexam} />
                                            <PreviewCard title="cniiexam" value={item.encounter.physicalexamination?.neuro?.cniiexam} />
                                            <PreviewCard title="cniiiexam" value={item.encounter.physicalexamination?.neuro?.cniiiexam} />
                                            <PreviewCard title="cnivexam" value={item.encounter.physicalexamination?.neuro?.cnivexam} />
                                            <PreviewCard title="cniviiexam" value={item.encounter.physicalexamination?.neuro?.cniviiexam} />
                                            <PreviewCard title="cniviiiexam" value={item.encounter.physicalexamination?.neuro?.cniviiiexam} />
                                            <PreviewCard title="cnixexam" value={item.encounter.physicalexamination?.neuro?.cnixexam} />
                                            <PreviewCard title="cnvexam" value={item.encounter.physicalexamination?.neuro?.cnvexam} />
                                            <PreviewCard title="cnviexam" value={item.encounter.physicalexamination?.neuro?.cnviexam} />
                                            <PreviewCard title="cnxexam" value={item.encounter.physicalexamination?.neuro?.cnxexam} />
                                            <PreviewCard title="cnxiexam" value={item.encounter.physicalexamination?.neuro?.cnxiexam} />
                                            <PreviewCard title="cnxiiexam" value={item.encounter.physicalexamination?.neuro?.cnxiiexam} />
                                            <PreviewCard title="glas gowcoma scale" value={item.encounter.physicalexamination?.neuro?.glasgowcomascale} />
                                            <PreviewCard title="level of arousal" value={item.encounter.physicalexamination?.neuro?.levelofarousal} />
                                            <PreviewCard title="level of consciousness" value={item.encounter.physicalexamination?.neuro?.levelofconsciousness} />
                                            <PreviewCard title="neurology assessment impression" value={item.encounter.physicalexamination?.neuro?.neurologyassessmentimpression} />
                                            <PreviewCard title="orientation assessment impression" value={item.encounter.physicalexamination?.neuro?.orientationassessmentimpression} />
                                            <PreviewCard title="patient memory" value={item.encounter.physicalexamination?.neuro?.patientmemory} />
                                            <PreviewCard title="patient mood" value={item.encounter.physicalexamination?.neuro?.patientmood} />
                                            <PreviewCard title="person" value={item.encounter.physicalexamination?.neuro?.person} />
                                            <PreviewCard title="physiologic find ingopticlens" value={item.encounter.physicalexamination?.neuro?.physiologicfindingopticlens} />
                                            <PreviewCard title="place" value={item.encounter.physicalexamination?.neuro?.place} />
                                            <PreviewCard title="pupil assessment impression" value={item.encounter.physicalexamination?.neuro?.pupilassessmentimpression} />
                                            <PreviewCard title="pupil diametereyel" value={item.encounter.physicalexamination?.neuro?.pupildiametereyel} />
                                            <PreviewCard title="pupil diametereyer" value={item.encounter.physicalexamination?.neuro?.pupildiametereyer} />
                                            <PreviewCard title="pupillary responsepupill" value={item.encounter.physicalexamination?.neuro?.pupillaryresponsepupill} />
                                            <PreviewCard title="pupillary responsepupilr" value={item.encounter.physicalexamination?.neuro?.pupillaryresponsepupilr} />
                                            <PreviewCard title="pupil shape left pupil" value={item.encounter.physicalexamination?.neuro?.pupilshapeleftpupil} />
                                            <PreviewCard title="pupil shape right pupil" value={item.encounter.physicalexamination?.neuro?.pupilshaperightpupil} />
                                            <PreviewCard title="speech clarity" value={item.encounter.physicalexamination?.neuro?.speechclarity} />
                                            <PreviewCard title="time" value={item.encounter.physicalexamination?.neuro?.time} />





                                        </SimpleGrid>
                                    </Box>
                                )
                            }
                            {
                                item.encounter?.physicalexamination?.msk && (
                                    <Box>

                                        <Text fontSize="15px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">physical examination ~ MSK</Text>
                                        <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                            <PreviewCard title="active range abduction hip l" value={item.encounter.physicalexamination?.msk?.activerangeabductionhipl} />
                                            <PreviewCard title="active range abduction hip r" value={item.encounter.physicalexamination?.msk?.activerangeabductionhipr} />
                                            <PreviewCard title="active range abduction shoulder l" value={item.encounter.physicalexamination?.msk?.activerangeabductionshoulderl} />
                                            <PreviewCard title="active range abduction shoulder r" value={item.encounter.physicalexamination?.msk?.activerangeabductionshoulderr} />
                                            <PreviewCard title="active range adduction hip l" value={item.encounter.physicalexamination?.msk?.activerangeadductionhipl} />
                                            <PreviewCard title="active range adduction hip r" value={item.encounter.physicalexamination?.msk?.activerangeadductionhipr} />
                                            <PreviewCard title="active range adduction shoulder l" value={item.encounter.physicalexamination?.msk?.activerangeadductionshoulderl} />
                                            <PreviewCard title="active range adduction shoulder r" value={item.encounter.physicalexamination?.msk?.activerangeadductionshoulderr} />
                                            <PreviewCard title="active range extension elbow l" value={item.encounter.physicalexamination?.msk?.activerangeextensionelbowl} />
                                            <PreviewCard title="active range extension elbow r" value={item.encounter.physicalexamination?.msk?.activerangeextensionelbowr} />
                                            <PreviewCard title="active range extension hipl " value={item.encounter.physicalexamination?.msk?.activerangeextensionhipl} />
                                            <PreviewCard title="active range extension hip r" value={item.encounter.physicalexamination?.msk?.activerangeextensionhipr} />
                                            <PreviewCard title="active range extension knee l" value={item.encounter.physicalexamination?.msk?.activerangeextensionkneel} />
                                            <PreviewCard title="active range extension knee r" value={item.encounter.physicalexamination?.msk?.activerangeextensionkneer} />
                                            <PreviewCard title="active range extension shoulder l" value={item.encounter.physicalexamination?.msk?.activerangeextensionshoulderl} />
                                            <PreviewCard title="active range extension shoulder r" value={item.encounter.physicalexamination?.msk?.activerangeextensionshoulderr} />
                                            <PreviewCard title="active range external rotation hip l" value={item.encounter.physicalexamination?.msk?.activerangeexternalrotationhipl} />
                                            <PreviewCard title="active range external rotation hip r" value={item.encounter.physicalexamination?.msk?.activerangeexternalrotationhipr} />
                                            <PreviewCard title="active range external rotation shoulder l" value={item.encounter.physicalexamination?.msk?.activerangeexternalrotationshoulderl} />
                                            <PreviewCard title="active range external rotation shoulder r" value={item.encounter.physicalexamination?.msk?.activerangeexternalrotationshoulderr} />
                                            <PreviewCard title="active range flexion elbow l" value={item.encounter.physicalexamination?.msk?.activerangeflexionelbowl} />
                                            <PreviewCard title="active range flexion elbow r" value={item.encounter.physicalexamination?.msk?.activerangeflexionelbowr} />
                                            <PreviewCard title="active range flexion hip l" value={item.encounter.physicalexamination?.msk?.activerangeflexionhipl} />
                                            <PreviewCard title="active range flexion hip r" value={item.encounter.physicalexamination?.msk?.activerangeflexionhipr} />
                                            <PreviewCard title="active range flexion knee l" value={item.encounter.physicalexamination?.msk?.activerangeflexionkneel} />
                                            <PreviewCard title="active range flexion knee r" value={item.encounter.physicalexamination?.msk?.activerangeflexionkneer} />
                                            <PreviewCard title="active range flexion shoulder l" value={item.encounter.physicalexamination?.msk?.activerangeflexionshoulderl} />
                                            <PreviewCard title="active range flexion shoulder r" value={item.encounter.physicalexamination?.msk?.activerangeflexionshoulderr} />
                                            <PreviewCard title="active range internal rotation hip l" value={item.encounter.physicalexamination?.msk?.activerangeinternalrotationhipl} />
                                            <PreviewCard title="active range internal rotation hip r" value={item.encounter.physicalexamination?.msk?.activerangeinternalrotationhipr} />
                                            <PreviewCard title="active range internal rotation shoulder l" value={item.encounter.physicalexamination?.msk?.activerangeinternalrotationshoulderl} />
                                            <PreviewCard title="babin skis reflex" value={item.encounter.physicalexamination?.msk?.babinskisreflex} />
                                            <PreviewCard title="dtr achilles" value={item.encounter.physicalexamination?.msk?.dtrachilles} />
                                            <PreviewCard title="dtr biceps" value={item.encounter.physicalexamination?.msk?.dtrbiceps} />
                                            <PreviewCard title="dtr brachioradialis" value={item.encounter.physicalexamination?.msk?.dtrbrachioradialis} />
                                            <PreviewCard title="dtr patellar" value={item.encounter.physicalexamination?.msk?.dtrpatellar} />
                                            <PreviewCard title="dtr triceps" value={item.encounter.physicalexamination?.msk?.dtrtriceps} />
                                            <PreviewCard title="involuntary movements" value={item.encounter.physicalexamination?.msk?.involuntarymovements} />
                                            <PreviewCard title="msk remark" value={item.encounter.physicalexamination?.msk?.mskremark} />
                                            <PreviewCard title="muscle strength" value={item.encounter.physicalexamination?.msk?.musclestrength} />
                                            <PreviewCard title="muscle tone" value={item.encounter.physicalexamination?.msk?.muscletone} />
                                            <PreviewCard title="musculo skeletal assessment impression" value={item.encounter.physicalexamination?.msk?.musculoskeletalassessmentimpression} />
                                            <PreviewCard title="oculocephalic" value={item.encounter.physicalexamination?.msk?.oculocephalic} />
                                            <PreviewCard title="paralysistype" value={item.encounter.physicalexamination?.msk?.paralysistype} />
                                            <PreviewCard title="paresthesiatype" value={item.encounter.physicalexamination?.msk?.paresthesiatype} />
                                            <PreviewCard title="passive range abduction hip l" value={item.encounter.physicalexamination?.msk?.passiverangeabductionhipl} />
                                            <PreviewCard title="passive range abduction hip r" value={item.encounter.physicalexamination?.msk?.passiverangeabductionhipr} />
                                            <PreviewCard title="passive range abduction shoulder l" value={item.encounter.physicalexamination?.msk?.passiverangeabductionshoulderl} />
                                            <PreviewCard title="passive range abduction shoulder r" value={item.encounter.physicalexamination?.msk?.passiverangeabductionshoulderr} />
                                            <PreviewCard title="passive range adduction hip l" value={item.encounter.physicalexamination?.msk?.passiverangeadductionhipl} />
                                            <PreviewCard title="passive range adduction hip r" value={item.encounter.physicalexamination?.msk?.passiverangeadductionhipr} />
                                            <PreviewCard title="passive range adduction shoulder l" value={item.encounter.physicalexamination?.msk?.passiverangeadductionshoulderl} />
                                            <PreviewCard title="passive range adduction shoulder r" value={item.encounter.physicalexamination?.msk?.passiverangeadductionshoulderr} />
                                            <PreviewCard title="passive range extension elbowl" value={item.encounter.physicalexamination?.msk?.passiverangeextensionelbowl} />
                                            <PreviewCard title="passive range extension elbowr" value={item.encounter.physicalexamination?.msk?.passiverangeextensionelbowr} />
                                            <PreviewCard title="passive range extension hipl" value={item.encounter.physicalexamination?.msk?.passiverangeextensionhipl} />
                                            <PreviewCard title="passive range extension hipr" value={item.encounter.physicalexamination?.msk?.passiverangeextensionhipr} />
                                            <PreviewCard title="passive range extension shoulderl" value={item.encounter.physicalexamination?.msk?.passiverangeextensionshoulderl} />
                                            <PreviewCard title="passive range extension shoulderr" value={item.encounter.physicalexamination?.msk?.passiverangeextensionshoulderr} />
                                            <PreviewCard title="passive range external rotation hip l" value={item.encounter.physicalexamination?.msk?.passiverangeexternalrotationhipl} />
                                            <PreviewCard title="passive range external rotation hip r" value={item.encounter.physicalexamination?.msk?.passiverangeexternalrotationhipr} />
                                            <PreviewCard title="passive range external rotation shoulder l" value={item.encounter.physicalexamination?.msk?.passiverangeexternalrotationshoulderl} />
                                            <PreviewCard title="passive range external rotation shoulder r" value={item.encounter.physicalexamination?.msk?.passiverangeexternalrotationshoulderr} />
                                            <PreviewCard title="passive range flexion elbow l" value={item.encounter.physicalexamination?.msk?.passiverangeflexionelbowl} />
                                            <PreviewCard title="passive range flexion hip l" value={item.encounter.physicalexamination?.msk?.passiverangeflexionhipl} />
                                            <PreviewCard title="passive range flexion hip r" value={item.encounter.physicalexamination?.msk?.passiverangeflexionhipr} />
                                            <PreviewCard title="passive range flexion shoulder l" value={item.encounter.physicalexamination?.msk?.passiverangeflexionshoulderl} />
                                            <PreviewCard title="passive range flexion shoulder r" value={item.encounter.physicalexamination?.msk?.passiverangeflexionshoulderr} />
                                            <PreviewCard title="passive range internal rotation hip l" value={item.encounter.physicalexamination?.msk?.passiverangeinternalrotationhipl} />
                                            <PreviewCard title="passive range internal rotation hipr" value={item.encounter.physicalexamination?.msk?.passiverangeinternalrotationhipr} />
                                            <PreviewCard title="passive range internal rotation shoulderl" value={item.encounter.physicalexamination?.msk?.passiverangeinternalrotationshoulderl} />
                                            <PreviewCard title="passive range internal rotation shoulderr" value={item.encounter.physicalexamination?.msk?.passiverangeinternalrotationshoulderr} />
                                            <PreviewCard title="physiologic finding" value={item.encounter.physicalexamination?.msk?.physiologicfinding} />

                                        </SimpleGrid>
                                    </Box>
                                )
                            }

                            {
                                item.status === "inprogress" && (

                                    <Button mt="32px" onClick={()=>nav(`/dashboard/doctor-encounter/${item._id}`)}>Complete Encounter</Button>
                                )
                            }

                        </Box>
                    ))
                }

            </Box>

            <ExamineModal isOpen={isOpen} oldPayload={OldPayload} onClose={onClose} type={ModalState} activateNotifications={activateNotifications} />
            <ExamineDetails isOpen={OpenView} oldPayload={OldPayload} onClose={() => setOpenView(false)} type={ModalState} activateNotifications={activateNotifications} />
            <LabRequestModal isOpen={OpenModal} oldPayload={OldPayload} onClose={() => setOpenModal(false)} type={ModalState} activateNotifications={activateNotifications} />

            <Pagination postPerPage={PostPerPage} currentPage={CurrentPage} totalPosts={Data.length} paginate={paginate} />


        </Box>
    )
}
