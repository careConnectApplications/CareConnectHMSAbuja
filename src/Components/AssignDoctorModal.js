import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Stack,
  Select,
  Text,
  Spinner,
  Box,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import Button from "./Button";
import {
  GetDoctorsByClinicApi,
  assignDoctorToAppointmentApi,
} from "../Utils/ApiCalls";

export default function AssignDoctorModal({
  isOpen,
  onClose,
  appointmentId,
  clinic,
  activateNotifications,
}) {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingDoctors, setIsFetchingDoctors] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [error, setError] = useState(null);

  const fetchDoctors = async () => {
    if (!clinic) {
      setError("No clinic selected");
      return;
    }

    try {
      setIsFetchingDoctors(true);
      setError(null);

      const result = await GetDoctorsByClinicApi(clinic);
      console.log("Doctors API response:", result);

      if (result.status && Array.isArray(result.queryresult)) {
        // Filter to only include medical doctors if needed
        const medicalDoctors = result.queryresult.filter(
          (doctor) => doctor.role === "Medical Doctor"
        );

        setDoctors(medicalDoctors); // or use result.queryresult for all staff
      } else {
        setError("No doctors available in this clinic");
      }
    } catch (e) {
      console.error("Fetch error:", e);
      setError(e.message || "Failed to load data");
    } finally {
      setIsFetchingDoctors(false);
    }
  };

  const handleAssignDoctor = async () => {
    if (!selectedDoctor) {
      activateNotifications("Please select a doctor", "error");
      return;
    }

    try {
      setIsLoading(true);
      const payload = {
        appointmentId: appointmentId,
        doctorId: selectedDoctor,
      };

      const result = await assignDoctorToAppointmentApi(payload);

      if (result.status === 200) {
        activateNotifications("Doctor assigned successfully", "success");
        onClose();
        setSelectedDoctor("");
      }
    } catch (e) {
      activateNotifications(e.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchDoctors();
    }
  }, [isOpen, clinic]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Assign Doctor</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing="15px">
            <Text fontSize="sm" mb={2}>
              Assigning doctor for appointment: {appointmentId}
            </Text>
            <Text fontSize="sm" color="gray.600">
              Clinic: {clinic}
            </Text>

            {isFetchingDoctors ? (
              <Box textAlign="center" py={4}>
                <Spinner size="lg" />
                <Text mt={2}>Loading doctors for {clinic}...</Text>
              </Box>
            ) : error ? (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                {error}
              </Alert>
            ) : doctors.length === 0 ? (
              <Alert status="info" borderRadius="md">
                <AlertIcon />
                No doctors available in {clinic}
              </Alert>
            ) : (
              <Select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                placeholder="Select Doctor"
                border="2px solid"
                fontSize="md"
                borderColor="gray.300"
                _hover={{ borderColor: "gray.400" }}
                focusBorderColor="blue.500"
              >
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    {`${doctor.title} ${doctor.firstName} ${doctor.lastName}`}
                    {doctor.specializationDetails &&
                      ` (${doctor.specializationDetails})`}
                    {` - Patients today: ${doctor.patientCountToday}`}
                  </option>
                ))}
              </Select>
            )}
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button
            isLoading={isLoading}
            onClick={handleAssignDoctor}
            disabled={!selectedDoctor || doctors.length === 0}
            width="full"
            colorScheme="blue"
          >
            Assign Doctor
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
