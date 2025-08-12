import React, { useState, useEffect } from "react";
import {
  Box,
  useDisclosure,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useToast,
  Flex
} from "@chakra-ui/react";
import { GetPatientBillingHistoryApi } from "../Utils/ApiCalls";
import { useParams } from "react-router-dom";
import Button from "../Components/Button";
import TableRow from "../Components/TableRow";
import CreateCustomBillModal from "../Components/CreateCustomBillModal";
import { SlPlus } from "react-icons/sl";
import moment from "moment";



export default function CustomBilling() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { id: patientId } = useParams();
  const toast = useToast();
  const [billingData, setBillingData] = useState([]);

  const fetchBillingHistory = async () => {
    try {
      const response = await GetPatientBillingHistoryApi(patientId);
      console.log("Billing History Response:", response);
      setBillingData(response.queryresult.paymentdetails);
    } catch (error) {
      console.error("Error fetching billing history:", error);
      toast({
        title: "Error",
        description: "Could not fetch billing history.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchBillingHistory();
    }
  }, [patientId, isOpen]);

  return (
    <Box p="4">
      <Flex
        justifyContent="space-between"
        flexWrap="wrap"
        mt={["10px", "10px", "10px", "10px"]}
        w={["100%", "100%", "50%", "37%"]}
      >
        <Button rightIcon={<SlPlus />} onClick={onOpen} colorScheme="blue">Add Custom Bill</Button>

      </Flex>


      <CreateCustomBillModal isOpen={isOpen} onClose={onClose} />
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
                  patient name
                </Th>
                <Th
                  fontSize="13px"
                  textTransform="capitalize"
                  color="#534D59"
                  fontWeight="600"
                >
                  Date
                </Th>

                <Th
                  fontSize="13px"
                  textTransform="capitalize"
                  color="#534D59"
                  fontWeight="600"
                >
                  Payment Category
                </Th>
                <Th
                  fontSize="13px"
                  textTransform="capitalize"
                  color="#534D59"
                  fontWeight="600"
                >
                  Payment Type
                </Th>
                <Th
                  fontSize="13px"
                  textTransform="capitalize"
                  color="#534D59"
                  fontWeight="600"
                >
                 Quantity
                </Th>
                <Th
                  fontSize="13px"
                  textTransform="capitalize"
                  color="#534D59"
                  fontWeight="600"
                >
                  Total Amount
                </Th>
                <Th
                  fontSize="13px"
                  textTransform="capitalize"
                  color="#534D59"
                  fontWeight="600"
                >
                  status
                </Th>

              </Tr>
            </Thead>
            <Tbody>
              {billingData?.map((bill, i) => (
                <TableRow
                  key={i}
                  type="custom-billing-history"
                  name={`${bill?.firstName || ""} ${bill?.lastName || ""}`}
                  email={bill.email}
                  category={bill.paymentcategory}
                  paymentType={bill.paymentype}
                  mrn={bill.MRN}
                  quantity={bill.qty}
                  amountPaid={bill.amount}
                  status={bill.status}
                  date={moment(bill.createdAt).format("lll")}

                />
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
