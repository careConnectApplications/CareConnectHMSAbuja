import React, { useState, useEffect } from "react";
import { Text, Flex, HStack, Box, useDisclosure } from "@chakra-ui/react";
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    TableContainer,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
} from "@chakra-ui/react";
import TableRow from "../Components/TableRow";
import Input from "../Components/Input";
import Button from "../Components/Button";
import ShowToast from "../Components/ToastNotification";
import { IoFilter } from "react-icons/io5";
import { BiSearch } from "react-icons/bi";
import { SlPlus } from "react-icons/sl";
import { GetAllSingleHistopathologyHistoryApi } from "../Utils/ApiCalls";
import Pagination from "../Components/Pagination";
import CreateHistopathologyModal from "../Components/CreateHistopathologyModal";
import CreateHistopathologyResult from "../Components/CreateHistopathologyResult";

import { configuration } from "../Utils/Helpers";
import Preloader from "../Components/Preloader";
import moment from "moment";
 


export default function SingleHistopathology() {
    const [IsLoading, setIsLoading] = useState(true);
    const [OpenHistopathologyModal, setOpenHistopathologyModal] = useState(false);
    const [All, setAll] = useState(true);
    const [PendingPayment, setPendingPayment] = useState(false);
    const [Scheduled, setScheduled] = useState(true);
    const [Processed, setProcessed] = useState(false);
    const [Data, setData] = useState([]);

    const [FilterData, setFilterData] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [Trigger, setTrigger] = useState(false);

    // Pagination settings to follow
    const [CurrentPage, setCurrentPage] = useState(1);
    const [PostPerPage, setPostPerPage] = useState(configuration.sizePerPage);

    //get current post
    const indexOfLastSra = CurrentPage * PostPerPage;
    const indexOfFirstSra = indexOfLastSra - PostPerPage;
    const PaginatedData = FilterData?.slice(indexOfFirstSra, indexOfLastSra);

    const [OldPayload, setOldPayload] = useState({});

    const {
        isOpen: isConfirmOpen,
        onOpen: onConfirmOpen,
        onClose: onConfirmClose,
    } = useDisclosure();

    //change page
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Pagination settings to follow end here

    // Search Filter settings to follow
    const [SearchInput, setSearchInput] = useState("");

    const [FilteredData, setFilteredData] = useState(null);

    const filterBy = (title) => {
        if (title === "appointmentId") {
            let filter = Data.filter((item) =>
                item.appointmentid?.toLowerCase().includes(SearchInput.toLowerCase())
            );
            setFilteredData(filter);
        } else if (title === "testName") {
            let filter = Data.filter((item) =>
                item.testname?.toLowerCase().includes(SearchInput.toLowerCase())
            );
            setFilteredData(filter);
        } else if (title === "testId") {
            let filter = Data.filter(
                (item) =>
                    item.testid?.toLowerCase().includes(SearchInput.toLowerCase()) ||
                    item.lastName?.toLowerCase().includes(SearchInput.toLowerCase())
            );
            setFilteredData(filter);
        }
    };

    // Search Filter settings to follow end here

    let id = localStorage.getItem("patientId");

    const [showToast, setShowToast] = useState({
        show: false,
        message: "",
        status: "",
    });

    const getAllHistopathologyHistory = async () => {
        setIsLoading(true);
        try {
            const result = await GetAllSingleHistopathologyHistoryApi(id);

            console.log("getAllHistopathologyHistory", result);
           
            setFilterData(result.data.filter((item) => item.testPaymentStatus === "scheduled"))
            setData(result.data.filter((item) => item.testPaymentStatus === "scheduled"))
            setIsLoading(false);

        } catch (e) {
            setIsLoading(false);
            activateNotifications(e.message, "error");
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
        }, 7000);
    };


    const filterScheduled = () => {
        setAll(false);
        setPendingPayment(false);
        setScheduled(true);
        setProcessed(false);

        const filterData = Data.filter((item) => item.testPaymentStatus === "scheduled");

        setFilterData(filterData);
    };
    const filterProcessed = () => {
        setAll(false);
        setPendingPayment(false);
        setScheduled(false);
        setProcessed(true);

        const filterData = Data.filter((item) => item.testPaymentStatus === "processed");

        setFilterData(filterData);
    };

    const ProcessLab = (item) => {
        setOldPayload(item);
        onOpen();
    };

    // confirmLab opens the ConfirmLabOrderModal for items with "awaiting confirmation" status.
    const confirmLab = (item) => {
        console.log("confirmLab called with item:", item);
        setOldPayload(item);
        onConfirmOpen();
    };

    useEffect(() => {
        getAllHistopathologyHistory();
       
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
            {IsLoading && <Preloader />}

            {showToast.show && (
                <ShowToast message={showToast.message} status={showToast.status} />
            )}
            {/* filter section  */}
            <Flex justifyContent="space-between" flexWrap="wrap">
                 <Flex
                justifyContent="space-between"
                flexWrap="wrap"
                mt={["10px", "10px", "10px", "10px"]}
                w={["100%", "100%", "50%", "37%"]}
            >
                <Button
                    rightIcon={<SlPlus />}
                    w={["100%", "100%", "144px", "144px"]}
                    onClick={() => setOpenHistopathologyModal(true)}
                >
                    Place Order
                </Button>
            </Flex>

                <Flex
                    flexWrap="wrap"
                    mt={["10px", "10px", "0px", "0px"]}
                    alignItems="center"
                    justifyContent={"flex-end"}
                >
                    <HStack>
                        <Input
                            label="Search"
                            onChange={(e) => setSearchInput(e.target.value)}
                            value={SearchInput}
                            bColor="#E4E4E4"
                            leftIcon={<BiSearch />}
                        />

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
                            <MenuList>
                                <MenuItem
                                    onClick={() => filterBy("appointmentId")}
                                    textTransform="capitalize"
                                    fontWeight={"500"}
                                    color="#2F2F2F"
                                    _hover={{
                                        color: "#fff",
                                        fontWeight: "400",
                                        bg: "blue.blue500",
                                    }}
                                >
                                    <HStack fontSize="14px">
                                        <Text>by Appointment ID</Text>
                                    </HStack>
                                </MenuItem>
                                <MenuItem
                                    onClick={() => filterBy("testName")}
                                    textTransform="capitalize"
                                    fontWeight={"500"}
                                    color="#2F2F2F"
                                    _hover={{
                                        color: "#fff",
                                        fontWeight: "400",
                                        bg: "blue.blue500",
                                    }}
                                >
                                    <HStack fontSize="14px">
                                        <Text>by Test Name</Text>
                                    </HStack>
                                </MenuItem>
                                <MenuItem
                                    onClick={() => filterBy("testId")}
                                    textTransform="capitalize"
                                    fontWeight={"500"}
                                    color="#2F2F2F"
                                    _hover={{
                                        color: "#fff",
                                        fontWeight: "400",
                                        bg: "blue.blue500",
                                    }}
                                >
                                    <HStack fontSize="14px">
                                        <Text>by Test ID</Text>
                                    </HStack>
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        setFilteredData(null);
                                        setSearchInput("");
                                    }}
                                    textTransform="capitalize"
                                    fontWeight={"500"}
                                    color="#2F2F2F"
                                    _hover={{
                                        color: "#fff",
                                        fontWeight: "400",
                                        bg: "blue.blue500",
                                    }}
                                >
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
                <Text mb="20px" fontWeight="700" fontSize="16px" color="blue.blue500">
                    Histopathology History
                </Text>
                <TableContainer>
                    <Table variant="striped">
                        <Thead bg="#fff">
                            <Tr>
                                <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                                    Patient name
                                </Th>
                                <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                                    Test Name
                                </Th>
                                <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                                    biopsy Type
                                </Th>
                                <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                                    lmp
                                </Th>
                                <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                                    phone Number
                                </Th>
                                <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                                    previous Biopsy
                                </Th>
                                <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                                    whole Organ
                                </Th>
                                <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                                    Lab Status
                                </Th>
                                <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                                    Payment Status
                                </Th>
                                <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                                    Actions
                                </Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {SearchInput === "" || FilteredData === null ? (
                                PaginatedData.map((item, i) => (
                                    <TableRow
                                        key={i}
                                        type="histopatholgy-process"
                                        name={`${item.patient?.firstName} ${item.patient?.lastName}`}
                                        testName={item.testName}
                                        biopsyType={item.diagnosisForm?.biopsyType}
                                        mrn={item.patient?.mrn}
                                        phone={item.diagnosisForm?.phoneNumber}
                                        previousBiopsy={item.diagnosisForm?.previousBiopsy ? "Yes" : "No"}
                                        lmp={moment(item.diagnosisForm?.lmp).format("lll")}
                                        wholeOrgan={item.diagnosisForm?.wholeOrgan}
                                        labStatus={item.testPaymentStatus}
                                        status={item.paymentInfo?.status}
                                        onConfirmClick={() => {
                                            console.log("Confirm action triggered for item:", item);
                                            confirmLab(item);
                                        }}
                                        onClick={() => {
                                            if (
                                                item.status?.trim().toLowerCase() === "awaiting confirmation"
                                            ) {
                                                console.log("Confirm action triggered for item:", item);
                                                confirmLab(item);
                                            } else {
                                                ProcessLab(item);
                                            }
                                        }}
                                    />
                                ))
                            ) : SearchInput !== "" && FilteredData?.length > 0 ? (
                                FilteredData.map((item, i) => (
                                    <TableRow
                                        key={i}
                                        type="histopatholgy-process"
                                        name={`${item.patient?.firstName} ${item.patient?.lastName}`}
                                        testName={item.testName}
                                        biopsyType={item.diagnosisForm?.biopsyType}
                                        mrn={item.patient?.mrn}
                                        phone={item.diagnosisForm?.phoneNumber}
                                        previousBiopsy={item.diagnosisForm?.previousBiopsy ? "Yes" : "No"}
                                        lmp={moment(item.diagnosisForm?.lmp).format("lll")}
                                        wholeOrgan={item.diagnosisForm?.wholeOrgan}
                                        labStatus={item.testPaymentStatus}
                                        status={item.paymentInfo?.status}
                                        onConfirmClick={() => {
                                            console.log("Confirm action triggered for item:", item);
                                            confirmLab(item);
                                        }}
                                        onClick={() => {
                                            if (
                                                item.status?.trim().toLowerCase() === "awaiting confirmation"
                                            ) {
                                                console.log("Confirm action triggered for item:", item);
                                                confirmLab(item);
                                            } else {
                                                ProcessLab(item);
                                            }
                                        }}
                                    />
                                ))
                            ) : (
                                <Text textAlign={"center"} mt="32px" color="black">
                                    *--No record found--*
                                </Text>
                            )}
                        </Tbody>
                    </Table>
                </TableContainer>

                <CreateHistopathologyModal
                    isOpen={OpenHistopathologyModal}
                    oldPayload={{ _id: id, appointmentid: id }}
                    onClose={() => setOpenHistopathologyModal(false)}
                    activateNotifications={activateNotifications}
                    onSuccess={getAllHistopathologyHistory}
                />

                <CreateHistopathologyResult
                        isOpen={isOpen}
                        oldPayload={OldPayload}
                        onClose={onClose}    
                        activateNotifications={activateNotifications}
                      />

                <Pagination
                    postPerPage={PostPerPage}
                    currentPage={CurrentPage}
                    totalPosts={Data.length}
                    paginate={paginate}
                />
            </Box>
        </Box>
    );
}
