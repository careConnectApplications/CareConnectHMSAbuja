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
  SearchTestApi, // API for test search
} from "../Utils/ApiCalls";
import Preloader from "./Preloader";

export default function RequestLabOtherModal({
  isOpen,
  onClose,
  type,
  activateNotifications,
  oldPayload,
  onSuccess, // Callback to notify parent on success
}) {
  const [Loading, setLoading] = useState(false);
  const [Settings, setSettings] = useState({});
  const [TestNames, setTestNames] = useState([]);
  // Instead of pre-loading patients into "Data", we now rely solely on search results.
  const [searchResults, setSearchResults] = useState([]);
  // State to track whether patient search is in progress
  const [isLoadingPatients, setIsLoadingPatients] = useState(false);

  // New states for test search
  const [searchTestQuery, setSearchTestQuery] = useState("");
  const [testSearchResults, setTestSearchResults] = useState([]);
  const [isLoadingTests, setIsLoadingTests] = useState(false);

  const [Payload, setPayload] = useState({
    testNames: "",
    id: "",
  });
  const [searchMRN, setSearchMRN] = useState("");

  // Generic handler to update payload; for test selection, we add the selected test to TestNames
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

  // Trigger lab order request with the selected patient and tests
  const RequestLabOrder = async () => {
    setLoading(true);
    try {
      const result = await RequestLabOrderStandAloneApi(
        { testname: TestNames, notfromappointment: true },
        Payload.id
      );
      if (result.status === 200) {
        setLoading(false);
        onClose();
        setPayload({ testNames: "", id: "" });
        setTestNames([]);
        activateNotifications("Lab Order Created Successfully", "success");
        if (onSuccess) {
          onSuccess(); // Trigger parent's refresh callback
        }
      }
    } catch (e) {
      setLoading(false);
      activateNotifications(e.message, "error");
      onClose();
    }
  };

  const removeTestName = (item) => {
    const updatedTestNames = TestNames.filter((id) => id !== item);
    setTestNames(updatedTestNames);
  };

  // Handler for searching a patient using MRN (or first/last name)
  const handleSearchPatient = async () => {
    setIsLoadingPatients(true);
    try {
      const results = await SearchPatientApi(searchMRN);
      if (results?.queryresult?.patientdetails) {
        // Update searchResults with the returned patients
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

  // useEffect to trigger test search on every change in searchTestQuery
  useEffect(() => {
    const fetchTests = async () => {
      if (searchTestQuery.trim() !== "") {
        setIsLoadingTests(true);
        try {
          const results = await SearchTestApi(searchTestQuery);
          console.log("Test search API response:", results); // Log API response
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
        // If no search query, clear search results so that default list is shown.
        setTestSearchResults([]);
      }
    };

    fetchTests();
  }, [searchTestQuery]);

  useEffect(() => {
    getSettings();
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setSearchMRN("");
      setSearchResults([]);
      setSearchTestQuery("");
      setTestSearchResults([]);
      setPayload({ testNames: "", id: "" });
      setTestNames([]); 
    }
  }, [isOpen]);
  

  // Form is complete if a patient is selected and at least one test is chosen
  const isFormComplete = Payload.id && TestNames.length > 0 && Payload.testNames;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      {Loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <Preloader />
        </Box>
      ) : (
        <ModalContent maxW={{ base: "90%", md: "50%" }}>
          <ModalHeader> Request Lab Order </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box mt="32px">
              {/* Patient Search Section */}
              <Flex mb={2} gap={4}>
                <Input
                  label="Search for Patient"
                  placeholder="Enter MRN, first name, or last name"
                  value={searchMRN}
                  onChange={(e) => setSearchMRN(e.target.value)}
                  leftIcon={<FiSearch size={16} color="blue.500" />}
                  flex="1"
                />
                <Button onClick={handleSearchPatient} w={["100%", "100%", "165px", "205px"]}>
                  Search
                </Button>
              </Flex>
              <Select
                onChange={handlePayload}
                placeholder={isLoadingPatients ? "Loading patients..." : "Select Patient"}
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
                placeholder={isLoadingTests ? "Loading tests..." : "Select Test"}
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
                  ? // When no search query, use the default list from Settings.
                    Settings?.testnames?.map((item, i) => (
                      <option key={i} value={item}>
                        {item}
                      </option>
                    ))
                  : // When a search query is present, use the API search results.
                    testSearchResults.map((item) => (
                      <option key={item._id} value={item.servicetype}>
                        {item.servicetype}
                      </option>
                    ))}
              </Select>
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
                  <Text color="#fff" fontWeight="500" textTransform="capitalize">
                    {item}
                  </Text>
                  <Box fontSize="20px" color="#fff" onClick={() => removeTestName(item)}>
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
