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
  PlaceOrderWithoutConfirmationApi,
  ReadDrugPriceApi,
  GetAllClinicApi,
  SettingsApi,
  SearchPatientApi,
  GetPharmarcystockbyname,
} from "../Utils/ApiCalls";

export default function PharmacyWithoutConfirmationModal({
  isOpen,
  onClose,
  onSuccess,
}) {
  const [formData, setFormData] = useState({ patient: "", patientId: "" });
  const [patients, setPatients] = useState([]);
  const [searchMRN, setSearchMRN] = useState("");
  const [selectedPatientInfo, setSelectedPatientInfo] = useState(null);
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const [isLoadingPatients, setIsLoadingPatients] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pharmacies, setPharmacies] = useState([]);
  const [settings, setSettings] = useState({});
  const [pendingPriceUpdates, setPendingPriceUpdates] = useState([]);

  const [products, setProducts] = useState([
    {
      pharmacy: "",
      drugSearch: "",
      drug: "",
      drugOptions: [],
      qty: "",
      price: null,
      // frequency: "",
      // duration: "",
      // dosage: "",
    },
  ]);

  const patientSelectRef = useRef(null);

  // Load clinics & settings
  useEffect(() => {
    if (!isOpen) return;
    setIsLoadingModal(true);
    (async () => {
      try {
        const clinicRes = await GetAllClinicApi();
        const clinicDetails = clinicRes?.queryresult?.clinicdetails || [];
        setPharmacies(clinicDetails.filter((c) => c.type === "pharmacy"));
        const settingsRes = await SettingsApi();
        setSettings(settingsRes);
      } catch (err) {
        console.error("Error fetching modal data:", err);
      } finally {
        setIsLoadingModal(false);
      }
    })();
  }, [isOpen]);

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
    setFormData({ patient: patient._id, patientId: patient._id });
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
      setFormData({ patient: "", patientId: "" });
    }
  };

  // Search patients by MRN/name
  const handleSearchPatient = async () => {
    setIsLoadingPatients(true);
    try {
      const res = await SearchPatientApi(searchMRN);
      setPatients(res?.queryresult?.patientdetails || []);
    } catch {
      setPatients([]);
    } finally {
      setIsLoadingPatients(false);
    }
  };

  const handlePatientChange = (e) => {
    const id = e.target.value;
    setFormData({ patient: id, patientId: id });
  };

  // Handle product field changes
  const handleProductChange = (index, field, value) => {
    const newProducts = [...products];
    newProducts[index][field] = value;

    // If pharmacy changes → reload drug options
    if (field === "pharmacy") {
      newProducts[index].drug = "";
      newProducts[index].drugOptions = [];
      newProducts[index].price = null;
      if (value) {
        GetPharmarcystockbyname(value)
          .then((data) => {
            const details = data?.queryresult?.pricedetails || [];
            newProducts[index].drugOptions = [
              ...new Set(details.map((d) => d.servicetype)),
            ];
            setProducts(newProducts);
          })
          .catch(() => {
            newProducts[index].drugOptions = [];
            setProducts(newProducts);
          });
      } else {
        setProducts(newProducts);
      }
      return;
    }

    // If drug or qty changes → fetch price
    if ((field === "drug" || field === "qty") && newProducts[index].pharmacy) {
      newProducts[index].price = null;
      setProducts(newProducts);

      const { pharmacy, drug, qty } = newProducts[index];
      if (pharmacy && drug && qty) {
        if (formData.patientId) {
          ReadDrugPriceApi(
            { pharmacy, drug, qty: Number(qty) },
            formData.patientId
          )
            .then((res) => {
              const updated = [...newProducts];
              updated[index].price = res.queryresult;
              setProducts(updated);
            })
            .catch(console.error);
        } else {
          // Defer price update until patient is selected
          setPendingPriceUpdates((prev) => [...new Set([...prev, index])]);
        }
      }

      return;
    }

    setProducts(newProducts);
  };

  // Add / remove rows
  const addProduct = () => {
    setProducts((prev) => {
      const first = prev[0] || {};
      return [
        ...prev,
        {
          // copy the first row’s pharmacy and drugOptions
          pharmacy: first.pharmacy || "",
          drugSearch: "",
          drug: "",
          drugOptions: first.drugOptions ? [...first.drugOptions] : [],
          qty: "",
          price: null,
        },
      ];
    });
  };

  const removeProduct = (i) =>
    products.length > 1 &&
    setProducts((prev) => prev.filter((_, idx) => idx !== i));

  // Only require pharmacy, drug, qty now
  const isProductComplete = (p) => p.pharmacy && p.drug && p.qty;

  // Submit
  const handleSubmit = async () => {
    if (!formData.patient) {
      alert("Please select a patient.");
      return;
    }
    if (!products.every(isProductComplete)) {
      alert("Please fill all product fields and quantity.");
      return;
    }
    setIsSubmitting(true);
    const payload = {
      products: products.map(({ pharmacy, drug, qty }) => ({
        pharmacy,
        drug,
        qty: Number(qty),
      })),
    };
    try {
      await PlaceOrderWithoutConfirmationApi(payload, formData.patientId);
      const selected = patients.find((p) => p._id === formData.patient) || {};
      onSuccess("Order placed!", "success", {
        patient: selected,
        products: payload.products,
      });
      handleClose();
    } catch (err) {
      console.error("Submit error:", err);
      alert(err.message || "Error placing order.");
      setIsSubmitting(false);
    }
  };

  // inside PharmacyWithoutConfirmationModal

  const handleClose = () => {
    setIsLoadingModal(true);

    // grab the first row (if any) so we can keep its pharmacy & drug
    const first = products[0] || {};
    const { pharmacy = "", drugOptions = [] } = first;

    setTimeout(() => {
      onClose();

      // reset patient search, etc.
      setFormData({ patient: "", patientId: "" });
      setSearchMRN("");
      setPatients([]);

      // back to exactly one row—but preserve pharmacy & drug selection
      setProducts([
        {
          pharmacy,
          drugSearch: "",
          drug: "",
          drugOptions: [...drugOptions],
          qty: "",
          price: null,
        },
      ]);

      setIsSubmitting(false);
      setIsLoadingModal(false);
    }, 200);
  };

  // compute grand total of all line‐item prices
  const grandTotal = products.reduce((sum, prod) => sum + (prod.price || 0), 0);

  useEffect(() => {
    if (formData.patientId && pendingPriceUpdates.length > 0) {
      const updates = [...pendingPriceUpdates];
      setPendingPriceUpdates([]); // reset immediately to avoid duplicates

      updates.forEach((index) => {
        const { pharmacy, drug, qty } = products[index];
        if (pharmacy && drug && qty) {
          ReadDrugPriceApi(
            { pharmacy, drug, qty: Number(qty) },
            formData.patientId
          )
            .then((res) => {
              setProducts((prevProducts) => {
                const updated = [...prevProducts];
                updated[index].price = res.queryresult;
                return updated;
              });
            })
            .catch(console.error);
        }
      });
    }
  }, [formData.patientId, pendingPriceUpdates, products]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
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
            <ModalCloseButton onClick={handleClose} />
          </ModalHeader>

          <ModalBody pb={6} mt={2}>
            {/* Patient Search */}
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

            {/* Medicines */}
            <Box mb={4}>
              <Text fontWeight="bold" mb={2}>
                Medicines
              </Text>
              {products.map((prod, idx) => (
                <Box key={idx} p={4} borderWidth="1px" borderRadius="md" mb={4}>
                  <Flex justify="space-between" align="center" mb={4}>
                    <Text fontWeight="bold">Medicine {idx + 1}</Text>
                    {products.length > 1 && (
                      <Box cursor="pointer" onClick={() => removeProduct(idx)}>
                        <MdClose size={20} />
                      </Box>
                    )}
                  </Flex>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl>
                      <FormLabel>Pharmacy</FormLabel>
                      <Select
                        placeholder="Select Pharmacy"
                        value={prod.pharmacy}
                        onChange={(e) =>
                          handleProductChange(idx, "pharmacy", e.target.value)
                        }
                        borderWidth="2px"
                        borderColor="gray.500"
                      >
                        {pharmacies.map((c) => (
                          <option key={c.clinic} value={c.clinic}>
                            {c.clinic}
                          </option>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Search Medicine</FormLabel>
                      <Input
                        placeholder="Type to filter"
                        value={prod.drugSearch}
                        onChange={(e) =>
                          handleProductChange(idx, "drugSearch", e.target.value)
                        }
                        borderWidth="2px"
                        borderColor="gray.500"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Medicine</FormLabel>
                      <Select
                        placeholder="Select Medicine"
                        value={prod.drug}
                        onChange={(e) =>
                          handleProductChange(idx, "drug", e.target.value)
                        }
                        disabled={!prod.pharmacy || !prod.drugOptions.length}
                        borderWidth="2px"
                        borderColor="gray.500"
                      >
                        {prod.drugOptions
                          .filter((d) =>
                            prod.drugSearch
                              ? d
                                  .toLowerCase()
                                  .includes(prod.drugSearch.toLowerCase())
                              : true
                          )
                          .map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Quantity</FormLabel>
                      <Input
                        type="number"
                        placeholder="Enter Qty"
                        value={prod.qty}
                        onChange={(e) =>
                          handleProductChange(idx, "qty", e.target.value)
                        }
                        borderWidth="2px"
                        borderColor="gray.500"
                      />
                    </FormControl>

                    {/* Price display */}
                    {prod.price != null && (
                      <Box gridColumn="1 / -1">
                        <Text fontWeight="semibold" color="blue.blue500">
                          Price ({prod.qty}× {prod.drug}): ₦{prod.price}
                        </Text>
                      </Box>
                    )}

                    {/* 
                    // Frequency / Duration / Dosage fields are intentionally commented out
                    <FormControl>
                      <FormLabel>Frequency</FormLabel>
                      <Select placeholder="Select Frequency" value={prod.frequency} onChange={...}>
                        {settings.medicationchartfrequency.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl>
                      <FormLabel>Duration</FormLabel>
                      <Input value={prod.duration} onChange={...} placeholder="Enter Duration" />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Dosage</FormLabel>
                      <Input value={prod.dosage} onChange={...} placeholder="Enter Dosage" />
                    </FormControl>
                    */}
                  </SimpleGrid>
                </Box>
              ))}

              <Button
                onClick={addProduct}
                mt={2}
                w="150px"
                rightIcon={<SlPlus />}
              >
                Add Medicine
              </Button>
              {/* Grand total */}
              <Box mt={4} textAlign="right">
                <Text fontSize="lg" fontWeight="bold" color="blue.blue400">
                  Grand Total: ₦{grandTotal}
                </Text>
              </Box>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
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
