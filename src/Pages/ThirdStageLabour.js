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
import { useColors } from "../Utils/colors";
import moment from "moment";

export default function ThirdStageLabour({ id }) {
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
          Third Stage Labour Records
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
                  Date/Time
                </Th>
                <Th fontSize="13px" textTransform="capitalize" color={subTitleTextColor} fontWeight="600">
                  Placental Delivery
                </Th>
                <Th fontSize="13px" textTransform="capitalize" color={subTitleTextColor} fontWeight="600">
                  Completeness
                </Th>
                <Th fontSize="13px" textTransform="capitalize" color={subTitleTextColor} fontWeight="600">
                  Blood Loss (ml)
                </Th>
                <Th fontSize="13px" textTransform="capitalize" color={subTitleTextColor} fontWeight="600">
                  Oxytocin Given
                </Th>
                <Th fontSize="13px" textTransform="capitalize" color={subTitleTextColor} fontWeight="600">
                  Complications
                </Th>
                <Th fontSize="13px" textTransform="capitalize" color={subTitleTextColor} fontWeight="600">
                  Actions
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td colSpan={7}>
                  <Text textAlign="center" mt="32px" color={textColor}>
                    No third stage labour records found
                  </Text>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
