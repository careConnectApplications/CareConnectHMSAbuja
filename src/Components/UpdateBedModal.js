import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
} from "@chakra-ui/react";
import { UpdateBedNumberApi, GetAllWardApi } from "../Utils/ApiCalls";

const UpdateBedModal = ({ isOpen, onClose, bedData, trigger, setTrigger }) => {
  const toast = useToast();
  const [wards, setWards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    wardid: "",
    bednumber: "",
  });

  useEffect(() => {
    if (isOpen && bedData) {
      setFormData({
        wardid: bedData.ward?._id || "",
        bednumber: bedData.bednumber || "",
      });
      fetchWards();
    }
  }, [isOpen, bedData]);

  const fetchWards = async () => {
    try {
      const result = await GetAllWardApi();
      setWards(result.queryresult.wardmanagementdetails);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
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
    if (!formData.bednumber) {
      toast({
        title: "Error",
        description: "Please enter bed number",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        bednumber: formData.bednumber,
      };
      const response = await UpdateBedNumberApi(bedData._id, payload);
      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Bed updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setTrigger(!trigger);
        onClose();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Update Bed</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl mb={4}>
            <FormLabel>Ward</FormLabel>
            <Select
              placeholder="Select ward"
              name="wardid"
              value={formData.wardid}
              onChange={handleChange}
              isDisabled={true}
            >
              {wards.map((ward) => (
                <option key={ward._id} value={ward._id}>
                  {ward.wardname}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Bed Number</FormLabel>
            <Input
              placeholder="Enter bed number"
              name="bednumber"
              value={formData.bednumber}
              onChange={handleChange}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={handleSubmit}
            isLoading={isLoading}
          >
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UpdateBedModal;
