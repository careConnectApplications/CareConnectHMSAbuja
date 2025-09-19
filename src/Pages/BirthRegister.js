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
import BirthRegisterModal from "../Components/BirthRegisterModal";
import { useColors } from "../Utils/colors";
import moment from "moment";

export default function BirthRegister({ id }) {
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
          Birth Register
        </Text>
        <Button onClick={onOpen}>
          Add New Birth Record
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
                  Birth Date/Time
                </Th>
                <Th fontSize="13px" textTransform="capitalize" color={subTitleTextColor} fontWeight="600">
                  Baby Name
                </Th>
                <Th fontSize="13px" textTransform="capitalize" color={subTitleTextColor} fontWeight="600">
                  Gender
                </Th>
                <Th fontSize="13px" textTransform="capitalize" color={subTitleTextColor} fontWeight="600">
                  Weight (kg)
                </Th>
                <Th fontSize="13px" textTransform="capitalize" color={subTitleTextColor} fontWeight="600">
                  Length (cm)
                </Th>
                <Th fontSize="13px" textTransform="capitalize" color={subTitleTextColor} fontWeight="600">
                  APGAR Score
                </Th>
                <Th fontSize="13px" textTransform="capitalize" color={subTitleTextColor} fontWeight="600">
                  Birth Type
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
                    No birth records found
                  </Text>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </Box>

      <BirthRegisterModal
        isOpen={isOpen}
        onClose={onClose}
        patientId={id}
      />
    </Box>
  );
}
