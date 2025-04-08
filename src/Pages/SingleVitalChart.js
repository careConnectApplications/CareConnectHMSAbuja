import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Flex,
  Spinner,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { SlPlus } from "react-icons/sl";
import { BiSearch } from "react-icons/bi";
import { IoFilter } from "react-icons/io5";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { configuration } from "../Utils/Helpers";
import SingleVitalModal from "../Components/SingleVitalModal";
import TableRowY from "../Components/TableRowY";
import Pagination from "../Components/Pagination";
import Button from "../Components/Button";
import Input from "../Components/Input";

import { ReadAllVitalsByPatientApi } from "../Utils/ApiCalls";

const SingleVitalChart = () => {
  const [vitalData, setVitalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // 'filter' can be "all", "date", or "createdBy"
  const [filter, setFilter] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [StartDate, setStartDate] = useState("");
  const [EndDate, setEndDate] = useState("");
  // Controls whether date inputs are shown (when filtering by date)
  const [byDate, setByDate] = useState(false);
  const [isVitalModalOpen, setIsVitalModalOpen] = useState(false);
  // Trigger state to force re-fetch of data after a new or updated vital record.
  const [trigger, setTrigger] = useState(false);
  // New state to handle editing
  const [selectedVital, setSelectedVital] = useState(null);
  const [vitalModalType, setVitalModalType] = useState("create");

  const patientId = localStorage.getItem("patientId");


  const storedPatient = localStorage.getItem("inPatient");
  let patient = storedPatient ? JSON.parse(storedPatient) : null;
  const admissionId =
    patient && patient.admission && Array.isArray(patient.admission)
      ? patient.admission[0]
      : localStorage.getItem("admissionId");

  const postPerPage = configuration.sizePerPage;

  // Fetch data (re-fetch when 'trigger' changes)
  useEffect(() => {
    if (patientId) {
      setLoading(true);
      ReadAllVitalsByPatientApi(patientId)
        .then((response) => {
          console.log("API response:", response);
          // Safely extract the data from the API response
          const data = response?.queryresult?.vitalchartsdetails || [];
          const transformedData = data.map((item) => ({
            id: item._id,
            // Format createdAt as YYYY-MM-DD for the vital date
            vitalDate: new Date(item.createdAt).toISOString().split("T")[0],
            temperature: parseFloat(item.temperature),
            heartRate: parseFloat(item.heartrate),
            bpSystolic: parseFloat(item.bloodpressuresystolic),
            bpDiastolic: parseFloat(item.bloodpressurediastolic),
            rbs: item.rbs,
            gcs: item.gcs,
            painScore: item.painscore,
            bmi: parseFloat(item.bmi),
            height: parseFloat(item.height),
            weight: parseFloat(item.weight),
            o2Saturation: item.saturation,
            createdBy: item.staffname,
          }));
          setVitalData(transformedData);
          setFilteredData(transformedData);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching vital chart data:", err);
          setError(err.message);
          setLoading(false);
        });
    }
  }, [patientId, trigger]);

  // Apply filtering based on the selected criteria
  useEffect(() => {
    if (filter === "all") {
      setFilteredData(vitalData);
    } else if (filter === "date") {
      if (StartDate && EndDate) {
        // Extend the end date by one day to include the whole day
        let endDateObj = new Date(EndDate);
        endDateObj.setDate(endDateObj.getDate() + 1);
        let formattedEndDate = endDateObj.toISOString().split("T")[0];
        setFilteredData(
          vitalData.filter(
            (item) =>
              item.vitalDate >= StartDate && item.vitalDate <= formattedEndDate
          )
        );
      } else {
        setFilteredData(vitalData);
      }
    } else if (filter === "createdBy") {
      setFilteredData(
        vitalData.filter((item) =>
          item.createdBy.toLowerCase().includes(searchInput.toLowerCase())
        )
      );
    }
  }, [filter, searchInput, StartDate, EndDate, vitalData]);

  // Pagination logic
  const indexOfLastPost = currentPage * postPerPage;
  const indexOfFirstPost = indexOfLastPost - postPerPage;
  const paginatedData = filteredData.slice(indexOfFirstPost, indexOfLastPost);

  // Prepare data for the Chart.js line chart
  const chartData = {
    labels: filteredData.map((item) => item.vitalDate),
    datasets: [
      {
        label: "Temperature",
        data: filteredData.map((item) => item.temperature),
        fill: false,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
      },
      {
        label: "Heart Rate",
        data: filteredData.map((item) => item.heartRate),
        fill: false,
        backgroundColor: "rgba(255,99,132,0.4)",
        borderColor: "rgba(255,99,132,1)",
      },
      {
        label: "BP Systolic",
        data: filteredData.map((item) => item.bpSystolic),
        fill: false,
        backgroundColor: "rgba(54, 162, 235, 0.4)",
        borderColor: "rgba(54, 162, 235, 1)",
      },
      {
        label: "BP Diastolic",
        data: filteredData.map((item) => item.bpDiastolic),
        fill: false,
        backgroundColor: "rgba(153, 102, 255, 0.4)",
        borderColor: "rgba(153, 102, 255, 1)",
      },
    ],
  };

  // When adding a new vital record, ensure the modal is in create mode.
  const handleAddVitalClick = () => {
    setVitalModalType("create");
    setSelectedVital(null);
    setIsVitalModalOpen(true);
  };

  // This function is called when a row’s Edit action is clicked.
  const handleEditVital = (vital) => {
    setSelectedVital(vital);
    setVitalModalType("edit");
    setIsVitalModalOpen(true);
  };

  return (
    <Box
      bg="#fff"
      border="1px solid #EFEFEF"
      mt="10px"
      py="17px"
      px="18px"
      rounded="10px"
    >
      {/* Top Controls: Add Vital button & Search/Filter UI */}
      <Flex justifyContent="space-between" flexWrap="wrap" mb="20px">
        <Button
          rightIcon={<SlPlus />}
          w={["100%", "100%", "144px", "144px"]}
          onClick={handleAddVitalClick}
        >
          Add Vital 
        </Button>
        <Flex
          flexWrap="wrap"
          mt={["10px", "10px", "0", "0"]}
          alignItems="center"
          justifyContent="flex-end"
        >
          <HStack spacing="4">
            {!byDate ? (
              <Input
                label="Search"
                onChange={(e) => setSearchInput(e.target.value)}
                value={searchInput}
                bColor="#E4E4E4"
                leftIcon={<BiSearch />}
              />
            ) : (
              <HStack>
                <Input
                  placeholder="Start Date"
                  type="date"
                  value={StartDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  size="md"
                  variant="outline"
                  borderColor="#E4E4E4"
                  focusBorderColor="blue.blue500"
                />
                <Input
                  placeholder="End Date"
                  type="date"
                  value={EndDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  size="md"
                  variant="outline"
                  borderColor="#E4E4E4"
                  focusBorderColor="blue.blue500"
                />
                <Flex
                  onClick={() => {}}
                  cursor="pointer"
                  px="5px"
                  py="3px"
                  rounded="5px"
                  bg="blue.blue500"
                  color="#fff"
                  justifyContent="center"
                  alignItems="center"
                >
                  <BiSearch />
                </Flex>
              </HStack>
            )}
            <Menu isLazy>
              <MenuButton as={Box}>
                <HStack
                  border="1px solid #EA5937"
                  rounded="7px"
                  cursor="pointer"
                  py="11.64px"
                  px="16.98px"
                  bg="#f8ddd1"
                  color="blue.blue500"
                  fontWeight="500"
                  fontSize="14px"
                >
                  <Text>Filter</Text>
                  <IoFilter />
                </HStack>
              </MenuButton>
              <MenuList>
                <MenuItem
                  onClick={() => {
                    setFilter("createdBy");
                    setByDate(false);
                    setStartDate("");
                    setEndDate("");
                  }}
                  textTransform="capitalize"
                  fontWeight="500"
                  color="#2F2F2F"
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                >
                  <HStack fontSize="14px">
                    <Text>by Created By</Text>
                  </HStack>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setFilter("date");
                    setByDate(true);
                  }}
                  textTransform="capitalize"
                  fontWeight="500"
                  color="#2F2F2F"
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                >
                  <HStack fontSize="14px">
                    <Text>by Date</Text>
                  </HStack>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setFilter("all");
                    setSearchInput("");
                    setByDate(false);
                    setStartDate("");
                    setEndDate("");
                  }}
                  textTransform="capitalize"
                  fontWeight="500"
                  color="#2F2F2F"
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                >
                  <HStack fontSize="14px">
                    <Text>clear filter</Text>
                  </HStack>
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>
      </Flex>

      <Tabs variant="enclosed" isFitted>
        <TabList mb="1em" color="#101828">
          <Tab _focus={{ outline: "none" }} _selected={{ color: "blue.blue500" }}>
            Chart View
          </Tab>
          <Tab _focus={{ outline: "none" }} _selected={{ color: "blue.blue500" }}>
            Table View
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Box p="10px" border="1px solid #EFEFEF" rounded="10px">
              <Line data={chartData} />
            </Box>
          </TabPanel>
          <TabPanel>
            <Box
              bg="#fff"
              border="1px solid #EFEFEF"
              mt="12px"
              py="15px"
              px="15px"
              rounded="10px"
              overflowX="auto"
            >
              {loading ? (
                <Flex justifyContent="center" alignItems="center" minH="100px">
                  <Spinner size="xl" />
                </Flex>
              ) : error ? (
                <Text color="red.500" textAlign="center">
                  {error}
                </Text>
              ) : (
                <TableContainer>
                  <Table variant="striped">
                    <Thead bg="#fff">
                      <Tr>
                        <Th fontSize="13px" color="#534D59" fontWeight="600">
                          Vital Date
                        </Th>
                        <Th fontSize="13px" color="#534D59" fontWeight="600">
                          Temperature
                        </Th>
                        <Th fontSize="13px" color="#534D59" fontWeight="600">
                          Heart Rate
                        </Th>
                        <Th fontSize="13px" color="#534D59" fontWeight="600">
                          BP (Systolic)
                        </Th>
                        <Th fontSize="13px" color="#534D59" fontWeight="600">
                          BP (Diastolic)
                        </Th>
                        <Th fontSize="13px" color="#534D59" fontWeight="600">
                          RBS
                        </Th>
                        <Th fontSize="13px" color="#534D59" fontWeight="600">
                          GCS
                        </Th>
                        <Th fontSize="13px" color="#534D59" fontWeight="600">
                          Pain Score
                        </Th>
                        <Th fontSize="13px" color="#534D59" fontWeight="600">
                          BMI
                        </Th>
                        <Th fontSize="13px" color="#534D59" fontWeight="600">
                          Height
                        </Th>
                        <Th fontSize="13px" color="#534D59" fontWeight="600">
                          Weight
                        </Th>
                        <Th fontSize="13px" color="#534D59" fontWeight="600">
                          O2 Saturation
                        </Th>
                        <Th fontSize="13px" color="#534D59" fontWeight="600">
                          Created By
                        </Th>
                        <Th fontSize="13px" color="#534D59" fontWeight="600">
                          Actions
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {paginatedData.map((item) => (
                        <TableRowY
                          key={item.id}
                          type="vital-chart"
                          vitalDate={item.vitalDate}
                          temperature={item.temperature}
                          heartRate={item.heartRate}
                          bpSystolic={item.bpSystolic}
                          bpDiastolic={item.bpDiastolic}
                          rbs={item.rbs}
                          gcs={item.gcs}
                          painScore={item.painScore}
                          bmi={item.bmi}
                          height={item.height}
                          weight={item.weight}
                          o2Saturation={item.o2Saturation}
                          createdBy={item.createdBy}
                          // Pass an onEdit callback so that the row can trigger editing.
                          onEdit={() => handleEditVital(item)}
                          onView={() =>
                            console.log("View vital details", item.id)
                          }
                        />
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              )}
            </Box>
            {!loading && filteredData.length > 0 && (
              <Pagination
                postPerPage={postPerPage}
                currentPage={currentPage}
                totalPosts={filteredData.length}
                paginate={setCurrentPage}
              />
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Render the modal for creating or editing vitals. 
          When editing, pass type="edit" and the selected vital data as initialData. */}
      <SingleVitalModal
        isOpen={isVitalModalOpen}
        onClose={() => setIsVitalModalOpen(false)}
        onSuccess={() => setTrigger((prev) => !prev)}
        patientId={patientId}
        type={vitalModalType}
        initialData={vitalModalType === "edit" ? selectedVital : null}
      />
    </Box>
  );
};

export default SingleVitalChart;
