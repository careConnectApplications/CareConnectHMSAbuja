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
  Text,
} from "@chakra-ui/react";
import Button from "./Button";
import ShowToast from "./ToastNotification";
import {
  CreateThirdStageLabourApi,
  UpdateThirdStageLabourApi,
  GetThirdStageLabourByIdApi,
  SettingsApi,
} from "../Utils/ApiCalls";
import moment from "moment";

export default function ThirdStageLabourModal({
  isOpen,
  onClose,
  mode,
  data,
  patientId,
  fetchData,
}) {
  const [formData, setFormData] = useState({
    mother: {
      bloodPressureSystolic: "",
      bloodPressureDiastolic: "",
      pulse: "",
      temperature: "",
      respiration: "",
      statusAfterDelivery: "",
    },
    newBorn: {
      newBornStatus: "",
      apgarScore1Min: "",
      apgarScore5Min: "",
      apgarScore10Min: "",
      weightKg: "",
    },
    delivery: {
      placenta: "",
      membranes: "",
      cord: "",
      placentaWeight: "",
      drugsGiven: "",
      bloodLoss: "",
      perinealTear: "",
      episiotomy: "",
      bornBeforeArrival: false,
      obstetricComplication: "",
      obstetricCare: "",
      deliveryComment: "",
      deliveredBy: "",
      perinealStatus: "",
      typeofDelivery: "",
      multipleGestation: "",
      mva: "",
      obstetricsFistulaServices: "",
    },
    babiesData: {
      liveBirth: false,
      freshStillBirth: false,
      maceratedStillBirth: false,
      asphyxia: false,
      lowBirthWeight: false,
      macrosomicBabies: false,
      earlyNeoNatalDeath: false,
      bornBeforeArrival: false,
      preMaturity: false,
    },
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
          const response = await GetThirdStageLabourByIdApi(recordId);
          if (response.status === true) {
            const record = response.queryresult;
            setFormData({
              mother: {
                bloodPressureSystolic:
                  record.mother?.bloodPressureSystolic || "",
                bloodPressureDiastolic:
                  record.mother?.bloodPressureDiastolic || "",
                pulse: record.mother?.pulse || "",
                temperature: record.mother?.temperature || "",
                respiration: record.mother?.respiration || "",
                statusAfterDelivery: record.mother?.statusAfterDelivery || "",
              },
              newBorn: {
                newBornStatus: record.newBorn?.newBornStatus || "",
                apgarScore1Min: record.newBorn?.apgarScore1Min || "",
                apgarScore5Min: record.newBorn?.apgarScore5Min || "",
                apgarScore10Min: record.newBorn?.apgarScore10Min || "",
                weightKg: record.newBorn?.weightKg || "",
              },
              delivery: {
                placenta: record.delivery?.placenta || "",
                membranes: record.delivery?.membranes || "",
                cord: record.delivery?.cord || "",
                placentaWeight: record.delivery?.placentaWeight || "",
                drugsGiven: record.delivery?.drugsGiven || "",
                bloodLoss: record.delivery?.bloodLoss || "",
                perinealTear: record.delivery?.perinealTear || "",
                episiotomy: record.delivery?.episiotomy || "",
                bornBeforeArrival: record.delivery?.bornBeforeArrival || false,
                obstetricComplication:
                  record.delivery?.obstetricComplication || "",
                obstetricCare: record.delivery?.obstetricCare || "",
                deliveryComment: record.delivery?.deliveryComment || "",
                deliveredBy: record.delivery?.deliveredBy || "",
                perinealStatus: record.delivery?.perinealStatus || "",
                typeofDelivery: record.delivery?.typeofDelivery || "",
                multipleGestation: record.delivery?.multipleGestation || "",
                mva: record.delivery?.mva || "",
                obstetricsFistulaServices:
                  record.delivery?.obstetricsFistulaServices || "",
              },
              babiesData: {
                liveBirth: record.babiesData?.liveBirth || false,
                freshStillBirth: record.babiesData?.freshStillBirth || false,
                maceratedStillBirth:
                  record.babiesData?.maceratedStillBirth || false,
                asphyxia: record.babiesData?.asphyxia || false,
                lowBirthWeight: record.babiesData?.lowBirthWeight || false,
                macrosomicBabies: record.babiesData?.macrosomicBabies || false,
                earlyNeoNatalDeath:
                  record.babiesData?.earlyNeoNatalDeath || false,
                bornBeforeArrival:
                  record.babiesData?.bornBeforeArrival || false,
                preMaturity: record.babiesData?.preMaturity || false,
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
        mother: {
          bloodPressureSystolic: "",
          bloodPressureDiastolic: "",
          pulse: "",
          temperature: "",
          respiration: "",
          statusAfterDelivery: "",
        },
        newBorn: {
          newBornStatus: "",
          apgarScore1Min: "",
          apgarScore5Min: "",
          apgarScore10Min: "",
          weightKg: "",
        },
        delivery: {
          placenta: "",
          membranes: "",
          cord: "",
          placentaWeight: "",
          drugsGiven: "",
          bloodLoss: "",
          perinealTear: "",
          episiotomy: "",
          bornBeforeArrival: false,
          obstetricComplication: "",
          obstetricCare: "",
          deliveryComment: "",
          deliveredBy: "",
          perinealStatus: "",
          typeofDelivery: "",
          multipleGestation: "",
          mva: "",
          obstetricsFistulaServices: "",
        },
        babiesData: {
          liveBirth: false,
          freshStillBirth: false,
          maceratedStillBirth: false,
          asphyxia: false,
          lowBirthWeight: false,
          macrosomicBabies: false,
          earlyNeoNatalDeath: false,
          bornBeforeArrival: false,
          preMaturity: false,
        },
      });
    }
  }, [mode, data]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const [parent, field] = name.split(".");

    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: type === "checkbox" ? checked : value,
      },
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const payload = { ...formData, patient: patientId };

    try {
      if (mode === "create") {
        const response = await CreateThirdStageLabourApi(payload);
        if (response.status === true) {
          activateNotifications("Record created successfully.", "success");
          fetchData();
          onClose();
        } else {
          activateNotifications(response.data.msg, "error");
        }
      } else if (mode === "edit") {
        const response = await UpdateThirdStageLabourApi(payload, data._id);
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
        <ModalHeader>
          {mode === "create" ? "Add" : mode === "edit" ? "Edit" : "View"} Third
          Stage Labour Record
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody overflowY="auto" pb={6}>
          {/* Mother Section */}
          <Text fontWeight="bold" fontSize="lg" mb={4} color="blue.500">
            Mother Information
          </Text>
          <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={6}>
            <GridItem>
              <FormControl>
                <FormLabel>Blood Pressure (Systolic)</FormLabel>
                <Input
                  name="mother.bloodPressureSystolic"
                  value={formData.mother.bloodPressureSystolic}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="Systolic pressure"
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Blood Pressure (Diastolic)</FormLabel>
                <Input
                  name="mother.bloodPressureDiastolic"
                  value={formData.mother.bloodPressureDiastolic}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="Diastolic pressure"
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Pulse</FormLabel>
                <Input
                  name="mother.pulse"
                  value={formData.mother.pulse}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="Pulse rate"
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Temperature (°C)</FormLabel>
                <Input
                  name="mother.temperature"
                  value={formData.mother.temperature}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="Temperature"
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Respiration</FormLabel>
                <Input
                  name="mother.respiration"
                  value={formData.mother.respiration}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="Respiration rate"
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Status After Delivery</FormLabel>
                <Select
                  name="mother.statusAfterDelivery"
                  value={formData.mother.statusAfterDelivery}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="Select status"
                >
                  {settings?.statusAfterDelivery?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </GridItem>
          </Grid>

          {/* New Born Section */}
          <Text fontWeight="bold" fontSize="lg" mb={4} color="blue.500">
            New Born Information
          </Text>
          <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={6}>
            <GridItem>
              <FormControl>
                <FormLabel>New Born Status</FormLabel>
                <Select
                  name="newBorn.newBornStatus"
                  value={formData.newBorn.newBornStatus}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="Select status"
                >
                  {settings?.newBornStatus?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Apgar Score (1 min)</FormLabel>
                <Input
                  name="newBorn.apgarScore1Min"
                  value={formData.newBorn.apgarScore1Min}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="1 min score"
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Apgar Score (5 min)</FormLabel>
                <Input
                  name="newBorn.apgarScore5Min"
                  value={formData.newBorn.apgarScore5Min}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="5 min score"
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Apgar Score (10 min)</FormLabel>
                <Input
                  name="newBorn.apgarScore10Min"
                  value={formData.newBorn.apgarScore10Min}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="10 min score"
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Weight (kg)</FormLabel>
                <Input
                  name="newBorn.weightKg"
                  value={formData.newBorn.weightKg}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="Weight in kg"
                />
              </FormControl>
            </GridItem>
          </Grid>

          {/* Delivery Section */}
          <Text fontWeight="bold" fontSize="lg" mb={4} color="blue.500">
            Delivery Information
          </Text>
          <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={6}>
            <GridItem>
              <FormControl>
                <FormLabel>Placenta</FormLabel>
                <Select
                  name="delivery.placenta"
                  value={formData.delivery.placenta}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="Select placenta status"
                >
                  {settings?.placenta?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Membranes</FormLabel>
                <Select
                  name="delivery.membranes"
                  value={formData.delivery.membranes}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="Select membranes status"
                >
                  {settings?.membranes?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Cord</FormLabel>
                <Select
                  name="delivery.cord"
                  value={formData.delivery.cord}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="Select cord status"
                >
                  {settings?.cord?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Placenta Weight</FormLabel>
                <Input
                  name="delivery.placentaWeight"
                  value={formData.delivery.placentaWeight}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="Placenta weight"
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Drugs Given</FormLabel>
                <Input
                  name="delivery.drugsGiven"
                  value={formData.delivery.drugsGiven}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="Drugs administered"
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Blood Loss</FormLabel>
                <Input
                  name="delivery.bloodLoss"
                  value={formData.delivery.bloodLoss}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="Blood loss amount"
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Perineal Tear</FormLabel>
                <Select
                  name="delivery.perinealTear"
                  value={formData.delivery.perinealTear}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="Select tear degree"
                >
                  {settings?.perinealTear?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Episiotomy</FormLabel>
                <Select
                  name="delivery.episiotomy"
                  value={formData.delivery.episiotomy}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="Select episiotomy type"
                >
                  {settings?.episiotomy?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl display="flex" alignItems="center" mt={8}>
                <Checkbox
                  name="delivery.bornBeforeArrival"
                  isChecked={formData.delivery.bornBeforeArrival}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                >
                  Born Before Arrival
                </Checkbox>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Obstetric Complication</FormLabel>
                <Select
                  name="delivery.obstetricComplication"
                  value={formData.delivery.obstetricComplication}
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
                  name="delivery.obstetricCare"
                  value={formData.delivery.obstetricCare}
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
                <FormLabel>Delivered By</FormLabel>
                <Input
                  name="delivery.deliveredBy"
                  value={formData.delivery.deliveredBy}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="Name of deliverer"
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Perineal Status</FormLabel>
                <Select
                  name="delivery.perinealStatus"
                  value={formData.delivery.perinealStatus}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="Select perineal status"
                >
                  {settings?.perinealStatus?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Type of Delivery</FormLabel>
                <Select
                  name="delivery.typeofDelivery"
                  value={formData.delivery.typeofDelivery}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="Select delivery type"
                >
                  {settings?.typeofDelivery?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Multiple Gestation</FormLabel>
                <Select
                  name="delivery.multipleGestation"
                  value={formData.delivery.multipleGestation}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="Select gestation type"
                >
                  {settings?.multipleGestation?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>MVA</FormLabel>
                <Select
                  name="delivery.mva"
                  value={formData.delivery.mva}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="Select MVA status"
                >
                  {settings?.mva?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Obstetrics Fistula Services</FormLabel>
                <Select
                  name="delivery.obstetricsFistulaServices"
                  value={formData.delivery.obstetricsFistulaServices}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="Select fistula services"
                >
                  {settings?.obstetricsFistulaServices?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </GridItem>
            <GridItem colSpan={2}>
              <FormControl>
                <FormLabel>Delivery Comment</FormLabel>
                <Textarea
                  name="delivery.deliveryComment"
                  value={formData.delivery.deliveryComment}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                  placeholder="Additional delivery comments"
                />
              </FormControl>
            </GridItem>
          </Grid>

          {/* Babies Data Section */}
          <Text fontWeight="bold" fontSize="lg" mb={4} color="blue.500">
            Babies Data
          </Text>
          <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={6}>
            <GridItem>
              <FormControl display="flex" alignItems="center">
                <Checkbox
                  name="babiesData.liveBirth"
                  isChecked={formData.babiesData.liveBirth}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                >
                  Live Birth
                </Checkbox>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl display="flex" alignItems="center">
                <Checkbox
                  name="babiesData.freshStillBirth"
                  isChecked={formData.babiesData.freshStillBirth}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                >
                  Fresh Still Birth
                </Checkbox>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl display="flex" alignItems="center">
                <Checkbox
                  name="babiesData.maceratedStillBirth"
                  isChecked={formData.babiesData.maceratedStillBirth}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                >
                  Macerated Still Birth
                </Checkbox>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl display="flex" alignItems="center">
                <Checkbox
                  name="babiesData.asphyxia"
                  isChecked={formData.babiesData.asphyxia}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                >
                  Asphyxia
                </Checkbox>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl display="flex" alignItems="center">
                <Checkbox
                  name="babiesData.lowBirthWeight"
                  isChecked={formData.babiesData.lowBirthWeight}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                >
                  Low Birth Weight
                </Checkbox>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl display="flex" alignItems="center">
                <Checkbox
                  name="babiesData.macrosomicBabies"
                  isChecked={formData.babiesData.macrosomicBabies}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                >
                  Macrosomic Babies
                </Checkbox>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl display="flex" alignItems="center">
                <Checkbox
                  name="babiesData.earlyNeoNatalDeath"
                  isChecked={formData.babiesData.earlyNeoNatalDeath}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                >
                  Early Neonatal Death
                </Checkbox>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl display="flex" alignItems="center">
                <Checkbox
                  name="babiesData.bornBeforeArrival"
                  isChecked={formData.babiesData.bornBeforeArrival}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                >
                  Born Before Arrival
                </Checkbox>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl display="flex" alignItems="center">
                <Checkbox
                  name="babiesData.preMaturity"
                  isChecked={formData.babiesData.preMaturity}
                  onChange={handleChange}
                  isReadOnly={mode === "view"}
                >
                  Pre-Maturity
                </Checkbox>
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
