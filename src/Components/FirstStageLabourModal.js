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
} from "@chakra-ui/react";
import Button from "./Button";
import ShowToast from "./ToastNotification";
import {
  CreateFirstStageLabourApi,
  UpdateFirstStageLabourApi,
  GetFirstStageLabourByIdApi,
  SettingsApi,
} from "../Utils/ApiCalls";
import moment from "moment";

export default function FirstStageLabourModal({
  isOpen,
  onClose,
  mode,
  data,
  patientId,
  fetchData,
}) {
  const [formData, setFormData] = useState({
    dateExamined: "",
    inducedLabour: false,
    phase: "",
    duration: "",
    contraction: "",
    selectDrug: "",
    palpationExamination: "",
    obstetricComplication: "",
    noOfVE: "",
    lastMenstrualPeriod: "",
    notes: "",
    cervicalDilation: "",
    foetalHeartRate: "",
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
          const response = await GetFirstStageLabourByIdApi(recordId);
          if (response.status === true) {
            const record = response.queryresult;
            setFormData({
              dateExamined: moment(record.dateExamined).format("YYYY-MM-DD"),
              inducedLabour: record.inducedLabour,
              phase: record.phase,
              duration: record.duration,
              contraction: record.contraction,
              selectDrug: record.selectDrug,
              palpationExamination: record.palpationExamination,
              obstetricComplication: record.obstetricComplication,
              noOfVE: record.noOfVE,
              lastMenstrualPeriod: moment(record.lastMenstrualPeriod).format(
                "YYYY-MM-DD"
              ),
              notes: record.notes,
              cervicalDilation: record.cervicalDilation,
              foetalHeartRate: record.foetalHeartRate,
              comments: record.comments,
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
        dateExamined: "",
        inducedLabour: false,
        phase: "",
        duration: "",
        contraction: "",
        selectDrug: "",
        palpationExamination: "",
        obstetricComplication: "",
        noOfVE: "",
        lastMenstrualPeriod: "",
        notes: "",
        cervicalDilation: "",
        foetalHeartRate: "",
        comments: "",
      });
    }
  }, [mode, data]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const payload = { ...formData, patient: patientId };

    try {
      if (mode === "create") {
        const response = await CreateFirstStageLabourApi(payload);
        if (response.status === true) {
          activateNotifications("Record created successfully.", "success");
          fetchData();
          onClose();
        } else {
          activateNotifications(response.data.msg, "error");
        }
      } else if (mode === "edit") {
        const response = await UpdateFirstStageLabourApi(payload, data._id);
        if (response.status === true) {
          activateNotifications("Record updated successfully.", "success");
          fetchData();
          onClose();
        } else {
          activateNotifications(response.data.msg, "error");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      activateNotifications(
        error?.response?.data?.msg || "Failed to save record.",
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
          {mode === "create" ? "Add" : mode === "edit" ? "Edit" : "View"} First
          Stage Labour Record
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody overflowY="auto" pb={6}>
          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            <GridItem>
              <FormControl>
                <FormLabel>Date Examined</FormLabel>
                <Input
                  type="date"
                  name="dateExamined"
                  value={formData.dateExamined}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                />
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
                <FormLabel>Phase</FormLabel>
                <Select
                  name="phase"
                  value={formData.phase}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="Select phase"
                >
                  {settings?.phase?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
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
                  placeholder="e.g., 8 hours"
                />
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
                <FormLabel>Palpation Examination</FormLabel>
                <Input
                  name="palpationExamination"
                  value={formData.palpationExamination}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="Enter examination details"
                />
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
                <FormLabel>No. of VE</FormLabel>
                <Select
                  name="noOfVE"
                  value={formData.noOfVE}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="Select number"
                >
                  {settings?.noOfVE?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Cervical Dilation (cm)</FormLabel>
                <Input
                  type="number"
                  name="cervicalDilation"
                  value={formData.cervicalDilation}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="Enter dilation in cm"
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Foetal Heart Rate</FormLabel>
                <Input
                  name="foetalHeartRate"
                  value={formData.foetalHeartRate}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="Enter heart rate"
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl display="flex" alignItems="center" mt={8}>
                <Checkbox
                  name="inducedLabour"
                  isChecked={formData.inducedLabour}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                >
                  Induced Labour
                </Checkbox>
              </FormControl>
            </GridItem>
            <GridItem colSpan={2}>
              <FormControl>
                <FormLabel>Notes</FormLabel>
                <Textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="Enter additional notes"
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
