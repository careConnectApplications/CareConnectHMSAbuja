import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Text,
  FormControl,
  FormLabel,
  Select,
  Box,
  Flex,
  SimpleGrid,
} from "@chakra-ui/react";
import Input from "./Input";
import Button from "./Button";
import Preloader from "./Preloader";
import { MdClose } from "react-icons/md";
import { SlPlus } from "react-icons/sl";
import {
  PlaceOrderApi,
  GetAllClinicApi,
  SettingsApi,
  GetPharmarcystockbyname,
} from "../Utils/ApiCalls";

export default function CreatePrescriptionModal({ isOpen, onClose, onSuccess, oldPayload }) {
  // Loading state for data fetching and submission
  const [isLoading, setIsLoading] = useState(false);
  // Pharmacies for the pharmacy dropdown
  const [pharmacies, setPharmacies] = useState([]);
  // Settings for dropdown (frequency)
  const [settings, setSettings] = useState({});
  // Products array – each product now contains pharmacy, drug, frequency, duration, dosage, drugOptions, and drugSearch for filtering
  const [products, setProducts] = useState([
    {
      pharmacy: "",
      drug: "",
      frequency: "",
      duration: "",
      dosage: "",
      drugOptions: [],
      drugSearch: "",
    },
  ]);

  // Fetch pharmacies and settings when the modal opens
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      const fetchData = async () => {
        try {
          // Fetch pharmacies (clinics of type "pharmacy")
          const clinicResult = await GetAllClinicApi();
          if (clinicResult?.queryresult?.clinicdetails) {
            setPharmacies(
              clinicResult.queryresult.clinicdetails.filter(
                (item) => item.type === "pharmacy"
              )
            );
          }
          // Fetch settings for frequency dropdown
          const settingsData = await SettingsApi();
          setSettings(settingsData);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [isOpen]);

  // Handle changes for each product row
  const handleProductChange = (index, field, value) => {
    const newProducts = [...products];
    newProducts[index][field] = value;

    // When a pharmacy is selected, fetch its available drugs (medicine)
    if (field === "pharmacy") {
      // Reset the current medicine selection, its options and clear the search field.
      newProducts[index]["drug"] = "";
      newProducts[index]["drugOptions"] = [];
      newProducts[index]["drugSearch"] = "";
      if (value) {
        GetPharmarcystockbyname(value)
          .then((data) => {
            const pricedetails = data?.queryresult?.pricedetails;
            if (Array.isArray(pricedetails)) {
              const uniqueServiceTypes = [
                ...new Set(pricedetails.map((item) => item.servicetype)),
              ];
              newProducts[index]["drugOptions"] = uniqueServiceTypes;
            } else {
              newProducts[index]["drugOptions"] = [];
            }
            setProducts(newProducts);
          })
          .catch((error) => {
            console.error("Error fetching pharmacy stock:", error);
            newProducts[index]["drugOptions"] = [];
            setProducts(newProducts);
          });
      } else {
        setProducts(newProducts);
      }
    } else {
      setProducts(newProducts);
    }
  };

  // Add a new empty product row
  const addProduct = () => {
    setProducts((prev) => [
      ...prev,
      {
        pharmacy: "",
        drug: "",
        frequency: "",
        duration: "",
        dosage: "",
        drugOptions: [],
        drugSearch: "",
      },
    ]);
  };

  // Remove a product row (ensuring at least one remains)
  const removeProduct = (index) => {
    if (products.length === 1) return;
    setProducts((prev) => prev.filter((_, i) => i !== index));
  };

  // Validate that every non-array field in a product is non-empty
  const isProductComplete = (product) =>
    Object.entries(product).every(([key, value]) => {
      // Skip checking the search field and options array.
      if (key === "drugOptions" || key === "drugSearch") return true;
      return value && value.toString().trim() !== "";
    });

  // Handle form submission with toast notifications for success/failure
  const handleSubmit = async () => {
    const patientId = localStorage.getItem("patientId");
    if (!patientId) {
      if (onSuccess) {
        onSuccess("Patient ID not found.", "error");
      }
      return;
    }
    if (products.length === 0 || !products.every(isProductComplete)) {
      if (onSuccess) {
        onSuccess("Please fill all fields for each product.", "error");
      }
      return;
    }

    // Build payload and only add appointmentid if oldPayload is provided
    const payload = { products };
    if (oldPayload?.id) {
      payload.appointmentid = oldPayload.id;
    }

    try {
      const response = await PlaceOrderApi(payload, patientId);
      if (onSuccess) {
        onSuccess("Order placed successfully.", "success");
      }
      onClose();
      // Reset the products form
      setProducts([
        {
          pharmacy: "",
          drug: "",
          frequency: "",
          duration: "",
          dosage: "",
          drugOptions: [],
          drugSearch: "",
        },
      ]);
    } catch (error) {
      console.error("Error placing order:", error);
      if (onSuccess) {
        onSuccess(error.message || "An error occurred while placing the order.", "error");
      }
    }
  };

  // Reset form on modal close (with a brief loader)
  const handleCloseWithLoader = () => {
    setIsLoading(true);
    setTimeout(() => {
      onClose();
      setProducts([
        {
          pharmacy: "",
          drug: "",
          frequency: "",
          duration: "",
          dosage: "",
          drugOptions: [],
          drugSearch: "",
        },
      ]);
      setIsLoading(false);
    }, 200);
  };

  const isFormComplete = products.length > 0 && products.every(isProductComplete);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseWithLoader}
      isCentered
      size="xl"
      scrollBehavior="inside"
    >
      <ModalOverlay />
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <Preloader />
        </Box>
      ) : (
        <ModalContent maxW={{ base: "90%", md: "70%" }} borderRadius="lg" p={4}>
          <ModalHeader>
            <Text fontSize="lg" fontWeight="bold">
              Place Order
            </Text>
            <ModalCloseButton onClick={handleCloseWithLoader} />
          </ModalHeader>
          <ModalBody pb={6} mt={2}>
            {/* Dynamic Product Forms */}
            <Box mb={4}>
              <Text fontWeight="bold" mb={2}>
                Medicine Order
              </Text>
              {products.map((product, index) => (
                <Box key={index} p={4} borderWidth="1px" borderRadius="md" mb={4} position="relative">
                  <Flex justifyContent="space-between" alignItems="center" mb={4}>
                    <Text fontWeight="bold">Medicine {index + 1}</Text>
                    {products.length > 1 && (
                      <Box cursor="pointer" onClick={() => removeProduct(index)}>
                        <MdClose size={20} />
                      </Box>
                    )}
                  </Flex>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    {/* Pharmacy */}
                    <FormControl>
                      <FormLabel>Pharmacy</FormLabel>
                      <Select
                        placeholder="Select Pharmacy"
                        value={product.pharmacy}
                        onChange={(e) =>
                          handleProductChange(index, "pharmacy", e.target.value)
                        }
                        border="2px solid"
                        borderColor="gray.500"
                      >
                        {pharmacies.map((item, idx) => (
                          <option key={idx} value={item.clinic}>
                            {item.clinic}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                    {/* Medicine Search */}
                    <FormControl>
                      <FormLabel>Search Medicine</FormLabel>
                      <Input
                        value={product.drugSearch}
                        onChange={(e) =>
                          handleProductChange(index, "drugSearch", e.target.value)
                        }
                        placeholder="Type to filter medicines"
                        border="2px solid"
                        borderColor="gray.500"
                      />
                    </FormControl>
                    {/* Medicine Dropdown */}
                    <FormControl>
                      <FormLabel>Medicine</FormLabel>
                      <Select
                        placeholder="Select Medicine"
                        value={product.drug}
                        onChange={(e) =>
                          handleProductChange(index, "drug", e.target.value)
                        }
                        border="2px solid"
                        borderColor="gray.500"
                        disabled={!product.pharmacy || !product.drugOptions.length}
                      >
                        {product.drugOptions
                          .filter((type) => {
                            // If no search text is entered, show all options.
                            if (!product.drugSearch) return true;
                            return type.toLowerCase().includes(product.drugSearch.toLowerCase());
                          })
                          .map((type, idx) => (
                            <option key={idx} value={type}>
                              {type}
                            </option>
                          ))}
                      </Select>
                    </FormControl>
                    {/* Frequency */}
                    <FormControl>
                      <FormLabel>Frequency</FormLabel>
                      <Select
                        placeholder="Select Frequency"
                        value={product.frequency}
                        onChange={(e) =>
                          handleProductChange(index, "frequency", e.target.value)
                        }
                        border="2px solid"
                        borderColor="gray.500"
                      >
                        {settings?.medicationchartfrequency?.map((option, idx) => (
                          <option key={idx} value={option}>
                            {option}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                    {/* Duration */}
                    <FormControl>
                      <FormLabel>Duration</FormLabel>
                      <Input
                        value={product.duration}
                        onChange={(e) =>
                          handleProductChange(index, "duration", e.target.value)
                        }
                        label="Duration"
                        placeholder="Enter Duration"
                        border="2px solid"
                        borderColor="gray.500"
                      />
                    </FormControl>
                    {/* Dosage */}
                    <FormControl>
                      <FormLabel>Dosage</FormLabel>
                      <Input
                        value={product.dosage}
                        onChange={(e) =>
                          handleProductChange(index, "dosage", e.target.value)
                        }
                        label="Dosage"
                        placeholder="Enter Dosage"
                        border="2px solid"
                        borderColor="gray.500"
                      />
                    </FormControl>
                  </SimpleGrid>
                </Box>
              ))}
              <Button onClick={addProduct} mt={2} w="150px" rightIcon={<SlPlus />}>
                Add Medicine
              </Button>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleSubmit} disabled={!isFormComplete || isLoading} isLoading={isLoading}>
              Submit Order
            </Button>
          </ModalFooter>
        </ModalContent>
      )}
    </Modal>
  );
}
