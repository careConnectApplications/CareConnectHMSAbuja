import {
  HStack,
  Box,
  Text,
  Spacer,
  Image,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
 Td,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import Button from "../Components/Button";
import { IoMdArrowRoundBack } from "react-icons/io";
import { MdLocalPrintshop } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import logo from "../Assets/carelogo.png";
import { FacilityName } from "../Utils/ApiConfig";
import TableRowY from "../Components/TableRowY";
import { ReadPharmacyByOrderId } from "../Utils/ApiCalls";

export default function PrintPharmacyNew() {
  const nav = useNavigate();
  const [Hide, setHide] = useState(false);
  const [PrintData, setPrintData] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("pharmacyPrintData");
    if (data) {
      const parsedData = JSON.parse(data);
      setPrintData(parsedData);
      fetchOrderDetails(parsedData.orderid);
    }
  }, []);

  const fetchOrderDetails = async (orderId) => {
    setLoading(true);
    try {
      const data = await ReadPharmacyByOrderId(orderId);
      setOrderDetails(data.queryresult);
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  };

  const printNow = () => {
    setHide(true);
    setTimeout(() => {
      window.print();
    }, 1000);
    setTimeout(() => {
      setHide(false);
    }, 2000);
  };

  return (
    <Box px="1%" mt="16px" className="print-container" maxW="800px" mx="auto">
      {Hide === false && (
        <HStack mb="12px">
          <Button
            leftIcon={<IoMdArrowRoundBack />}
            w="120px"
            size="sm"
            onClick={() => nav("/dashboard/pharmacy-new")}
          >
            Back
          </Button>
          <Spacer />
          <Button
            w="120px"
            size="sm"
            rightIcon={<MdLocalPrintshop />}
            onClick={printNow}
          >
            Print
          </Button>
        </HStack>
      )}
      <Flex justifyContent="center">
        <Image src={logo} width={"8%"} onClick={() => nav("/")} />
      </Flex>
      <Text
        textAlign="center"
        fontSize="22px"
        textTransform="uppercase"
        fontWeight="900"
        color="blue.blue500"
      >
        {FacilityName}
      </Text>
      <Text
        textAlign="center"
        fontSize="18px"
        textTransform="uppercase"
        fontWeight="700"
        color="#242424"
      >
        Pharmacy Department
      </Text>
      {orderDetails && orderDetails.prescriptiondetails.length > 0 && (
        <Box mt="5px" textAlign="center">
          <Text fontSize="14px">
            <span style={{ fontWeight: "bold" }}>Patient Name:</span>{" "}
            {`${orderDetails.prescriptiondetails[0].patient?.firstName || ""} ${
              orderDetails.prescriptiondetails[0].patient?.lastName || ""
            }`}
          </Text>
          <Text fontSize="14px">
            <span style={{ fontWeight: "bold" }}>MRN:</span>{" "}
            {orderDetails.prescriptiondetails[0].patient?.MRN}
          </Text>
        </Box>
      )}
      <Box border="1px solid gray" p="10px" mt="5px" rounded="8px">
        {loading ? (
          <Text>Loading order details...</Text>
        ) : orderDetails ? (
          <TableContainer mt="5px">
            <Table variant="striped" size="sm">
              <Thead bg="blue.blue500">
                <Tr>
                  <Th color="#fff" fontSize="9px" px="2">
                    Drug
                  </Th>
                  <Th color="#fff" fontSize="9px" px="2">
                    Freq.
                  </Th>
                  <Th color="#fff" fontSize="9px" px="2">
                    Dosage
                  </Th>
                  <Th color="#fff" fontSize="9px" px="2">
                    Dur.
                  </Th>
                  <Th color="#fff" fontSize="9px" px="2">
                    Qty
                  </Th>
                  <Th color="#fff" fontSize="9px" px="2">
                    Amount
                  </Th>
                  <Th color="#fff" fontSize="9px" px="2">
                    Doctor
                  </Th>
                  <Th color="#fff" fontSize="9px" px="2">
                    Date
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {orderDetails.prescriptiondetails.map((detail) => (
                  <Tr key={detail._id}>
                    <Td fontSize="9px" px="2">
                      {detail.prescription}
                    </Td>
                    <Td fontSize="9px" px="2">
                      {detail.frequency}
                    </Td>
                    <Td fontSize="9px" px="2">
                      {detail.dosage}
                    </Td>
                    <Td fontSize="9px" px="2">
                      {detail.duration}
                    </Td>
                    <Td fontSize="9px" px="2">
                      {detail.payment?.qty || "N/A"}
                    </Td>
                    <Td fontSize="9px" px="2">
                      {detail.payment?.amount || "N/A"}
                    </Td>
                    <Td fontSize="9px" px="2">
                      {detail.prescribersname}
                    </Td>
                    <Td fontSize="9px" px="2">
                      {detail.createdAt}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        ) : (
          <Text>No order details found.</Text>
        )}
      </Box>
      <style>
        {`
          @media print {
            .print-container {
              padding: 0;
              margin: 0;
            }
            body {
              -webkit-print-color-adjust: exact;
            }
            th, td {
              font-size: 7px !important;
              padding: 2px !important;
            }
          }
        `}
      </style>
    </Box>
  );
}
