import React, { useState, useEffect } from 'react';
import { Box, HStack, SimpleGrid, Select, Flex, Text } from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import Input from "./Input";
import Button from "./Button";
import { IoIosCloseCircle } from 'react-icons/io';
import { FaNoteSticky } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { GetAllClinicApi, GetAllTheatreApi, SettingsApi, ReferTheatreAdmissionApi } from "../Utils/ApiCalls";

export default function ReferTheatreAdmissionModal({ isOpen, onClose, activateNotifications, type, oldPayload }) {
  const [Loading, setLoading] = useState(false);
  const [Clinics, setClinics] = useState([]);
  const [Theatres, setTheatres] = useState([]);
  const [Settings, setSettings] = useState("");
  
  // Get the patientId from localStorage as used in the endpoint
  const patientId = localStorage.getItem('patientId');
  
  const [Payload, setPayload] = useState({
    clinic: "",
    indicationdiagnosisprocedure: "",
    procedure: "",
    appointmentdate: "",
    cptcodes: "",
    dxcodes: "",
    referedtheatre: ""
  });
  
  // Arrays to hold multiple entries
  const [ProcedureArr, setProcedureArr] = useState([]);
  const [CptcodesArr, setCptcodesArr] = useState([]);
  const [DxcodesArr, setDxcodesArr] = useState([]);
  
  const handlePayload = (e) => {
    setPayload({ ...Payload, [e.target.id]: e.target.value });
    if (e.target.id === "procedure") {
      setProcedureArr([...ProcedureArr, e.target.value]);
    }
    if (e.target.id === "cptcodes") {
      setCptcodesArr([...CptcodesArr, e.target.value]);
    }
    if (e.target.id === "dxcodes") {
      setDxcodesArr([...DxcodesArr, e.target.value]);
    }
  };
  
  const removeProcedureArr = (item) => {
    setProcedureArr(ProcedureArr.filter(x => x !== item));
  };
  
  const removeCptcodesArr = (item) => {
    setCptcodesArr(CptcodesArr.filter(x => x !== item));
  };
  
  const removeDxcodesArr = (item) => {
    setDxcodesArr(DxcodesArr.filter(x => x !== item));
  };
  
  const getClinics = async () => {
    try {
      const result = await GetAllClinicApi();
      setClinics(result.queryresult.clinicdetails);
    } catch (e) {
      console.log(e.message);
    }
  };
  
  const getTheatres = async () => {
    try {
      const result = await GetAllTheatreApi();
      // Assuming the API returns theatre details in queryresult.theatremanagementdetails
      setTheatres(result.queryresult.theatremanagementdetails);
    } catch (e) {
      console.log(e.message);
    }
  };
  
  const getSettingsData = async () => {
    try {
      const result = await SettingsApi();
      setSettings(result);
    } catch (e) {
      console.log(e.message);
    }
  };
  
  useEffect(() => {
    getClinics();
    getTheatres();
    getSettingsData();
    if (type === "edit" && oldPayload) {
      setPayload({
        clinic: oldPayload?.clinic,
        indicationdiagnosisprocedure: oldPayload?.indicationdiagnosisprocedure,
        procedure: oldPayload?.procedure,
        appointmentdate: oldPayload?.appointmentdate,
        cptcodes: oldPayload?.cptcodes,
        dxcodes: oldPayload?.dxcodes,
        referedtheatre: oldPayload?.referedtheatre,
      });
      setProcedureArr(oldPayload?.procedure || []);
      setCptcodesArr(oldPayload?.cptcodes || []);
      setDxcodesArr(oldPayload?.dxcodes || []);
    }
  }, [isOpen]);
  
  const handleSubmitNew = async () => {
    setLoading(true);
    try {
      const result = await ReferTheatreAdmissionApi(patientId, {
        clinic: Payload.clinic,
        indicationdiagnosisprocedure: Payload.indicationdiagnosisprocedure,
        procedures: ProcedureArr,
        appointmentdate: Payload.appointmentdate,
        cptcodes: CptcodesArr,
        dxcodes: DxcodesArr,
        referedtheatre: Payload.referedtheatre
      });
      if (result.status === 200) {
        setLoading(false);
        // Reset the state
        setPayload({
          clinic: "",
          indicationdiagnosisprocedure: "",
          procedure: "",
          appointmentdate: "",
          cptcodes: "",
          dxcodes: "",
          referedtheatre: ""
        });
        setProcedureArr([]);
        setCptcodesArr([]);
        setDxcodesArr([]);
        activateNotifications("Refer Theatre Admission Successful", "success");
        onClose();
      }
    } catch (e) {
      setLoading(false);
      activateNotifications(e.message, "error");
      onClose(); 
    }
  };
  
 
  const handleSubmitUpdate = async () => {
    // Update logic here if needed
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent maxW={{ base: "90%", md: "60%" }} maxH="80vh" overflowY="auto">
        <ModalHeader>
          {type === "new"
            ? "Add New Refer Theatre Admission"
            : type === "edit"
            ? "Edit Refer Theatre Admission"
            : "Refer Theatre Admission Details"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {type === "new" ? (
            <>
              <SimpleGrid mt="18px" mb="5" columns={{ base: 1, md: 1, lg: 1 }} spacing={5}>
                {/* Clinic selection */}
                <Select
                  onChange={handlePayload}
                  placeholder="Select Clinic"
                  id="clinic"
                  value={Payload.clinic}
                  fontSize={Payload.clinic !== "" ? "16px" : "13px"}
                  size="lg"
                  border="2px solid"
                  borderColor="gray.500"
                >
                  {Clinics.filter(item => item.type === "clinic").map((item, i) => (
                    <option key={i} value={item.clinic}>
                      {item.clinic}
                    </option>
                  ))}
                </Select>
                {/* Refered Theatre Dropdown */}
                <Select
                  onChange={handlePayload}
                  placeholder="Select Theatre"
                  id="referedtheatre"
                  value={Payload.referedtheatre}
                  fontSize={Payload.referedtheatre !== "" ? "16px" : "13px"}
                  size="lg"
                  border="2px solid"
                  borderColor="gray.500"
                >
                  {Theatres.map((item, i) => (
                    <option key={i} value={item._id}>
                      {item.theatrename}
                    </option>
                  ))}
                </Select>
                {/* Procedure selection */}
                <Select
                  onChange={handlePayload}
                  placeholder="Select Procedure"
                  id="procedure"
                  value={Payload.procedure}
                  fontSize={Payload.procedure !== "" ? "16px" : "13px"}
                  size="lg"
                  border="2px solid"
                  borderColor="gray.500"
                >
                  {Settings?.servicecategory
                    ?.filter(item => item.category === "Procedure")[0]
                    ?.type?.map((item, i) => (
                      <option key={i} value={item}>
                        {item}
                      </option>
                    ))}
                </Select>
                {/* Display selected procedures */}
                <SimpleGrid mt="12px" columns={{ base: 2, md: 4 }} spacing={2}>
                  {ProcedureArr.map((item, i) => (
                    <Flex
                      key={i}
                      cursor="pointer"
                      px="10px"
                      py="10px"
                      rounded="25px"
                      fontSize="13px"
                      _hover={{ bg: "blue.blue400" }}
                      bg="blue.blue500"
                      w="100%"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Text color="#fff" fontWeight="500" textTransform="capitalize">
                        {item}
                      </Text>
                      <Box fontSize="20px" color="#fff" onClick={() => removeProcedureArr(item)}>
                        <IoIosCloseCircle />
                      </Box>
                    </Flex>
                  ))}
                </SimpleGrid>
                {/* Indication Diagnosis Procedure */}
                <Input
                  val={Payload.indicationdiagnosisprocedure !== "" ? true : false}
                  leftIcon={<FaNoteSticky />}
                  onChange={handlePayload}
                  id="indicationdiagnosisprocedure"
                  value={Payload.indicationdiagnosisprocedure}
                  label="Indication Diagnosis Procedure"
                />
                {/* Appointment Date */}
                <Input
                  leftIcon={<FaCalendarAlt />}
                  label="Appointment Date"
                  type="datetime-local"
                  value={Payload.appointmentdate}
                  onChange={handlePayload}
                  id="appointmentdate"
                />
                {/* CPT Codes */}
                <Select
                  onChange={handlePayload}
                  placeholder="Select CPT Codes"
                  id="cptcodes"
                  value={Payload.cptcodes}
                  fontSize={Payload.cptcodes !== "" ? "16px" : "13px"}
                  size="lg"
                  border="2px solid"
                  borderColor="gray.500"
                >
                  {Settings?.cptcodes?.map((item, i) => (
                    <option key={i} value={item}>
                      {item}
                    </option>
                  ))}
                </Select>
                <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>
                  {CptcodesArr.map((item, i) => (
                    <Flex
                      key={i}
                      cursor="pointer"
                      px="10px"
                      py="10px"
                      rounded="25px"
                      fontSize="13px"
                      _hover={{ bg: "blue.blue400" }}
                      bg="blue.blue500"
                      w="100%"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Text color="#fff" fontWeight="500" textTransform="capitalize">
                        {item}
                      </Text>
                      <Box fontSize="20px" color="#fff" onClick={() => removeCptcodesArr(item)}>
                        <IoIosCloseCircle />
                      </Box>
                    </Flex>
                  ))}
                </SimpleGrid>
                {/* DX Codes */}
                <Select
                  onChange={handlePayload}
                  placeholder="Select DX Codes"
                  id="dxcodes"
                  value={Payload.dxcodes}
                  fontSize={Payload.dxcodes !== "" ? "16px" : "13px"}
                  size="lg"
                  border="2px solid"
                  borderColor="gray.500"
                >
                  {Settings?.dxcodes?.map((item, i) => (
                    <option key={i} value={item}>
                      {item}
                    </option>
                  ))}
                </Select>
                <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>
                  {DxcodesArr.map((item, i) => (
                    <Flex
                      key={i}
                      cursor="pointer"
                      px="10px"
                      py="10px"
                      rounded="25px"
                      fontSize="13px"
                      _hover={{ bg: "blue.blue400" }}
                      bg="blue.blue500"
                      w="100%"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Text color="#fff" fontWeight="500" textTransform="capitalize">
                        {item}
                      </Text>
                      <Box fontSize="20px" color="#fff" onClick={() => removeDxcodesArr(item)}>
                        <IoIosCloseCircle />
                      </Box>
                    </Flex>
                  ))}
                </SimpleGrid>
              </SimpleGrid>
              <Button mt="32px" isLoading={Loading} onClick={handleSubmitNew}>
                Proceed
              </Button>
            </>
          ) : type === "edit" ? (
            <>
              {/* Similar layout for editing can be implemented here */}
            </>
          ) : (
            <>
              {/* Optionally, display details if needed */}
            </>
          )}
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
}
