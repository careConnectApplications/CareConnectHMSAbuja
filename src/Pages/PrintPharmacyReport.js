import { HStack, Box, Text, Spacer, Image, Flex, SimpleGrid } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import Button from "../Components/Button";
import PrintCard from "../Components/PrintCard";
import { Table, Thead, Tbody, Tr, Th, TableContainer } from "@chakra-ui/react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { MdLocalPrintshop } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import logo from "../Assets/carelogo.png"
import moment from "moment";
import { FacilityName } from "../Utils/ApiConfig";
import TableRowY from "../Components/TableRowY";

export default function PrintPharmacyReport() {
    const nav = useNavigate()
    const [Hide, setHide] = useState(false);
    const [PrintData, setPrintData] = useState([]);

    useEffect(() => {
        const data = localStorage.getItem("pharmacyPrintData");
        if (data) {
            setPrintData(JSON.parse(data));
        }
    }, []);

    const printNow = () => {
        setHide(true)
        setTimeout(() => {
            window.print()
        }, 1000);
        setTimeout(() => {
            setHide(false)
        }, 2000);
    }

    return (
        <Box px="6%" mt="32px">
            {Hide === false && (
                <HStack mb="12px">
                    <Button leftIcon={<IoMdArrowRoundBack />} w="150px" onClick={() => nav("/pharmacy")}>Back</Button>
                    <Spacer />
                    <Button w="150px" rightIcon={<MdLocalPrintshop />} onClick={printNow}>Print</Button>
                </HStack>
            )}
            <Flex justifyContent="center">
                <Image src={logo} width={"10%"} onClick={() => nav("/")} />
            </Flex>
            <Text textAlign="center" fontSize="25px" textTransform="uppercase" fontWeight="900" color="blue.blue500">{FacilityName}</Text>
            <Text textAlign="center" fontSize="20px" textTransform="uppercase" fontWeight="700" color="#242424">Pharmacy Department</Text>

            <Box border="1px solid gray" p="15px" mt="10px" rounded="8px">
                <TableContainer mt="10px">
                    <Table variant="striped">
                        <Thead bg="blue.blue500">
                            <Tr>
                                <Th fontSize="13px" textTransform="capitalize" color="#fff" fontWeight="600">Order ID</Th>
                                <Th fontSize="13px" textTransform="capitalize" color="#fff" fontWeight="600">Patient Name</Th>
                                <Th fontSize="13px" textTransform="capitalize" color="#fff" fontWeight="600">MRN</Th>
                                <Th fontSize="13px" textTransform="capitalize" color="#fff" fontWeight="600">Creation Date</Th>
                                <Th fontSize="13px" textTransform="capitalize" color="#fff" fontWeight="600">Prescriber Name</Th>
                                <Th fontSize="13px" textTransform="capitalize" color="#fff" fontWeight="600">HMO Cover</Th>
                                <Th fontSize="13px" textTransform="capitalize" color="#fff" fontWeight="600">HMO Name</Th>
                                <Th fontSize="13px" textTransform="capitalize" color="#fff" fontWeight="600">HMO Plan</Th>
                                <Th fontSize="13px" textTransform="capitalize" color="#fff" fontWeight="600">Appointment Date</Th>
                                <Th fontSize="13px" textTransform="capitalize" color="#fff" fontWeight="600">Clinic</Th>
                                <Th fontSize="13px" textTransform="capitalize" color="#fff" fontWeight="600">Appointment ID</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {PrintData.map((item, i) => (
                                <TableRowY
                                    key={i}
                                    type="pharmacy-print"
                                    orderid={item.orderid}
                                    patient={`${item.firstName || ""} ${item.lastName || ""}`}
                                    MRN={item.MRN}
                                    createdDate={item.createdAt}
                                    prescribersName={item.prescribersname}
                                    isHMOCover={item.isHMOCover}
                                    HMOName={item.HMOName}
                                    HMOPlan={item.HMOPlan}
                                    appointmentdate={item.appointmentdate}
                                    clinic={item.clinic}
                                    appointmentid={item.appointmentid}
                                />
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    )
}
