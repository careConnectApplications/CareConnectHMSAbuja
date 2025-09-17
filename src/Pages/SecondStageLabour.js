import React, { useState, useEffect } from "react";
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
import SecondStageLabourModal from "../Components/SecondStageLabourModal";
import { useColors } from "../Utils/colors";
import moment from "moment";

export default function SecondStageLabour({ id }) {
  const {
    bgColor,
    textColor,
    borderColor,
    titleTextColor,
    subTitleTextColor,
  } = useColors();
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [data, setData] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [modalMode, setModalMode] = useState("create");

  const handleCreate = () => {
    setSelectedRecord(null);
    setModalMode("create");
    onOpen();
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setModalMode("edit");
    onOpen();
  };

  const handleView = (record) => {
    setSelectedRecord(record);
    setModalMode("view");
    onOpen();
  };

  return (
    <Box>
      <HStack justifyContent="space-between" mb={4}>
        <Text color={titleTextColor} fontWeight="600" fontSize="18px">
          Second Stage Labour Records
        </Text>
        <Button onClick={handleCreate}>
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
                  Pushing Started
                </Th>
                <Th fontSize="13px" textTransform="capitalize" color={subTitleTextColor} fontWeight="600">
                  Fetal Descent
                </Th>
                <Th fontSize="13px" textTransform="capitalize" color={subTitleTextColor} fontWeight="600">
                  Maternal Efforts
                </Th>
                <Th fontSize="13px" textTransform="capitalize" color={subTitleTextColor} fontWeight="600">
                  Fetal Heart Rate
                </Th>
                <Th fontSize="13px" textTransform="capitalize" color={subTitleTextColor} fontWeight="600">
                  Interventions
                </Th>
                <Th fontSize="13px" textTransform="capitalize" color={subTitleTextColor} fontWeight="600">
                  Delivery Method
                </Th>
                <Th fontSize="13px" textTransform="capitalize" color={subTitleTextColor} fontWeight="600">
                  Recorded By
                </Th>
                <Th fontSize="13px" textTransform="capitalize" color={subTitleTextColor} fontWeight="600">
                  Actions
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.length > 0 ? (
                data.map((item, i) => (
                  <Tr key={i}>
                    <Td fontSize="14px" color={textColor}>
                      {moment(item.dateTime).format("DD/MM/YYYY HH:mm")}
                    </Td>
                    <Td fontSize="14px" color={textColor}>
                      {moment(item.pushingStarted).format("HH:mm")}
                    </Td>
                    <Td fontSize="14px" color={textColor}>
                      {item.fetalDescent}
                    </Td>
                    <Td fontSize="14px" color={textColor}>
                      {item.maternalEfforts}
                    </Td>
                    <Td fontSize="14px" color={textColor}>
                      {item.fetalHeartRate} bpm
                    </Td>
                    <Td fontSize="14px" color={textColor}>
                      {item.interventions}
                    </Td>
                    <Td fontSize="14px" color={textColor}>
                      {item.deliveryMethod}
                    </Td>
                    <Td fontSize="14px" color={textColor}>
                      {item.recordedBy}
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <Button size="sm" onClick={() => handleView(item)}>
                          View
                        </Button>
                        <Button size="sm" onClick={() => handleEdit(item)}>
                          Edit
                        </Button>
                      </HStack>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={9}>
                    <Text textAlign="center" mt="32px" color={textColor}>
                      No second stage labour records found
                    </Text>
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>

      <SecondStageLabourModal
        isOpen={isOpen}
        onClose={onClose}
        mode={modalMode}
        data={selectedRecord}
        patientId={id}
      />
    </Box>
  );
}
