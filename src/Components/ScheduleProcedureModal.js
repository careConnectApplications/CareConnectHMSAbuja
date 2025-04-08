import React, { useState, useEffect } from "react";
import {
  Box,
  SimpleGrid,
  Select,
  Flex,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import Button from "../Components/Button";
import Input from "./Input";
import { IoIosCloseCircle } from "react-icons/io";
import { FaNoteSticky } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import {
  SettingsApi,
  AddProcedureAPI,
  UpdateProcedureAPI,
  GetAllClinicApi,
  SearchPatientApi,
} from "../Utils/ApiCalls";

export default function ScheduleProcedureModal({
  isOpen,
  onClose,
  activateNotifications,
  type,
  oldPayload,
}) {
  // Loading & data fetching state
  const [Loading, setLoading] = useState(false);
  const [Clinics, setClinics] = useState([]);
  const [Settings, setSettings] = useState("");

  // Two separate form states: one for new entries, one for edit mode.
  const [Payload, setPayload] = useState({
    patientId: "",
    clinic: "",
    indicationdiagnosisprocedure: "",
    procedure: "",
    appointmentdate: "",
    cptcodes: "",
    dxcodes: "",
  });
  const [UpdatedPayload, setUpdatedPayload] = useState({
    patientId: "",
    clinic: "",
    indicationdiagnosisprocedure: "",
    procedure: "",
    appointmentdate: "",
    cptcodes: "",
    dxcodes: "",
  });

  // Arrays for handling multiple values (removable tags)
  const [ProcedureArr, setProcedureArr] = useState([]);
  const [CptcodesArr, setCptcodesArr] = useState([]);
  const [DxcodesArr, setDxcodesArr] = useState([]);

  // Patient search state (applies to both modes)
  const [searchMRN, setSearchMRN] = useState("");
  const [Patients, setPatients] = useState([]);
  const [isLoadingPatients, setIsLoadingPatients] = useState(false);

  // Determine which form state and handler to use based on mode.
  const formState = type === "edit" ? UpdatedPayload : Payload;
  const formHandler = type === "edit" ? handleUpdatedPayload : handlePayload;

  // Handler for new mode inputs
  function handlePayload(e) {
    const { id, value } = e.target;
    setPayload({ ...Payload, [id]: value });
    if (id === "procedure") {
      setProcedureArr([...ProcedureArr, value]);
    }
    if (id === "cptcodes") {
      setCptcodesArr([...CptcodesArr, value]);
    }
    if (id === "dxcodes") {
      setDxcodesArr([...DxcodesArr, value]);
    }
  }

  // Handler for edit mode inputs
  function handleUpdatedPayload(e) {
    const { id, value } = e.target;
    setUpdatedPayload({ ...UpdatedPayload, [id]: value });
    if (id === "procedure") {
      setProcedureArr([...ProcedureArr, value]);
    }
    if (id === "cptcodes") {
      setCptcodesArr([...CptcodesArr, value]);
    }
    if (id === "dxcodes") {
      setDxcodesArr([...DxcodesArr, value]);
    }
  }

  const removeProcedureArr = (item) => {
    setProcedureArr(ProcedureArr.filter((p) => p !== item));
  };
  const removeCptcodesArr = (item) => {
    setCptcodesArr(CptcodesArr.filter((c) => c !== item));
  };
  const removeDxcodesArr = (item) => {
    setDxcodesArr(DxcodesArr.filter((d) => d !== item));
  };

  const getSettings = async () => {
    try {
      const result = await SettingsApi();
      setSettings(result);
    } catch (e) {
      console.error(e);
    }
  };

  const getAllClinic = async () => {
    try {
      const result = await GetAllClinicApi();
      setClinics(result.queryresult.clinicdetails);
    } catch (e) {
      console.error(e.message);
    }
  };

  // Handler for patient search
  const handleSearchPatient = async () => {
    setIsLoadingPatients(true);
    try {
      const results = await SearchPatientApi(searchMRN);
      if (results?.queryresult?.patientdetails) {
        setPatients(results.queryresult.patientdetails);
      } else {
        setPatients([]);
      }
    } catch (error) {
      console.error("Error searching patient:", error);
    } finally {
      setIsLoadingPatients(false);
    }
  };

  // When the modal opens, fetch clinics and settings.
  // In edit mode, prefill the form fields—including the patient.
  useEffect(() => {
    getAllClinic();
    getSettings();

    if (type === "edit" && oldPayload) {
      // If the patient is stored inside oldPayload.patient, use that.
      const preselectedPatient =
        oldPayload?.patientId ||
        (oldPayload?.patient && oldPayload.patient._id) ||
        "";
      setUpdatedPayload({
        patientId: preselectedPatient,
        clinic: oldPayload?.clinic || "",
        indicationdiagnosisprocedure:
          oldPayload?.indicationdiagnosisprocedure || "",
        procedure:
          Array.isArray(oldPayload?.procedure) &&
          oldPayload.procedure.length > 0
            ? oldPayload.procedure[0]
            : oldPayload?.procedure || "",
        appointmentdate: oldPayload?.appointmentdate || "",
        cptcodes:
          Array.isArray(oldPayload?.cptcodes) && oldPayload.cptcodes.length > 0
            ? oldPayload.cptcodes[0]
            : oldPayload?.cptcodes || "",
        dxcodes:
          Array.isArray(oldPayload?.dxcodes) && oldPayload.dxcodes.length > 0
            ? oldPayload.dxcodes[0]
            : oldPayload?.dxcodes || "",
      });
      setProcedureArr(
        oldPayload?.procedure
          ? Array.isArray(oldPayload.procedure)
            ? oldPayload.procedure
            : [oldPayload.procedure]
          : []
      );
      setCptcodesArr(
        oldPayload?.cptcodes
          ? Array.isArray(oldPayload.cptcodes)
            ? oldPayload.cptcodes
            : [oldPayload.cptcodes]
          : []
      );
      setDxcodesArr(
        oldPayload?.dxcodes
          ? Array.isArray(oldPayload.dxcodes)
            ? oldPayload.dxcodes
            : [oldPayload.dxcodes]
          : []
      );
      // Ensure the patient appears in the dropdown by adding it to Patients.
      if (oldPayload?.patient) {
        setPatients([oldPayload.patient]);
      }
    }
  }, [isOpen, oldPayload, type]);

  // When modal closes, clear all form state so the next open is empty.
  useEffect(() => {
    if (!isOpen) {
      setPayload({
        patientId: "",
        clinic: "",
        indicationdiagnosisprocedure: "",
        procedure: "",
        appointmentdate: "",
        cptcodes: "",
        dxcodes: "",
      });
      setUpdatedPayload({
        patientId: "",
        clinic: "",
        indicationdiagnosisprocedure: "",
        procedure: "",
        appointmentdate: "",
        cptcodes: "",
        dxcodes: "",
      });
      setProcedureArr([]);
      setCptcodesArr([]);
      setDxcodesArr([]);
      setSearchMRN("");
      setPatients([]);
    }
  }, [isOpen]);

  const handleSubmitNew = async () => {
    setLoading(true);
    try {
      const result = await AddProcedureAPI(
        {
          clinic: Payload.clinic,
          indicationdiagnosisprocedure: Payload.indicationdiagnosisprocedure,
          procedure: ProcedureArr,
          appointmentdate: Payload.appointmentdate,
          cptcodes: CptcodesArr,
          dxcodes: DxcodesArr,
        },
        Payload.patientId
      );
      if (result.status === 200) {
        setLoading(false);
        activateNotifications("Procedure Scheduled Successfully", "success");
        onClose();
      }
    } catch (e) {
      setLoading(false);
      activateNotifications(e.message, "error");
    }
  };

  const handleSubmitEdit = async () => {
    setLoading(true);
    try {
      // Pass the procedure id (oldPayload._id) to the update endpoint.
      const result = await UpdateProcedureAPI(
        {
          clinic: UpdatedPayload.clinic,
          indicationdiagnosisprocedure:
            UpdatedPayload.indicationdiagnosisprocedure,
          procedure: ProcedureArr,
          appointmentdate: UpdatedPayload.appointmentdate,
          cptcodes: CptcodesArr,
          dxcodes: DxcodesArr,
        },
        oldPayload._id // procedure id passed here
      );
      if (result.status === 200) {
        setLoading(false);
        activateNotifications("Procedure Updated Successfully", "success");
        onClose();
      }
    } catch (e) {
      setLoading(false);
      activateNotifications(e.message, "error");
    }
  };

  // Determine which submit handler to use based on mode.
  const handleSubmit = type === "edit" ? handleSubmitEdit : handleSubmitNew;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent
        maxW={{ base: "90%", md: "60%" }}
        maxH="80vh"
        overflowY="auto"
      >
        <ModalHeader>
          {type === "new"
            ? "Add New Procedure"
            : type === "edit"
            ? "Edit Procedure"
            : "Procedure Details"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Patient Search & Selection (common for new and edit) */}
          <SimpleGrid mb="5" columns={1} spacing={5}>
            <Box>
              <Flex mb={2} gap={4}>
                <Input
                  label="Search for Patient"
                  placeholder="Enter MRN, first name, or last name"
                  value={searchMRN}
                  onChange={(e) => setSearchMRN(e.target.value)}
                  leftIcon={<FiSearch size={16} color="blue.500" />}
                  flex="1"
                />
                <Button
                  onClick={handleSearchPatient}
                  w={["100%", "100%", "165px", "205px"]}
                >
                  Search
                </Button>
              </Flex>
              <Select
                onChange={formHandler}
                placeholder={
                  isLoadingPatients ? "Loading patients..." : "Select Patient"
                }
                id="patientId"
                value={formState.patientId}
                fontSize={formState.patientId !== "" ? "16px" : "13px"}
                size="lg"
                border="2px solid"
                borderColor="gray.500"
                mt={4}
                isDisabled={isLoadingPatients}
              >
                {Patients?.map((item, i) => (
                  <option key={i} value={item._id}>
                    {`${item.firstName} ${item.lastName} ~ ${item.MRN}`}
                  </option>
                ))}
              </Select>
            </Box>
          </SimpleGrid>

          {/* Main Form Fields */}
          <SimpleGrid mt="18px" mb="5" columns={1} spacing={5}>
            <Select
              onChange={formHandler}
              placeholder="Select Clinic"
              id="clinic"
              value={formState.clinic}
              fontSize={formState.clinic !== "" ? "16px" : "13px"}
              size="lg"
              border="2px solid"
              borderColor="gray.500"
            >
              {Clinics.filter((item) => item.type === "clinic")?.map(
                (item, i) => (
                  <option key={i} value={item.clinic}>
                    {item.clinic}
                  </option>
                )
              )}
            </Select>
            <Input
              val={formState.indicationdiagnosisprocedure !== "" ? true : false}
              leftIcon={<FaNoteSticky />}
              onChange={formHandler}
              id="indicationdiagnosisprocedure"
              value={formState.indicationdiagnosisprocedure}
              label="Indication Diagnosis Procedure"
            />
            <Select
              onChange={formHandler}
              placeholder="Select Procedure"
              id="procedure"
              value={formState.procedure}
              fontSize={formState.procedure !== "" ? "16px" : "13px"}
              size="lg"
              border="2px solid"
              borderColor="gray.500"
            >
              {Settings?.servicecategory
                ?.filter((item) => item.category === "Procedure")[0]
                ?.type?.map((item, i) => (
                  <option key={i} value={item}>
                    {item}
                  </option>
                ))}
            </Select>
            <SimpleGrid mt="12px" columns={{ base: 2, md: 4 }} spacing={2}>
              {ProcedureArr?.map((item, i) => (
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
                  <Text
                    color="#fff"
                    fontWeight="500"
                    textTransform="capitalize"
                  >
                    {item}
                  </Text>
                  <Box
                    fontSize="20px"
                    color="#fff"
                    onClick={() => removeProcedureArr(item)}
                  >
                    <IoIosCloseCircle />
                  </Box>
                </Flex>
              ))}
            </SimpleGrid>
            <Input
              leftIcon={<FaCalendarAlt />}
              label="Appointment Date"
              type="datetime-local"
              value={formState.appointmentdate}
              onChange={formHandler}
              id="appointmentdate"
            />
            <Select
              onChange={formHandler}
              placeholder="Select CPT Codes"
              id="cptcodes"
              value={formState.cptcodes}
              fontSize={formState.cptcodes !== "" ? "16px" : "13px"}
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
              {CptcodesArr?.map((item, i) => (
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
                  <Text
                    color="#fff"
                    fontWeight="500"
                    textTransform="capitalize"
                  >
                    {item}
                  </Text>
                  <Box
                    fontSize="20px"
                    color="#fff"
                    onClick={() => removeCptcodesArr(item)}
                  >
                    <IoIosCloseCircle />
                  </Box>
                </Flex>
              ))}
            </SimpleGrid>
            <Select
              onChange={formHandler}
              placeholder="Select DX Codes"
              id="dxcodes"
              value={formState.dxcodes}
              fontSize={formState.dxcodes !== "" ? "16px" : "13px"}
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
              {DxcodesArr?.map((item, i) => (
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
                  <Text
                    color="#fff"
                    fontWeight="500"
                    textTransform="capitalize"
                  >
                    {item}
                  </Text>
                  <Box
                    fontSize="20px"
                    color="#fff"
                    onClick={() => removeDxcodesArr(item)}
                  >
                    <IoIosCloseCircle />
                  </Box>
                </Flex>
              ))}
            </SimpleGrid>
          </SimpleGrid>
          <Button mt="32px" isLoading={Loading} onClick={handleSubmit}>
            {type === "edit" ? "Update Procedure" : "Proceed"}
          </Button>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
}
