import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Grid,
  GridItem,
  SimpleGrid,
  Box,
  Text,
  Flex,
  HStack,
  Badge,
} from "@chakra-ui/react";
import Button from "./Button";
import ShowToast from "./ToastNotification";
import {
  CreatePostnatalCareApi,
  UpdatePostnatalCareApi,
  GetPostnatalCareByIdApi,
  SettingsApi,
} from "../Utils/ApiCalls";
import { IoIosCloseCircle } from "react-icons/io";
import { SlPlus } from "react-icons/sl";

export default function PostnatalCareModal({
  isOpen,
  onClose,
  mode,
  data,
  patientId,
  fetchData,
}) {
  const [formData, setFormData] = useState({
    typeOfVisit: "",
    parity: "",
    motherWeeks: "",
    motherDays: "",
    newBornWeeks: "",
    newBornDays: "",
    sexOfChild: "",
    kangarooMotherCare: "",
    numberOfBabiesDelivered: "",
    outcomeOfVisit: {
      visit: "",
      visitFor: "",
      outcomeOfVisit: "",
      associatedProblems: "",
      services: [],
      neonatalComplications: [],
      counselling: [],
    },
  });

  const [servicesInput, setServicesInput] = useState("");
  const [complicationsInput, setComplicationsInput] = useState("");
  const [counsellingInput, setCounsellingInput] = useState("");

  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    status: "",
  });

  const isReadOnly = mode === "view";

  // Get enum values from settings using the correct keys
  const getEnumValues = (fieldName) => {
    if (!settings || !settings[fieldName]) return [];
    return Array.isArray(settings[fieldName]) ? settings[fieldName] : [];
  };

  const activateNotifications = (message, status) => {
    setShowToast({
      show: true,
      message: message,
      status: status,
    });

    setTimeout(() => {
      setShowToast({
        show: false,
        message: "",
        status: "",
      });
    }, 5000);
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await SettingsApi();
        setSettings(response);
      } catch (error) {
        console.error("Error fetching settings:", error);
        activateNotifications("Failed to fetch settings.", "error");
      }
    };

    if (isOpen) {
      fetchSettings();
    }
  }, [isOpen]);

  useEffect(() => {
    if ((mode === "edit" || mode === "view") && data) {
      const recordId = data._id;
      const fetchRecordData = async () => {
        setIsLoading(true);
        try {
          const response = await GetPostnatalCareByIdApi(recordId);
          if (response.status === true) {
            const record = response.queryresult;
            setFormData({
              typeOfVisit: record.typeOfVisit || "",
              parity: record.parity || "",
              motherWeeks: record.motherWeeks || "",
              motherDays: record.motherDays || "",
              newBornWeeks: record.newBornWeeks || "",
              newBornDays: record.newBornDays || "",
              sexOfChild: record.sexOfChild || "",
              kangarooMotherCare: record.kangarooMotherCare || "",
              numberOfBabiesDelivered: record.numberOfBabiesDelivered || "",
              outcomeOfVisit: record.outcomeOfVisit || {
                visit: "",
                visitFor: "",
                outcomeOfVisit: "",
                associatedProblems: "",
                services: [],
                neonatalComplications: [],
                counselling: [],
              },
            });
          }
        } catch (error) {
          console.error("Error fetching record data:", error);
          activateNotifications("Failed to fetch record data.", "error");
        } finally {
          setIsLoading(false);
        }
      };
      fetchRecordData();
    } else {
      setFormData({
        typeOfVisit: "",
        parity: "",
        motherWeeks: "",
        motherDays: "",
        newBornWeeks: "",
        newBornDays: "",
        sexOfChild: "",
        kangarooMotherCare: "",
        numberOfBabiesDelivered: "",
        outcomeOfVisit: {
          visit: "",
          visitFor: "",
          outcomeOfVisit: "",
          associatedProblems: "",
          services: [],
          neonatalComplications: [],
          counselling: [],
        },
      });
      setServicesInput("");
      setComplicationsInput("");
      setCounsellingInput("");
    }
  }, [mode, data, isOpen]);

  const handleChange = (e) => {
    if (isReadOnly) return; // Prevent changes in view mode

    const { name, value } = e.target;

    if (name.startsWith("outcomeOfVisit.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        outcomeOfVisit: {
          ...prev.outcomeOfVisit,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Add service to array
  const addService = () => {
    if (isReadOnly || !servicesInput) return;
    setFormData((prev) => ({
      ...prev,
      outcomeOfVisit: {
        ...prev.outcomeOfVisit,
        services: [...prev.outcomeOfVisit.services, servicesInput],
      },
    }));
    setServicesInput("");
  };

  // Remove service from array
  const removeService = (service) => {
    if (isReadOnly) return;
    setFormData((prev) => ({
      ...prev,
      outcomeOfVisit: {
        ...prev.outcomeOfVisit,
        services: prev.outcomeOfVisit.services.filter((s) => s !== service),
      },
    }));
  };

  // Add complication to array
  const addComplication = () => {
    if (isReadOnly || !complicationsInput) return;
    setFormData((prev) => ({
      ...prev,
      outcomeOfVisit: {
        ...prev.outcomeOfVisit,
        neonatalComplications: [
          ...prev.outcomeOfVisit.neonatalComplications,
          complicationsInput,
        ],
      },
    }));
    setComplicationsInput("");
  };

  // Remove complication from array
  const removeComplication = (complication) => {
    if (isReadOnly) return;
    setFormData((prev) => ({
      ...prev,
      outcomeOfVisit: {
        ...prev.outcomeOfVisit,
        neonatalComplications: prev.outcomeOfVisit.neonatalComplications.filter(
          (c) => c !== complication
        ),
      },
    }));
  };

  // Add counselling item to array
  const addCounselling = () => {
    if (isReadOnly || !counsellingInput) return;
    setFormData((prev) => ({
      ...prev,
      outcomeOfVisit: {
        ...prev.outcomeOfVisit,
        counselling: [...prev.outcomeOfVisit.counselling, counsellingInput],
      },
    }));
    setCounsellingInput("");
  };

  // Remove counselling item from array
  const removeCounselling = (counsellingItem) => {
    if (isReadOnly) return;
    setFormData((prev) => ({
      ...prev,
      outcomeOfVisit: {
        ...prev.outcomeOfVisit,
        counselling: prev.outcomeOfVisit.counselling.filter(
          (c) => c !== counsellingItem
        ),
      },
    }));
  };

  const handleSubmit = async () => {
    if (isReadOnly) return;

    setIsLoading(true);
    const payload = { ...formData, patient: patientId };

    try {
      if (mode === "create") {
        const response = await CreatePostnatalCareApi(payload);
        if (response.status === true) {
          activateNotifications("Record created successfully.", "success");
          fetchData();
          onClose();
        } else {
          activateNotifications(response.msg, "error");
        }
      } else if (mode === "edit") {
        const response = await UpdatePostnatalCareApi(payload, data._id);
        if (response.status === true) {
          activateNotifications("Record updated successfully.", "success");
          fetchData();
          onClose();
        } else {
          activateNotifications(response.msg, "error");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      activateNotifications(
        error?.response?.msg || "Failed to save record.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const modalTitle =
    mode === "create"
      ? "Add Postnatal Care Record"
      : mode === "edit"
      ? "Edit Postnatal Care Record"
      : "View Postnatal Care Record";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="6xl"
      isCentered
      scrollBehavior="inside"
      blockScrollOnMount={false}
    >
      <ModalOverlay />
      <ModalContent maxH="90vh">
        {showToast.show && (
          <ShowToast message={showToast.message} status={showToast.status} />
        )}
        <ModalHeader>{modalTitle}</ModalHeader>
        <ModalCloseButton />
        <ModalBody overflowY="auto" pb={6}>
          <Text fontSize="16px" fontWeight="600" mb="16px">
            Basic Information
          </Text>
          <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={6}>
            <GridItem>
              <FormControl>
                <FormLabel>Type of Visit</FormLabel>
                <Select
                  name="typeOfVisit"
                  value={formData.typeOfVisit}
                  onChange={handleChange}
                  isReadOnly={isReadOnly}
                  isDisabled={isReadOnly}
                  placeholder="Select visit type"
                >
                  {getEnumValues("typeOfVisit").map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Parity</FormLabel>
                <Input
                  name="parity"
                  value={formData.parity}
                  onChange={handleChange}
                  isReadOnly={isReadOnly}
                  placeholder="Enter parity"
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Mother Weeks</FormLabel>
                <Input
                  name="motherWeeks"
                  value={formData.motherWeeks}
                  onChange={handleChange}
                  isReadOnly={isReadOnly}
                  placeholder="Enter weeks"
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Mother Days</FormLabel>
                <Input
                  name="motherDays"
                  value={formData.motherDays}
                  onChange={handleChange}
                  isReadOnly={isReadOnly}
                  placeholder="Enter days"
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Newborn Weeks</FormLabel>
                <Input
                  name="newBornWeeks"
                  value={formData.newBornWeeks}
                  onChange={handleChange}
                  isReadOnly={isReadOnly}
                  placeholder="Enter weeks"
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Newborn Days</FormLabel>
                <Input
                  name="newBornDays"
                  value={formData.newBornDays}
                  onChange={handleChange}
                  isReadOnly={isReadOnly}
                  placeholder="Enter days"
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Sex of Child</FormLabel>
                <Select
                  name="sexOfChild"
                  value={formData.sexOfChild}
                  onChange={handleChange}
                  isReadOnly={isReadOnly}
                  isDisabled={isReadOnly}
                  placeholder="Select sex"
                >
                  {getEnumValues("gender").map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Kangaroo Mother Care</FormLabel>
                <Select
                  name="kangarooMotherCare"
                  value={formData.kangarooMotherCare}
                  onChange={handleChange}
                  isReadOnly={isReadOnly}
                  isDisabled={isReadOnly}
                  placeholder="Select care type"
                >
                  {getEnumValues("kangarooMotherCare").map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Number of Babies Delivered</FormLabel>
                <Input
                  type="number"
                  name="numberOfBabiesDelivered"
                  value={formData.numberOfBabiesDelivered}
                  onChange={handleChange}
                  isReadOnly={isReadOnly}
                  placeholder="Enter number"
                />
              </FormControl>
            </GridItem>
          </Grid>

          <Text fontSize="16px" fontWeight="600" mb="16px">
            Outcome of Visit
          </Text>
          <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={6}>
            <GridItem>
              <FormControl>
                <FormLabel>Visit</FormLabel>
                <Select
                  name="outcomeOfVisit.visit"
                  value={formData.outcomeOfVisit.visit}
                  onChange={handleChange}
                  isReadOnly={isReadOnly}
                  isDisabled={isReadOnly}
                  placeholder="Select visit"
                >
                  {getEnumValues("visit").map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Visit For</FormLabel>
                <Input
                  name="outcomeOfVisit.visitFor"
                  value={formData.outcomeOfVisit.visitFor}
                  onChange={handleChange}
                  isReadOnly={isReadOnly}
                  placeholder="Enter purpose of visit"
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Outcome of Visit</FormLabel>
                <Select
                  name="outcomeOfVisit.outcomeOfVisit"
                  value={formData.outcomeOfVisit.outcomeOfVisit}
                  onChange={handleChange}
                  isReadOnly={isReadOnly}
                  isDisabled={isReadOnly}
                  placeholder="Select outcome"
                >
                  {getEnumValues("outcomeOfVisit").map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Associated Problems</FormLabel>
                <Input
                  name="outcomeOfVisit.associatedProblems"
                  value={formData.outcomeOfVisit.associatedProblems}
                  onChange={handleChange}
                  isReadOnly={isReadOnly}
                  placeholder="Enter associated problems"
                />
              </FormControl>
            </GridItem>

            {/* Services */}
            <GridItem colSpan={2}>
              <FormControl>
                <FormLabel>Services</FormLabel>
                <Flex
                  direction={{ base: "column", md: "row" }}
                  alignItems="center"
                >
                  <Select
                    value={servicesInput}
                    onChange={(e) =>
                      !isReadOnly && setServicesInput(e.target.value)
                    }
                    placeholder="Select service"
                    isReadOnly={isReadOnly}
                    isDisabled={isReadOnly}
                    mr={2}
                  >
                    {getEnumValues("services").map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                  {!isReadOnly && (
                    <Button
                      mt={{ base: 2, md: 0 }}
                      onClick={addService}
                      rightIcon={<SlPlus />}
                      disabled={!servicesInput}
                    >
                      Add
                    </Button>
                  )}
                </Flex>
                <SimpleGrid columns={{ base: 2, md: 3 }} spacing={2} mt={2}>
                  {formData.outcomeOfVisit.services.map((service, idx) => (
                    <Flex
                      key={idx}
                      cursor="pointer"
                      px="10px"
                      py="10px"
                      rounded="full"
                      bg="blue.blue500"
                      color="white"
                      fontSize="sm"
                      _hover={{ bg: "blue.400" }}
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Text fontWeight="medium">{service}</Text>
                      {!isReadOnly && (
                        <Box
                          fontSize="lg"
                          onClick={() => removeService(service)}
                        >
                          <IoIosCloseCircle />
                        </Box>
                      )}
                    </Flex>
                  ))}
                </SimpleGrid>
              </FormControl>
            </GridItem>

            {/* Neonatal Complications */}
            <GridItem colSpan={2}>
              <FormControl>
                <FormLabel>Neonatal Complications</FormLabel>
                <Flex
                  direction={{ base: "column", md: "row" }}
                  alignItems="center"
                >
                  <Select
                    value={complicationsInput}
                    onChange={(e) =>
                      !isReadOnly && setComplicationsInput(e.target.value)
                    }
                    placeholder="Select complication"
                    isReadOnly={isReadOnly}
                    isDisabled={isReadOnly}
                    mr={2}
                  >
                    {getEnumValues("neonatalComplications").map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                  {!isReadOnly && (
                    <Button
                      mt={{ base: 2, md: 0 }}
                      onClick={addComplication}
                      rightIcon={<SlPlus />}
                      disabled={!complicationsInput}
                    >
                      Add
                    </Button>
                  )}
                </Flex>
                <SimpleGrid columns={{ base: 2, md: 3 }} spacing={2} mt={2}>
                  {formData.outcomeOfVisit.neonatalComplications.map(
                    (complication, idx) => (
                      <Flex
                        key={idx}
                        cursor="pointer"
                        px="10px"
                        py="10px"
                        rounded="full"
                        bg="blue.blue500"
                        color="white"
                        fontSize="sm"
                        _hover={{ bg: "red.400" }}
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Text fontWeight="medium">{complication}</Text>
                        {!isReadOnly && (
                          <Box
                            fontSize="lg"
                            onClick={() => removeComplication(complication)}
                          >
                            <IoIosCloseCircle />
                          </Box>
                        )}
                      </Flex>
                    )
                  )}
                </SimpleGrid>
              </FormControl>
            </GridItem>
            {/* Counselling */}
            <GridItem colSpan={2}>
              <FormControl>
                <FormLabel>Counselling</FormLabel>
                <Flex
                  direction={{ base: "column", md: "row" }}
                  alignItems="center"
                >
                  <Select
                    value={counsellingInput}
                    onChange={(e) =>
                      !isReadOnly && setCounsellingInput(e.target.value)
                    }
                    placeholder="Select counselling topic"
                    isReadOnly={isReadOnly}
                    isDisabled={isReadOnly}
                    mr={2}
                  >
                    {getEnumValues("counselling").map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                  {!isReadOnly && (
                    <Button
                      mt={{ base: 2, md: 0 }}
                      onClick={addCounselling}
                      rightIcon={<SlPlus />}
                      disabled={!counsellingInput}
                    >
                      Add
                    </Button>
                  )}
                </Flex>
                <SimpleGrid columns={{ base: 2, md: 3 }} spacing={2} mt={2}>
                  {formData.outcomeOfVisit.counselling.map(
                    (counsellingItem, idx) => (
                      <Flex
                        key={idx}
                        cursor="pointer"
                        px="10px"
                        py="10px"
                        rounded="full"
                        bg="blue.blue500"
                        color="white"
                        fontSize="sm"
                        _hover={{ bg: "blue.400" }}
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Text fontWeight="medium">{counsellingItem}</Text>
                        {!isReadOnly && (
                          <Box
                            fontSize="lg"
                            onClick={() => removeCounselling(counsellingItem)}
                          >
                            <IoIosCloseCircle />
                          </Box>
                        )}
                      </Flex>
                    )
                  )}
                </SimpleGrid>
              </FormControl>
            </GridItem>
          </Grid>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          {mode !== "view" && (
            <Button onClick={handleSubmit} isLoading={isLoading}>
              {mode === "create" ? "Save" : "Update"}
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
