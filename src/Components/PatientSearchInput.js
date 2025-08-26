import React, { useState, useEffect } from "react";
import { Box, Text, HStack, Badge, InputRightElement, InputGroup, IconButton } from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import { SearchPatientApi } from "../Utils/ApiCalls";
import Input from "./Input";
import { FaTimes } from "react-icons/fa";

const PatientSearchInput = ({ onPatientSelect, initialValue }) => {
  const [searchMRN, setSearchMRN] = useState(initialValue || "");
  const [patients, setPatients] = useState([]);
  const [isLoadingPatients, setIsLoadingPatients] = useState(false);
  const [selectedPatientInfo, setSelectedPatientInfo] = useState(null);

  useEffect(() => {
    if (initialValue) {
      setSearchMRN(initialValue);
    }
  }, [initialValue]);

  const handlePatientSelect = (patient) => {
    setSelectedPatientInfo({
      name: `${patient.firstName} ${patient.lastName}`,
      mrn: patient.MRN,
    });
    setPatients([]);
    setSearchMRN(`${patient.firstName} ${patient.lastName} (MRN: ${patient.MRN})`);
    onPatientSelect(patient);
  };

  useEffect(() => {
    const searchPatients = async (searchTerm) => {
      if (!searchTerm || searchTerm.trim().length < 2) {
        setPatients([]);
        return;
      }

      if (selectedPatientInfo && searchTerm.includes(selectedPatientInfo.mrn)) {
        return;
      }

      try {
        setIsLoadingPatients(true);
        const results = await SearchPatientApi(searchTerm);
        if (results?.queryresult?.patientdetails) {
          setPatients(results.queryresult.patientdetails);
        } else {
          setPatients([]);
        }
      } catch (e) {
        console.error("Error searching patient:", e.message);
        setPatients([]);
      } finally {
        setIsLoadingPatients(false);
      }
    };

    const timeoutId = setTimeout(() => {
      searchPatients(searchMRN);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchMRN, selectedPatientInfo]);

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchMRN(value);

    if (selectedPatientInfo && !value.includes(selectedPatientInfo.mrn)) {
      setSelectedPatientInfo(null);
      onPatientSelect(null);
    }
  };

  const handleClear = () => {
    setSearchMRN("");
    setPatients([]);
    setSelectedPatientInfo(null);
    onPatientSelect(null);
  };

  return (
    <Box position="relative">
      <InputGroup>
        <Input
          label="Search for Patient"
          placeholder="Enter MRN, first name, or last name"
          value={searchMRN}
          onChange={handleSearchInputChange}
          leftIcon={<FiSearch size={16} color="blue.500" />}
        />
        {searchMRN && (
          <InputRightElement>
            <IconButton
              aria-label="Clear search"
              icon={<FaTimes />}
              onClick={handleClear}
              size="sm"
              isRound
            />
          </InputRightElement>
        )}
      </InputGroup>

      {selectedPatientInfo && (
        <Box mt={2} p={3} bg="blue.50" borderRadius="md" border="1px solid" borderColor="blue.200">
          <HStack spacing={2}>
            <Badge colorScheme="blue" variant="solid">Selected</Badge>
            <Text fontWeight="medium">{selectedPatientInfo.name}</Text>
            <Text fontSize="sm" color="gray.600">MRN: {selectedPatientInfo.mrn}</Text>
          </HStack>
        </Box>
      )}

      {patients.length > 0 && !selectedPatientInfo && (
        <Box
          position="absolute"
          top="100%"
          left={0}
          right={0}
          zIndex={10}
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="md"
          boxShadow="lg"
          maxH="200px"
          overflowY="auto"
          mt={1}
        >
          {patients.map((patient) => (
            <Box
              key={patient._id}
              p={3}
              cursor="pointer"
              _hover={{ bg: "blue.50" }}
              onClick={() => handlePatientSelect(patient)}
              borderBottom="1px solid"
              borderColor="gray.100"
              _last={{ borderBottom: "none" }}
            >
              <Text fontWeight="medium">
                {`${patient.firstName} ${patient.lastName}`}
              </Text>
              <Text fontSize="sm" color="gray.600">
                MRN: {patient.MRN}
              </Text>
            </Box>
          ))}
        </Box>
      )}

      {isLoadingPatients && (
        <Box
          position="absolute"
          top="100%"
          left={0}
          right={0}
          zIndex={10}
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="md"
          p={3}
          mt={1}
        >
          <Text color="gray.500">Searching patients...</Text>
        </Box>
      )}
    </Box>
  );
};

export default PatientSearchInput;
