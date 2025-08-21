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
  useToast,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import Input from "./Input";
import Button from "./Button";
import {
  CreateHmoCategoryCoverApi,
  UpdateHmoCategoryCoverApi,
  GetAllServiceApi,
  GetAllInsuranceApi,
} from "../Utils/ApiCalls";
import { MdOutlineCategory } from "react-icons/md";
import { FaRegBuilding } from "react-icons/fa";
import { TbPercentage } from "react-icons/tb";

export default function CreateInsuranceCoverModal({
  isOpen,
  onClose,
  type,
  activateNotifications,
  oldPayload,
}) {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [hmos, setHmos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [payload, setPayload] = useState({
    hmo_id: "",
    category: "",
    percentage_cover: "",
  });
  const [updatedPayload, setUpdatedPayload] = useState({
    hmo_id: "",
    category: "",
    percentage_cover: "",
  });
  const toast = useToast();

  // Fetch data when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchDropdownData();
    }
  }, [isOpen]);

  const fetchDropdownData = async () => {
    setFetching(true);
    try {
      const [serviceResult, insuranceResult] = await Promise.all([
        GetAllServiceApi(),
        GetAllInsuranceApi(),
      ]);

      const serviceData = serviceResult.queryresult.servicetypedetails;
      const insuranceData = insuranceResult.queryresult.hmomanagementdetails;

      setHmos(insuranceData);

      // Extract unique service categories
      const categoryMap = new Map();
      serviceData.forEach((item) => {
        if (item.category) {
          categoryMap.set(item.category, item.category);
        }
      });
      setCategories(
        Array.from(categoryMap.values()).map((cat) => ({ name: cat }))
      );
    } catch (error) {
      toast({
        title: "Error fetching data",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setFetching(false);
    }
  };

  const handlePayload = (e) => {
    setPayload({ ...payload, [e.target.id]: e.target.value });
  };

  const handleUpdatedPayload = (e) => {
    setUpdatedPayload({ ...updatedPayload, [e.target.id]: e.target.value });
  };

  const addInsuranceCover = async () => {
    setLoading(true);
    try {
      const payloadToSend = {
        hmoId: payload.hmo_id,
        category: payload.category,
        hmopercentagecover: payload.percentage_cover,
      };
      const result = await CreateHmoCategoryCoverApi(payloadToSend);
      if (result.status === 200) {
        setPayload({
          hmo_id: "",
          category: "",
          percentage_cover: "",
        });
        activateNotifications("Insurance Cover Added Successfully", "success");
        onClose();
      }
    } catch (e) {
      activateNotifications(e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const updateInsuranceCover = async () => {
    setLoading(true);
    try {
      const payloadToSend = {
        hmoId: updatedPayload.hmo_id,
        category: updatedPayload.category,
        hmopercentagecover: updatedPayload.percentage_cover,
      };
      const result = await UpdateHmoCategoryCoverApi(
        payloadToSend,
        oldPayload._id
      );
      if (result.status === 200) {
        activateNotifications(
          "Insurance Cover Updated Successfully",
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

  useEffect(() => {
    if (type === "edit" && oldPayload) {
      setUpdatedPayload({
        hmo_id: oldPayload.hmoId?._id || "",
        category: oldPayload.category || "",
        percentage_cover: oldPayload.hmopercentagecover || "",
      });
    }
  }, [type, oldPayload]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {type === "new" ? "Add Insurance Cover" : "Edit Insurance Cover"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing="15px">
            {/* HMO Dropdown */}
            <Select
              id="hmo_id"
              value={type === "new" ? payload.hmo_id : updatedPayload.hmo_id}
              onChange={type === "new" ? handlePayload : handleUpdatedPayload}
              placeholder={fetching ? "Loading HMOs..." : "Select HMO"}
              isDisabled={fetching}
              border="2px solid"
              fontSize={
                (type === "new" ? payload.hmo_id : updatedPayload.hmo_id)
                  ? "16px"
                  : "13px"
              }
              borderColor="gray.500"
            >
              {hmos.map((hmo) => (
                <option key={hmo._id} value={hmo._id}>
                  {hmo.hmoname}
                </option>
              ))}
            </Select>

            {/* Category Dropdown */}
            <Select
              id="category"
              value={
                type === "new" ? payload.category : updatedPayload.category
              }
              onChange={type === "new" ? handlePayload : handleUpdatedPayload}
              placeholder={
                fetching ? "Loading Categories..." : "Select Category"
              }
              isDisabled={fetching}
              border="2px solid"
              fontSize={
                (type === "new" ? payload.category : updatedPayload.category)
                  ? "16px"
                  : "13px"
              }
              borderColor="gray.500"
            >
              {categories.map((category, index) => (
                <option key={index} value={category.name}>
                  {category.name}
                </option>
              ))}
            </Select>

            {/* Percentage Cover Input */}
            <Input
              val={
                (type === "new"
                  ? payload.percentage_cover
                  : updatedPayload.percentage_cover) !== ""
              }
              leftIcon={<TbPercentage />}
              onChange={type === "new" ? handlePayload : handleUpdatedPayload}
              type="number"
              id="percentage_cover"
              value={
                type === "new"
                  ? payload.percentage_cover
                  : updatedPayload.percentage_cover
              }
              label="Percentage Cover"
              isDisabled={fetching}
            />
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button
            mt="32px"
            isLoading={loading || fetching}
            onClick={type === "new" ? addInsuranceCover : updateInsuranceCover}
            isDisabled={fetching}
          >
            {type === "new" ? "Add Insurance Cover" : "Update Insurance Cover"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
