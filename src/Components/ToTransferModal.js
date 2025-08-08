import { HStack, Text } from "@chakra-ui/react";
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
  Flex,
  SimpleGrid,
  Box,
} from "@chakra-ui/react";
import Input from "./Input";
import Button from "./Button";
import {
  UpdateAdmissionStatusAPI,
  SettingsApi,
  GetAllWardApi,
  GetAvailableBedsByWardApi,
} from "../Utils/ApiCalls";
import { FaClinicMedical } from "react-icons/fa";
import { FaBed } from "react-icons/fa6";
import { IoMdPricetags } from "react-icons/io";
import { SlPlus } from "react-icons/sl";
import { IoIosCloseCircle } from "react-icons/io";

export default function ToTransferModal({
  isOpen,
  onClose,
  type,
  activateNotifications,
  oldPayload,
}) {
  const [Ward, setWard] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [availableBeds, setAvailableBeds] = useState([]);
  const [isFetchingBeds, setIsFetchingBeds] = useState(false);

  const [Payload, setPayload] = useState({
    transfterto: "",
    bed_id: "",
    status: "transfered",
  });

  const handlePayload = (e) => {
    setPayload({ ...Payload, [e.target.id]: e.target.value });
  };

  const handleWardChange = async (e) => {
    const wardId = e.target.value;
    setPayload({ ...Payload, transfterto: wardId, bed_id: "" }); // Reset bed when ward changes

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
      setWard(result.queryresult.wardmanagementdetails);
    } catch (e) {
      activateNotifications(e.message, "error");
    }
  };

  const handleStatusUpdate = async () => {
    if (!Payload.bed_id) {
      activateNotifications("Please select a bed", "error");
      return;
    }

    try {
      setLoading(true);
      const result = await UpdateAdmissionStatusAPI(
        {
          status: "transfered",
          transfterto: Payload.transfterto,
          bed_id: Payload.bed_id,
        },
        oldPayload.id
      );

      if (result.status === 200) {
        activateNotifications("Patient Transferred Successfully", "success");
        onClose();
        setPayload({
          transfterto: "",
          bed_id: "",
          status: "transfered",
        });
      }
    } catch (e) {
      activateNotifications(e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllWard();
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Transfer Patient</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing="15px">
            <Select
              id="transfterto"
              value={Payload.transfterto}
              onChange={handleWardChange}
              placeholder="Select Ward To Transfer"
              border="2px solid"
              fontSize={Payload.transfterto !== "" ? "16px" : "13px"}
              borderColor="gray.500"
            >
              {Ward?.map((item, i) => (
                <option key={i} value={item._id}>
                  {item.wardname}
                </option>
              ))}
            </Select>

            <Select
              id="bed_id"
              value={Payload.bed_id}
              onChange={handlePayload}
              placeholder={isFetchingBeds ? "Loading beds..." : "Select Bed"}
              border="2px solid"
              fontSize={Payload.bed_id !== "" ? "16px" : "13px"}
              borderColor="gray.500"
              isDisabled={!Payload.transfterto || isFetchingBeds}
            >
              {availableBeds?.map((bed) => (
                <option key={bed._id} value={bed._id}>
                  {bed.bednumber} ({bed.status})
                </option>
              ))}
            </Select>
          </Stack>
          <Button mt="32px" isLoading={Loading} onClick={handleStatusUpdate}>
            Transfer Patient
          </Button>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
}
