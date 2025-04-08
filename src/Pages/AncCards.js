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
import { GetPreviousANCApi } from "../Utils/ApiCalls";
import Pagination from "../Components/Pagination";
import { configuration } from '../Utils/Helpers'
import Preloader from "../Components/Preloader";
import { SlPlus } from "react-icons/sl";
import { useNavigate, useLocation } from 'react-router-dom';
import { FaClock } from "react-icons/fa";
import { BsCalendar2DateFill } from "react-icons/bs";


export default function AncCards({ hide = false }) {
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




    const [showToast, setShowToast] = useState({
        show: false,
        message: "",
        status: "",
    });


    const GetSingleANCHistory = async () => {
        setIsLoading(true)
        try {
            const result = await GetPreviousANCApi(id);

            console.log("getAllPreviousANC", result);

            if (result.status === true) {
                setIsLoading(false)
                setFilterData(result.queryresult.ancdetails)
                setData(result.queryresult.ancdetails)


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

    const AddNewANC = () => {


        nav(`/dashboard/add-new-anc/${id}`)
        localStorage.setItem("pathname", pathname)


    }

    const AncFollowUp = (id) => {


        nav(`/dashboard/anc-follow-up/${id}`)
        localStorage.setItem("pathname", pathname)


    }




    useEffect(() => {

        GetSingleANCHistory();




    }, [isOpen, Trigger]);

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
                            onClick={AddNewANC}
                            rightIcon={<SlPlus />}
                        >
                            Add New ANC
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

                <Text mb="20px" fontWeight="700" fontSize="16px" color="blue.blue500">Previous ANC </Text>
                {
                    FilterData.map((item, i) => (
                        <Box key={i} mt="20px">
                            <HStack bg="orange.orange500" py="10px" px="10px" rounded="10px" color="blue.blue500" justifyContent="space-between" fontStyle="italic" fontSize="14px" fontWeight="500">
                                <HStack>

                                    <Box color="blue.blue500"><BsCalendar2DateFill /></Box>
                                    <Text textAlign="center">{moment(item.createdAt).format("L")} </Text>
                                    <Box color="blue.blue500"><FaClock /></Box>
                                    <Text textAlign="center"> {moment(item.createdAt).format("LT")} </Text>
                                </HStack>

                                {/* <Text textAlign="center"> {item.appointmenttype} </Text> */}
                            </HStack>
                            {/* {
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
                            } */}

                            {
                                item.pregnancysummary && (
                                    <Box>

                                        <Text fontSize="15px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">pregnancy summary</Text>
                                        <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                            <PreviewCard title="currentmedication" value={item.currentmedication} />
                                            <PreviewCard title="allergies" value={item.allergies} />
                                            <PreviewCard title="lmp" value={moment(item.pregnancysummary.lmp).format("ll")} />
                                            <PreviewCard title="cycle" value={item.pregnancysummary.cycle} />
                                            <PreviewCard title="edd" value={moment(item.pregnancysummary.edd).format("ll")} />
                                            <PreviewCard title="gravida" value={item.pregnancysummary.gravida} />
                                            <PreviewCard title="term" value={item.pregnancysummary.term} />
                                            <PreviewCard title="preterm" value={item.pregnancysummary.preterm} />
                                            <PreviewCard title="abortions" value={item.pregnancysummary.abortions} />
                                            <PreviewCard title="ectopic" value={item.pregnancysummary.ectopic} />
                                            <PreviewCard title="stillbirths" value={item.pregnancysummary.stillbirths} />
                                            <PreviewCard title="noliving" value={item.pregnancysummary.noliving} />
                                        </SimpleGrid>
                                    </Box>
                                )
                            }
                            {
                                item.obstetrichistory && (

                                    item.obstetrichistory?.map((item, i) => (
                                        <Box>

                                            <Text fontSize="15px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">Obstetric History {i + 1}</Text>
                                            <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                                <PreviewCard title="year" value={moment(item.year).format("ll")} />
                                                <PreviewCard title="sex of child" value={item.sexofchild} />
                                                <PreviewCard title="gestage" value={item.gestage} />
                                                <PreviewCard title="birth weight" value={item.birthweight} />
                                                <PreviewCard title="length of labour" value={item.lengthoflabour} />
                                                <PreviewCard title="place of birth" value={item.placeofbirth} />
                                                <PreviewCard title="type of birth" value={item.typeofbirth} />
                                                <PreviewCard title="comment" value={item.comment} />
                                            </SimpleGrid>
                                        </Box>
                                    ))


                                )
                            }

                            {
                                item.medicalobsterichistory && (
                                    <Box>

                                        <Text fontSize="15px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">Medical Obstetric History</Text>
                                        <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                            <PreviewCard title="previous still birth or new born loss" value={item.medicalobsterichistory?.previousstillbirthornewbornloss ? "true" : "false"} />
                                            <PreviewCard title="history of three or more consecutive spontaneous abortions" value={item.medicalobsterichistory?.historyofthreeormoreconsecutivespontaneousabortions ? "true" : "false"} />
                                            <PreviewCard title="birth weight of last baby less than 450" value={item.medicalobsterichistory?.birthweightoflastbabylessthan450 ? "true" : "false"} />
                                            <PreviewCard title="birth weight of last baby greater than 450" value={item.medicalobsterichistory?.birthweightoflastbabygreaterthan450 ? "true" : "false"} />
                                            <PreviewCard title="last pregnancy hospital admission for peteclampsia" value={item.medicalobsterichistory?.lastpregnancyhospitaladmissionforpeteclampsia ? "true" : "false"} />
                                            <PreviewCard title="previous surgery on reproductive tract" value={item.medicalobsterichistory?.previoussurgeryonreproductivetract ? "true" : "false"} />


                                        </SimpleGrid>
                                    </Box>
                                )
                            }
                            {
                                item.currenthistory && (
                                    <Box>

                                        <Text fontSize="15px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">Current History</Text>
                                        <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                            <PreviewCard title="diagnosed suspected multiple prenancy" value={item.currenthistory?.diagnosedsuspectedmultipleprenancy ? "true" : "false"} />
                                            <PreviewCard title="ageless than 16" value={item.currenthistory?.agelessthan16 ? "true" : "false"} />
                                            <PreviewCard title="age more than 40" value={item.currenthistory?.agemorethan40 ? "true" : "false"} />
                                            <PreviewCard title="rhesus negative" value={item.currenthistory?.rhesusnegative ? "true" : "false"} />
                                            <PreviewCard title="vaginal bleeding" value={item.currenthistory?.vaginalbleeding ? "true" : "false"} />
                                            <PreviewCard title="pelvic mass" value={item.currenthistory?.pelvicmass ? "true" : "false"} />
                                            <PreviewCard title="diastolic bp greater than 90" value={item.currenthistory?.diastolicbpgreaterthan90 ? "true" : "false"} />

                                        </SimpleGrid>
                                    </Box>
                                )
                            }
                            {
                                item.generalmedicalhistory && (
                                    <Box>

                                        <Text fontSize="15px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">general medical History</Text>
                                        <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                            <PreviewCard title="diabetes mellitus" value={item.generalmedicalhistory?.diabetesmellitus ? "true" : "false"} />
                                            <PreviewCard title="renal disease" value={item.generalmedicalhistory?.renaldisease ? "true" : "false"} />
                                            <PreviewCard title="cardiac disease" value={item.generalmedicalhistory?.cardiacdisease ? "true" : "false"} />
                                            <PreviewCard title="sickle cell disease" value={item.generalmedicalhistory?.sicklecelldisease ? "true" : "false"} />
                                            <PreviewCard title="hiv positive" value={item.generalmedicalhistory?.hivpositive ? "true" : "false"} />
                                            <PreviewCard title="any other severe medical disease or condition specify" value={item.generalmedicalhistory?.anyotherseveremedicaldeseaseorconditionspecify} />

                                        </SimpleGrid>
                                    </Box>
                                )
                            }
                            {
                                item.physicalexamination && (
                                    <Box>

                                        <Text fontSize="15px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">physical examination</Text>
                                        <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                            <PreviewCard title="weight" value={item.physicalexamination?.weight} />
                                            <PreviewCard title="blood pressure" value={item.physicalexamination?.bloodpressure} />
                                            <PreviewCard title="pulse" value={item.physicalexamination?.pulse} />
                                            <PreviewCard title="head teeth eyes nose throat" value={item.physicalexamination?.headteetheyesnosethroat ? "true" : "false"} />
                                            <PreviewCard title="thyroid" value={item.physicalexamination?.thyroid ? "true" : "false"} />
                                            <PreviewCard title="chest" value={item.physicalexamination?.chest ? "true" : "false"} />
                                            <PreviewCard title="breasts" value={item.physicalexamination?.breasts ? "true" : "false"} />
                                            <PreviewCard title="cardiovascular" value={item.physicalexamination?.weight ? "true" : "false"} />
                                            <PreviewCard title="abdomen" value={item.physicalexamination?.abdomen ? "true" : "false"} />
                                            <PreviewCard title="varicose veins" value={item.physicalexamination?.varicoseveins ? "true" : "false"} />
                                            <PreviewCard title="neurological exam" value={item.physicalexamination?.neurologicalexam ? "true" : "false"} />
                                            <PreviewCard title="external genitalia" value={item.physicalexamination?.externalgenitalia ? "true" : "false"} />
                                            <PreviewCard title="cervix vigina" value={item.physicalexamination?.cervixvigina ? "true" : "false"} />
                                            <PreviewCard title="uterus" value={item.physicalexamination?.uterus ? "true" : "false"} />
                                            <PreviewCard title="adnexa" value={item.physicalexamination?.adnexa ? "true" : "false"} />
                                            <PreviewCard title="anything abnormal" value={item.physicalexamination?.anythingabnormal} />
                                            <PreviewCard title="additional comment" value={item.physicalexamination?.additionalcomment} />
                                        </SimpleGrid>
                                    </Box>
                                )
                            }
                            {
                                item.laboratory && (
                                    <Box>

                                        <Text fontSize="15px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">laboratory</Text>
                                        <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                            <PreviewCard title="haemoglobin/haematocrit" value={item.laboratory?.haemoglobinhaematocrit} />
                                            <PreviewCard title="urinalysis protein sugar" value={item.laboratory?.urinalysisprotientsugar} />
                                            <PreviewCard title="VDRL or RPR of syphilis" value={item.laboratory?.vdrlorrprotientsugar} />
                                            <PreviewCard title="blood group and rhesus status" value={item.laboratory?.boodgroupandrhesusstatus} />
                                            <PreviewCard title="hivtest" value={item.laboratory?.hivtest} />
                                            <PreviewCard title="urinnemicroscopic" value={item.laboratory?.urinnemicroscopic} />
                                            <PreviewCard title="haemoglobin" value={item.laboratory?.haemoglobin} />
                                        </SimpleGrid>
                                    </Box>
                                )
                            }
                            {
                                item.healtheducationtopicscovered && (
                                    <Box>

                                        <Text fontSize="15px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">health education topics covered</Text>
                                        <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                            <PreviewCard title="nutrition" value={item.healtheducationtopicscovered?.nutrition} />
                                            <PreviewCard title="rest and exercise" value={item.healtheducationtopicscovered?.restandexercise} />
                                            <PreviewCard title="malaria in pregnancy" value={item.healtheducationtopicscovered?.malariainpregnancy} />
                                            <PreviewCard title="safer sex in pregnancy" value={item.healtheducationtopicscovered?.safersexinpregnancy} />
                                            <PreviewCard title="vct for prevention of mother to child transmission of hiv" value={item.healtheducationtopicscovered?.vctforpreventionofmotertochildtrnsmissionofhiv} />
                                            <PreviewCard title="birth and emergency readness planning" value={item.healtheducationtopicscovered?.birthandemergencyreadnessplanning} />
                                            <PreviewCard title="alcohol tobacoo or other drugs used" value={item.healtheducationtopicscovered?.alcohotobaccoorotherdrugsysed} />
                                            <PreviewCard title="famil planning birth spacing" value={item.healtheducationtopicscovered?.familyplanningbirthspacing} />
                                            <PreviewCard title="infant feeding options" value={item.healtheducationtopicscovered?.infantfeedingoptions} />
                                        </SimpleGrid>
                                    </Box>
                                )
                            }
                            {
                                item.tetanustoxod && (
                                    <Box>

                                        <Text fontSize="15px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">tetanus given</Text>
                                        <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                            <PreviewCard title="tetanus first dose" value={item.tetanustoxod?.tetanusfirstdose ? "true" : "false"} />
                                            <PreviewCard title="tetanus first dosedate" value={moment(item.tetanustoxod?.tetanusfirstdosedate).format("ll")} />
                                            <PreviewCard title="tetanus second dose" value={item.tetanustoxod?.tetanusseconddose ? "true" : "false"} />
                                            <PreviewCard title="tetatus seond dosedate" value={moment(item.tetanustoxod?.tetatusseonddosedate).format("ll")} />
                                            <PreviewCard title="tetanus third dose" value={item.tetanustoxod?.tetanusthirddose ? "true" : "false"} />
                                            <PreviewCard title="tetanus third dosedate" value={moment(item.tetanustoxod?.tetanusthirddosedate).format("ll")} />
                                            <PreviewCard title="tetatus fourth dose" value={item.tetanustoxod?.tetatusfourthdose ? "true" : "false"} />
                                            <PreviewCard title="tetanus fourth dosedate" value={moment(item.tetanustoxod?.tetanusfourthdosedate).format("ll")} />
                                            <PreviewCard title="tetanus fifth dose" value={item.tetanustoxod?.tetanusfifthdose ? "true" : "false"} />
                                            <PreviewCard title="tetanus fifth dose date" value={moment(item.tetanustoxod?.tetanusfifthdosedate).format("ll")} />
                                        </SimpleGrid>
                                    </Box>
                                )
                            }
                            {
                                item.ipt && (
                                    <Box>

                                        <Text fontSize="15px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">IPT given</Text>
                                        <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                            <PreviewCard title="Ipt first dose" value={item.ipt?.iptfirstdose ? "true" : "false"} />
                                            <PreviewCard title="Ipt first dosedate" value={moment(item.ipt?.iptfirstdosedate).format("ll")} />
                                            <PreviewCard title="Ipt second dose" value={item.ipt?.iptseconddose ? "true" : "false"} />
                                            <PreviewCard title="ipt second dosedate" value={moment(item.ipt?.iptseconddosedate).format("ll")} />
                                            <PreviewCard title="Ipt third dose" value={item.ipt?.iptthirddose ? "true" : "false"} />
                                            <PreviewCard title="Ipt third dosedate" value={moment(item.ipt?.iptthirddosedate).format("ll")} />
                                            <PreviewCard title="ipt fourth dose" value={item.ipt?.iptfourthdose ? "true" : "false"} />
                                            <PreviewCard title="Ipt fourth dosedate" value={moment(item.ipt?.iptfourthdosedate).format("ll")} />
                                            <PreviewCard title="Ipt fifth dose" value={item.ipt?.iptfifthdose ? "true" : "false"} />
                                            <PreviewCard title="Ipt fifth dose date" value={moment(item.ipt?.iptfifthdosedate).format("ll")} />
                                            <PreviewCard title="Ipt sixth dose" value={item.ipt?.iptsixthdose ? "true" : "false"} />
                                            <PreviewCard title="Ipt sixth dose date" value={moment(item.ipt?.iptsixthdosedate).format("ll")} />
                                        </SimpleGrid>
                                    </Box>
                                )
                            }
                            {
                                item.ironfolategiven && (
                                    <Box>

                                        <Text fontSize="15px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">IPT given</Text>
                                        <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                            <PreviewCard title="prescription" value={item.ironfolategiven?.prescription ? "true" : "false"} />
                                            <PreviewCard title="tablets" value={item.ironfolategiven?.tablets ? "true" : "false"} />
                                            <PreviewCard title="iron folate given date" value={moment(item.ironfolategiven?.ironfolategivendate).format("ll")} />
                                        </SimpleGrid>
                                    </Box>
                                )
                            }



                            <Button mt="32px" onClick={()=>AncFollowUp(item._id)}>Follow Up</Button>

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
