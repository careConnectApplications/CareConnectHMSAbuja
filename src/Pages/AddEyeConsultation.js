import {
  Box,
  Flex,
  SimpleGrid,
  Text,
  Stack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import MainLayout from "../Layouts/Index";
import Seo from "../Utils/Seo";
import Button from "../Components/Button";
import DatePickerComponent from "../Components/DatePicker";
import { format } from "date-fns";
import Input from "../Components/Input";
import TextArea from "../Components/TextArea";
import ShowToast from "../Components/ToastNotification";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import PatientInfoCard from "../Components/PatientInfoCard";
import { FaNoteSticky, FaEye, FaStethoscope } from "react-icons/fa6";
import { AddEyeConsultationApi } from "../Utils/ApiCalls";

export default function AddEyeConsultation() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    status: "",
  });

  let PatientId = localStorage.getItem("patientId");
  const [payload, setPayload] = useState({
    patientId: PatientId,
    appointmentId: id,
    comps: "",
    historyOfPresentingComplaint: "",
    pastMedicalHistory: "",
    opticalHistory: "",
    familySocialHx: "",
    va: "",
    IOP: "",
    Refraction: "",
    externalExamination: "",
    opthalmoscopy: "",
    slitLamp: "",
    diagnosis: "",
    treatmentPlan: "",
    nextAppointmentDate: "",
  });

  const handlePayload = (e) => {
    const { id, value } = e.target;
    setPayload({ ...payload, [id]: value });
  };

  const handleDateChange = (date, id) => {
    if (!date) {
      setPayload({ ...payload, [id]: "" });
      return;
    }
    const formattedDate = format(date, "yyyy-MM-dd");
    setPayload({ ...payload, [id]: formattedDate });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const result = await AddEyeConsultationApi(payload);
      
      console.log("Eye consultation payload:", payload);
      setShowToast({
        show: true,
        message: "Eye consultation added successfully",
        status: "success",
      });
      setTimeout(() => {
        nav(-1);
      }, 2000);
    } catch (error) {
      setShowToast({
        show: true,
        message: error.message,
        status: "error",
      });

      setTimeout(() => {
        setShowToast({
          show: false,
          message: error.message,
          status: "error",
        });
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const nav = useNavigate();

  return (
    <MainLayout>
      {showToast.show && (
        <ShowToast message={showToast.message} status={showToast.status} />
      )}
      <Seo
        title="Add Eye Consultation"
        description="Add a new eye consultation for a patient"
      />

      <Box>
        <Button
          leftIcon={<IoMdArrowRoundBack />}
          px="40px"
          w="100px"
          onClick={() => nav(-1)}
        >
          Back
        </Button>

        <PatientInfoCard />

        <Stack spacing={5} mt="32px">
          {/* Chief Complaints Section */}
          <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              Chief Complaints & History
            </Text>
            <SimpleGrid columns={{ base: 1, md: 1 }} spacing={4}>
              <Input
                leftIcon={<FaNoteSticky />}
                label="Chief Complaints"
                value={payload.comps}
                onChange={handlePayload}
                id="comps"
                placeholder="Eye irritation and redness"
              />
              <Box>
                <Text fontSize="sm" fontWeight="bold" mb={2}>
                  History of Presenting Complaint
                </Text>
                <TextArea
                  value={payload.historyOfPresentingComplaint}
                  onChange={handlePayload}
                  id="historyOfPresentingComplaint"
                  placeholder="Patient reports redness and discomfort in right eye for 3 days."
                  rows={3}
                />
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight="bold" mb={2}>
                  Past Medical History
                </Text>
                <TextArea
                  value={payload.pastMedicalHistory}
                  onChange={handlePayload}
                  id="pastMedicalHistory"
                  placeholder="Diabetes mellitus, controlled"
                  rows={3}
                />
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight="bold" mb={2}>
                  Optical History
                </Text>
                <TextArea
                  value={payload.opticalHistory}
                  onChange={handlePayload}
                  id="opticalHistory"
                  placeholder="Wears glasses for distance"
                  rows={3}
                />
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight="bold" mb={2}>
                  Family & Social History
                </Text>
                <TextArea
                  value={payload.familySocialHx}
                  onChange={handlePayload}
                  id="familySocialHx"
                  placeholder="No family history of glaucoma"
                  rows={3}
                />
              </Box>
            </SimpleGrid>
          </Box>

          {/* Visual Assessment Section */}
          <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              Visual Assessment
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <Input
                leftIcon={<FaEye />}
                label="Visual Acuity (VA)"
                value={payload.va}
                onChange={handlePayload}
                id="va"
                placeholder="6/9 OD, 6/6 OS"
              />
              <Input
                leftIcon={<FaEye />}
                label="Intraocular Pressure (IOP)"
                value={payload.IOP}
                onChange={handlePayload}
                id="IOP"
                placeholder="18 mmHg OD, 20 mmHg OS"
              />
              <Input
                leftIcon={<FaEye />}
                label="Refraction"
                value={payload.Refraction}
                onChange={handlePayload}
                id="Refraction"
                placeholder="-2.00 DS OD, -1.75 DS OS"
              />
            </SimpleGrid>
          </Box>

          {/* Clinical Examination Section */}
          <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              Clinical Examination
            </Text>
            <SimpleGrid columns={{ base: 1, md: 1 }} spacing={4}>
              <Box>
                <Text fontSize="sm" fontWeight="bold" mb={2}>
                  External Examination
                </Text>
                <TextArea
                  value={payload.externalExamination}
                  onChange={handlePayload}
                  id="externalExamination"
                  placeholder="Mild lid swelling OD"
                  rows={3}
                />
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight="bold" mb={2}>
                  Ophthalmoscopy
                </Text>
                <TextArea
                  value={payload.opthalmoscopy}
                  onChange={handlePayload}
                  id="opthalmoscopy"
                  placeholder="Optic disc healthy, no papilledema"
                  rows={3}
                />
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight="bold" mb={2}>
                  Slit Lamp Examination
                </Text>
                <TextArea
                  value={payload.slitLamp}
                  onChange={handlePayload}
                  id="slitLamp"
                  placeholder="Mild conjunctival injection OD"
                  rows={3}
                />
              </Box>
            </SimpleGrid>
          </Box>

          {/* Diagnosis & Treatment Section */}
          <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              Diagnosis & Treatment Plan
            </Text>
            <SimpleGrid columns={{ base: 1, md: 1 }} spacing={4}>
              <Input
                leftIcon={<FaStethoscope />}
                label="Diagnosis"
                value={payload.diagnosis}
                onChange={handlePayload}
                id="diagnosis"
                placeholder="Acute conjunctivitis"
              />
              <Box>
                <Text fontSize="sm" fontWeight="bold" mb={2}>
                  Treatment Plan
                </Text>
                <TextArea
                  value={payload.treatmentPlan}
                  onChange={handlePayload}
                  id="treatmentPlan"
                  placeholder="Prescribed Tobrex drops QID for 7 days"
                  rows={4}
                />
              </Box>
              <DatePickerComponent
                id="nextAppointmentDate"
                label="Next Appointment Date"
                selected={
                  payload.nextAppointmentDate
                    ? new Date(payload.nextAppointmentDate)
                    : null
                }
                onChange={(date) => handleDateChange(date, "nextAppointmentDate")}
              />
            </SimpleGrid>
          </Box>

          <Flex justifyContent="center" mt={8}>
            <Button
              onClick={handleSubmit}
              isLoading={isLoading}
              w={{ base: "100%", md: "184px" }}
            >
              Submit
            </Button>
          </Flex>
        </Stack>
      </Box>
    </MainLayout>
  );
}
