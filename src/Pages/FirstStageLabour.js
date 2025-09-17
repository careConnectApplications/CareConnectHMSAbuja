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
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Flex,
} from "@chakra-ui/react";
import Button from "../Components/Button";
import FirstStageLabourModal from "../Components/FirstStageLabourModal";
import { useColors } from "../Utils/colors";
import moment from "moment";
import { BsThreeDots } from "react-icons/bs";
import axios from "axios";
import { API_URL } from "../Utils/ApiConfig";
import Preloader from "../Components/Preloader";

export default function FirstStageLabour({ id }) {
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
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  // Fetch data from API
  const fetchData = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/first-stage-labour/patient/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.data?.status === true) {
        setData(response.data.queryresult || []);
      }
    } catch (error) {
      console.error("Error fetching first stage labour data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch first stage labour records",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

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
          First Stage Labour Records
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
                  Cervical Dilation (cm)
                </Th>
                <Th fontSize="13px" textTransform="capitalize" color={subTitleTextColor} fontWeight="600">
                  Effacement (%)
                </Th>
                <Th fontSize="13px" textTransform="capitalize" color={subTitleTextColor} fontWeight="600">
                  Station
                </Th>
                <Th fontSize="13px" textTransform="capitalize" color={subTitleTextColor} fontWeight="600">
                  Contractions
                </Th>
                <Th fontSize="13px" textTransform="capitalize" color={subTitleTextColor} fontWeight="600">
                  Fetal Heart Rate
                </Th>
                <Th fontSize="13px" textTransform="capitalize" color={subTitleTextColor} fontWeight="600">
                  Membranes
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
                      {item.cervicalDilation}
                    </Td>
                    <Td fontSize="14px" color={textColor}>
                      {item.effacement}
                    </Td>
                    <Td fontSize="14px" color={textColor}>
                      {item.station}
                    </Td>
                    <Td fontSize="14px" color={textColor}>
                      {item.contractions}
                    </Td>
                    <Td fontSize="14px" color={textColor}>
                      {item.fetalHeartRate} bpm
                    </Td>
                    <Td fontSize="14px" color={textColor}>
                      {item.membranes}
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
                      No first stage labour records found
                    </Text>
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>

      <FirstStageLabourModal
        isOpen={isOpen}
        onClose={onClose}
        mode={modalMode}
        data={selectedRecord}
        patientId={id}
      />
    </Box>
  );
}
