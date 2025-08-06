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
  Select,
  Textarea,
  SimpleGrid,
  Divider,
  Text,
  Checkbox,
  Box,
  Flex,
  VStack,
  HStack,
  Badge,
} from "@chakra-ui/react";
import { FaIdBadge, FaPhone, FaUser } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import {
  SettingsApi,
  ScheduleAppointmentApi,
  UpdateAppointmentApi,
  GetOnlyClinicApi,
  SearchPatientApi,
} from "../Utils/ApiCalls";
import Button from "../Components/Button";
import Input from "../Components/Input";
import ShowToast from "./ToastNotification";

export default function CreateAppointmentModal({
  isOpen,
  onClose,
  type,
  initialData,
}) {
  const initialFormState = {
    appointmentdate: "",
    reason: "",
    appointmentcategory: "",
    appointmenttype: "",
    patient: "",
    clinic: "",
    policecase: false,
    physicalassault: false,
    sexualassault: false,
    policaename: "",
    servicenumber: "",
    policephonenumber: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [settings, setSettings] = useState({});
  // Patients will be populated only after a search is performed.
  const [patients, setPatients] = useState([]);
  const [isLoadingPatients, setIsLoadingPatients] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [ClinicData, setClinicData] = useState([]);

  // New state for MRN search input and selected patient info
  const [searchMRN, setSearchMRN] = useState("");
  const [selectedPatientInfo, setSelectedPatientInfo] = useState(null);

  const showToast = (toastData) => {
    setToast(toastData);
    setTimeout(() => setToast(null), 2000);
  };

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setIsLoadingPatients(true);
        try {
          // Only fetch settings here; patients will be fetched via search.
          const settingsData = await SettingsApi();
          setSettings(settingsData);
          if (type === "edit" && initialData) {
            setFormData({
              appointmentdate: initialData.appointmentdate || "",
              reason: initialData.reason || "",
              appointmentcategory: initialData.appointmentcategory || "",
              appointmenttype: initialData.appointmenttype || "",
              patient: initialData.patient || "",
              clinic: initialData.clinic || "",
              policecase: initialData.policecase || false,
              physicalassault: initialData.physicalassault || false,
              sexualassault: initialData.sexualassault || false,
              policaename: initialData.policaename || "",
              servicenumber: initialData.servicenumber || "",
              policephonenumber: initialData.policephonenumber || "",
            });
          }
        } catch (error) {
          showToast({
            status: "error",
            message: `Error fetching settings: ${error.message}`,
          });
        } finally {
          setIsLoadingPatients(false);
        }
      };
      fetchData();
    } else {
      setFormData(initialFormState);
    }
  }, [isOpen, type, initialData]);

  // Clear search input and patient list when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchMRN("");
      setPatients([]);
      setSelectedPatientInfo(null);
    }
  }, [isOpen]);

  const handleInputChange = ({ target: { name, value } }) =>
    setFormData((prev) => ({ ...prev, [name]: value }));

  // Handler for patient selection from search results
  const handlePatientSelect = (patient) => {
    setFormData((prev) => ({
      ...prev,
      patient: patient._id,
    }));
    setSelectedPatientInfo({
      name: `${patient.firstName} ${patient.lastName}`,
      mrn: patient.MRN,
    });
    setPatients([]); // Clear search results
    setSearchMRN(`${patient.firstName} ${patient.lastName} (MRN: ${patient.MRN})`);
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
      }));
    }
  };

  // The common required fields (reason is optional)
  const requiredFields = [
    "appointmentdate",
    "appointmentcategory",
    "appointmenttype",
    "patient",
    "clinic",
  ];
  const isRequiredComplete = requiredFields.every(
    (field) => formData[field] && formData[field].toString().trim() !== ""
  );

  // If a police case is reported, then at least one assault checkbox must be selected...
  const isAssaultSelected =
    !formData.policecase || formData.physicalassault || formData.sexualassault;

  // ...and the police details must be provided.
  let policeDetailsComplete = true;
  if (formData.policecase) {
    policeDetailsComplete =
      formData.policaename &&
      formData.policaename.trim() !== "" &&
      formData.servicenumber &&
      formData.servicenumber.trim() !== "" &&
      formData.policephonenumber &&
      formData.policephonenumber.trim() !== "";
  }

  const isFormComplete =
    isRequiredComplete && isAssaultSelected && policeDetailsComplete;

  const handleSubmit = async () => {
    if (!isRequiredComplete) {
      showToast({
        status: "error",
        message: "Please complete all required fields.",
      });
      return;
    }
    if (formData.policecase) {
      if (!isAssaultSelected) {
        showToast({
          status: "error",
          message: "Please select at least one type of assault for a police case.",
        });
        return;
      }
      if (!policeDetailsComplete) {
        showToast({
          status: "error",
          message: "Please fill in all police details.",
        });
        return;
      }
    }
    setLoading(true);
    try {
      let response;
      if (type === "edit") {
        response = await UpdateAppointmentApi(initialData.id, formData);
        showToast({
          status: "success",
          message: "Appointment updated successfully!",
        });
      } else {
        response = await ScheduleAppointmentApi(formData);
        showToast({
          status: "success",
          message: "Appointment created successfully!",
        });
      }
      onClose();
      setFormData(initialFormState);
    } catch (error) {
      console.error("API Error:", error);
      showToast({
        status: "error",
        message: `Failed to ${type === "edit" ? "update" : "schedule"} appointment: ${error.message}`,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const getAllClinic = async () => {
    try {
      const result = await GetOnlyClinicApi();
      setClinicData(result.queryresult.clinicdetails);
    } catch (e) {
      // handle error if needed
    }
  };

  useEffect(() => {
    getAllClinic();
  }, []);

  return (
    <>
      {toast && <ShowToast status={toast.status} message={toast.message} />}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="lg"
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent maxW={{ base: "95%", md: "60%" }}>
          <ModalHeader>
            {type === "edit" ? "Edit Appointment" : "Create Appointment"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Patient Search Section */}
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

            {/* Main Form Fields */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl>
                <FormLabel>Date</FormLabel>
                <Input
                  type="date"
                  name="appointmentdate"
                  value={formData.appointmentdate}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Reason (Optional)</FormLabel>
                <Textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  placeholder="Reason for appointment"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Appointment Category</FormLabel>
                <Select
                  name="appointmentcategory"
                  value={formData.appointmentcategory}
                  onChange={handleInputChange}
                  placeholder="Select Appointment Category"
                >
                  {settings.servicecategory
                    ?.filter((item) => item.category === "Appointment")
                    .map((item, index) => (
                      <option key={index} value={item.category}>
                        {item.category}
                      </option>
                    ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Appointment Type</FormLabel>
                <Select
                  name="appointmenttype"
                  value={formData.appointmenttype}
                  onChange={handleInputChange}
                  placeholder="Select Appointment Type"
                >
                  {settings.servicecategory
                    ?.find(
                      (item) =>
                        item.category === formData.appointmentcategory
                    )
                    ?.type?.map((type, index) => (
                      <option key={index} value={type}>
                        {type}
                      </option>
                    ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Clinic</FormLabel>
                <Select
                  name="clinic"
                  value={formData.clinic}
                  onChange={handleInputChange}
                  placeholder="Select Clinic"
                >
                  {ClinicData?.map((item, i) => (
                    <option key={i} value={item.clinic}>
                      {item.clinic}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </SimpleGrid>

            {/* Police Report Section */}
            <Divider my={4} />
            <Text fontSize="md" fontWeight="bold" mb={2} color="blue.blue500">
              Police Report Information
            </Text>
            <SimpleGrid columns={1} spacing={4}>
              <FormControl display="flex" alignItems="center">
                <Checkbox
                  isChecked={formData.policecase}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      policecase: e.target.checked,
                    }))
                  }
                >
                  Police Case
                </Checkbox>
              </FormControl>

              {formData.policecase && (
                <>
                  <SimpleGrid columns={1} spacing={4} mt={4}>
                    <FormControl display="flex" alignItems="center">
                      <Checkbox
                        isChecked={formData.physicalassault}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            physicalassault: e.target.checked,
                          }))
                        }
                      >
                        Physical Assault
                      </Checkbox>
                    </FormControl>
                    <FormControl display="flex" alignItems="center">
                      <Checkbox
                        isChecked={formData.sexualassault}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            sexualassault: e.target.checked,
                          }))
                        }
                      >
                        Sexual Assault
                      </Checkbox>
                    </FormControl>
                  </SimpleGrid>

                  <SimpleGrid columns={1} spacing={4} mt={4}>
                    <Input
                      id="policaename"
                      label="Police Name"
                      value={formData.policaename}
                      onChange={handleInputChange}
                      name="policaename"
                      placeholder="Enter Police Name"
                      leftIcon={<FaUser />}
                    />
                    <Input
                      id="servicenumber"
                      label="Service Number"
                      value={formData.servicenumber}
                      onChange={handleInputChange}
                      name="servicenumber"
                      placeholder="Enter Service Number"
                      leftIcon={<FaIdBadge />}
                    />
                    <Input
                      id="policephonenumber"
                      label="Police Phone Number"
                      value={formData.policephonenumber}
                      onChange={handleInputChange}
                      name="policephonenumber"
                      placeholder="Enter Police Phone Number"
                      leftIcon={<FaPhone />}
                    />
                  </SimpleGrid>
                </>
              )}
            </SimpleGrid>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              disabled={!isFormComplete || loading}
              isLoading={loading}
            >
              {type === "edit" ? "Update" : "Create"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
