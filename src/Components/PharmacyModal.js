import React, { useState, useEffect, useRef } from "react";
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
  HStack,
  Badge,
} from "@chakra-ui/react";
import Input from "./Input";
import Button from "./Button";
import Preloader from "./Preloader";
import { MdClose } from "react-icons/md";
import { SlPlus } from "react-icons/sl";
import { FiSearch } from "react-icons/fi";
import {
  PlaceOrderApi,
  GetAllClinicApi,
  SettingsApi,
  GetPharmarcystockbyname,
  SearchPatientApi,
} from "../Utils/ApiCalls";

export default function PharmacyModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    patient: "",
    patientId: "",
  });
  const [patients, setPatients] = useState([]);

  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingPatients, setIsLoadingPatients] = useState(false);

  const [pharmacies, setPharmacies] = useState([]);
  const [settings, setSettings] = useState({});

  const [products, setProducts] = useState([
    {
      pharmacy: "",
      drug: "",
      drugOptions: [],
      frequency: "",
      duration: "",
      dosage: "",
      drugSearch: "",
    },
  ]);

  const [searchMRN, setSearchMRN] = useState("");
  const [selectedPatientInfo, setSelectedPatientInfo] = useState(null);
  const patientSelectRef = useRef(null);

  // Modified reset function to preserve drugOptions
  const resetProductFields = (product) => ({
    pharmacy: product.pharmacy, // preserve selected pharmacy
    drug: "",
    drugOptions: product.drugOptions, // preserve the fetched drug options
    frequency: "",
    duration: "",
    dosage: "",
    drugSearch: "",
  });

  useEffect(() => {
    if (isOpen) {
      setIsLoadingModal(true);
      const fetchData = async () => {
        try {
          const clinicResult = await GetAllClinicApi();
          if (clinicResult?.queryresult?.clinicdetails) {
            setPharmacies(
              clinicResult.queryresult.clinicdetails.filter(
                (item) => item.type === "pharmacy"
              )
            );
          }
          const settingsData = await SettingsApi();
          setSettings(settingsData);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoadingModal(false);
        }
      };
      fetchData();
    }
  }, [isOpen]);

  const handlePatientChange = (event) => {
    const selectedPatientId = event.target.value;
    setFormData((prev) => ({
      ...prev,
      patient: selectedPatientId,
      patientId: selectedPatientId,
    }));
  };

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
      console.error("Error searching patient:", error.message);
    } finally {
      setIsLoadingPatients(false);
    }
  };

  const handleProductChange = (index, field, value) => {
    const newProducts = [...products];
    newProducts[index][field] = value;
    if (field === "pharmacy") {
      newProducts[index].drug = "";
      newProducts[index].drugOptions = [];
      if (value) {
        GetPharmarcystockbyname(value)
          .then((data) => {
            const pricedetails = data?.queryresult?.pricedetails;
            if (Array.isArray(pricedetails)) {
              const uniqueServiceTypes = [
                ...new Set(pricedetails.map((item) => item.servicetype)),
              ];
              newProducts[index].drugOptions = uniqueServiceTypes;
            } else {
              newProducts[index].drugOptions = [];
            }
            setProducts(newProducts);
          })
          .catch((error) => {
            console.error("Error fetching pharmacy stock:", error);
            newProducts[index].drugOptions = [];
            setProducts(newProducts);
          });
      } else {
        setProducts(newProducts);
      }
    } else {
      setProducts(newProducts);
    }
  };

  const addProduct = () => {
    setProducts((prev) => [
      ...prev,
      {
        pharmacy: "",
        drug: "",
        drugOptions: [],
        frequency: "",
        duration: "",
        dosage: "",
        drugSearch: "",
      },
    ]);
  };

  const removeProduct = (index) => {
    if (products.length === 1) return;
    setProducts((prev) => prev.filter((_, i) => i !== index));
  };

  const isProductComplete = (product) =>
    Object.entries(product).every(([key, value]) => {
      if (key === "drugOptions" || key === "drugSearch") return true;
      return value && value.toString().trim() !== "";
    });

  const handleSubmit = async () => {
    if (!formData.patient) {
      alert("Please select a patient.");
      return;
    }
    if (products.length === 0 || !products.every(isProductComplete)) {
      alert("Please fill all fields for each product.");
      return;
    }

    setIsSubmitting(true);

    // Sanitize the payload by removing unwanted fields
    const sanitizedProducts = products.map(
      ({ pharmacy, drug, frequency, duration, dosage }) => ({
        pharmacy,
        drug,
        frequency,
        duration,
        dosage,
      })
    );
    const payload = { products: sanitizedProducts };

    // Log the payload to the console
    console.log("Payload:", payload);

    try {
      await PlaceOrderApi(payload, formData.patientId);
      const selectedPatient =
        patients.find((p) => p._id === formData.patient) || {};
      onSuccess("Order placed successfully!", "success", {
        patient: selectedPatient,
        products: sanitizedProducts,
      });
      onClose();
      setFormData({ patient: "", patientId: "" });
      // Reset product fields but preserve pharmacy and drug options
      setProducts((prevProducts) => prevProducts.map(resetProductFields));
    } catch (error) {
      console.error("Error placing order:", error);
      alert(error.message || "An error occurred while placing the order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseWithLoader = () => {
    setIsLoadingModal(true);
    setTimeout(() => {
      onClose();
      setFormData({ patient: "", patientId: "" });
      // Reset product fields but preserve pharmacy and its options
      setProducts((prevProducts) => prevProducts.map(resetProductFields));
      setIsLoadingModal(false);
    }, 200);
  };

  // Auto-search functionality with debouncing
  useEffect(() => {
    const searchPatients = async (searchTerm) => {
      if (!searchTerm || searchTerm.trim().length < 2) {
        setPatients([]);
        return;
      }

      // Don't search if a patient is already selected and the search term matches
      if (selectedPatientInfo && searchTerm.includes(selectedPatientInfo.mrn)) {
        return;
      }

      try {
        setIsLoadingPatients(true);
        const results = await SearchPatientApi(searchTerm);
        if (results?.queryresult?.patientdetails) {
          setPatients(results.queryresult.patientdetails);
        } else {
          setPatients([]);
        }
      } catch (e) {
        console.error("Error searching patient:", e.message);
        setPatients([]);
      } finally {
        setIsLoadingPatients(false);
      }
    };

    const timeoutId = setTimeout(() => {
      searchPatients(searchMRN);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchMRN, selectedPatientInfo]);

  // Handle patient selection from search results
  const handlePatientSelect = (patient) => {
    setFormData((prev) => ({
      ...prev,
      patient: patient._id,
      patientId: patient._id,
    }));
    setSelectedPatientInfo({
      name: `${patient.firstName} ${patient.lastName}`,
      mrn: patient.MRN,
    });
    setPatients([]); // Clear search results
    setSearchMRN(`${patient.firstName} ${patient.lastName} (MRN: ${patient.MRN})`);
  };

  // Handle search input change and clear selection if user starts typing new search
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchMRN(value);
    
    // Clear selected patient if user modifies the search significantly
    if (selectedPatientInfo && !value.includes(selectedPatientInfo.mrn)) {
      setSelectedPatientInfo(null);
      setFormData((prev) => ({
        ...prev,
        patient: "",
        patientId: "",
      }));
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setSearchMRN("");
      setPatients([]);
      setSelectedPatientInfo(null);
    }
  }, [isOpen]);

  const isFormComplete =
    formData.patient &&
    products.length > 0 &&
    products.every(isProductComplete);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseWithLoader}
      isCentered
      size="xl"
      scrollBehavior="inside"
    >
      <ModalOverlay />
      {isLoadingModal ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
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
            <FormControl mb={4}>
              <FormLabel>Patient</FormLabel>
              <Box position="relative">
                <Input
                  label="Search for Patient"
                  placeholder="Enter MRN, first name, or last name"
                  value={searchMRN}
                  onChange={handleSearchInputChange}
                  leftIcon={<FiSearch size={16} color="blue.500" />}
                />
                
                {/* Selected Patient Display */}
                {selectedPatientInfo && (
                  <Box mt={2} p={3} bg="blue.50" borderRadius="md" border="1px solid" borderColor="blue.200">
                    <HStack spacing={2}>
                      <Badge colorScheme="blue" variant="solid">Selected</Badge>
                      <Text fontWeight="medium">{selectedPatientInfo.name}</Text>
                      <Text fontSize="sm" color="gray.600">MRN: {selectedPatientInfo.mrn}</Text>
                    </HStack>
                  </Box>
                )}

                {/* Search Results Dropdown */}
                {patients.length > 0 && !selectedPatientInfo && (
                  <Box
                    position="absolute"
                    top="100%"
                    left={0}
                    right={0}
                    zIndex={10}
                    bg="white"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    boxShadow="lg"
                    maxH="200px"
                    overflowY="auto"
                    mt={1}
                  >
                    {patients.map((patient) => (
                      <Box
                        key={patient._id}
                        p={3}
                        cursor="pointer"
                        _hover={{ bg: "blue.50" }}
                        onClick={() => handlePatientSelect(patient)}
                        borderBottom="1px solid"
                        borderColor="gray.100"
                        _last={{ borderBottom: "none" }}
                      >
                        <Text fontWeight="medium">
                          {`${patient.firstName} ${patient.lastName}`}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          MRN: {patient.MRN}
                        </Text>
                      </Box>
                    ))}
                  </Box>
                )}

                {/* Loading Indicator */}
                {isLoadingPatients && (
                  <Box
                    position="absolute"
                    top="100%"
                    left={0}
                    right={0}
                    zIndex={10}
                    bg="white"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    p={3}
                    mt={1}
                  >
                    <Text color="gray.500">Searching patients...</Text>
                  </Box>
                )}
              </Box>
            </FormControl>
            <Box mb={4}>
              <Text fontWeight="bold" mb={2}>
                Medicine
              </Text>
              {products.map((product, index) => (
                <Box
                  key={index}
                  p={4}
                  borderWidth="1px"
                  borderRadius="md"
                  mb={4}
                  position="relative"
                >
                  <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    mb={4}
                  >
                    <Text fontWeight="bold">Medicine {index + 1}</Text>
                    {products.length > 1 && (
                      <Box cursor="pointer" onClick={() => removeProduct(index)}>
                        <MdClose size={20} />
                      </Box>
                    )}
                  </Flex>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
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
                        disabled={
                          !product.pharmacy || !product.drugOptions.length
                        }
                        label="search for medicine"
                      >
                        {product.drugOptions
                          .filter((type) => {
                            if (!product.drugSearch) return true;
                            return type
                              .toLowerCase()
                              .includes(product.drugSearch.toLowerCase());
                          })
                          .map((type, idx) => (
                            <option key={idx} value={type}>
                              {type}
                            </option>
                          ))}
                      </Select>
                    </FormControl>
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
                        {settings?.medicationchartfrequency?.map(
                          (option, idx) => (
                            <option key={idx} value={option}>
                              {option}
                            </option>
                          )
                        )}
                      </Select>
                    </FormControl>
                    <FormControl>
                      <FormLabel>Duration</FormLabel>
                      <Input
                        value={product.duration}
                        onChange={(e) =>
                          handleProductChange(index, "duration", e.target.value)
                        }
                        placeholder="Enter Duration"
                        border="2px solid"
                        borderColor="gray.500"
                        label="Duration"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Dosage</FormLabel>
                      <Input
                        value={product.dosage}
                        onChange={(e) =>
                          handleProductChange(index, "dosage", e.target.value)
                        }
                        placeholder="Enter Dosage"
                        border="2px solid"
                        borderColor="gray.500"
                        label="Dosage"
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
            <Button
              mt="32px"
              onClick={handleSubmit}
              disabled={!isFormComplete || isSubmitting}
              isLoading={isSubmitting}
            >
              Submit Order
            </Button>
          </ModalFooter>
        </ModalContent>
      )}
    </Modal>
  );
}
