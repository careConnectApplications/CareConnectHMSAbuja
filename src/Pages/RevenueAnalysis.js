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
} from "@chakra-ui/react";
import * as XLSX from "xlsx";
import moment from "moment";
import MainLayout from "../Layouts/Index";
import Preloader from "../Components/Preloader";
import Pagination from "../Components/Pagination";
import { configuration } from "../Utils/Helpers";

const RevenueAnalysis = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [filterData, setFilterData] = useState([]);
    const [search, setSearch] = useState("");
    const [analysisType, setAnalysisType] = useState("");
    const [department, setDepartment] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = configuration.sizePerPage || 10;
    
    const toast = useToast();

    useEffect(() => {
        fetchRevenueAnalysis();
    }, [analysisType, department, paymentMethod, dateFrom, dateTo]);

    const fetchRevenueAnalysis = async () => {
        setLoading(true);
        // TODO: Implement API call to fetch revenue analysis data
        // Example: GetRevenueAnalysisApi({ analysisType, department, paymentMethod, dateFrom, dateTo })
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
        XLSX.utils.book_append_sheet(workbook, worksheet, "Revenue Analysis");
        XLSX.writeFile(
            workbook,
            `Revenue_Analysis_${moment().format("YYYY-MM-DD")}.xlsx`
        );
        
        toast({
            title: "Export successful",
            description: "Revenue analysis data has been exported to Excel",
            status: "success",
            duration: 3000,
            isClosable: true,
        });
    };

    const resetFilters = () => {
        setAnalysisType("");
        setDepartment("");
        setPaymentMethod("");
        setDateFrom("");
        setDateTo("");
        setSearch("");
        fetchRevenueAnalysis();
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
            <Box p={6} bg="white" borderRadius="lg" shadow="sm">
                <Flex justifyContent="space-between" alignItems="center" mb={6}>
                    <Text fontSize="2xl" fontWeight="bold">
                        Revenue Analysis
                    </Text>
                    <Flex gap={3}>
                        <Button colorScheme="green" onClick={exportToExcel}>
                            Export to Excel
                        </Button>
                        <Button colorScheme="blue" onClick={resetFilters}>
                            Reset Filters
                        </Button>
                    </Flex>
                </Flex>

                {/* Filters Section */}
                <Grid templateColumns="repeat(3, 1fr)" gap={4} mb={6}>
                    <GridItem>
                        <Text fontSize="sm" mb={2} fontWeight="medium">
                            Analysis Type
                        </Text>
                        <Select
                            placeholder="Select Analysis Type"
                            value={analysisType}
                            onChange={(e) => setAnalysisType(e.target.value)}
                        >
                            <option value="daily">Daily Revenue</option>
                            <option value="monthly">Monthly Revenue</option>
                            <option value="quarterly">Quarterly Revenue</option>
                            <option value="service-wise">Service-wise Revenue</option>
                            <option value="insurance">Insurance vs Cash</option>
                            <option value="outstanding">Outstanding Payments</option>
                        </Select>
                    </GridItem>

                    <GridItem>
                        <Text fontSize="sm" mb={2} fontWeight="medium">
                            Department
                        </Text>
                        <Select
                            placeholder="All Departments"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                        >
                            <option value="outpatient">Outpatient</option>
                            <option value="inpatient">Inpatient</option>
                            <option value="laboratory">Laboratory</option>
                            <option value="radiology">Radiology</option>
                            <option value="pharmacy">Pharmacy</option>
                            <option value="theatre">Theatre</option>
                            <option value="dental">Dental</option>
                            <option value="eye-clinic">Eye Clinic</option>
                        </Select>
                    </GridItem>

                    <GridItem>
                        <Text fontSize="sm" mb={2} fontWeight="medium">
                            Payment Method
                        </Text>
                        <Select
                            placeholder="All Payment Methods"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                            <option value="cash">Cash</option>
                            <option value="card">Card</option>
                            <option value="transfer">Bank Transfer</option>
                            <option value="insurance">Insurance/HMO</option>
                            <option value="credit">Credit</option>
                        </Select>
                    </GridItem>

                    <GridItem>
                        <Text fontSize="sm" mb={2} fontWeight="medium">
                            Date From
                        </Text>
                        <Input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                        />
                    </GridItem>

                    <GridItem>
                        <Text fontSize="sm" mb={2} fontWeight="medium">
                            Date To
                        </Text>
                        <Input
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                        />
                    </GridItem>

                    <GridItem>
                        <Text fontSize="sm" mb={2} fontWeight="medium">
                            Search
                        </Text>
                        <Input
                            placeholder="Search revenue records..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </GridItem>
                </Grid>

                {/* Revenue Summary Cards */}
                <Grid templateColumns="repeat(4, 1fr)" gap={4} mb={6}>
                    <Box p={4} bg="green.50" borderRadius="md" borderLeft="4px solid" borderColor="green.500">
                        <Text fontSize="sm" color="gray.600">Total Revenue</Text>
                        <Text fontSize="2xl" fontWeight="bold">₦0.00</Text>
                    </Box>
                    <Box p={4} bg="blue.50" borderRadius="md" borderLeft="4px solid" borderColor="blue.500">
                        <Text fontSize="sm" color="gray.600">Cash Revenue</Text>
                        <Text fontSize="2xl" fontWeight="bold">₦0.00</Text>
                    </Box>
                    <Box p={4} bg="purple.50" borderRadius="md" borderLeft="4px solid" borderColor="purple.500">
                        <Text fontSize="sm" color="gray.600">Insurance Revenue</Text>
                        <Text fontSize="2xl" fontWeight="bold">₦0.00</Text>
                    </Box>
                    <Box p={4} bg="orange.50" borderRadius="md" borderLeft="4px solid" borderColor="orange.500">
                        <Text fontSize="sm" color="gray.600">Outstanding</Text>
                        <Text fontSize="2xl" fontWeight="bold">₦0.00</Text>
                    </Box>
                </Grid>

                {/* Data Table */}
                <Box overflowX="auto">
                    {loading ? (
                        <Flex justifyContent="center" alignItems="center" h="200px">
                            <Spinner size="xl" color="blue.500" />
                        </Flex>
                    ) : (
                        <>
                            <Table variant="simple">
                                <Thead bg="gray.50">
                                    <Tr>
                                        <Th>Date</Th>
                                        <Th>Transaction ID</Th>
                                        <Th>Patient Name</Th>
                                        <Th>Service/Item</Th>
                                        <Th>Department</Th>
                                        <Th>Amount</Th>
                                        <Th>Payment Method</Th>
                                        <Th>Status</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {paginatedData.length > 0 ? (
                                        paginatedData.map((item, index) => (
                                            <Tr key={index}>
                                                <Td>{moment(item.date).format("DD/MM/YYYY")}</Td>
                                                <Td>{item.transactionId}</Td>
                                                <Td>{item.patientName}</Td>
                                                <Td>{item.service}</Td>
                                                <Td>{item.department}</Td>
                                                <Td>₦{item.amount}</Td>
                                                <Td>{item.paymentMethod}</Td>
                                                <Td>
                                                    <Text
                                                        color={
                                                            item.status === "Paid"
                                                                ? "green.500"
                                                                : item.status === "Pending"
                                                                ? "orange.500"
                                                                : "red.500"
                                                        }
                                                    >
                                                        {item.status}
                                                    </Text>
                                                </Td>
                                            </Tr>
                                        ))
                                    ) : (
                                        <Tr>
                                            <Td colSpan={8} textAlign="center">
                                                No revenue data available
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

export default RevenueAnalysis;
