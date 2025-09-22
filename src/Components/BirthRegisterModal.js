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
  Checkbox,
  Text
} from "@chakra-ui/react";
import Button from "./Button";
import ShowToast from "./ToastNotification";
import {
  CreateBirthRegisterApi,
  UpdateBirthRegisterApi,
  GetBirthRegisterByIdApi,
  SettingsApi,
} from "../Utils/ApiCalls";
import moment from "moment";

export default function BirthRegisterModal({
  isOpen,
  onClose,
  mode,
  data,
  patientId,
  fetchData,
}) {
  const [formData, setFormData] = useState({
    dateOfChildRegistration: "",
    under1YearRegistration: false,
    sex: "",
    placeOfBirth: "",
    childName: {
      lastName: "",
      firstName: "",
      middleName: "",
    },
    fatherFullName: {
      lastName: "",
      firstName: "",
      middleName: "",
    },
    motherFullName: {
      lastName: "",
      firstName: "",
      middleName: "",
    },
    motherAge: "",
    fathersStateOfOrigin: "",
    residentialAddress: "",
    phoneNumber: "",
    birthCertificateIssue: "",
    birthCertificateCollected: "",
  });
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    status: "",
  });

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
    if (mode === "edit" && data) {
      const recordId = data._id;
      const fetchRecordData = async () => {
        setIsLoading(true);
        try {
          const response = await GetBirthRegisterByIdApi(recordId);
          if (response.status === true) {
            const record = response.queryresult;
            setFormData({
              dateOfChildRegistration: moment(
                record.dateOfChildRegistration
              ).format("YYYY-MM-DD"),
              under1YearRegistration: record.under1YearRegistration || false,
              sex: record.sex || "",
              placeOfBirth: record.placeOfBirth || "",
              childName: record.childName || {
                lastName: "",
                firstName: "",
                middleName: "",
              },
              fatherFullName: record.fatherFullName || {
                lastName: "",
                firstName: "",
                middleName: "",
              },
              motherFullName: record.motherFullName || {
                lastName: "",
                firstName: "",
                middleName: "",
              },
              motherAge: record.motherAge || "",
              fathersStateOfOrigin: record.fathersStateOfOrigin || "",
              residentialAddress: record.residentialAddress || "",
              phoneNumber: record.phoneNumber || "",
              birthCertificateIssue: moment(
                record.birthCertificateIssue
              ).format("YYYY-MM-DD"),
              birthCertificateCollected: moment(
                record.birthCertificateCollected
              ).format("YYYY-MM-DD"),
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
        dateOfChildRegistration: "",
        under1YearRegistration: false,
        sex: "",
        placeOfBirth: "",
        childName: {
          lastName: "",
          firstName: "",
          middleName: "",
        },
        fatherFullName: {
          lastName: "",
          firstName: "",
          middleName: "",
        },
        motherFullName: {
          lastName: "",
          firstName: "",
          middleName: "",
        },
        motherAge: "",
        fathersStateOfOrigin: "",
        residentialAddress: "",
        phoneNumber: "",
        birthCertificateIssue: "",
        birthCertificateCollected: "",
      });
    }
  }, [mode, data]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const payload = { ...formData, patient: patientId };

    try {
      if (mode === "create") {
        const response = await CreateBirthRegisterApi(payload);
        if (response.status === true) {
          activateNotifications("Record created successfully.", "success");
          fetchData();
          onClose();
        } else {
          activateNotifications(response.msg, "error");
        }
      } else if (mode === "edit") {
        const response = await UpdateBirthRegisterApi(payload, data._id);
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="4xl"
      isCentered
      scrollBehavior="inside"
      blockScrollOnMount={false}
    >
      <ModalOverlay />
      <ModalContent maxH="90vh">
        {showToast.show && (
          <ShowToast message={showToast.message} status={showToast.status} />
        )}
        <ModalHeader>
          {mode === "create" ? "Add" : mode === "edit" ? "Edit" : "View"} Birth
          Register Record
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody overflowY="auto" pb={6}>
          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            <GridItem>
              <FormControl>
                <FormLabel>Date of Child Registration</FormLabel>
                <Input
                  type="date"
                  name="dateOfChildRegistration"
                  value={formData.dateOfChildRegistration}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl display="flex" alignItems="center" mt={8}>
                <Checkbox
                  name="under1YearRegistration"
                  isChecked={formData.under1YearRegistration}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                >
                  Under 1 Year Registration
                </Checkbox>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Sex</FormLabel>
                <Select
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="Select gender"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Select>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Place of Birth</FormLabel>
                <Input
                  name="placeOfBirth"
                  value={formData.placeOfBirth}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="Enter place of birth"
                />
              </FormControl>
            </GridItem>

            {/* Child Name Fields */}
            <GridItem colSpan={2}>
              <Text fontWeight="600" mb={2}>
                Child Name
              </Text>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>First Name</FormLabel>
                <Input
                  name="childName.firstName"
                  value={formData.childName.firstName}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="Child's first name"
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Last Name</FormLabel>
                <Input
                  name="childName.lastName"
                  value={formData.childName.lastName}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="Child's last name"
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Middle Name</FormLabel>
                <Input
                  name="childName.middleName"
                  value={formData.childName.middleName}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="Child's middle name"
                />
              </FormControl>
            </GridItem>

            {/* Father's Name Fields */}
            <GridItem colSpan={2}>
              <Text fontWeight="600" mb={2}>
                Father's Full Name
              </Text>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>First Name</FormLabel>
                <Input
                  name="fatherFullName.firstName"
                  value={formData.fatherFullName.firstName}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="Father's first name"
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Last Name</FormLabel>
                <Input
                  name="fatherFullName.lastName"
                  value={formData.fatherFullName.lastName}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="Father's last name"
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Middle Name</FormLabel>
                <Input
                  name="fatherFullName.middleName"
                  value={formData.fatherFullName.middleName}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="Father's middle name"
                />
              </FormControl>
            </GridItem>

            {/* Mother's Name Fields */}
            <GridItem colSpan={2}>
              <Text fontWeight="600" mb={2}>
                Mother's Full Name
              </Text>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>First Name</FormLabel>
                <Input
                  name="motherFullName.firstName"
                  value={formData.motherFullName.firstName}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="Mother's first name"
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Last Name</FormLabel>
                <Input
                  name="motherFullName.lastName"
                  value={formData.motherFullName.lastName}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="Mother's last name"
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Middle Name</FormLabel>
                <Input
                  name="motherFullName.middleName"
                  value={formData.motherFullName.middleName}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="Mother's middle name"
                />
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl>
                <FormLabel>Mother's Age</FormLabel>
                <Input
                  type="number"
                  name="motherAge"
                  value={formData.motherAge}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="Mother's age"
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Father's State of Origin</FormLabel>
                <Input
                  name="fathersStateOfOrigin"
                  value={formData.fathersStateOfOrigin}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="Father's state of origin"
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={2}>
              <FormControl>
                <FormLabel>Residential Address</FormLabel>
                <Textarea
                  name="residentialAddress"
                  value={formData.residentialAddress}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="Enter residential address"
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="Phone number"
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Birth Certificate Issue Date</FormLabel>
                <Input
                  type="date"
                  name="birthCertificateIssue"
                  value={formData.birthCertificateIssue}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Birth Certificate Collected Date</FormLabel>
                <Input
                  type="date"
                  name="birthCertificateCollected"
                  value={formData.birthCertificateCollected}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                />
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
