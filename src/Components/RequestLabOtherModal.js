import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Select,
  Box,
  SimpleGrid,
  Flex,
  Text,
} from "@chakra-ui/react";
import Button from "../Components/Button";
import Input from "./Input";
import TextArea from "./TextArea";
import ShowToast from "./ToastNotification";
import { IoIosCloseCircle } from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import {
  GetAllPatientsApi,
  SettingsApi,
  RequestLabOrderStandAloneApi,
  SearchPatientApi,
  SearchTestApi,
  GetAllClinicApi,
} from "../Utils/ApiCalls";
import Preloader from "./Preloader";

export default function RequestLabOtherModal({
  isOpen,
  onClose,
  type,
  activateNotifications,
  oldPayload,
  onSuccess,
}) {
  const [Loading, setLoading] = useState(false);
  const [Settings, setSettings] = useState({});
  const [TestNames, setTestNames] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoadingPatients, setIsLoadingPatients] = useState(false);
  const [searchTestQuery, setSearchTestQuery] = useState("");
  const [testSearchResults, setTestSearchResults] = useState([]);
  const [isLoadingTests, setIsLoadingTests] = useState(false);
  const [labs, setLabs] = useState([]);
  const [Payload, setPayload] = useState({
    department: "",
    testNames: "",
    id: "",
    notes: "", // Added notes field
    priority: "", // Added priority field
  });
  const [searchMRN, setSearchMRN] = useState("");

  useEffect(() => {
    console.log("Payload:", Payload);
  }, [Payload]);

  const handlePayload = (e) => {
    setPayload({ ...Payload, [e.target.id]: e.target.value });
    if (e.target.id === "testNames") {
      setTestNames([...TestNames, e.target.value]);
    }
  };

  const getSettings = async () => {
    try {
      const result = await SettingsApi();
      setSettings(result);
    } catch (e) {
      console.error(e);
    }
  };

  const getLabs = async () => {
    try {
      const result = await GetAllClinicApi();
      if (result?.queryresult?.clinicdetails) {
        const labList = result.queryresult.clinicdetails.filter(
          (item) => item.type === "lab"
        );
        setLabs(labList);
      }
    } catch (e) {
      console.error("Error fetching labs:", e);
    }
  };

  const RequestLabOrder = async () => {
    setLoading(true);
    try {
      const result = await RequestLabOrderStandAloneApi(
        {
          testname: TestNames,
          notfromappointment: true,
          department: Payload.department,
          notes: Payload.notes, // Include notes in the request
          priority: Payload.priority, // Include priority in the request
        },
        Payload.id
      );
      if (result.status === 200) {
        setLoading(false);
        onClose();
        setPayload({
          department: "",
          testNames: "",
          id: "",
          notes: "",
          priority: "",
        });
        setTestNames([]);
        activateNotifications("Lab Order Created Successfully", "success");
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (e) {
      setLoading(false);
      activateNotifications(e.message, "error");
      onClose();
    }
  };

  const removeTestName = (item) => {
    const updatedTestNames = TestNames.filter((test) => test !== item);
    setTestNames(updatedTestNames);
  };

  const handleSearchPatient = async () => {
    setIsLoadingPatients(true);
    try {
      const results = await SearchPatientApi(searchMRN);
      if (results?.queryresult?.patientdetails) {
        setSearchResults(results.queryresult.patientdetails);
      } else {
        setSearchResults([]);
      }
    } catch (e) {
      console.error("Error searching patient:", e.message);
    } finally {
      setIsLoadingPatients(false);
    }
  };

  useEffect(() => {
    const fetchTests = async () => {
      if (searchTestQuery.trim() !== "") {
        setIsLoadingTests(true);
        try {
          const results = await SearchTestApi(searchTestQuery);
          console.log("Test search API response:", results);
          if (results?.queryresult) {
            setTestSearchResults(results.queryresult);
          } else {
            setTestSearchResults([]);
          }
        } catch (e) {
          console.error("Error searching test:", e.message);
          setTestSearchResults([]);
        } finally {
          setIsLoadingTests(false);
        }
      } else {
        setTestSearchResults([]);
      }
    };

    fetchTests();
  }, [searchTestQuery]);

  useEffect(() => {
    getSettings();
  }, []);

  useEffect(() => {
    if (isOpen) {
      getLabs();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setSearchMRN("");
      setSearchResults([]);
      setSearchTestQuery("");
      setTestSearchResults([]);
      setPayload({
        department: "",
        testNames: "",
        id: "",
        notes: "",
        priority: "",
      });
      setTestNames([]);
    }
  }, [isOpen]);

  const isFormComplete =
    Payload.department &&
    Payload.id &&
    TestNames.length > 0 &&
    Payload.testNames;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg" scrollBehavior="inside" >
      <ModalOverlay />
      {Loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
                 maxH="90vh"
          overflow="hidden"

        >
          <Preloader />
        </Box>
      ) : (
        <ModalContent maxW={{ base: "90%", md: "50%" }}>
          <ModalHeader> Request Lab Order </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Department (Lab) Selection Dropdown */}
            <Box mb={4}>
              <Select
                onChange={handlePayload}
                placeholder="Select Lab"
                border="2px solid"
                id="department"
                value={Payload.department}
                size="lg"
                fontSize={Payload.department !== "" ? "16px" : "13px"}
                borderColor="gray.500"
              >
                {labs.map((item, i) => (
                  <option key={i} value={item.clinic}>
                    {item.clinic}
                  </option>
                ))}
              </Select>
            </Box>

            {/* Priority Dropdown */}
            <Box mb={4}>
              <Select
                onChange={handlePayload}
                placeholder="Select Priority"
                border="2px solid"
                id="priority"
                value={Payload.priority}
                size="lg"
                fontSize={Payload.priority !== "" ? "16px" : "13px"}
                borderColor="gray.500"
              >
                {Settings?.priority?.map((item, i) => (
                  <option key={i} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
            </Box>

            {/* Patient Search Section */}
            <Box mt="32px">
              <Flex mb={2} gap={4}>
                <Input
                  label="Search for Patient"
                  placeholder="Enter MRN, first name, or last name"
                  value={searchMRN}
                  onChange={(e) => setSearchMRN(e.target.value)}
                  leftIcon={<FiSearch size={16} color="blue.500" />}
                  flex="1"
                />
                <Button
                  onClick={handleSearchPatient}
                  w={["100%", "100%", "165px", "205px"]}
                >
                  Search
                </Button>
              </Flex>
              <Select
                onChange={handlePayload}
                placeholder={
                  isLoadingPatients ? "Loading patients..." : "Select Patient"
                }
                border="2px solid"
                id="id"
                value={Payload.id}
                size="lg"
                fontSize={Payload.id !== "" ? "16px" : "13px"}
                borderColor="gray.500"
                mt={searchResults.length > 0 ? 4 : 0}
                isDisabled={isLoadingPatients}
              >
                {searchResults.map((item, i) => (
                  <option key={i} value={item._id}>
                    {`${item.firstName} ${item.lastName} ~ ${item.MRN}`}
                  </option>
                ))}
              </Select>

              {/* Test Search Section */}
              <Box mt={4}>
                <Input
                  label="Search for Test"
                  placeholder="Enter test name"
                  value={searchTestQuery}
                  onChange={(e) => setSearchTestQuery(e.target.value)}
                  leftIcon={<FiSearch size={16} color="blue.500" />}
                />
              </Box>
              <Select
                onChange={handlePayload}
                placeholder={
                  isLoadingTests ? "Loading tests..." : "Select Test"
                }
                border="2px solid"
                id="testNames"
                value={Payload.testNames}
                size="lg"
                fontSize={Payload.testNames !== "" ? "16px" : "13px"}
                borderColor="gray.500"
                mt={4}
                isDisabled={isLoadingTests}
              >
                {searchTestQuery.trim() === ""
                  ? Settings?.testnames?.map((item, i) => (
                      <option key={i} value={item}>
                        {item}
                      </option>
                    ))
                  : testSearchResults.map((item) => (
                      <option key={item._id} value={item.servicetype}>
                        {item.servicetype}
                      </option>
                    ))}
              </Select>
            </Box>

            {/* Notes TextArea */}
            <Box mt="35px">
              <TextArea
                label="Notes"
                placeholder="Enter any additional notes"
                value={Payload.notes}
                onChange={(e) =>
                  setPayload({ ...Payload, notes: e.target.value })
                }
              />
            </Box>

            <SimpleGrid mt="12px" columns={{ base: 2, md: 4 }} spacing={2}>
              {TestNames?.map((item, i) => (
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
                  <Text
                    color="#fff"
                    fontWeight="500"
                    textTransform="capitalize"
                  >
                    {item}
                  </Text>
                  <Box
                    fontSize="20px"
                    color="#fff"
                    onClick={() => removeTestName(item)}
                  >
                    <IoIosCloseCircle />
                  </Box>
                </Flex>
              ))}
            </SimpleGrid>
            <Button
              mt="32px"
              onClick={RequestLabOrder}
              isLoading={Loading}
              disabled={!isFormComplete}
            >
              Request
            </Button>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      )}
    </Modal>
  );
}
