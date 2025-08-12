import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MainLayout from "../Layouts/Index";
import { Text, Flex, HStack, Box, useDisclosure } from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, TableContainer, Menu, MenuButton, SimpleGrid, Select, MenuList, MenuItem } from "@chakra-ui/react";
import TableRow from "../Components/TableRow";
import Button from "../Components/Button";
import Input from "../Components/Input";
import VitalsModal from "../Components/VitalsModal";
import UpdateClinicalInfoModal from "../Components/UpdateClinicalInfoModal";
import AddSpecialNeedsModal from "../Components/AddSpecialNeedsModal";
import ShowToast from "../Components/ToastNotification";
import { BiSearch } from "react-icons/bi";
import { IoFilter } from "react-icons/io5";
import { SlPlus } from "react-icons/sl";
import CreateAppointmentModal from "../Components/CreateAppointmentModal";
import moment from "moment";
import Seo from "../Utils/Seo";

import { GetAllPatientsHistoryApi, GetAllTodayQueueHistoryApi, GetOnlyClinicApi, GetAllPatientsHistoryFilteredApi } from "../Utils/ApiCalls";
import Pagination from "../Components/Pagination";
import { configuration } from '../Utils/Helpers'
import Preloader from "../Components/Preloader";



export default function DoctoerSchedule() {
  const [IsLoading, setIsLoading] = useState(false);
  const [ClinicData, setClinicData] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [Trigger, setTrigger] = useState(false);
  const [OldPayload, setOldPayload] = useState({});
  const [Data, setData] = useState([]);
  const [QueueData, setQueueData] = useState([]);
  const [ModalState, setModalState] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isClinicalInfoModalOpen, setIsClinicalInfoModalOpen] = useState(false);
  const [isSpecialNeedsModalOpen, setIsSpecialNeedsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [TotalData, setTotalData] = useState("");

  const [filters, setFilters] = useState({
    clinic: null,
    status: "scheduled",
    searchTerm: "",
    searchField: "firstName",
  });

  // Pagination settings to follow
  const [CurrentPage, setCurrentPage] = useState(1);
  const [PostPerPage, setPostPerPage] = useState(configuration.sizePerPage);

  const handleFilterChange = (filterName, value) => {
    
    setFilters((prev) => ({ ...prev, [filterName]: value }));
    setCurrentPage(1);
  };

  const fetchData = async () => {
    if (!filters.clinic) return;
    setIsLoading(true);
    try {
      let result;
      if (filters.searchTerm) {
        result = await GetAllPatientsHistoryFilteredApi(
          filters.clinic,
          PostPerPage,
          CurrentPage,
          filters.status,
          filters.searchField,
          filters.searchTerm
        );
      } else {
        result = await GetAllPatientsHistoryApi(
          filters.clinic,
          PostPerPage,
          CurrentPage,
          filters.status
        );
      }

      if (result.status === true) {
        setData(result.queryresult.appointmentdetails);
        setTotalData(result.queryresult.totalappointmentdetails);
        localStorage.setItem(
          "patientList",
          JSON.stringify(result.queryresult.appointmentdetails)
        );
      }
    } catch (e) {
      console.error(e.message);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    status: "",
  });

  const nav = useNavigate();


  const getAllClinic = async () => {
    try {
      const result = await GetOnlyClinicApi();
      setClinicData(result.queryresult.clinicdetails);
    } catch (e) {
      // activateNotifications(e.message, "error");
    }
  };

  const getAllTodayQueue = async () => {
    if (!filters.clinic) return;
    try {
      const result = await GetAllTodayQueueHistoryApi(filters.clinic);
      if (result.status === true) {
        setQueueData(result.queryresult.appointmentdetails);
      }
    } catch (e) {
      console.error(e.message);
    }
  };
  const activateNotifications = (message, status) => {

    setShowToast({
      show: true,
      message: message,
      status: status,
    });

    setTimeout(() => {
      setShowToast({
        show: false,
      });

    }, 5000)
  }
  const location = useLocation().pathname

  const ExaminePatient = (item) => {
    localStorage.setItem('pathLocation', location)
    nav(`/dashboard/doctor-schedule-details/${item.patient?._id}`);
    localStorage.setItem('appointmentId', item._id)
    localStorage.setItem('PatientName', `${item.patient?.firstName} ${item.patient?.lastName}`)
    localStorage.setItem('appointmentStatus', item.status)
    localStorage.setItem('patientDetails', JSON.stringify(item.patient))

  }
  const takeVitals = (item) => {
    onOpen()
    setOldPayload(item)
    setModalState("new")
  }

  const openClinicalInfoModal = (item) => {
    setSelectedPatient(item);
    setIsClinicalInfoModalOpen(true);
  };

  const closeClinicalInfoModal = () => {
    setIsClinicalInfoModalOpen(false);
    setSelectedPatient(null);
  };

  const openSpecialNeedsModal = (item) => {
    setSelectedPatient(item);
    setIsSpecialNeedsModalOpen(true);
  };

  const closeSpecialNeedsModal = () => {
    setIsSpecialNeedsModalOpen(false);
    setSelectedPatient(null);
  };

  useEffect(() => {
    getAllClinic();
  }, []);

  useEffect(() => {
    fetchData();
  }, [filters, CurrentPage, Trigger, isOpen, isClinicalInfoModalOpen, isSpecialNeedsModalOpen]);




  return (
    <MainLayout>
      {
        IsLoading && (
          <Preloader />
        )
      }
      <Seo title="Doctor Schedule" description="Care connect Manage Doctors Schedule" />

      {showToast.show && (
        <ShowToast message={showToast.message} status={showToast.status} />
      )}
      <HStack>
        <Text color="#1F2937" fontWeight="600" fontSize="19px">
          Doctor Schedule
        </Text>
        <Text color="#667085" fontWeight="400" fontSize="18px">
          ({TotalData})
        </Text>
      </HStack>
      <Text color="#686C75" mt="9px" fontWeight="400" fontSize="15px">
        View and manage all appointments in one place. Quickly access statuses,
        update details, and manage schedules as needed.
      </Text>
      <Text color="blue.blue500" mt="9px" fontWeight="400" fontSize="15px">
        Kindly Select Clinic you want to manage
      </Text>
      <SimpleGrid mt="5px" columns={{ base: 1, md: 2, lg: 2 }} spacing={10}>
        <Select
          id="type"
          value={filters.clinic}
          onChange={(e) => handleFilterChange("clinic", e.target.value)}
          placeholder="Select Clinic"
          fontSize={filters.clinic ? "16px" : "13px"}
        >
          {
            ClinicData?.map((item, i) => (

              <option value={item.clinic}>{item.clinic}</option>
            ))
          }


        </Select>
      </SimpleGrid>



      <Box
        bg="#fff"
        border="1px solid #EFEFEF"
        mt="12px"
        py="17px"
        px={["18px", "18px"]}
        rounded="10px"
      >
        {/* filter section  */}
        <Flex justifyContent="space-between" flexWrap="wrap">
          <Flex
            alignItems="center"
            flexWrap="wrap"
            bg="#E4F3FF"
            rounded="7px"
            py="3.5px"
            px="5px"
            cursor="pointer"
            mt={["10px", "10px", "0px", "0px"]}
          >
            <Box borderRight="1px solid #EDEFF2" pr="5px" onClick={() => handleFilterChange("status", "scheduled")}>
              <Text
                py="8.5px"
                px="12px"
                bg={filters.status === "scheduled" ? "#fff" : "transparent"}
                rounded="7px"
                color={"#1F2937"}
                fontWeight={"500"}
                fontSize={"13px"}
              >
                Scheduled

              </Text>
            </Box>
            <Box borderRight="1px solid #EDEFF2" pr="5px" onClick={() => handleFilterChange("status", "today_queue")}>
              <Text
                py="8.5px"
                px="12px"
                bg={filters.status === "today_queue" ? "#fff" : "transparent"}
                rounded="7px"
                color={"#1F2937"}
                fontWeight={"500"}
                fontSize={"13px"}
              >
                Today Queue
                <Box color="#667085" as="span" fontWeight="400" fontSize="13px">
                  ({QueueData?.length})
                </Box>
              </Text>
            </Box>
            <Box borderRight="1px solid #EDEFF2" pr="5px" onClick={() => handleFilterChange("status", "complete")}>
              <Text
                py="8.5px"
                px="12px"
                bg={filters.status === "complete" ? "#fff" : "transparent"}
                rounded="7px"
                color={"#1F2937"}
                fontWeight={"500"}
                fontSize={"13px"}
              >
                Completed

              </Text>
            </Box>
            <Box borderRight="1px solid #EDEFF2" pr="5px" onClick={() => handleFilterChange("status", "inprogress")}>
              <Text
                py="8.5px"
                px="12px"
                bg={filters.status === "inprogress" ? "#fff" : "transparent"}
                rounded="7px"
                color={"#1F2937"}
                fontWeight={"500"}
                fontSize={"13px"}
              >
                In progress

              </Text>
            </Box>

          </Flex>

          <Flex
            flexWrap="wrap"
            mt={["10px", "10px", "0px", "0px"]}
            alignItems="center"
            justifyContent={"flex-end"}
          >
            <HStack>
              <Input
                label="Search"
                onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
                value={filters.searchTerm}
                bColor="#E4E4E4"
                leftIcon={<BiSearch />}
              />
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
                    onClick={() => handleFilterChange("searchField", "firstName")}
                    textTransform="capitalize"
                    fontWeight={"500"}
                    color="#2F2F2F"
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                  >
                    <HStack fontSize="14px">
                      <Text>by First Name</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleFilterChange("searchField", "lastName")}
                    textTransform="capitalize"
                    fontWeight={"500"}
                    color="#2F2F2F"
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                  >
                    <HStack fontSize="14px">
                      <Text>by Last Name</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleFilterChange("searchField", "MRN")}
                    textTransform="capitalize"
                    fontWeight={"500"}
                    color="#2F2F2F"
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                  >
                    <HStack fontSize="14px">
                      <Text>by MRN</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem
                    onClick={() =>
                      handleFilterChange("searchField", "appointmenttype")
                    }
                    textTransform="capitalize"
                    fontWeight={"500"}
                    color="#2F2F2F"
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                  >
                    <HStack fontSize="14px">
                      <Text>by Appointment Type</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setFilters((prev) => ({
                        ...prev,
                        searchTerm: "",
                        searchField: "firstName",
                      }));
                    }}
                    textTransform="capitalize"
                    fontWeight={"500"}
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



        {/* filter section end here */}

        <Box
          bg="#fff"
          border="1px solid #EFEFEF"
          mt="12px"
          py="15px"
          px="15px"
          rounded="10px"
          overflowX="auto"
        >
          <TableContainer>
            <Table variant="striped">
              <Thead bg="#fff">
                <Tr>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#534D59"
                    fontWeight="600"
                  >
                    Patient
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#534D59"
                    fontWeight="600"
                  >
                    Scheduled Date
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#534D59"
                    fontWeight="600"
                  >
                    Reason
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#534D59"
                    fontWeight="600"
                  >
                    Appointment
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#534D59"
                    fontWeight="600"
                  >
                    Type
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#534D59"
                    fontWeight="600"
                  >
                    Clinic
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#534D59"
                    fontWeight="600"
                  >
                    Vital Status
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#534D59"
                    fontWeight="600"
                  >
                    Status
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#534D59"
                    fontWeight="600"
                  >
                    Actions
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {Data.length > 0 ? (
                  Data.map((item, i) => (
                    <TableRow
                      key={i}
                      type="schedule-appointment"
                      date={moment(item.appointmentdate).format("lll")}
                      reason={item.reason}
                      appointment={item.appointmentcategory}
                      appointmentType={item.appointmenttype}
                      name={`${item.patient?.firstName} ${item.patient?.lastName}`}
                      mrn={`${item.patient?.MRN} `}
                      clinic={item.clinic}
                      status={item.status}
                      vitalStatus={item?.vitalstatus}
                      onClick={() => ExaminePatient(item)}
                      onVital={() => takeVitals(item)}
                      onClinicalInfo={() => openClinicalInfoModal(item)}
                      onSpecialNeeds={() => openSpecialNeedsModal(item)}
                    />
                  ))
                ) : (
                  <Text textAlign={"center"} mt="32px" color="black">
                    *--No record found--*
                  </Text>
                )}
              </Tbody>
            </Table>
          </TableContainer>

          <Pagination
            postPerPage={PostPerPage}
            currentPage={CurrentPage}
            totalPosts={TotalData}
            paginate={(page) => setCurrentPage(page)}
          />
        </Box>

        <VitalsModal isOpen={isOpen} oldPayload={OldPayload} onClose={onClose} type={ModalState} activateNotifications={activateNotifications} />
        <UpdateClinicalInfoModal
          isOpen={isClinicalInfoModalOpen}
          onClose={closeClinicalInfoModal}
          patient={selectedPatient}
          activateNotifications={activateNotifications}
        />
        <AddSpecialNeedsModal
          isOpen={isSpecialNeedsModalOpen}
          onClose={closeSpecialNeedsModal}
          patient={selectedPatient}
          activateNotifications={activateNotifications}
        />
      </Box>

    </MainLayout>
  );
}
