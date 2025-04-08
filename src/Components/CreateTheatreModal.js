import { HStack, Text, Select, Stack } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton
} from '@chakra-ui/react';
import Input from "./Input";
import Button from "./Button";
import { UpdateTheatreAPI, SettingsApi, AddTheatreSettingsApi } from "../Utils/ApiCalls";
import { FaClinicMedical, FaBed } from "react-icons/fa";

export default function CreateTheatreModal({ isOpen, onClose, type, activateNotifications, oldPayload }) {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState({
    bedspecialization: "",
    theatrename: "",
    totalbed: "",
    occupiedbed: ""
  });

  useEffect(() => {
    if (type === "edit" && oldPayload) {
      setPayload(oldPayload);
    } else {
      setPayload({
        bedspecialization: "",
        theatrename: "",
        totalbed: "",
        occupiedbed: ""
      });
    }
    fetchSettings();
  }, [isOpen]);

  const fetchSettings = async () => {
    try {
      const result = await SettingsApi();
      setSettings(result);
    } catch (e) {
      console.error("Error fetching settings:", e);
    }
  };

  const handleChange = (e) => {
    setPayload((prev) => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formattedPayload = {
        ...payload,
        totalbed: Number(payload.totalbed),
        occupiedbed: Number(payload.occupiedbed)
      };

      let response;
      if (type === "new") {
        response = await AddTheatreSettingsApi(formattedPayload);
      } else {
        response = await UpdateTheatreAPI(formattedPayload, oldPayload._id);
      }

      if (response.status === 200) {
        activateNotifications(
          type === "new" ? "Theatre Added Successfully" : "Theatre Updated Successfully",
          "success"
        );
        onClose();
      }
    } catch (e) {
      activateNotifications(e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{type === "new" ? "Add New Theatre" : "Edit Theatre"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing="15px">
            {/* Bed Specialization Dropdown */}
            <Select
              id="bedspecialization"
              value={payload.bedspecialization}
              onChange={handleChange}
              placeholder="Select Bed Specialization"
              border="2px solid"
              fontSize={payload.bedspecialization ? "16px" : "13px"}
              borderColor="gray.500"
            >
              {settings?.clinics?.map((item, i) => (
                <option key={i} value={item.clinic}>
                  {item.clinic}
                </option>
              ))}
            </Select>

            {/* Theatre Name */}
            <Input
              val={!!payload.theatrename}
              leftIcon={<FaClinicMedical />}
              onChange={handleChange}
              id="theatrename"
              value={payload.theatrename}
              label="Theatre Name"
            />

            {/* Total Bed */}
            <Input
              val={!!payload.totalbed}
              leftIcon={<FaBed />}
              onChange={handleChange}
              type="number"
              id="totalbed"
              value={payload.totalbed}
              label="Total Bed"
            />

            {/* Occupied Bed */}
            <Input
              val={!!payload.occupiedbed}
              leftIcon={<FaBed />}
              onChange={handleChange}
              type="number"
              id="occupiedbed"
              value={payload.occupiedbed}
              label="Occupied Bed"
            />
          </Stack>

          <Button mt="32px" isLoading={loading} onClick={handleSubmit}>
            {type === "new" ? "Add Theatre" : "Update Theatre"}
          </Button>
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
}
