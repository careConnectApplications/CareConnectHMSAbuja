import React, { useState } from "react";
import {
  Box,
  Text,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useDisclosure,
} from "@chakra-ui/react";
import Button from "../Components/Button";
import MortalityRegisterModal from "../Components/MortalityRegisterModal";
import { useColors } from "../Utils/colors";
import moment from "moment";

export default function MortalityRegister({ id }) {
  const {
    bgColor,
    textColor,
    borderColor,
    titleTextColor,
    subTitleTextColor,
  } = useColors();
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [data, setData] = useState([]);

  return (
    <Box>
      <HStack justifyContent="space-between" mb={4}>
        <Text color={titleTextColor} fontWeight="600" fontSize="18px">
          Mortality Register
        </Text>
        <Button onClick={onOpen}>
          Add New Record
        </Button>
      </HStack>

      <Box
        bg={bgColor}
        border={`1px solid ${borderColor}`}
        p="15px"
        rounded="10px"
        overflowX="auto"
      >
        <TableContainer>
          <Table variant="striped">
            <Thead bg={bgColor}>
              <Tr>
                <Th fontSize="13px" textTransform="capitalize" color={subTitleTextColor} fontWeight="600">
                  Date/Time of Death
                </Th>
                <Th fontSize="13px" textTransform="capitalize" color={subTitleTextColor} fontWeight="600">
                  Name
                </Th>
                <Th fontSize="13px" textTransform="capitalize" color={subTitleTextColor} fontWeight="600">
                  Age
                </Th>
                <Th fontSize="13px" textTransform="capitalize" color={subTitleTextColor} fontWeight="600">
                  Type
                </Th>
                <Th fontSize="13px" textTransform="capitalize" color={subTitleTextColor} fontWeight="600">
                  Cause of Death
                </Th>
                <Th fontSize="13px" textTransform="capitalize" color={subTitleTextColor} fontWeight="600">
                  Certificate No.
                </Th>
                <Th fontSize="13px" textTransform="capitalize" color={subTitleTextColor} fontWeight="600">
                  Certified By
                </Th>
                <Th fontSize="13px" textTransform="capitalize" color={subTitleTextColor} fontWeight="600">
                  Actions
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td colSpan={8}>
                  <Text textAlign="center" mt="32px" color={textColor}>
                    No mortality records found
                  </Text>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </Box>

      <MortalityRegisterModal
        isOpen={isOpen}
        onClose={onClose}
        patientId={id}
      />
    </Box>
  );
}
