import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import {
  Box,
  Flex,
  Text,
  Heading,
  Avatar,
  HStack,
  Tag,
  VStack,
} from "@chakra-ui/react";

const PatientInfoCard = () => {
  const [patientDetails, setPatientDetails] = useState(null);

  useEffect(() => {
    const details = localStorage.getItem("patientDetails");
    console.log("Patient Details:", JSON.parse(details));
    if (details) {
      setPatientDetails(JSON.parse(details));
    }
  }, []);

  if (!patientDetails) {
    return <Box>Loading patient details...</Box>;
  }

  const {
    firstName,
    lastName,
    gender,
    dateOfBirth,
    phoneNumber,
    MRN,
    clinicalInformation,
    maritalStatus,
    email,
  } = patientDetails;

  const getAge = (dob) => {
    if (!dob) return "N/A";
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <Box
      bg="white"
      borderRadius="lg"
      p={5}
      boxShadow="md"
      display="flex"
      flexWrap="wrap"
      justifyContent="space-between"
      my={3}
    >
      <Flex align="center" flex={1.5} gap="2" minW="200px" m={2}>
     <Avatar name={`${firstName} ${lastName}`} size='lg' src='https://bit.ly/tioluwani-kolawole' />
      
        <Box textTransform="capitalize">
          <Heading as="h4" size="md">{`${firstName} ${lastName}`}</Heading>
          <Text color="gray.600">{gender}</Text>
          <Text color="gray.600">{getAge(dateOfBirth)} yrs old</Text>
          <Text color="gray.600">{phoneNumber}</Text>
          <Text color="gray.600">MRN ~ {MRN}</Text>
        </Box>
      </Flex>

      <Box flex={1} minW="200px" m={2}>
        <Heading as="h5" size="sm" mb={3}>
          Clinical Information
        </Heading>
        <Text color="gray.600">Blood Group: {clinicalInformation.bloodGroup || "Not Specified"}</Text>
        <Text color="gray.600">Genotype: {clinicalInformation.genotype || "Not Specified"}</Text>
        <Text color="gray.600">BP: {clinicalInformation.bp || "Not Specified"}</Text>
        <Text color="gray.600">Heart Rate: {clinicalInformation.heartRate || "Not Specified"} </Text>
        <Text color="gray.600">Temperature: {clinicalInformation.temperature || "Not Specified"}</Text>
        <Text color="gray.600">Disability: {clinicalInformation.disability || "Not Specified"}</Text>
      </Box>

      <Box flex={1} minW="200px" m={2}>
        <Heading as="h5" size="sm" mb={3}>
          Social Info
        </Heading>
        <Text color="gray.600">
          Marital Status: {maritalStatus || "Not Specified"}
        </Text>
        <Text color="gray.600">Language:</Text>
        <Text color="gray.600">
          DOB: {new Date(dateOfBirth).toLocaleDateString()}
        </Text>
        <Text color="gray.600">Email: {email}</Text>
      </Box>

    
    </Box>
  );
};

export default PatientInfoCard;
