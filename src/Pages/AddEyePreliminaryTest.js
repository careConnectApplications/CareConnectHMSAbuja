import {
    Box,
    Flex,
    SimpleGrid,
    Text,
    Stack,
    useDisclosure,
    Tooltip,
  } from "@chakra-ui/react";
  import React, { useEffect, useState } from "react";
  import MainLayout from "../Layouts/Index";
  import Seo from "../Utils/Seo";
  import Button from "../Components/Button";
  import DatePickerComponent from "../Components/DatePicker";
  import { format } from "date-fns";
  import Input from "../Components/Input";
  import ShowToast from "../Components/ToastNotification";
  import { useNavigate, useParams } from "react-router-dom";
  import { IoMdArrowRoundBack } from "react-icons/io";
import { AddEyePreliminaryTestApi } from "../Utils/ApiCalls";
  import PatientInfoCard from "../Components/PatientInfoCard";
  import { FaNoteSticky } from "react-icons/fa6";
  
  
  export default function AddEyePreliminaryTest() {
    const { id} = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [showToast, setShowToast] = useState({
      show: false,
      message: "",
      status: "",
    });
  
    let PatientId = localStorage.getItem("patientId")
    const [payload, setPayload] = useState({
      patientId: PatientId,
      appointmentId: id,
      vaFarDist: "",
      vaFarOd: "",
      vaFarOs: "",
      vaFarOu: "",
      vaNearDist: "",
      vaNearOd: "",
      vaNearOs: "",
      vaNearOu: "",
      vaPhDist: "",
      vaPhOd: "",
      vaPhOs: "",
      vaPhOu: "",
      vaAidedFarOd: "",
      vaAidedFarOs: "",
      vaAidedFarOu: "",
      vaAidedNearOd: "",
      vaAidedNearOs: "",
      vaAidedNearOu: "",
      vaAidedPhOd: "",
      vaAidedPhOs: "",
      vaAidedPhOu: "",
      cfOd: "",
      cfOs: "",
      hmOd: "",
      hmOs: "",
      lpOd: "",
      lpOs: "",
      nlpOd: "",
      nlpOs: "",
      lpTopOd: "",
      lpBottomOd: "",
      lpLeftOd: "",
      lpRightOd: "",
      lpTopOs: "",
      lpBottomOs: "",
      lpLeftOs: "",
      lpRightOs: "",
      pachymetryOdName: "",
      pachymetryOdDate: "",
      pachymetryOsName: "",
      pachymetryOsDate: "",
      tonometryOdName: "",
      tonometryOdMethodOrTime: "",
      tonometryOsName: "",
      tonometryOsMethodOrTime: "",
      glaucomaVisualFieldsOd: "",
      glaucomaVisualFieldsOs: "",
      glaucomaCupDiskRatioOd: "",
      glaucomaCupDiskRatioOs: "",
      glaucomaIopOd: "",
      glaucomaIopOs: "",
      pdFarOd: "",
      pdFarOs: "",
      pdFarOu: "",
      pdNearOd: "",
      pdNearOs: "",
      pdNearOu: "",
      fieldsFullOd: "",
      fieldsFullOs: "",
      fieldsRestrictedOd: "",
      fieldsRestrictedOs: "",
      distanceReading: "",
      distanceWork: "",
      eyeColour: "",
      hyperEye: "",
      npc: "",
      stereopsis: "",
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
      const formattedDate = format(date, "dd/MM/yyyy");
      setPayload({ ...payload, [id]: formattedDate });
    };
  
    const handleSubmit = async () => {
      setIsLoading(true);
      try {
        await AddEyePreliminaryTestApi(payload);
        setShowToast({
          show: true,
          message: "Preliminary test added successfully",
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
          title="Add Preliminary Eye Test"
          description="Add a new preliminary eye test for a patient"
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
            <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
              <Text fontSize="xl" fontWeight="bold" mb={4}>
                Visual Acuity - Unaided
              </Text>
              <Text fontSize="sm" fontWeight="bold" my={2}>
               Far
              </Text>
              <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
                <Input
                leftIcon={<FaNoteSticky />}
                  label="Dist."
                  value={payload.vaFarDist}
                  onChange={handlePayload}
                  id="vaFarDist"
                />
                <Input
                leftIcon={<FaNoteSticky />}
                  label="OD"
                  value={payload.vaFarOd}
                  onChange={handlePayload}
                  id="vaFarOd"
                />
                <Input
                leftIcon={<FaNoteSticky />}
                  label="OS"
                  value={payload.vaFarOs}
                  onChange={handlePayload}
                  id="vaFarOs"
                />
                <Input
                leftIcon={<FaNoteSticky />}
                  label="OU"
                  value={payload.vaFarOu}
                  onChange={handlePayload}
                  id="vaFarOu"
                />
              </SimpleGrid>
               <Text fontSize="sm" fontWeight="bold" my={2}>
               Near
              </Text>

              <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
                <Input
                leftIcon={<FaNoteSticky />}
                  label="Dist."
                  value={payload.vaNearDist}
                  onChange={handlePayload}
                  id="vaNearDist"
                />
                <Input
                leftIcon={<FaNoteSticky />}
                  label="OD"
                  value={payload.vaNearOd}
                  onChange={handlePayload}
                  id="vaNearOd"
                />
                <Input
                leftIcon={<FaNoteSticky />}
                  label="OS"
                  value={payload.vaNearOs}
                  onChange={handlePayload}
                  id="vaNearOs"
                />
                <Input
                leftIcon={<FaNoteSticky />}
                  label="OU"
                  value={payload.vaNearOu}
                  onChange={handlePayload}
                  id="vaNearOu"
                />
              </SimpleGrid>
               <Text fontSize="sm" fontWeight="bold" my={2}>
               Ph
              </Text>

              <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
                <Input
                leftIcon={<FaNoteSticky />}
                  label="Dist."
                  value={payload.vaPhDist}
                  onChange={handlePayload}
                  id="vaPhDist"
                />
                <Input
                leftIcon={<FaNoteSticky />}
                  label="OD"
                  value={payload.vaPhOd}
                  onChange={handlePayload}
                  id="vaPhOd"
                />
                <Input
                leftIcon={<FaNoteSticky />}
                  label="OS"
                  value={payload.vaPhOs}
                  onChange={handlePayload}
                  id="vaPhOs"
                />
                <Input
                leftIcon={<FaNoteSticky />}
                  label="OU"
                  value={payload.vaPhOu}
                  onChange={handlePayload}
                  id="vaPhOu"
                />
              </SimpleGrid>
            </Box>
  
            <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
              <Text fontSize="xl" fontWeight="bold" mb={4}>
                Visual Acuity - Aided
              </Text>
                <Text fontSize="sm" fontWeight="bold" my={2}>
               Far
              </Text>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                
                <Input
                leftIcon={<FaNoteSticky />}
                  label="OD"
                  value={payload.vaAidedFarOd}
                  onChange={handlePayload}
                  id="vaAidedFarOd"
                />
                <Input
                leftIcon={<FaNoteSticky />}
                  label="OS"
                  value={payload.vaAidedFarOs}
                  onChange={handlePayload}
                  id="vaAidedFarOs"
                />
                <Input
                leftIcon={<FaNoteSticky />}
                  label="OU"
                  value={payload.vaAidedFarOu}
                  onChange={handlePayload}
                  id="vaAidedFarOu"
                />
              </SimpleGrid>
                <Text fontSize="sm" fontWeight="bold" my={2}>
               Near
              </Text>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                
                <Input
                leftIcon={<FaNoteSticky />}
                  label="OD"
                  value={payload.vaAidedNearOd}
                  onChange={handlePayload}
                  id="vaAidedNearOd"
                />
                <Input
                leftIcon={<FaNoteSticky />}
                  label="OS"
                  value={payload.vaAidedNearOs}
                  onChange={handlePayload}
                  id="vaAidedNearOs"
                />
                <Input
                leftIcon={<FaNoteSticky />}
                  label="OU"
                  value={payload.vaAidedNearOu}
                  onChange={handlePayload}
                  id="vaAidedNearOu"
                />
              </SimpleGrid>
                <Text fontSize="sm" fontWeight="bold" my={2}>
               Ph
              </Text>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                
                <Input
                leftIcon={<FaNoteSticky />}
                  label="OD"
                  value={payload.vaAidedPhOd}
                  onChange={handlePayload}
                  id="vaAidedPhOd"
                />
                <Input
                leftIcon={<FaNoteSticky />}
                  label="OS"
                  value={payload.vaAidedPhOs}
                  onChange={handlePayload}
                  id="vaAidedPhOs"
                />
                <Input
                leftIcon={<FaNoteSticky />}
                  label="OU"
                  value={payload.vaAidedPhOu}
                  onChange={handlePayload}
                  id="vaAidedPhOu"
                />
              </SimpleGrid>
            </Box>
  
            <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
              <Text fontSize="xl" fontWeight="bold" mb={4}>
                Pachymetry
              </Text>
              <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
                <Input
                leftIcon={<FaNoteSticky />}
                  label="OD Name"
                  value={payload.pachymetryOdName}
                  onChange={handlePayload}
                  id="pachymetryOdName"
                />
                <DatePickerComponent
                  id="pachymetryOdDate"
                  label="OD Date"
                  selected={
                    payload.pachymetryOdDate
                      ? new Date(
                          payload.pachymetryOdDate.split("/").reverse().join("-")
                        )
                      : null
                  }
                  onChange={(date) => handleDateChange(date, "pachymetryOdDate")}
                />
                <Input
                leftIcon={<FaNoteSticky />}
                  label="OS Name"
                  value={payload.pachymetryOsName}
                  onChange={handlePayload}
                  id="pachymetryOsName"
                />
                <DatePickerComponent
                  id="pachymetryOsDate"
                  label="OS Date"
                  selected={
                    payload.pachymetryOsDate
                      ? new Date(
                          payload.pachymetryOsDate.split("/").reverse().join("-")
                        )
                      : null
                  }
                  onChange={(date) => handleDateChange(date, "pachymetryOsDate")}
                />
              </SimpleGrid>
            </Box>
  
            <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
              <Text fontSize="xl" fontWeight="bold" mb={4}>
                Tonometry
              </Text>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <Input
                leftIcon={<FaNoteSticky />}
                  label="OD Name"
                  value={payload.tonometryOdName}
                  onChange={handlePayload}
                  id="tonometryOdName"
                />
                <Input
                leftIcon={<FaNoteSticky />}
                  label="OD Method/Time"
                  type="date"
                  value={payload.tonometryOdMethodOrTime}
                  onChange={handlePayload}
                  id="tonometryOdMethodOrTime"
                />
                <Input
                leftIcon={<FaNoteSticky />}
                  label="OS Name"
                 
                  value={payload.tonometryOsName}
                  onChange={handlePayload}
                  id="tonometryOsName"
                />
                <Input
                leftIcon={<FaNoteSticky />}
                  label="OS Method/Time"
                   type="date"
                  value={payload.tonometryOsMethodOrTime}
                  onChange={handlePayload}
                  id="tonometryOsMethodOrTime"
                />
              </SimpleGrid>
            </Box>
  
            <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
              <Text fontSize="xl" fontWeight="bold" mb={4}>
                Glaucoma Flowsheet
              </Text>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <Input
                leftIcon={<FaNoteSticky />}
                  label="Visual Fields OD"
                  value={payload.glaucomaVisualFieldsOd}
                  onChange={handlePayload}
                  id="glaucomaVisualFieldsOd"
                />
                <Input
                leftIcon={<FaNoteSticky />}
                  label="Visual Fields OS"
                  value={payload.glaucomaVisualFieldsOs}
                  onChange={handlePayload}
                  id="glaucomaVisualFieldsOs"
                />
                <Input
                leftIcon={<FaNoteSticky />}
                  label="Cup/Disk Ratio OD"
                  value={payload.glaucomaCupDiskRatioOd}
                  onChange={handlePayload}
                  id="glaucomaCupDiskRatioOd"
                />
                <Input
                leftIcon={<FaNoteSticky />}
                  label="Cup/Disk Ratio OS"
                  value={payload.glaucomaCupDiskRatioOs}
                  onChange={handlePayload}
                  id="glaucomaCupDiskRatioOs"
                />
                <Input
                leftIcon={<FaNoteSticky />}
                  label="IOP OD"
                  value={payload.glaucomaIopOd}
                  onChange={handlePayload}
                  id="glaucomaIopOd"
                />
                <Input
                leftIcon={<FaNoteSticky />}
                  label="IOP OS"
                  value={payload.glaucomaIopOs}
                  onChange={handlePayload}
                  id="glaucomaIopOs"
                />
              </SimpleGrid>
            </Box>
  
            <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
              <Text fontSize="xl" fontWeight="bold" mb={4}>
                Pupillary Distance
              </Text>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                <Input
                leftIcon={<FaNoteSticky />}
                  label="Far OD"
                  value={payload.pdFarOd}
                  onChange={handlePayload}
                  id="pdFarOd"
                />
                <Input
                leftIcon={<FaNoteSticky />}
                  label="Far OS"
                  value={payload.pdFarOs}
                  onChange={handlePayload}
                  id="pdFarOs"
                />
                <Input
                leftIcon={<FaNoteSticky />}
                  label="Far OU"
                  value={payload.pdFarOu}
                  onChange={handlePayload}
                  id="pdFarOu"
                />
                <Input
                leftIcon={<FaNoteSticky />}
                  label="Near OD"
                  value={payload.pdNearOd}
                  onChange={handlePayload}
                  id="pdNearOd"
                />
                <Input
                leftIcon={<FaNoteSticky />}
                  label="Near OS"
                  value={payload.pdNearOs}
                  onChange={handlePayload}
                  id="pdNearOs"
                />
                <Input
                leftIcon={<FaNoteSticky />}
                  label="Near OU"
                  value={payload.pdNearOu}
                  onChange={handlePayload}
                  id="pdNearOu"
                />
              </SimpleGrid>
            </Box>
            <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
              <Text fontSize="xl" fontWeight="bold" mb={4}>
                Light Projection 
              </Text>
                <Text fontSize="sm" fontWeight="bold" my={2}>
                OD
              </Text>
              <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
                <Input
                leftIcon={<FaNoteSticky />}
                  label="Top"
                  value={payload.lpTopOd}
                  onChange={handlePayload}
                  id="lpTopOd"
                />
                <Input
                leftIcon={<FaNoteSticky />}
                  label="Bottom"
                  value={payload.lpBottomOd}
                  onChange={handlePayload}
                  id="lpBottomOd"
                />
                <Input
                leftIcon={<FaNoteSticky />}
                  label="Left"
                  value={payload.lpLeftOd}
                  onChange={handlePayload}
                  id="lpLeftOd"
                />
                <Input
                leftIcon={<FaNoteSticky />}
                  label="Right"
                  value={payload.lpRightOd}
                  onChange={handlePayload}
                  id="lpRightOd"
                />
                
              </SimpleGrid>
                <Text fontSize="sm" fontWeight="bold" my={2}>
                OS
              </Text>
              <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
                <Input
                leftIcon={<FaNoteSticky />}
                  label="Top"
                  value={payload.lpTopOs}
                  onChange={handlePayload}
                  id="lpTopOs"
                />
                <Input
                leftIcon={<FaNoteSticky />}
                  label="Bottom"
                  value={payload.lpBottomOs}
                  onChange={handlePayload}
                  id="lpBottomOs"
                />
                <Input
                leftIcon={<FaNoteSticky />}
                  label="Left"
                  value={payload.lpLeftOs}
                  onChange={handlePayload}
                  id="lpLeftOs"
                />
                <Input
                leftIcon={<FaNoteSticky />}
                  label="Right"
                  value={payload.lpRightOs}
                  onChange={handlePayload}
                  id="lpRightOs"
                />
                
              </SimpleGrid>
            </Box>
  
            <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
              <Text fontSize="xl" fontWeight="bold" mb={4}>
                Other Details
              </Text>

             
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
               <Input
                leftIcon={<FaNoteSticky />}
                  label="Counting Finger  OD"
                  value={payload.cfOd}
                  onChange={handlePayload}
                  id="cfOd"
                />
                 <Input
                leftIcon={<FaNoteSticky />}
                  label="Counting Finger  OS"
                  value={payload.cfOs}
                  onChange={handlePayload}
                  id="cfOs"
                />
               <Input
                leftIcon={<FaNoteSticky />}
                  label="Hand Movement OD"
                  value={payload.hmOd}
                  onChange={handlePayload}
                  id="hmOd"
                />
                 <Input
                leftIcon={<FaNoteSticky />}
                  label="Hand Movement OS"
                  value={payload.hmOs}
                  onChange={handlePayload}
                  id="hmOs"
                />
               <Input
                leftIcon={<FaNoteSticky />}
                  label="Light Perception OD"
                  value={payload.lpOd}
                  onChange={handlePayload}
                  id="lpOd"
                />
                 <Input
                leftIcon={<FaNoteSticky />}
                  label="Light Perception OS"
                  value={payload.lpOs}
                  onChange={handlePayload}
                  id="lpOs"
                />
               <Input
                leftIcon={<FaNoteSticky />}
                  label="No Light Perception OD"
                  value={payload.nlpOd}
                  onChange={handlePayload}
                  id="nlpOd"
                />
                 <Input
                leftIcon={<FaNoteSticky />}
                  label="No Light Perception OS"
                  value={payload.nlpOs}
                  onChange={handlePayload}
                  id="nlpOs"
                />
                <Input
                leftIcon={<FaNoteSticky />}
                  label="Fields (Full) OD"
                  value={payload.fieldsFullOd}
                  onChange={handlePayload}
                  id="fieldsFullOd"
                />
                <Input
                leftIcon={<FaNoteSticky />}
                  label="Fields (Full) OS"
                  value={payload.fieldsFullOs}
                  onChange={handlePayload}
                  id="fieldsFullOs"
                />
                <Input
                leftIcon={<FaNoteSticky />}
                  label="Fields (Restricted) OD"
                  value={payload.fieldsRestrictedOd}
                  onChange={handlePayload}
                  id="fieldsRestrictedOd"
                />
                <Input
                leftIcon={<FaNoteSticky />}
                  label="Fields (Restricted) OS"
                  value={payload.fieldsRestrictedOs}
                  onChange={handlePayload}
                  id="fieldsRestrictedOs"
                />
                <Input
                leftIcon={<FaNoteSticky />}
                  label="Distance (Reading)"
                  value={payload.distanceReading}
                  onChange={handlePayload}
                  id="distanceReading"
                />
                <Input
                leftIcon={<FaNoteSticky />}
                  label="Distance (Work)"
                  value={payload.distanceWork}
                  onChange={handlePayload}
                  id="distanceWork"
                />
                <Input
                leftIcon={<FaNoteSticky />}
                  label="Eye Colour"
                  value={payload.eyeColour}
                  onChange={handlePayload}
                  id="eyeColour"
                />
                <Input
                leftIcon={<FaNoteSticky />}
                  label="Hyper Eye"
                  value={payload.hyperEye}
                  onChange={handlePayload}
                  id="hyperEye"
                />
                <Input
                leftIcon={<FaNoteSticky />}
                  label="NPC"
                  value={payload.npc}
                  onChange={handlePayload}
                  id="npc"
                />
                <Input
                leftIcon={<FaNoteSticky />}
                  label="Stereopsis"
                  value={payload.stereopsis}
                  onChange={handlePayload}
                  id="stereopsis"
                />
                <DatePickerComponent
                  id="nextAppointmentDate"
                  label="Next Appointment Date"
                  selected={
                    payload.nextAppointmentDate
                      ? new Date(
                          payload.nextAppointmentDate
                            .split("/")
                            .reverse()
                            .join("-")
                        )
                      : null
                  }
                  onChange={(date) =>
                    handleDateChange(date, "nextAppointmentDate")
                  }
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
