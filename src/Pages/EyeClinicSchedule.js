import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MainLayout from "../Layouts/Index";
import { Text, Flex, HStack, Box, useDisclosure } from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, TableContainer, Menu, MenuButton, SimpleGrid, Select, MenuList, MenuItem } from "@chakra-ui/react";
import TableRow from "../Components/TableRow";
import Button from "../Components/Button";
import Input from "../Components/Input";
import VitalsModal from "../Components/VitalsModal";
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



export default function EyeClinicSchedule() {
  const [IsLoading, setIsLoading] = useState(false);
  const [All, setAll] = useState(true);
  const [TodayQueue, setTodayQueue] = useState(false);
  const [Completed, setCompleted] = useState(false);
  const [Inprogress, setInprogress] = useState(false);
  const [Clinic, setClinic] = useState(null);
  const [ClinicData, setClinicData] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [Trigger, setTrigger] = useState(false);
  const [OldPayload, setOldPayload] = useState({});

  const [Data, setData] = useState(JSON.parse(localStorage.getItem("patientList")) ? JSON.parse(localStorage.getItem("patientList")) : []);
  const [QueueData, setQueueData] = useState([]);

  const [FilterData, setFilterData] = useState(Data);
  const [ModalState, setModalState] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  // Pagination settings to follow
  const [CurrentPage, setCurrentPage] = useState(1);
  const [PostPerPage, setPostPerPage] = useState(configuration.sizePerPage);
  const [TotalData, setTotalData] = useState("");
  const [Status, setStatus] = useState("scheduled");

  //get current post
  const indexOfLastSra = CurrentPage * PostPerPage;
  const indexOfFirstSra = indexOfLastSra - PostPerPage;
  const PaginatedData = FilterData.slice(indexOfFirstSra, indexOfLastSra);
  //change page 
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  // Pagination settings to follow end here 


  // Search Filter settings to follow 
  const [SearchInput, setSearchInput] = useState("");

  const [FilteredData, setFilteredData] = useState(null);

  const [Key, setKey] = useState("");
  const [Value, setValue] = useState("");

  const getFilteredScheduled = async (key, value) => {
    setKey(key)
    setValue(value)

    try {
      setIsLoading(true);
      const result = await GetAllPatientsHistoryFilteredApi(Clinic, PostPerPage, CurrentPage, Status, key, value);
      console.log("all fitlered payment", result);
      if (result.status === true) {
        setFilteredData(result.queryresult.appointmentdetails);
        setTotalData(result.queryresult.totalappointmentdetails)
      }
    } catch (e) {
      console.error(e.message);
    } finally {
      setIsLoading(false);
    }
  };


  const filterBy = (title) => {

    if (title === "appointmentId") {
      getFilteredScheduled("appointmentid", SearchInput)
    } else if (title === "firstName") {
      getFilteredScheduled("firstName", SearchInput)

    } else if (title === "lastName") {
      getFilteredScheduled("lastName", SearchInput)

    } else if (title === "mrn") {
      getFilteredScheduled("MRN", SearchInput)

    } else if (title === "appointmentType") {
      getFilteredScheduled("appointmenttype", SearchInput)

    }

  }



  // Search Filter settings to follow end here

  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    status: "",
  });

  const getAllPatientHistory = async (status) => {
    setIsLoading(true)
    try {
      const result = await GetAllPatientsHistoryApi(Clinic, PostPerPage, CurrentPage, status);
      console.log("getAllPatientHistory", result)
      if (result.status === true) {
        setIsLoading(false)
        setLoading(false)
        setData(result.queryresult.appointmentdetails);
        setFilterData(result.queryresult.appointmentdetails);
        setTotalData(result.queryresult.totalappointmentdetails)


        localStorage.setItem("patientList", JSON.stringify(result.queryresult.appointmentdetails))
      }
    } catch (e) {
      console.error(e.message);
    }
  };


  const nav = useNavigate();


  const filterAll = () => {
    setAll(true);
    setInprogress(false);
    setCompleted(false);
    setTodayQueue(false);
    getAllPatientHistory("scheduled")
    setStatus("scheduled")
    setCurrentPage(1)
  };

  const filterTodayQueue = () => {
    setAll(false);
    setTodayQueue(true);
    setFilterData(QueueData);
  };

  const filterCompleted = () => {
    setAll(false);
    setTodayQueue(false);
    setCompleted(true);
    setInprogress(false);
    getAllPatientHistory("complete")
    setStatus("complete")
    setCurrentPage(1)
  };
  const filterInprogress = () => {
    setAll(false);
    setTodayQueue(false);
    setCompleted(false);
    setInprogress(true);
    getAllPatientHistory("inprogress")
    setStatus("inprogress")
    setCurrentPage(1)
  };


  const getAllClinic = async () => {
    try {
      const result = await GetOnlyClinicApi();
      console.log("getonlyClinic", result);
      setClinicData(result.queryresult.clinicdetails)

    } catch (e) {
      // activateNotifications(e.message, "error");
    }
  };

  const getAllTodayQueue = async () => {
    try {
      const result = await GetAllTodayQueueHistoryApi(Clinic);
      console.log("getAllTodayQueue", result)
      if (result.status === true) {
        setLoading(false)
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
    nav(`/dashboard/eye-clinic-details/${item.patient?._id}`);
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


  const fetchPatient = () => {
    setLoading(true)
    getAllPatientHistory("scheduled");
    getAllTodayQueue()
  }
  useEffect(() => {

    getAllClinic()

    if (Clinic != null) {

      if (FilteredData?.length > 0 || FilteredData !== null) {
        getFilteredScheduled(Key, Value)
      } else {

        if (All === true) {
          getAllPatientHistory("scheduled");
        } else if (Completed === true) {
          getAllPatientHistory("complete");
        } else if (Inprogress === true) {

          getAllPatientHistory("inprogress");
        }

      }


    }


  }, [isOpen, Trigger, CurrentPage]);




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
          Eye Clinic Scheduled
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
          value={Clinic}
          onChange={(e) => setClinic(e.target.value)}
          placeholder="Select Clinic"
          fontSize={Clinic !== "" ? "16px" : "13px"}
        >
          {
            ClinicData?.map((item, i) => (

              <option value={item.clinic}>{item.clinic}</option>
            ))
          }


        </Select>

        <Button isLoading={Loading} onClick={fetchPatient} disabled={Clinic !== "" ? false : true}>  Fetch Patient</Button>
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
            <Box borderRight="1px solid #EDEFF2" pr="5px" onClick={filterAll}>
              <Text
                py="8.5px"
                px="12px"
                bg={All ? "#fff" : "transparent"}
                rounded="7px"
                color={"#1F2937"}
                fontWeight={"500"}
                fontSize={"13px"}
              >
                Scheduled

              </Text>
            </Box>
            <Box borderRight="1px solid #EDEFF2" pr="5px" onClick={filterTodayQueue}>
              <Text
                py="8.5px"
                px="12px"
                bg={TodayQueue ? "#fff" : "transparent"}
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
            <Box borderRight="1px solid #EDEFF2" pr="5px" onClick={filterCompleted}>
              <Text
                py="8.5px"
                px="12px"
                bg={Completed ? "#fff" : "transparent"}
                rounded="7px"
                color={"#1F2937"}
                fontWeight={"500"}
                fontSize={"13px"}
              >
                Completed

              </Text>
            </Box>
            <Box borderRight="1px solid #EDEFF2" pr="5px" onClick={filterInprogress}>
              <Text
                py="8.5px"
                px="12px"
                bg={Inprogress ? "#fff" : "transparent"}
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
              <Input label="Search" onChange={(e) => {
                setSearchInput(e.target.value);
                setCurrentPage(1)
              }} value={SearchInput} bColor="#E4E4E4" leftIcon={<BiSearch />} />

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
                <MenuList >

                  <MenuItem onClick={() => filterBy("firstName")} textTransform="capitalize" fontWeight={"500"} color='#2F2F2F' _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}>
                    <HStack fontSize="14px">

                      <Text>by First Name</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem onClick={() => filterBy("lastName")} textTransform="capitalize" fontWeight={"500"} color='#2F2F2F' _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}>
                    <HStack fontSize="14px">

                      <Text>by Last Name</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem onClick={() => filterBy("mrn")} textTransform="capitalize" fontWeight={"500"} color='#2F2F2F' _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}>
                    <HStack fontSize="14px">

                      <Text>by MRN</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem onClick={() => filterBy("appointmentType")} textTransform="capitalize" fontWeight={"500"} color='#2F2F2F' _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}>
                    <HStack fontSize="14px">

                      <Text>by Appointment Type</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem onClick={() => {
                    setFilteredData(null)
                    setSearchInput("")
                    filterAll()
                    setCurrentPage(1)
                  }} textTransform="capitalize" fontWeight={"500"} color='#2F2F2F' _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}>
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


                {

                  SearchInput === "" || FilteredData === null ? (
                    FilterData.map((item, i) => (
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

                      />
                    ))
                  ) : (
                    SearchInput !== "" && FilteredData?.length > 0 ? (
                      FilteredData.map((item, i) => (
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

                        />
                      ))
                    ) : (
                      <Text textAlign={"center"} mt="32px" color="black">*--No record found--*</Text>
                    )
                  )

                }
              </Tbody>
            </Table>
          </TableContainer>

          <Pagination postPerPage={PostPerPage} currentPage={CurrentPage} totalPosts={TotalData} paginate={paginate} />
        </Box>

        <VitalsModal isOpen={isOpen} oldPayload={OldPayload} onClose={onClose} type={ModalState} activateNotifications={activateNotifications} />
      </Box>

    </MainLayout>
  );
}
