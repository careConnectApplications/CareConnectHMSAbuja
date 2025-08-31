import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  SimpleGrid,
  Select,
  Flex,
  Text,
  Box,
  Badge,
} from "@chakra-ui/react";
import Input from "./Input";
import Button from "./Button";
import { FaNoteSticky } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import {
  SettingsApi,
  AddProcedureAPI,
  UpdateProcedureAPI,
  GetAllClinicApi,
  SearchProcedureApi,
  GetPriceOfService,
} from "../Utils/ApiCalls";

export default function CreateProcedureModal({
  isOpen,
  onClose,
  setOldPayload,
  activateNotifications,
  type,
  oldPayload = {},
}) {
  const [Loading, setLoading] = useState(false);
  const [Clinics, setClinics] = useState([]);
  const [Settings, setSettings] = useState({});
  const [Payload, setPayload] = useState({
    clinic: "",
    indicationdiagnosisprocedure: "",
    procedure: "",
    appointmentdate: "",
    cptcodes: "",
    dxcodes: "",
    proceduretype: "",
  });
  const [UpdatedPayload, setUpdatedPayload] = useState({
    clinic: "",
    indicationdiagnosisprocedure: "",
    procedure: "",
    appointmentdate: "",
    cptcodes: "",
    dxcodes: "",
    proceduretype: "",
  });

  const [ProcedureArr, setProcedureArr] = useState([]);
  const [CptcodesArr, setCptcodesArr] = useState([]);
  const [DxcodesArr, setDxcodesArr] = useState([]);
  const [searchProcedureQuery, setSearchProcedureQuery] = useState("");
  const [procedureSearchResults, setProcedureSearchResults] = useState([]);
  const [isLoadingProcedures, setIsLoadingProcedures] = useState(false);
  const [procedurePrices, setProcedurePrices] = useState({}); // Store prices for each procedure
  const patientId = localStorage.getItem("patientId");

  // Calculate total price
  const totalPrice = Object.values(procedurePrices).reduce((sum, price) => {
    if (typeof price === "number") return sum + price;
    return sum;
  }, 0);

  useEffect(() => {
    if (!isOpen) return;

    async function fetchAll() {
      try {
        const [clinicRes, settingsRes] = await Promise.all([
          GetAllClinicApi(),
          SettingsApi(),
        ]);
        setClinics(clinicRes.queryresult.clinicdetails);
        setSettings(settingsRes);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchAll();

    setUpdatedPayload({
      clinic: oldPayload?.clinic || "",
      indicationdiagnosisprocedure:
        oldPayload?.indicationdiagnosisprocedure || "",
      procedure: oldPayload?.procedure || "",
      appointmentdate: oldPayload?.appointmentdate || "",
      cptcodes: oldPayload?.cptcodes || "",
      dxcodes: oldPayload?.dxcodes || "",
      proceduretype: oldPayload?.proceduretype || "",
    });

    // Initialize procedure array if editing
    if (type === "edit" && oldPayload?.procedure) {
      setProcedureArr(
        Array.isArray(oldPayload.procedure)
          ? oldPayload.procedure
          : [oldPayload.procedure]
      );
    }
  }, [isOpen, oldPayload, type]);

  useEffect(() => {
    async function fetchProcedures() {
      if (!searchProcedureQuery.trim()) {
        setProcedureSearchResults([]);
        return;
      }
      setIsLoadingProcedures(true);
      try {
        const res = await SearchProcedureApi(searchProcedureQuery.trim());
        setProcedureSearchResults(res.queryresult || []);
      } catch (error) {
        console.error("Error searching procedures:", error);
        setProcedureSearchResults([]);
      } finally {
        setIsLoadingProcedures(false);
      }
    }
    fetchProcedures();
  }, [searchProcedureQuery]);

  // Fetch prices when ProcedureArr changes
  useEffect(() => {
    const fetchProcedurePrices = async () => {
      if (ProcedureArr.length === 0) {
        setProcedurePrices({});
        return;
      }

      const newPrices = { ...procedurePrices };
      let hasChanges = false;

      // Fetch prices for newly added procedures
      for (const procedure of ProcedureArr) {
        if (!newPrices[procedure]) {
          try {
            const response = await GetPriceOfService(
              { servicetype: procedure },
              patientId
            );
            newPrices[procedure] = response.data?.price || "N/A";
            hasChanges = true;
          } catch (error) {
            console.error(`Error fetching price for ${procedure}:`, error);
            newPrices[procedure] = "N/A";
            hasChanges = true;
          }
        }
      }

      // Remove prices for procedures no longer in the list
      Object.keys(newPrices).forEach((procedure) => {
        if (!ProcedureArr.includes(procedure)) {
          delete newPrices[procedure];
          hasChanges = true;
        }
      });

      if (hasChanges) {
        setProcedurePrices(newPrices);
      }
    };

    fetchProcedurePrices();
  }, [ProcedureArr]);

  const handleClose = () => {
    // Reset all state when closing
    setPayload({
      clinic: "",
      indicationdiagnosisprocedure: "",
      procedure: "",
      appointmentdate: "",
      cptcodes: "",
      dxcodes: "",
      proceduretype: "",
    });
    setUpdatedPayload({
      clinic: "",
      indicationdiagnosisprocedure: "",
      procedure: "",
      appointmentdate: "",
      cptcodes: "",
      dxcodes: "",
      proceduretype: "",
    });
    setProcedureArr([]);
    setCptcodesArr([]);
    setDxcodesArr([]);
    setSearchProcedureQuery("");
    setProcedureSearchResults([]);
    setProcedurePrices({});
    onClose();
  };

  const handlePayload = (e) => {
    const { id, value } = e.target;
    setPayload({ ...Payload, [id]: value });

    if (id === "procedure" && value) {
      setProcedureArr([...ProcedureArr, value]);
      setPayload((prev) => ({ ...prev, procedure: "" })); // Clear the select after adding
    }
    if (id === "cptcodes" && value) {
      setCptcodesArr([...CptcodesArr, value]);
      setPayload((prev) => ({ ...prev, cptcodes: "" }));
    }
    if (id === "dxcodes" && value) {
      setDxcodesArr([...DxcodesArr, value]);
      setPayload((prev) => ({ ...prev, dxcodes: "" }));
    }
  };

  const handleUpdatedPayload = (e) => {
    const { id, value } = e.target;
    setUpdatedPayload({ ...UpdatedPayload, [id]: value });

    if (id === "procedure" && value) {
      setProcedureArr([...ProcedureArr, value]);
      setUpdatedPayload((prev) => ({ ...prev, procedure: "" }));
    }
  };

  const removeProcedureArr = (item) =>
    setProcedureArr((arr) => arr.filter((p) => p !== item));
  const removeCptcodesArr = (item) =>
    setCptcodesArr((arr) => arr.filter((c) => c !== item));
  const removeDxcodesArr = (item) =>
    setDxcodesArr((arr) => arr.filter((d) => d !== item));

  const handleSubmitNew = async () => {
    if (ProcedureArr.length === 0) {
      activateNotifications("At least one procedure is required", "error");
      return;
    }

    setLoading(true);
    try {
      const result = await AddProcedureAPI(
        {
          clinic: Payload.clinic,
          indicationdiagnosisprocedure: Payload.indicationdiagnosisprocedure,
          procedure: ProcedureArr,
          appointmentdate: Payload.appointmentdate,
          cptcodes: CptcodesArr,
          dxcodes: DxcodesArr,
          appointmentid: oldPayload.id,
          proceduretype: Payload.proceduretype,
        },
        patientId
      );
      if (result.status === 200) {
        activateNotifications("Procedure Scheduled Successfully", "success");
        handleClose();
      }
    } catch (e) {
      activateNotifications(e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitUpdate = async () => {
    if (ProcedureArr.length === 0) {
      activateNotifications("At least one procedure is required", "error");
      return;
    }

    setLoading(true);
    try {
      const result = await UpdateProcedureAPI(
        {
          clinic: UpdatedPayload.clinic,
          indicationdiagnosisprocedure:
            UpdatedPayload.indicationdiagnosisprocedure,
          procedure: ProcedureArr,
          appointmentdate: UpdatedPayload.appointmentdate,
          cptcodes: CptcodesArr,
          dxcodes: DxcodesArr,
          proceduretype: UpdatedPayload.proceduretype,
        },
        oldPayload._id
      );
      if (result.status === 200) {
        activateNotifications("Updated Successfully", "success");
        handleClose();
      }
    } catch (e) {
      activateNotifications(e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const ChipGrid = ({ items, removeFn, showPrice = false }) => (
    <SimpleGrid mt="12px" columns={{ base: 2, md: 4 }} spacing={2}>
      {items.map((item, i) => (
        <Flex
          key={i}
          cursor="pointer"
          px="10px"
          py="10px"
          rounded="25px"
          fontSize="13px"
          _hover={{ bg: "blue.blue400" }}
          bg="blue.blue500"
          w="100%"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Text color="#fff" fontWeight="500" textTransform="capitalize">
              {item}
            </Text>
            {showPrice && (
              <Text fontSize="10px" color="#fff">
                Price: {procedurePrices[item] || "Loading..."}
              </Text>
            )}
          </Box>
          <Box fontSize="20px" color="#fff" onClick={() => removeFn(item)}>
            <IoIosCloseCircle />
          </Box>
        </Flex>
      ))}
    </SimpleGrid>
  );

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent
        maxW={{ base: "90%", md: "60%" }}
        maxH="80vh"
        overflowY="auto"
      >
        <ModalHeader>
          {type === "new"
            ? "Add New Procedure"
            : type === "edit"
            ? "Edit Procedure"
            : "Procedure Details"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {type === "new" && (
            <>
              <SimpleGrid mt="18px" mb="5" columns={{ base: 1 }} spacing={5}>
                {/* Clinic */}
                <Select
                  onChange={handlePayload}
                  placeholder="Select Clinic"
                  id="clinic"
                  value={Payload.clinic}
                  fontSize={Payload.clinic ? "16px" : "13px"}
                  size="lg"
                  border="2px solid"
                  borderColor="gray.500"
                >
                  {Clinics.filter((c) => c.type === "clinic").map((c, i) => (
                    <option key={i} value={c.clinic}>
                      {c.clinic}
                    </option>
                  ))}
                </Select>

                {/* Indication */}
                <Input
                  leftIcon={<FaNoteSticky />}
                  id="indicationdiagnosisprocedure"
                  value={Payload.indicationdiagnosisprocedure}
                  onChange={handlePayload}
                  label="Indication Diagnosis Procedure"
                />

                <Select
                  onChange={handlePayload}
                  placeholder="Select Procedure Type"
                  id="proceduretype"
                  value={Payload.proceduretype}
                  fontSize={Payload.proceduretype ? "16px" : "13px"}
                  size="lg"
                  border="2px solid"
                  borderColor="gray.500"
                >
                  {Settings?.proceduretype?.map((type, i) => (
                    <option key={i} value={type}>
                      {type}
                    </option>
                  ))}
                </Select>

                {/* Procedure search and select */}
                <Input
                  label="Search for Procedure"
                  placeholder="Enter procedure name"
                  value={searchProcedureQuery}
                  onChange={(e) => setSearchProcedureQuery(e.target.value)}
                  leftIcon={<FiSearch size={16} />}
                />

                <Select
                  onChange={handlePayload}
                  placeholder={
                    isLoadingProcedures
                      ? "Loading procedures..."
                      : "Select Procedure"
                  }
                  id="procedure"
                  value={Payload.procedure}
                  fontSize={Payload.procedure ? "16px" : "13px"}
                  size="lg"
                  border="2px solid"
                  borderColor="gray.500"
                >
                  {searchProcedureQuery.trim() === ""
                    ? Settings?.servicecategory
                        ?.find((s) => s.category === "Procedure")
                        ?.type?.map((item, i) => (
                          <option key={i} value={item}>
                            {item}
                          </option>
                        ))
                    : procedureSearchResults.map((item, i) => (
                        <option key={i} value={item.servicetype}>
                          {item.servicetype}
                        </option>
                      ))}
                </Select>

                {/* Procedure chips with prices */}
                <ChipGrid
                  items={ProcedureArr}
                  removeFn={removeProcedureArr}
                  showPrice
                />

                {/* Appointment date */}
                <Input
                  leftIcon={<FaCalendarAlt />}
                  label="Appointment Date"
                  type="datetime-local"
                  id="appointmentdate"
                  value={Payload.appointmentdate}
                  onChange={handlePayload}
                />

                {/* CPT */}
                <Select
                  onChange={handlePayload}
                  placeholder="Select CPT Codes"
                  id="cptcodes"
                  value={Payload.cptcodes}
                  fontSize={Payload.cptcodes ? "16px" : "13px"}
                  size="lg"
                  border="2px solid"
                  borderColor="gray.500"
                >
                  {Settings?.cptcodes?.map((c, i) => (
                    <option key={i} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>

                <ChipGrid items={CptcodesArr} removeFn={removeCptcodesArr} />

                {/* DX */}
                <Select
                  onChange={handlePayload}
                  placeholder="Select DX Codes"
                  id="dxcodes"
                  value={Payload.dxcodes}
                  fontSize={Payload.dxcodes ? "16px" : "13px"}
                  size="lg"
                  border="2px solid"
                  borderColor="gray.500"
                >
                  {Settings?.dxcodes?.map((d, i) => (
                    <option key={i} value={d}>
                      {d}
                    </option>
                  ))}
                </Select>

                <ChipGrid items={DxcodesArr} removeFn={removeDxcodesArr} />
              </SimpleGrid>

              {/* Total price display */}
              {ProcedureArr.length > 0 && (
                <Flex justifyContent="flex-end" mt="12px">
                  <Badge colorScheme="green" fontSize="md" px={3} py={1}>
                    Total: {totalPrice.toFixed(2)}
                  </Badge>
                </Flex>
              )}

              <Button mt="32px" isLoading={Loading} onClick={handleSubmitNew}>
                Proceed
              </Button>
            </>
          )}

          {type === "edit" && (
            <>
              <SimpleGrid mt="18px" mb="5" columns={{ base: 1 }} spacing={5}>
                {/* Clinic */}
                <Select
                  onChange={handleUpdatedPayload}
                  placeholder="Select Clinic"
                  id="clinic"
                  value={UpdatedPayload.clinic}
                  fontSize={UpdatedPayload.clinic ? "16px" : "13px"}
                  size="lg"
                  border="2px solid"
                  borderColor="gray.500"
                >
                  {Clinics.filter((c) => c.type === "clinic").map((c, i) => (
                    <option key={i} value={c.clinic}>
                      {c.clinic}
                    </option>
                  ))}
                </Select>

                {/* Indication */}
                <Input
                  leftIcon={<FaNoteSticky />}
                  id="indicationdiagnosisprocedure"
                  value={UpdatedPayload.indicationdiagnosisprocedure}
                  onChange={handleUpdatedPayload}
                  label="Indication Diagnosis Procedure"
                />

                <Select
                  onChange={handleUpdatedPayload}
                  placeholder="Select Procedure Type"
                  id="proceduretype"
                  value={UpdatedPayload.proceduretype}
                  fontSize={UpdatedPayload.proceduretype ? "16px" : "13px"}
                  size="lg"
                  border="2px solid"
                  borderColor="gray.500"
                >
                  {Settings?.proceduretype?.map((type, i) => (
                    <option key={i} value={type}>
                      {type}
                    </option>
                  ))}
                </Select>
                {/* Procedure search + select */}
                <Input
                  label="Search for Procedure"
                  placeholder="Enter procedure name"
                  value={searchProcedureQuery}
                  onChange={(e) => setSearchProcedureQuery(e.target.value)}
                  leftIcon={<FiSearch size={16} />}
                />

                <Select
                  onChange={handleUpdatedPayload}
                  placeholder={
                    isLoadingProcedures
                      ? "Loading procedures..."
                      : "Select Procedure"
                  }
                  id="procedure"
                  value={UpdatedPayload.procedure}
                  fontSize={UpdatedPayload.procedure ? "16px" : "13px"}
                  size="lg"
                  border="2px solid"
                  borderColor="gray.500"
                >
                  {searchProcedureQuery.trim() === ""
                    ? Settings?.servicecategory
                        ?.find((s) => s.category === "Procedure")
                        ?.type?.map((item, i) => (
                          <option key={i} value={item}>
                            {item}
                          </option>
                        ))
                    : procedureSearchResults.map((item, i) => (
                        <option key={i} value={item.servicetype}>
                          {item.servicetype}
                        </option>
                      ))}
                </Select>

                {/* Procedure chips with prices */}
                <ChipGrid
                  items={ProcedureArr}
                  removeFn={removeProcedureArr}
                  showPrice
                />

                {/* Appointment */}
                <Input
                  leftIcon={<FaCalendarAlt />}
                  label="Appointment Date"
                  type="datetime-local"
                  id="appointmentdate"
                  value={UpdatedPayload.appointmentdate}
                  onChange={handleUpdatedPayload}
                />

                {/* CPT */}
                <Select
                  onChange={handlePayload}
                  placeholder="Select CPT Codes"
                  id="cptcodes"
                  value={Payload.cptcodes}
                  fontSize={Payload.cptcodes ? "16px" : "13px"}
                  size="lg"
                  border="2px solid"
                  borderColor="gray.500"
                >
                  {Settings?.cptcodes?.map((c, i) => (
                    <option key={i} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>

                <ChipGrid items={CptcodesArr} removeFn={removeCptcodesArr} />

                {/* DX */}
                <Select
                  onChange={handlePayload}
                  placeholder="Select DX Codes"
                  id="dxcodes"
                  value={Payload.dxcodes}
                  fontSize={Payload.dxcodes ? "16px" : "13px"}
                  size="lg"
                  border="2px solid"
                  borderColor="gray.500"
                >
                  {Settings?.dxcodes?.map((d, i) => (
                    <option key={i} value={d}>
                      {d}
                    </option>
                  ))}
                </Select>

                <ChipGrid items={DxcodesArr} removeFn={removeDxcodesArr} />
              </SimpleGrid>

              {/* Total price display */}
              {ProcedureArr.length > 0 && (
                <Flex justifyContent="flex-end" mt="12px">
                  <Badge colorScheme="green" fontSize="md" px={3} py={1}>
                    Total: {totalPrice.toFixed(2)}
                  </Badge>
                </Flex>
              )}

              <Button
                mt="32px"
                isLoading={Loading}
                onClick={handleSubmitUpdate}
              >
                Update
              </Button>
            </>
          )}

          {type !== "new" && type !== "edit" && (
            <>
              <SimpleGrid mt="18px" mb="5" columns={{ base: 1 }} spacing={5}>
                {/* everything disabled */}
                <Select
                  isDisabled
                  value={UpdatedPayload.clinic}
                  size="lg"
                  border="2px solid"
                >
                  <option>{UpdatedPayload.clinic || "N/A"}</option>
                </Select>

                <Input
                  isDisabled
                  id="indicationdiagnosisprocedure"
                  value={UpdatedPayload.indicationdiagnosisprocedure}
                  label="Indication Diagnosis Procedure"
                />

                <Select
                  isDisabled
                  value={UpdatedPayload.proceduretype}
                  size="lg"
                  border="2px solid"
                >
                  <option>{UpdatedPayload.proceduretype || "N/A"}</option>
                </Select>

                <Select
                  isDisabled
                  value={UpdatedPayload.procedure}
                  size="lg"
                  border="2px solid"
                >
                  <option>{UpdatedPayload.procedure || "N/A"}</option>
                </Select>

                <ChipGrid items={ProcedureArr} removeFn={() => {}} showPrice />

                <Input
                  isDisabled
                  type="datetime-local"
                  id="appointmentdate"
                  value={UpdatedPayload.appointmentdate}
                  label="Appointment Date"
                />

                <Select
                  isDisabled
                  value={Payload.cptcodes}
                  size="lg"
                  border="2px solid"
                >
                  <option>{Payload.cptcodes || "N/A"}</option>
                </Select>

                <Select
                  isDisabled
                  value={Payload.dxcodes}
                  size="lg"
                  border="2px solid"
                >
                  <option>{Payload.dxcodes || "N/A"}</option>
                </Select>
              </SimpleGrid>

              {/* Total price display */}
              {ProcedureArr.length > 0 && (
                <Flex justifyContent="flex-end" mt="12px">
                  <Badge colorScheme="green" fontSize="md" px={3} py={1}>
                    Total: {totalPrice.toFixed(2)}
                  </Badge>
                </Flex>
              )}
            </>
          )}
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
}
