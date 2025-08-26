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

const CodingIndexing = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [filterData, setFilterData] = useState([]);
    const [search, setSearch] = useState("");
    const [codeType, setCodeType] = useState("");
    const [category, setCategory] = useState("");
    const [status, setStatus] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = configuration.sizePerPage || 10;
    
    const toast = useToast();

    useEffect(() => {
        fetchCodingIndexing();
    }, [codeType, category, status, dateFrom, dateTo]);

    const fetchCodingIndexing = async () => {
        setLoading(true);
        // TODO: Implement API call to fetch coding and indexing data
        // Example: GetCodingIndexingApi({ codeType, category, status, dateFrom, dateTo })
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
        XLSX.utils.book_append_sheet(workbook, worksheet, "Coding Indexing");
        XLSX.writeFile(
            workbook,
            `Coding_Indexing_${moment().format("YYYY-MM-DD")}.xlsx`
        );
        
        toast({
            title: "Export successful",
            description: "Coding and indexing data has been exported to Excel",
            status: "success",
            duration: 3000,
            isClosable: true,
        });
    };

    const resetFilters = () => {
        setCodeType("");
        setCategory("");
        setStatus("");
        setDateFrom("");
        setDateTo("");
        setSearch("");
        fetchCodingIndexing();
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
                        Coding & Indexing
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
                            Code Type
                        </Text>
                        <Select
                            placeholder="Select Code Type"
                            value={codeType}
                            onChange={(e) => setCodeType(e.target.value)}
                        >
                            <option value="icd10">ICD-10 Diagnosis</option>
                            <option value="icd9">ICD-9 Procedures</option>
                            <option value="cpt">CPT Codes</option>
                            <option value="drg">DRG Codes</option>
                            <option value="hcpcs">HCPCS Codes</option>
                            <option value="snomed">SNOMED CT</option>
                        </Select>
                    </GridItem>

                    <GridItem>
                        <Text fontSize="sm" mb={2} fontWeight="medium">
                            Category
                        </Text>
                        <Select
                            placeholder="All Categories"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="diagnosis">Diagnosis</option>
                            <option value="procedure">Procedure</option>
                            <option value="medication">Medication</option>
                            <option value="laboratory">Laboratory</option>
                            <option value="radiology">Radiology</option>
                            <option value="billing">Billing</option>
                        </Select>
                    </GridItem>

                    <GridItem>
                        <Text fontSize="sm" mb={2} fontWeight="medium">
                            Status
                        </Text>
                        <Select
                            placeholder="All Status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="coded">Coded</option>
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="rejected">Rejected</option>
                            <option value="incomplete">Incomplete</option>
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
                            placeholder="Search by code, description, patient..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </GridItem>
                </Grid>

                {/* Statistics Cards */}
                <Grid templateColumns="repeat(4, 1fr)" gap={4} mb={6}>
                    <Box p={4} bg="teal.50" borderRadius="md" borderLeft="4px solid" borderColor="teal.500">
                        <Text fontSize="sm" color="gray.600">Total Records</Text>
                        <Text fontSize="2xl" fontWeight="bold">0</Text>
                    </Box>
                    <Box p={4} bg="green.50" borderRadius="md" borderLeft="4px solid" borderColor="green.500">
                        <Text fontSize="sm" color="gray.600">Coded</Text>
                        <Text fontSize="2xl" fontWeight="bold">0</Text>
                    </Box>
                    <Box p={4} bg="orange.50" borderRadius="md" borderLeft="4px solid" borderColor="orange.500">
                        <Text fontSize="sm" color="gray.600">Pending</Text>
                        <Text fontSize="2xl" fontWeight="bold">0</Text>
                    </Box>
                    <Box p={4} bg="red.50" borderRadius="md" borderLeft="4px solid" borderColor="red.500">
                        <Text fontSize="sm" color="gray.600">Rejected</Text>
                        <Text fontSize="2xl" fontWeight="bold">0</Text>
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
                                        <Th>Patient ID</Th>
                                        <Th>Patient Name</Th>
                                        <Th>Visit Type</Th>
                                        <Th>Code Type</Th>
                                        <Th>Code</Th>
                                        <Th>Description</Th>
                                        <Th>Category</Th>
                                        <Th>Coded By</Th>
                                        <Th>Status</Th>
                                        <Th>Notes</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {paginatedData.length > 0 ? (
                                        paginatedData.map((item, index) => (
                                            <Tr key={index}>
                                                <Td>{moment(item.date).format("DD/MM/YYYY")}</Td>
                                                <Td>{item.patientId}</Td>
                                                <Td>{item.patientName}</Td>
                                                <Td>{item.visitType}</Td>
                                                <Td>{item.codeType}</Td>
                                                <Td>{item.code}</Td>
                                                <Td>{item.description}</Td>
                                                <Td>{item.category}</Td>
                                                <Td>{item.codedBy}</Td>
                                                <Td>
                                                    <Text
                                                        color={
                                                            item.status === "Coded"
                                                                ? "green.500"
                                                                : item.status === "Pending"
                                                                ? "orange.500"
                                                                : item.status === "Reviewed"
                                                                ? "blue.500"
                                                                : "red.500"
                                                        }
                                                    >
                                                        {item.status}
                                                    </Text>
                                                </Td>
                                                <Td>{item.notes || "-"}</Td>
                                            </Tr>
                                        ))
                                    ) : (
                                        <Tr>
                                            <Td colSpan={11} textAlign="center">
                                                No coding data available
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

export default CodingIndexing;
