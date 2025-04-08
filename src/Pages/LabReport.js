import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MainLayout from "../Layouts/Index";
import { Text, Flex, HStack, Box, useDisclosure } from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, TableContainer, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import TableRow from "../Components/TableRow";
import Input from "../Components/Input";
import ShowToast from "../Components/ToastNotification";
import { BiSearch } from "react-icons/bi";
import { IoFilter } from "react-icons/io5";
import moment from "moment";
import Seo from "../Utils/Seo";
import CreateTestOrderModal from "../Components/CreateTestOrderModal";
import { GetAllLabReportApi } from "../Utils/ApiCalls";
import Pagination from "../Components/Pagination";
import { configuration } from '../Utils/Helpers'
import Preloader from "../Components/Preloader";



export default function LabReport() {
    const [IsLoading, setIsLoading] = useState(true);
    const [All, setAll] = useState(true);
    const [TodayQueue, setTodayQueue] = useState(false);
    const [Trigger, setTrigger] = useState(false);

    const [Data, setData] = useState([]);
    const [QueueData, setQueueData] = useState([]);

    const [FilterData, setFilterData] = useState(Data);
    const [ModalState, setModalState] = useState("");
    const [OldPayload, setOldPayload] = useState({});
    const { isOpen, onOpen, onClose } = useDisclosure();
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

        } else if (title === "name") {
            let filter = Data.filter(item => item.firstName?.toLowerCase().includes(SearchInput.toLowerCase()) || item.lastName?.toLowerCase().includes(SearchInput.toLowerCase()))
            setFilteredData(filter)

        } else if (title === "mrn") {
            let filter = Data.filter(item => item.MRN?.toLowerCase().includes(SearchInput.toLowerCase()))
            setFilteredData(filter)

        }


    }

    // Search Filter settings to follow end here

    const [showToast, setShowToast] = useState({
        show: false,
        message: "",
        status: "",
    });


    const nav = useNavigate();


    const filterAll = () => {
        setAll(true);
        setTodayQueue(false);
        setFilterData(Data);
    };

    const filterTodayQueue = () => {
        setAll(false);
        setTodayQueue(true);
        setFilterData(QueueData);
    };

    const getAllLabReport = async () => {
        setIsLoading(true)
        try {
            const result = await GetAllLabReportApi();
            console.log("getAllLabReport", result)
            if (result.status === true) {
                setIsLoading(false)
                setData(result.queryresult);
                setFilterData(result.queryresult);
            }
        } catch (e) {
            console.error(e.message);
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

        }, 3000)
    }

    const { pathname } = useLocation()

    const ViewLabResult = (id) => {
        nav(`/dashboard/lab-process/report/${id}`)
        localStorage.setItem("pathname", pathname)
    }

    useEffect(() => {
        getAllLabReport();

    }, [isOpen, Trigger]);




    return (
        <MainLayout>
         {
                IsLoading && (
                    <Preloader />
                )
            }
            <Seo title="Lab Report" description="Care connect Manage Lab Report" />

            {showToast.show && (
                <ShowToast message={showToast.message} status={showToast.status} />
            )}
            <HStack>
                <Text color="#1F2937" fontWeight="600" fontSize="19px">
                    Lab Report
                </Text>
                <Text color="#667085" fontWeight="400" fontSize="18px">
                    ({Data?.length})
                </Text>
            </HStack>
            <Text color="#686C75" mt="9px" fontWeight="400" fontSize="15px">
                Create a new test order for a patient.
            </Text>

            <Box
                bg="#fff"
                border="1px solid #EFEFEF"
                mt="12px"
                py="17px"
                px={["18px", "18px"]}
                rounded="10px"
            >
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
                                All
                                <Box color="#667085" as="span" fontWeight="400" fontSize="13px">
                                    ({Data?.length})
                                </Box>
                            </Text>
                        </Box>


                    </Flex>

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

                                    <MenuItem onClick={() => filterBy("name")} textTransform="capitalize" fontWeight={"500"} color='#2F2F2F' _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}>
                                        <HStack fontSize="14px">

                                            <Text>by Patient Name</Text>
                                        </HStack>
                                    </MenuItem>
                                    <MenuItem onClick={() => filterBy("mrn")} textTransform="capitalize" fontWeight={"500"} color='#2F2F2F' _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}>
                                        <HStack fontSize="14px">

                                            <Text>by MRN</Text>
                                        </HStack>
                                    </MenuItem>
                                    <MenuItem onClick={() => filterBy("appointmentId")} textTransform="capitalize" fontWeight={"500"} color='#2F2F2F' _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}>
                                        <HStack fontSize="14px">

                                            <Text>by Appointment ID</Text>
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
                </Flex>


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
                    <TableContainer>
                        <Table variant="striped">
                            <Thead bg="#fff">
                                <Tr>
                                    <Th
                                        fontSize="13px"
                                        textTransform="capitalize"
                                        color="#534D59"
                                        fontWeight="600"
                                    >
                                        Patient name
                                    </Th>
                                    <Th
                                        fontSize="13px"
                                        textTransform="capitalize"
                                        color="#534D59"
                                        fontWeight="600"
                                    >
                                        appointment ID
                                    </Th>
                                    <Th
                                        fontSize="13px"
                                        textTransform="capitalize"
                                        color="#534D59"
                                        fontWeight="600"
                                    >
                                        Created At
                                    </Th>
                                    <Th
                                        fontSize="13px"
                                        textTransform="capitalize"
                                        color="#534D59"
                                        fontWeight="600"
                                    >
                                        Phone number
                                    </Th>


                                    <Th
                                        fontSize="13px"
                                        textTransform="capitalize"
                                        color="#534D59"
                                        fontWeight="600"
                                    >
                                        Actions
                                    </Th>
                                </Tr>
                            </Thead>
                            <Tbody>


                             
                                {
                                    SearchInput === "" || FilteredData === null ? (
                                        PaginatedData?.map((item, i) => (
                                            <TableRow
                                                key={i}
                                                type="lab-report"
                                                name={`${item.firstName} ${item.lastName}`}
                                                mrn={item.MRN}
                                                appointmentId={item.appointmentid}
                                                phone={item.phoneNumber}
                                                date={moment(item.createdAt).format("lll")}
                                                labStatus={item.status}
                                                onClick={() => ViewLabResult(item._id)}


                                            />
                                        ))
                                    ) : (

                                        SearchInput !== "" && FilteredData?.length > 0 ? (
                                            FilteredData?.map((item, i) => (
                                                <TableRow
                                                    key={i}
                                                    type="lab-report"
                                                    name={`${item.firstName} ${item.lastName}`}
                                                    mrn={item.MRN}
                                                    appointmentId={item.appointmentid}
                                                    phone={item.phoneNumber}
                                                    date={moment(item.appointmentdate).format("lll")}
                                                    labStatus={item.status}
                                                    onClick={() => ViewLabResult(item._id)}


                                                />
                                            ))
                                        ) : (

                                            <Text textAlign={"center"} mt="32px" color="black">*--No record found--*</Text>
                                        )

                                    )


                                }


                            </Tbody>
                        </Table>
                    </TableContainer>

                    <Pagination postPerPage={PostPerPage} currentPage={CurrentPage} totalPosts={Data.length} paginate={paginate} />
                </Box>

                <CreateTestOrderModal isOpen={isOpen} oldPayload={OldPayload} onClose={onClose} type={ModalState} activateNotifications={activateNotifications} />

            </Box>

        </MainLayout>
    );
}
