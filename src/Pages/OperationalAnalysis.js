import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../Layouts/Index";
import { Text, Flex, HStack, Box, useDisclosure, SimpleGrid, Select } from "@chakra-ui/react";
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
    MenuItem
} from "@chakra-ui/react";
import * as XLSX from 'xlsx/xlsx.mjs';
import TableRow from "../Components/TableRow";
import Button from "../Components/Button";
import Input from "../Components/Input";
import Preloader from "../Components/Preloader";
import ShowToast from "../Components/ToastNotification";
import { FaCloudDownloadAlt, FaCalendarAlt } from "react-icons/fa";
import { IoFilter } from "react-icons/io5";
import { BiSearch } from "react-icons/bi";
import { MdOutlineAnalytics } from "react-icons/md";
import Pagination from "../Components/Pagination";
import { configuration } from "../Utils/Helpers";
import moment from "moment";
import Seo from "../Utils/Seo";
import { useColors } from "../Utils/colors";

export default function OperationalAnalysis() {
    const {
        bgColor,
        textColor,
        borderColor,
        titleTextColor,
        selectTitleTextColor,
        subTitleTextColor,
        primaryColor,
        secondaryColor,
        NavListBg,
    } = useColors();
    const [IsLoading, setIsLoading] = useState(false);
    const [Loading, setLoading] = useState(false);
    const [Data, setData] = useState([]);
    const [FilterData, setFilterData] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();

    // Filter settings
    const [Department, setDepartment] = useState("");
    const [MetricType, setMetricType] = useState("");
    const [StartDate, setStartDate] = useState("");
    const [EndDate, setEndDate] = useState("");

    // Pagination settings
    const [CurrentPage, setCurrentPage] = useState(1);
    const [PostPerPage, setPostPerPage] = useState(configuration.sizePerPage || 10);

    const indexOfLastSra = CurrentPage * PostPerPage;
    const indexOfFirstSra = indexOfLastSra - PostPerPage;
    const PaginatedData = FilterData.slice(indexOfFirstSra, indexOfLastSra);
    
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Search Filter settings
    const [SearchInput, setSearchInput] = useState("");
    const [FilteredData, setFilteredData] = useState(null);

    const handleInputChange = (e) => {
        let filter = Data.filter(
            (item) =>
                item.department?.toLowerCase().includes(e.target.value.toLowerCase()) ||
                item.metric?.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setFilteredData(filter);
        setSearchInput(e.target.value);
    };

    const [showToast, setShowToast] = useState({
        show: false,
        message: "",
        status: "",
    });

    const router = useNavigate();

    const fetchOperationalData = async () => {
        setLoading(true);
        // TODO: Implement API call to fetch operational analytics
        setTimeout(() => {
            setLoading(false);
            setData([]);
            setFilterData([]);
        }, 1000);
    };

    const DownloadFile = () => {
        var workbook = XLSX.utils.book_new();
        var worksheet = XLSX.utils.json_to_sheet(Data);
        XLSX.utils.book_append_sheet(workbook, worksheet);
        let date = moment(Date.now()).format("DD/MM/YYYY");
        XLSX.writeFile(workbook, `${date}_Operational_Analysis.xlsx`);
    };

    useEffect(() => {
        if (FilteredData) {
            setFilterData(FilteredData);
        } else {
            setFilterData(Data);
        }
    }, [FilteredData, Data]);

    return (
        <MainLayout>
            {IsLoading && <Preloader />}
            <Seo title="Operational Analysis" description="Care Connect Operational Analysis" />

            {showToast.show && (
                <ShowToast message={showToast.message} status={showToast.status} />
            )}

            <HStack>
                <Text color={titleTextColor} fontWeight="600" fontSize="18px">
                    Operational Analysis
                </Text>
                <Text color={subTitleTextColor} fontWeight="400" fontSize="16px">
                    ({Data?.length})
                </Text>
            </HStack>
            <Text color={subTitleTextColor} mt="9px" fontWeight="400" fontSize="12px">
                Monitor hospital operations, resource utilization, and performance metrics across all departments.
            </Text>

            {/* Filter Section */}
            <Box
                bg={bgColor}
                border={`1px solid ${borderColor}`}
                mt="12px"
                py="17px"
                px={["18px", "18px"]}
                rounded="10px"
            >
                <SimpleGrid mt="12px" columns={{ base: 2, md: 4 }} spacing={2}>
                    <Box>
                        <Text color={selectTitleTextColor} fontWeight="500" fontSize="14px">Analysis Type</Text>
                        <Select
                            fontSize={MetricType !== "" ? "16px" : "13px"}
                            h="45px"
                            borderWidth="2px"
                            borderColor={borderColor}
                            _hover={{ borderColor: primaryColor }}
                            _focus={{ borderColor: primaryColor }}
                            value={MetricType}
                            onChange={(e) => {
                                setMetricType(e.target.value);
                                setData([]);
                            }}
                            placeholder="Select Analysis Type"
                        >
                            <option value="bed-occupancy">Bed Occupancy Rate</option>
                            <option value="patient-flow">Patient Flow Analysis</option>
                            <option value="staff-utilization">Staff Utilization</option>
                            <option value="equipment">Equipment Utilization</option>
                            <option value="waiting-time">Waiting Time Analysis</option>
                            <option value="discharge">Discharge Analysis</option>
                            <option value="admission">Admission Trends</option>
                        </Select>
                    </Box>

                    <Box>
                        <Text color={selectTitleTextColor} fontWeight="500" fontSize="14px">Department/Unit</Text>
                        <Select
                            fontSize={Department !== "" ? "16px" : "13px"}
                            h="45px"
                            borderWidth="2px"
                            borderColor={borderColor}
                            _hover={{ borderColor: primaryColor }}
                            _focus={{ borderColor: primaryColor }}
                            value={Department}
                            onChange={(e) => {
                                setDepartment(e.target.value);
                                setData([]);
                            }}
                            placeholder="Select Department"
                        >
                            <option value="all">All Departments</option>
                            <option value="emergency">Emergency</option>
                            <option value="outpatient">Outpatient</option>
                            <option value="inpatient">Inpatient</option>
                            <option value="icu">ICU</option>
                            <option value="surgery">Surgery</option>
                            <option value="laboratory">Laboratory</option>
                            <option value="radiology">Radiology</option>
                            <option value="pharmacy">Pharmacy</option>
                        </Select>
                    </Box>

                    <Box>
                        <Text color={selectTitleTextColor} fontWeight="500" fontSize="14px">Start Date</Text>
                        <Input
                            type="date"
                            onChange={(e) => {
                                setStartDate(e.target.value);
                                setData([]);
                            }}
                            value={StartDate}
                            bColor={borderColor}
                            leftIcon={<FaCalendarAlt />}
                        />
                    </Box>

                    <Box>
                        <Text color={selectTitleTextColor} fontWeight="500" fontSize="14px">End Date</Text>
                        <Input
                            type="date"
                            onChange={(e) => {
                                setEndDate(e.target.value);
                                setData([]);
                            }}
                            value={EndDate}
                            bColor={borderColor}
                            leftIcon={<FaCalendarAlt />}
                        />
                    </Box>
                </SimpleGrid>

                <Flex justifyContent="flex-end" mt="2">
                    <Button
                        mt={["10px", "10px", "0px", "0px"]}
                        isLoading={Loading}
                        loadingText="Analyzing..."
                        bg={NavListBg}
                        border={`1px solid ${primaryColor}`}
                        color={primaryColor}
                        w={["100%", "100%", "144px", "144px"]}
                        onClick={fetchOperationalData}
                        disabled={MetricType !== "" && Department !== "" && StartDate !== "" && EndDate !== "" ? false : true}
                    >
                        Generate Analysis
                    </Button>
                </Flex>
            </Box>

            {/* Data Display Section */}
            {Data.length > 0 && (
                <Box
                    bg={bgColor}
                    border={`1px solid ${borderColor}`}
                    mt="12px"
                    py="17px"
                    px={["18px", "18px"]}
                    rounded="10px"
                >
                    <Flex justifyContent="space-between" flexWrap="wrap">
                        <Button
                            rightIcon={<FaCloudDownloadAlt />}
                            w={["100%", "100%", "144px", "144px"]}
                            onClick={DownloadFile}
                        >
                            Download
                        </Button>

                        <Flex
                            flexWrap="wrap"
                            mt={["10px", "10px", "0px", "0px"]}
                            alignItems="center"
                            justifyContent="flex-end"
                        >
                            <HStack>
                                <Input
                                    label="Search"
                                    onChange={handleInputChange}
                                    value={SearchInput}
                                    bColor={borderColor}
                                    leftIcon={<BiSearch />}
                                />

                                <Menu isLazy>
                                    <MenuButton as={Box}>
                                        <HStack
                                            border={`1px solid ${NavListBg}`}
                                            rounded="7px"
                                            cursor="pointer"
                                            py="11.64px"
                                            px="16.98px"
                                            bg={NavListBg}
                                            color={secondaryColor}
                                            fontWeight="500"
                                            fontSize="14px"
                                        >
                                            <Text>Filter</Text>
                                            <IoFilter />
                                        </HStack>
                                    </MenuButton>
                                    <MenuList bg={bgColor} border={`1px solid ${borderColor}`}>
                                        <MenuItem
                                            onClick={() => {
                                                setFilteredData(null);
                                                setSearchInput("");
                                            }}
                                        >
                                            <Text>Clear Filter</Text>
                                        </MenuItem>
                                    </MenuList>
                                </Menu>
                            </HStack>
                        </Flex>
                    </Flex>

                    <Box
                        bg={bgColor}
                        border={`1px solid ${borderColor}`}
                        mt="12px"
                        py="15px"
                        px="15px"
                        rounded="10px"
                        overflowX="auto"
                    >
                        <TableContainer>
                            <Table variant="striped">
                                <Thead>
                                    <Tr>
                                        <Th fontSize="13px" textTransform="capitalize" color={subTitleTextColor} fontWeight="600">
                                            Department
                                        </Th>
                                        <Th fontSize="13px" textTransform="capitalize" color={subTitleTextColor} fontWeight="600">
                                            Metric
                                        </Th>
                                        <Th fontSize="13px" textTransform="capitalize" color={subTitleTextColor} fontWeight="600">
                                            Value
                                        </Th>
                                        <Th fontSize="13px" textTransform="capitalize" color={subTitleTextColor} fontWeight="600">
                                            Target
                                        </Th>
                                        <Th fontSize="13px" textTransform="capitalize" color={subTitleTextColor} fontWeight="600">
                                            Performance
                                        </Th>
                                        <Th fontSize="13px" textTransform="capitalize" color={subTitleTextColor} fontWeight="600">
                                            Date
                                        </Th>
                                        <Th fontSize="13px" textTransform="capitalize" color={subTitleTextColor} fontWeight="600">
                                            Status
                                        </Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {/* Data rows will be mapped here */}
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Box>
            )}
        </MainLayout>
    );
}
