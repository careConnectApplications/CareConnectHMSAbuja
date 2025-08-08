import { HStack, Radio, RadioGroup, Text } from "@chakra-ui/react";
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
  SimpleGrid,
  Select,
  Flex,
} from "@chakra-ui/react";
import Input from "./Input";
import Button from "./Button";
import DiagnosisCard from "./DiagnosisCard";
import { FaNoteSticky } from "react-icons/fa6";
import { IoColorFilter } from "react-icons/io5";
import {
  SettingsApi,
  GetAllWardApi,
  AdmitPatientApi,
  GetAvailableBedsByWardApi,
} from "../Utils/ApiCalls";
import { FaArrowsToDot } from "react-icons/fa6";
import { AiFillDatabase } from "react-icons/ai";
import { FaCalendarAlt } from "react-icons/fa";
import { SlPlus } from "react-icons/sl";

export default function AdmissionModal({
  isOpen,
  onClose,
  setOldPayload,
  activateNotifications,
  oldPayload,
}) {
  const [Loading, setLoading] = useState(false);
  const [Settings, setSettings] = useState("");
  const [Data, setData] = useState([]);
  const [availableBeds, setAvailableBeds] = useState([]); // State for available beds
  const [isFetchingBeds, setIsFetchingBeds] = useState(false); // Loading state for beds

  const date = Date.now();
  const currentDate = new Date(date).toISOString().split("T")[0];

  const [Payload, setPayload] = useState({
    alldiagnosis: [],
    referedward: "",
    admittospecialization: "",
    referddate: currentDate,
    bed_id: "", // Add bed_id to payload
  });

  const handlePayload = (e) => {
    setPayload({ ...Payload, [e.target.id]: e.target.value });
  };

  // Handle ward selection change
  const handleWardChange = async (e) => {
    const wardId = e.target.value;
    setPayload({ ...Payload, referedward: wardId, bed_id: "" }); // Reset bed when ward changes

    if (wardId) {
      try {
        setIsFetchingBeds(true);
        const result = await GetAvailableBedsByWardApi(wardId);
        setAvailableBeds(result.queryresult.bedDetails);
      } catch (e) {
        activateNotifications("Failed to fetch available beds", "error");
        setAvailableBeds([]);
      } finally {
        setIsFetchingBeds(false);
      }
    } else {
      setAvailableBeds([]);
    }
  };

  const getAllWard = async () => {
    try {
      const result = await GetAllWardApi();
      setData(result.queryresult.wardmanagementdetails);
    } catch (e) {
      activateNotifications(e.message, "error");
    }
  };

  const save = async () => {
    try {
      setLoading(true);
      const patientId = localStorage.getItem("patientId");
      let result = await AdmitPatientApi(Payload, patientId);

      if (result.status === 200) {
        setLoading(false);
        onClose();
        setPayload({
          alldiagnosis: [],
          referedward: "",
          admittospecialization: "",
          referddate: currentDate,
          bed_id: "",
        });
        activateNotifications("Patient Admitted Successfully", "success");
      }
    } catch (e) {
      setLoading(false);
      activateNotifications(e.message, "error");
    }
  };

  const getSettings = async () => {
    try {
      const result = await SettingsApi();
      setSettings(result);
    } catch (e) {
      // Handle error if required.
    }
  };

  useEffect(() => {
    getSettings();
    getAllWard();
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent
        maxW={{ base: "90%", md: "60%" }}
        maxH="80vh"
        overflowY="auto"
      >
        <ModalHeader> In Patient Admission </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex justifyContent={"flex-end"} mb="15px">
            <Button
              w="150px"
              rightIcon={<SlPlus />}
              onClick={() =>
                setPayload({
                  ...Payload,
                  alldiagnosis: [
                    ...Payload.alldiagnosis,
                    {
                      note: "",
                      diagnosis: "",
                    },
                  ],
                })
              }
            >
              Add Diagnosis
            </Button>
          </Flex>

          {Payload.alldiagnosis.map((item, i) => (
            <DiagnosisCard
              data={item}
              oldItem={Payload.alldiagnosis}
              Payload={Payload}
              setPayload={setPayload}
              key={i}
              i={i}
            />
          ))}

          <SimpleGrid
            mt="12px"
            mb="5"
            columns={{ base: 1, md: 2, lg: 2 }}
            spacing={5}
          >
            <Input
              leftIcon={<FaCalendarAlt />}
              isDisabled={true}
              label="Referred Date"
              type="date"
              value={Payload.referddate}
              onChange={handlePayload}
              id="referddate"
            />

            <Select
              h="45px"
              borderWidth="2px"
              fontSize={Payload.admittospecialization !== "" ? "16px" : "13px"}
              borderColor="#6B7280"
              id="admittospecialization"
              value={Payload.admittospecialization}
              onChange={handlePayload}
              placeholder="Admit to specialization"
            >
              {Settings?.clinics?.map((item, i) => (
                <option value={`${item.clinic}`} key={i}>
                  {item.clinic}
                </option>
              ))}
            </Select>

            <Select
              h="45px"
              borderWidth="2px"
              fontSize={Payload.referedward !== "" ? "16px" : "13px"}
              borderColor="#6B7280"
              id="referedward"
              value={Payload.referedward}
              onChange={handleWardChange} // Updated to use handleWardChange
              placeholder="Select Referred Ward"
            >
              {Data?.map((item, i) => (
                <option value={`${item._id}`} key={i}>
                  {item.wardname}
                </option>
              ))}
            </Select>

            {/* New Bed Selection Dropdown */}
            <Select
              h="45px"
              borderWidth="2px"
              fontSize={Payload.bed_id !== "" ? "16px" : "13px"}
              borderColor="#6B7280"
              id="bed_id"
              value={Payload.bed_id}
              onChange={handlePayload}
              placeholder={isFetchingBeds ? "Loading beds..." : "Select Bed"}
              isDisabled={!Payload.referedward || isFetchingBeds}
            >
              {availableBeds?.map((bed) => (
                <option value={bed._id} key={bed._id}>
                  {bed.bednumber} ({bed.status})
                </option>
              ))}
            </Select>
          </SimpleGrid>

          <Button mt="32px" isLoading={Loading} onClick={save}>
            Proceed
          </Button>
        </ModalBody>

        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
}
