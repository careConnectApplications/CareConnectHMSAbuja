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
} from "@chakra-ui/react";
import Button from "./Button";
import ShowToast from "./ToastNotification";
import {
  CreateSecondStageLabourApi,
  UpdateSecondStageLabourApi,
  GetSecondStageLabourByIdApi,
  SettingsApi,
} from "../Utils/ApiCalls";
import moment from "moment";

export default function SecondStageLabourModal({
  isOpen,
  onClose,
  mode,
  data,
  patientId,
  fetchData,
}) {
  const [formData, setFormData] = useState({
    modeOfDelivery: "",
    contraction: "",
    deliveryDate: "",
    deliveryTime: "",
    duration: "",
    selectDrug: "",
    preferredDrugs: "",
    foetalMonitoring: "",
    route: "",
    obstetricComplication: "",
    obstetricCare: "",
    lastMenstrualPeriod: "",
    expectedDayOfDelivery: "",
    cervicalDilatation: "",
    comments: "",
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
          const response = await GetSecondStageLabourByIdApi(recordId);
          if (response.status === true) {
            const record = response.queryresult;
            setFormData({
              modeOfDelivery: record.modeOfDelivery || "",
              contraction: record.contraction || "",
              deliveryDate: moment(record.deliveryDate).format("YYYY-MM-DD"),
              deliveryTime: record.deliveryTime || "",
              duration: record.duration || "",
              selectDrug: record.selectDrug || "",
              preferredDrugs: record.preferredDrugs || "",
              foetalMonitoring: record.foetalMonitoring || "",
              route: record.route || "",
              obstetricComplication: record.obstetricComplication || "",
              obstetricCare: record.obstetricCare || "",
              lastMenstrualPeriod: moment(record.lastMenstrualPeriod).format(
                "YYYY-MM-DD"
              ),
              expectedDayOfDelivery: moment(
                record.expectedDayOfDelivery
              ).format("YYYY-MM-DD"),
              cervicalDilatation: record.cervicalDilatation || "",
              comments: record.comments || "",
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
        modeOfDelivery: "",
        contraction: "",
        deliveryDate: "",
        deliveryTime: "",
        duration: "",
        selectDrug: "",
        preferredDrugs: "",
        foetalMonitoring: "",
        route: "",
        obstetricComplication: "",
        obstetricCare: "",
        lastMenstrualPeriod: "",
        expectedDayOfDelivery: "",
        cervicalDilatation: "",
        comments: "",
      });
    }
  }, [mode, data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const payload = { ...formData, patient: patientId };

    try {
      if (mode === "create") {
        const response = await CreateSecondStageLabourApi(payload);
        if (response.status === true) {
          activateNotifications("Record created successfully.", "success");
          fetchData();
          onClose();
        } else {
          activateNotifications(response.msg, "error");
        }
      } else if (mode === "edit") {
        const response = await UpdateSecondStageLabourApi(payload, data._id);
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
          {mode === "create" ? "Add" : mode === "edit" ? "Edit" : "View"} Second
          Stage Labour Record
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody overflowY="auto" pb={6}>
          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            <GridItem>
              <FormControl>
                <FormLabel>Delivery Date</FormLabel>
                <Input
                  type="date"
                  name="deliveryDate"
                  value={formData.deliveryDate}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Delivery Time</FormLabel>
                <Input
                  type="time"
                  name="deliveryTime"
                  value={formData.deliveryTime}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Mode of Delivery</FormLabel>
                <Select
                  name="modeOfDelivery"
                  value={formData.modeOfDelivery}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="Select mode of delivery"
                >
                  {settings?.modeOfDelivery?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Contraction</FormLabel>
                <Input
                  name="contraction"
                  value={formData.contraction}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="e.g., every 5 minutes"
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Duration</FormLabel>
                <Input
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="e.g., 1 hour"
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Select Drug</FormLabel>
                <Select
                  name="selectDrug"
                  value={formData.selectDrug}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="Select drug"
                >
                  {settings?.selectDrug?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Preferred Drugs</FormLabel>
                <Input
                  name="preferredDrugs"
                  value={formData.preferredDrugs}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="Enter preferred drugs"
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Foetal Monitoring</FormLabel>
                <Input
                  name="foetalMonitoring"
                  value={formData.foetalMonitoring}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="Enter foetal monitoring details"
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Route</FormLabel>
                <Select
                  name="route"
                  value={formData.route}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="Select route"
                >
                  {settings?.route?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Obstetric Complication</FormLabel>
                <Select
                  name="obstetricComplication"
                  value={formData.obstetricComplication}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="Select complication"
                >
                  {settings?.obstetricComplication?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Obstetric Care</FormLabel>
                <Select
                  name="obstetricCare"
                  value={formData.obstetricCare}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="Select obstetric care"
                >
                  {settings?.obstetricCare?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Last Menstrual Period</FormLabel>
                <Input
                  type="date"
                  name="lastMenstrualPeriod"
                  value={formData.lastMenstrualPeriod}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Expected Day of Delivery</FormLabel>
                <Input
                  type="date"
                  name="expectedDayOfDelivery"
                  value={formData.expectedDayOfDelivery}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Cervical Dilatation (cm)</FormLabel>
                <Input
                  type="number"
                  name="cervicalDilatation"
                  value={formData.cervicalDilatation}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="Enter dilatation in cm"
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={2}>
              <FormControl>
                <FormLabel>Comments</FormLabel>
                <Textarea
                  name="comments"
                  value={formData.comments}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="Enter comments"
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