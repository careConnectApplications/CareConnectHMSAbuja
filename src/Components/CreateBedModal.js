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
  HStack,
  Text,
} from "@chakra-ui/react";
import {
  CreateBedApi,
  GetAllWardApi,
  UpdateBedNumberApi,
} from "../Utils/ApiCalls";
import { FaHashtag } from "react-icons/fa6";
import Button from "./Button";
import Input from "./Input";

const CreateBedModal = ({
  isOpen,
  onClose,
  oldPayload,
  type,
  activateNotifications,
  trigger,
  setTrigger,
}) => {
  const [wards, setWards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    wardid: "",
    bednumber: "",
  });

  useEffect(() => {
    if (isOpen) {
      fetchWards();
      if (type === "edit" && oldPayload) {
        setFormData({
          wardid: oldPayload.ward?._id || "",
          bednumber: oldPayload.bednumber || "",
        });
      } else {
        setFormData({
          wardid: "",
          bednumber: "",
        });
      }
    }
  }, [isOpen, type, oldPayload]);

  const fetchWards = async () => {
    try {
      const result = await GetAllWardApi();
      setWards(result.queryresult.wardmanagementdetails || []);
    } catch (error) {
      activateNotifications(error.message || "Failed to fetch wards", "error");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.wardid || !formData.bednumber) {
      activateNotifications("Please fill all fields", "error");
      return;
    }

    setIsLoading(true);
    try {
      if (type === "edit") {
        const payload = {
          bednumber: formData.bednumber,
        };
        const response = await UpdateBedNumberApi(oldPayload._id, payload);
        if (response.status === 200) {
          activateNotifications("Bed updated successfully", "success");
          setTrigger(!trigger);
          onClose();
        }
      } else {
        const response = await CreateBedApi(formData);
        if (response.status === 200) {
          activateNotifications("Bed created successfully", "success");
          setTrigger(!trigger);
          onClose();
        }
      }
    } catch (error) {
      activateNotifications(error.message || "Operation failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{type === "new" ? "Add New Bed" : "Edit Bed"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing="15px">
            <Select
              name="wardid"
              value={formData.wardid}
              onChange={handleChange}
              placeholder="Select Ward"
              border="2px solid"
              fontSize={formData.wardid !== "" ? "16px" : "13px"}
              borderColor="gray.500"
              isDisabled={type === "edit"}
            >
              {wards.map((ward) => (
                <option key={ward._id} value={ward._id}>
                  {ward.wardname}
                </option>
              ))}
            </Select>

            <Input
              val={formData.bednumber !== ""}
              leftIcon={<FaHashtag />}
              onChange={handleChange}
              name="bednumber"
              value={formData.bednumber}
              label="Bed Number"
            />
          </Stack>

          <HStack mt="32px" justifyContent="flex-end">
            <Button isLoading={isLoading} onClick={handleSubmit}>
              {type === "new" ? "Add Bed" : "Update Bed"}
            </Button>
          </HStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreateBedModal;
