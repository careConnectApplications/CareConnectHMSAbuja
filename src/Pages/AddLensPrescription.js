import {
  Box,
  Flex,
  SimpleGrid,
  Text,
  Stack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
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
import { FaNoteSticky } from "react-icons/fa6";
import { AddLensPrescriptionApi } from "../Utils/ApiCalls";

export default function AddLensPrescription() {
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
    rightsphere: "",
    rightcyl: "",
    rightaxis: "",
    rightprism: "",
    rightva: "",
    leftsphere: "",
    leftcyl: "",
    leftaxis: "",
    leftprism: "",
    leftva: "",
    addright: "",
    addleft: "",
    ipdnear: "",
    ipddist: "",
    lensTint: "",
    lensSize: "",
    segHt: "",
    temple: "",
    lensType: "",
    frame: "",
    colour: "",
    remarks: "",
    nextExamDate: "",
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
        const result = await AddLensPrescriptionApi(payload);
    
      console.log("Lens prescription payload:", payload);
      setShowToast({
        show: true,
        message: "Lens prescription added successfully",
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

  const lensTypeOptions = [
   "Adaptics - Photochromic",
            "Adapter micro brass",
            "BF - D Segment",
            "BF - Fused plastic",
            "BF - Invisible Bifocal",
            "BF - Invisible white focus",
            "Contact lens daily wear clear",
            "Contact lens Daily Colour",
            "Adapter transition lenses",
            "BF - Fused plastic lenses",
            "BF - Invisible Bifocal lenses",
            "BF - Invisible white lenses",
            "Contact lens daily wear white",
            "Contact Lens Daily Colour",
            "D-Top B-F Photo",
            "D-Top B-F White",
            "Disposable Contact Lens Colour",
            "D-Top B-F Photo",
            "D-Top B-F White",
            "Disposable Contact Lens colour",
            "Polaron with POA",
            "Polarized",
            "Progressive",
            "Progressive lens",
            "Single Vision Transition",
            "Single Vision with AR",
            "Single Vision Transition with AR",
            "Single Vision Ultra-Thin",
            "Single Vision Ultra-Thin transition",
            "Single Vision White",
            "Sunlenses",
            "Varilux Ellipse",
            "Varilux Ellipse transition",
            "Varilux progressive white lenses"
  ];

  const lensTintOptions = [
             "Amber",
            "Amethyst",
            "Aquamarine",
            "Autumn Gold",
            "Blue",
            "Brown",
            "Copper",
            "Didymium",
            "Green/Grey",
            "Grey",
            "Melanin",
            "Orange",
            "Pewter",
            "Pink",
            "Purple",
            "Rainbow",
            "Red",
            "Rose",
            "Sapphire",
            "Silver",
            "Tan",
            "Therannon",
            "Umber",
            "Yellow"
  ];



  return (
    <MainLayout>
      {showToast.show && (
        <ShowToast message={showToast.message} status={showToast.status} />
      )}
      <Seo
        title="Add Lens Prescription"
        description="Add a new lens prescription for a patient"
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
          {/* Distance Prescription Table */}
          <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              Distance Prescription
            </Text>
            <Box overflowX="auto">
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr bg="gray.50">
                    <Th></Th>
                    <Th textAlign="center">Sphere</Th>
                    <Th textAlign="center">Cyl</Th>
                    <Th textAlign="center">Axis</Th>
                    <Th textAlign="center">Prism</Th>
                    <Th textAlign="center">VA</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td fontWeight="bold" color="blue.blue500">
                      Right:
                    </Td>
                    <Td>
                      <Input
                        size="sm"
                        value={payload.rightsphere}
                        onChange={handlePayload}
                        id="rightsphere"
                        placeholder="-2.50"
                      />
                    </Td>
                    <Td>
                      <Input
                        size="sm"
                        value={payload.rightcyl}
                        onChange={handlePayload}
                        id="rightcyl"
                        placeholder="-1.00"
                      />
                    </Td>
                    <Td>
                      <Input
                        size="sm"
                        value={payload.rightaxis}
                        onChange={handlePayload}
                        id="rightaxis"
                        placeholder="180"
                      />
                    </Td>
                    <Td>
                      <Input
                        size="sm"
                        value={payload.rightprism}
                        onChange={handlePayload}
                        id="rightprism"
                        placeholder="2 BI"
                      />
                    </Td>
                    <Td>
                      <Input
                        size="sm"
                        value={payload.rightva}
                        onChange={handlePayload}
                        id="rightva"
                        placeholder="6/9"
                      />
                    </Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="bold" color="blue.blue500">
                      Left:
                    </Td>
                    <Td>
                      <Input
                        size="sm"
                        value={payload.leftsphere}
                        onChange={handlePayload}
                        id="leftsphere"
                        placeholder="-3.00"
                      />
                    </Td>
                    <Td>
                      <Input
                        size="sm"
                        value={payload.leftcyl}
                        onChange={handlePayload}
                        id="leftcyl"
                        placeholder="-0.75"
                      />
                    </Td>
                    <Td>
                      <Input
                        size="sm"
                        value={payload.leftaxis}
                        onChange={handlePayload}
                        id="leftaxis"
                        placeholder="175"
                      />
                    </Td>
                    <Td>
                      <Input
                        size="sm"
                        value={payload.leftprism}
                        onChange={handlePayload}
                        id="leftprism"
                        placeholder="1.5 BO"
                      />
                    </Td>
                    <Td>
                      <Input
                        size="sm"
                        value={payload.leftva}
                        onChange={handlePayload}
                        id="leftva"
                        placeholder="6/12"
                      />
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </Box>
          </Box>

          {/* Add Distance Section */}
          <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              Add Distance
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <Input
                leftIcon={<FaNoteSticky />}
                label="Right"
                value={payload.addright}
                onChange={handlePayload}
                id="addright"
                placeholder="+2.00"
              />
              <Input
                leftIcon={<FaNoteSticky />}
                label="Left"
                value={payload.addleft}
                onChange={handlePayload}
                id="addleft"
                placeholder="+2.00"
              />
            </SimpleGrid>
          </Box>

          {/* IPD Section */}
          <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              Interpupillary Distance (IPD)
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <Input
                leftIcon={<FaNoteSticky />}
                label="Near"
                value={payload.ipdnear}
                onChange={handlePayload}
                id="ipdnear"
                placeholder="64"
              />
              <Input
                leftIcon={<FaNoteSticky />}
                label="Distance"
                value={payload.ipddist}
                onChange={handlePayload}
                id="ipddist"
                placeholder="68"
              />
            </SimpleGrid>
          </Box>

          {/* Lens Specifications */}
          <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              Lens Specifications
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <Box>
               
                <Select
                  id="lensTint"
                  value={payload.lensTint}
                  onChange={handlePayload}
                  placeholder="Select tint"
                >
                  {lensTintOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </Box>
              <Input
                leftIcon={<FaNoteSticky />}
                label="Lens Size"
                value={payload.lensSize}
                onChange={handlePayload}
                id="lensSize"
                placeholder="54"
              />
              <Input
                leftIcon={<FaNoteSticky />}
                label="Seg Height"
                value={payload.segHt}
                onChange={handlePayload}
                id="segHt"
                placeholder="18"
              />
              <Input
                leftIcon={<FaNoteSticky />}
                label="Temple"
                value={payload.temple}
                onChange={handlePayload}
                id="temple"
                placeholder="140"
              />
              <Box>
                
                <Select
                  id="lensType"
                  value={payload.lensType}
                  onChange={handlePayload}
                  placeholder="Select lens type"
                >
                  {lensTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </Box>
            </SimpleGrid>
          </Box>

          {/* Frame Details */}
          <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              Frame Details
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
             
              <Input
                leftIcon={<FaNoteSticky />}
                label="frame"
                value={payload.frame}
                onChange={handlePayload}
                id="frame"
                placeholder="Black"
              />
              <Input
                leftIcon={<FaNoteSticky />}
                label="Colour"
                value={payload.colour}
                onChange={handlePayload}
                id="colour"
                placeholder="Black"
              />
            </SimpleGrid>
          </Box>

          {/* Additional Information */}
          <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              Additional Information
            </Text>
            <SimpleGrid columns={{ base: 1, md: 1 }} spacing={4}>
              <Box>
                <Text fontSize="sm" fontWeight="bold" mb={2}>
                  Remarks
                </Text>
                <TextArea
                  value={payload.remarks}
                  onChange={handlePayload}
                  id="remarks"
                  placeholder="Patient prefers lightweight lenses."
                  rows={4}
                />
              </Box>
              <Box>
                <SimpleGrid columns={{ base: 1, md: 2 }}  spacing={4}>
                  <DatePickerComponent
                    id="nextExamDate"
                    label="Next Exam Date"
                    selected={
                      payload.nextExamDate
                        ? new Date(
                            payload.nextExamDate
                              .split("/")
                              .reverse()
                              .join("-")
                          )
                        : null
                    }
                    onChange={(date) => handleDateChange(date, "nextExamDate")}
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
