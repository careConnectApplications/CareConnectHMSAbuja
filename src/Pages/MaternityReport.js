import React, { useState, useEffect } from "react";
import {
    Box,
    Flex,
    Button,
    Text,
    Grid,
    GridItem,
    Input,
    Select,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Spinner,
    useToast,
    HStack,
} from "@chakra-ui/react";
import * as XLSX from "xlsx";
import moment from "moment";
import MainLayout from "../Layouts/Index";
import Preloader from "../Components/Preloader";
import Pagination from "../Components/Pagination";
import { configuration } from "../Utils/Helpers";
import { useColors } from "../Utils/colors";

const MaternityReport = () => {
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
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [filterData, setFilterData] = useState([]);
    const [search, setSearch] = useState("");
    const [reportType, setReportType] = useState("");
    const [deliveryType, setDeliveryType] = useState("");
    const [outcome, setOutcome] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = configuration.sizePerPage || 10;
    
    const toast = useToast();

    useEffect(() => {
        fetchMaternityReport();
    }, [reportType, deliveryType, outcome, dateFrom, dateTo]);

    const fetchMaternityReport = async () => {
        setLoading(true);
        // TODO: Implement API call to fetch maternity reports
        // Example: GetMaternityReportApi({ reportType, deliveryType, outcome, dateFrom, dateTo })
        setTimeout(() => {
            setLoading(false);
            // Placeholder data structure
            setData([]);
            setFilterData([]);
        }, 1000);
    };

    const handleSearch = (value) => {
        setSearch(value);
        if (value === "") {
            setFilterData(data);
        } else {
            const filtered = data.filter((item) =>
                Object.values(item).some((val) =>
                    String(val).toLowerCase().includes(value.toLowerCase())
                )
            );
            setFilterData(filtered);
        }
        setCurrentPage(1);
    };

    const exportToExcel = () => {
        if (filterData.length === 0) {
            toast({
                title: "No data to export",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        const worksheet = XLSX.utils.json_to_sheet(filterData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Maternity Report");
        XLSX.writeFile(
            workbook,
            `Maternity_Report_${moment().format("YYYY-MM-DD")}.xlsx`
        );
        
        toast({
            title: "Export successful",
            description: "Maternity report data has been exported to Excel",
            status: "success",
            duration: 3000,
            isClosable: true,
        });
    };

    const resetFilters = () => {
        setReportType("");
        setDeliveryType("");
        setOutcome("");
        setDateFrom("");
        setDateTo("");
        setSearch("");
        fetchMaternityReport();
    };

    const paginatedData = filterData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        setTotalPages(Math.ceil(filterData.length / itemsPerPage));
    }, [filterData, itemsPerPage]);

    return (
        <MainLayout>
            <HStack>
                <Text color={titleTextColor} fontWeight="600" fontSize="18px">
                    Maternity Report
                </Text>
            </HStack>
            <Text color={subTitleTextColor} mt="9px" fontWeight="400" fontSize="12px">
                Monitor and analyze maternity-related data and performance metrics.
            </Text>
            <Box
                bg={bgColor}
                border={`1px solid ${borderColor}`}
                mt="12px"
                py="17px"
                px={["18px", "18px"]}
                rounded="10px"
            >
                <Flex justifyContent="space-between" alignItems="center" mb={6}>
                    <Flex gap={3}>
                        <Button bg={NavListBg} color={primaryColor} onClick={exportToExcel}>
                            Export to Excel
                        </Button>
                        <Button bg={NavListBg} color={primaryColor} onClick={resetFilters}>
                            Reset Filters
                        </Button>
                    </Flex>
                </Flex>

                {/* Filters Section */}
                <Grid templateColumns="repeat(3, 1fr)" gap={4} mb={6}>
                    <GridItem>
                        <Text fontSize="sm" mb={2} fontWeight="medium" color={selectTitleTextColor}>
                            Report Type
                        </Text>
                        <Select
                            placeholder="Select Report Type"
                            borderColor={borderColor}
                            _hover={{ borderColor: primaryColor }}
                            _focus={{ borderColor: primaryColor }}
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                        >
                            <option value="antenatal">Antenatal Care</option>
                            <option value="delivery">Delivery Records</option>
                            <option value="postnatal">Postnatal Care</option>
                            <option value="family-planning">Family Planning</option>
                            <option value="immunization">Immunization</option>
                            <option value="maternal-mortality">Maternal Mortality</option>
                            <option value="neonatal">Neonatal Records</option>
                        </Select>
                    </GridItem>

                    <GridItem>
                        <Text fontSize="sm" mb={2} fontWeight="medium" color={selectTitleTextColor}>
                            Delivery Type
                        </Text>
                        <Select
                            placeholder="All Delivery Types"
                            borderColor={borderColor}
                            _hover={{ borderColor: primaryColor }}
                            _focus={{ borderColor: primaryColor }}
                            value={deliveryType}
                            onChange={(e) => setDeliveryType(e.target.value)}
                        >
                            <option value="normal">Normal Vaginal Delivery</option>
                            <option value="caesarean">Caesarean Section</option>
                            <option value="assisted">Assisted Delivery</option>
                            <option value="breech">Breech Delivery</option>
                            <option value="twins">Multiple Births</option>
                        </Select>
                    </GridItem>

                    <GridItem>
                        <Text fontSize="sm" mb={2} fontWeight="medium" color={selectTitleTextColor}>
                            Outcome
                        </Text>
                        <Select
                            placeholder="All Outcomes"
                            borderColor={borderColor}
                            _hover={{ borderColor: primaryColor }}
                            _focus={{ borderColor: primaryColor }}
                            value={outcome}
                            onChange={(e) => setOutcome(e.target.value)}
                        >
                            <option value="live-birth">Live Birth</option>
                            <option value="stillbirth">Stillbirth</option>
                            <option value="neonatal-death">Neonatal Death</option>
                            <option value="maternal-death">Maternal Death</option>
                            <option value="complications">With Complications</option>
                        </Select>
                    </GridItem>

                    <GridItem>
                        <Text fontSize="sm" mb={2} fontWeight="medium" color={selectTitleTextColor}>
                            Date From
                        </Text>
                        <Input
                            type="date"
                            borderColor={borderColor}
                            _hover={{ borderColor: primaryColor }}
                            _focus={{ borderColor: primaryColor }}
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                        />
                    </GridItem>

                    <GridItem>
                        <Text fontSize="sm" mb={2} fontWeight="medium" color={selectTitleTextColor}>
                            Date To
                        </Text>
                        <Input
                            type="date"
                            borderColor={borderColor}
                            _hover={{ borderColor: primaryColor }}
                            _focus={{ borderColor: primaryColor }}
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                        />
                    </GridItem>

                    <GridItem>
                        <Text fontSize="sm" mb={2} fontWeight="medium" color={selectTitleTextColor}>
                            Search
                        </Text>
                        <Input
                            placeholder="Search maternity records..."
                            borderColor={borderColor}
                            _hover={{ borderColor: primaryColor }}
                            _focus={{ borderColor: primaryColor }}
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </GridItem>
                </Grid>

                {/* Statistics Cards */}
                <Grid templateColumns="repeat(4, 1fr)" gap={4} mb={6}>
                    <Box p={4} bg="pink.50" borderRadius="md" borderLeft="4px solid" borderColor="pink.500">
                        <Text fontSize="sm" color="gray.600">Total Deliveries</Text>
                        <Text fontSize="2xl" fontWeight="bold">0</Text>
                    </Box>
                    <Box p={4} bg="blue.50" borderRadius="md" borderLeft="4px solid" borderColor="blue.500">
                        <Text fontSize="sm" color="gray.600">ANC Visits</Text>
                        <Text fontSize="2xl" fontWeight="bold">0</Text>
                    </Box>
                    <Box p={4} bg="green.50" borderRadius="md" borderLeft="4px solid" borderColor="green.500">
                        <Text fontSize="sm" color="gray.600">Live Births</Text>
                        <Text fontSize="2xl" fontWeight="bold">0</Text>
                    </Box>
                    <Box p={4} bg="purple.50" borderRadius="md" borderLeft="4px solid" borderColor="purple.500">
                        <Text fontSize="sm" color="gray.600">C-Sections</Text>
                        <Text fontSize="2xl" fontWeight="bold">0</Text>
                    </Box>
                </Grid>

                {/* Data Table */}
                <Box
                    bg={bgColor}
                    border={`1px solid ${borderColor}`}
                    mt="12px"
                    py="15px"
                    px="15px"
                    rounded="10px"
                    overflowX="auto"
                >
                    {loading ? (
                        <Flex justifyContent="center" alignItems="center" h="200px">
                            <Spinner size="xl" color={primaryColor} />
                        </Flex>
                    ) : (
                        <>
                            <Table variant="simple">
                                <Thead>
                                    <Tr>
                                        <Th color={subTitleTextColor}>Date</Th>
                                        <Th color={subTitleTextColor}>Patient ID</Th>
                                        <Th color={subTitleTextColor}>Patient Name</Th>
                                        <Th color={subTitleTextColor}>Age</Th>
                                        <Th color={subTitleTextColor}>Gravidity</Th>
                                        <Th color={subTitleTextColor}>Parity</Th>
                                        <Th color={subTitleTextColor}>Service Type</Th>
                                        <Th color={subTitleTextColor}>Delivery Type</Th>
                                        <Th color={subTitleTextColor}>Baby Gender</Th>
                                        <Th color={subTitleTextColor}>Baby Weight</Th>
                                        <Th color={subTitleTextColor}>Outcome</Th>
                                        <Th color={subTitleTextColor}>Complications</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {paginatedData.length > 0 ? (
                                        paginatedData.map((item, index) => (
                                            <Tr key={index}>
                                                <Td>{moment(item.date).format("DD/MM/YYYY")}</Td>
                                                <Td>{item.patientId}</Td>
                                                <Td>{item.patientName}</Td>
                                                <Td>{item.age}</Td>
                                                <Td>{item.gravidity}</Td>
                                                <Td>{item.parity}</Td>
                                                <Td>{item.serviceType}</Td>
                                                <Td>{item.deliveryType}</Td>
                                                <Td>{item.babyGender}</Td>
                                                <Td>{item.babyWeight}</Td>
                                                <Td>
                                                    <Text
                                                        color={
                                                            item.outcome === "Live Birth"
                                                                ? "green.500"
                                                                : "red.500"
                                                        }
                                                    >
                                                        {item.outcome}
                                                    </Text>
                                                </Td>
                                                <Td>{item.complications || "None"}</Td>
                                            </Tr>
                                        ))
                                    ) : (
                                        <Tr>
                                            <Td colSpan={12} textAlign="center">
                                                No maternity data available
                                            </Td>
                                        </Tr>
                                    )}
                                </Tbody>
                            </Table>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <Flex justifyContent="center" alignItems="center" mt={4} gap={2}>
                                    <Button
                                        size="sm"
                                        onClick={() => setCurrentPage(1)}
                                        isDisabled={currentPage === 1}
                                    >
                                        First
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={() => setCurrentPage(currentPage - 1)}
                                        isDisabled={currentPage === 1}
                                    >
                                        Previous
                                    </Button>
                                    <Text fontSize="sm">
                                        Page {currentPage} of {totalPages}
                                    </Text>
                                    <Button
                                        size="sm"
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                        isDisabled={currentPage === totalPages}
                                    >
                                        Next
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={() => setCurrentPage(totalPages)}
                                        isDisabled={currentPage === totalPages}
                                    >
                                        Last
                                    </Button>
                                </Flex>
                            )}
                        </>
                    )}
                </Box>
            </Box>
        </MainLayout>
    );
};

export default MaternityReport;
