import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPatientData } from "../Utils/ApiCalls";
import {
  HStack,
  Text,
  Flex,
  Box,
  Image,
  Stack,
  Spacer,
  Input,
} from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, TableContainer } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../Layouts/Index";
import Seo from "../Utils/Seo";
import Button from "../Components/Button";
import TableRow from "../Components/TableRow";
import Preloader from "../Components/Preloader";
import InformationCard from "../Components/InformationCard";
import imageSample from "../Assets/solomon.png";
import { MdModeEditOutline } from "react-icons/md";
import { updatePatientPicture } from "../Utils/ApiCalls";
import { baseUrl } from "../Utils/ApiConfig";

import { LiaEdit } from "react-icons/lia";
import moment from "moment";
import Pagination from "../Components/Pagination";
import { configuration } from "../Utils/Helpers";
import ShowToast from "../Components/ToastNotification";

export default function SinglePatient() {
  const { id } = useParams();
  const [patientData, setPatientData] = useState(null);
  const [error, setError] = useState(null);
  const [All, setAll] = useState(true);
  const [Active, setActive] = useState(false);
  const [InActive, setInActive] = useState(false);
  const [Data, setData] = useState(true);

  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [appointmentFilter, setAppointmentFilter] = useState("all");

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      setIsUploading(true);
      const result = await updatePatientPicture(id, formData);
      console.log("Upload result:", result);
  
      const updatedPassport = result?.data?.passport; 
     
      setData(!Data)
      if (updatedPassport) {
        setPatientData((prev) => ({
          ...prev,
          passport: updatedPassport, 
        }));
      }
  
      setToast({ status: "success", message: "Picture updated successfully!" });
    } catch (error) {
      console.error("Upload error:", error);
      setToast({
        status: "error",
        message: error.message || "Failed to update the picture.",
      });
    } finally {
      setIsUploading(false);
      setTimeout(() => setToast(null), 3000);
    }
  };
  

  const triggerFileInput = () => {
    document.getElementById("file-input").click();
  };

  // Pagination settings to follow

  const [PostPerPage, setPostPerPage] = useState(configuration.sizePerPage);

  //get current post

  // this is working for the payment table
  const [CurrentPage, setCurrentPage] = useState(1);
  const indexOfLastData = CurrentPage * PostPerPage;
  const indexOfFirstData = indexOfLastData - PostPerPage;
  const PaginatedData = patientData?.payment.slice(
    indexOfFirstData,
    indexOfLastData
  );
  //change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // this is working for the appointment table
  const [CurrentPageX, setCurrentPageX] = useState(1);
  const indexOfLastDataX = CurrentPageX * PostPerPage;
  const indexOfFirstDataX = indexOfLastDataX - PostPerPage;
  const PaginatedAppointmentData = patientData?.appointment.slice(
    indexOfFirstDataX,
    indexOfLastDataX
  );
  const paginateX = (pageNumber) => {
    setCurrentPageX(pageNumber);
  };

  // Pagination settings to follow end here

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPatientData(id);

        console.log("Fetched Patient Data:", data); // Log the patient data here

        setPatientData(data);

        setFilteredAppointments(data?.appointment || []); // Initialize with all appointments
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchData();
  }, [id,Data]);

  // Appointment filter functions
  const filterAppointments = (status) => {
    setAppointmentFilter(status);

    if (status === "all") {
      // Show all appointments
      setFilteredAppointments(patientData?.appointment || []);
    } else if (status === "pending payment") {
      // Filter for "pending payments" status
      const pendingPayments = patientData?.appointment.filter(
        (appt) => appt.status === "pending payment"
      );
      setFilteredAppointments(pendingPayments);
    } else if (status === "examined") {
      // Filter for "examined" status
      const examined = patientData?.appointment.filter(
        (appt) => appt.status === "examined"
      );
      setFilteredAppointments(examined);
    }

    setCurrentPageX(1); // Reset to the first page after filtering
  };

  if (error) return <div>Error: {error}</div>;

  if (isLoading) {
    return <Preloader />;
  }

  const {
    firstName,
    lastName,
    username,
    title,
    dob,
    gender,
    middleName,
    age,
    nin,
    registrationDate,
    membershipStatus,
    phoneNumber,
    email,
    address,
    country,
    stateOfResidence,
    LGA,
    maritalStatus,
    disability,
    occupation,
    MRN,
    oldMRN,
    billingHistory = [],
    appointments = [],
    passport,
  } = patientData;

  return (
    <MainLayout>
      <Seo
        title="Patient details"
        description="Care Connect Patients details"
      />

      <HStack>
        <Text fontSize="15px" fontWeight="500" color="blue.blue500">
          Patient List
        </Text>
        <Text fontSize="15px" fontWeight="400" color="#8A8D8E">
          {" "}
          {`${firstName} ${lastName}`}
        </Text>
      </HStack>

      <Flex justifyContent="space-between" flexWrap="wrap" mt="32px">
        <Box
          bg="#fff"
          rounded="6.81px"
          px="32px"
          py="25px"
          w={["100%", "100%", "48%", "25%"]}
        >
          <Flex justifyContent="center" pos="relative" mb="16px">
            <Image
              src={`${baseUrl}/uploads/${patientData.passport}`}
              w="85px"
              h="85px"
              objectFit="cover"
              rounded="100%"
              alt={`${firstName} ${lastName}`}
            />
          </Flex>

          <Text
            textAlign="center"
            fontSize="17px"
            fontWeight="800"
            color="#1E1E1E"
          >
            {firstName} {lastName}
          </Text>
          <Text
            textAlign="center"
            fontSize="13px"
            fontWeight="400"
            color="#8A8D8E"
          >
            {username}
          </Text>

          <Box>
            {toast && (
              <ShowToast status={toast.status} message={toast.message} />
            )}
            <Input
              id="file-input"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileChange} // Trigger API call on file selection
            />
            <Button
              mt="8px"
              rightIcon={<LiaEdit />}
              onClick={triggerFileInput}
              isLoading={isUploading}
            >
              Edit Patient Picture
            </Button>
          </Box>
        </Box>

        <Box
          bg="#fff"
          rounded="6.81px"
          px="32px"
          py="25px"
          w={["100%", "100%", "48%", "30%"]}
        >
          <Text fontSize="15px" fontWeight="700" color="blue.blue500">
            Personal Information
          </Text>

          <Stack mt="32px" spacing="20px">
            <HStack>
              <InformationCard title="title" value={title || "N/A"} />
              <Spacer />
              <InformationCard
                textAlign="right"
                title="D-O-B"
                value={moment(dob).format("MMM DD YYYY")}
              />
            </HStack>
            <HStack>
              <InformationCard title="gender" value={gender || "N/A"} />
              <Spacer />
              <InformationCard
                textAlign="right"
                title="middle name"
                value={middleName || "N/A"}
              />
            </HStack>
            <HStack>
              <InformationCard title="age" value={age || "N/A"} />
              <Spacer />
              <InformationCard
                textAlign="right"
                title="NIN"
                value={nin || "N/A"}
              />
            </HStack>
            <HStack>
              <InformationCard
                title="Registration Date"
                value={moment(registrationDate).format("MMM DD YYYY")}
              />
              <Spacer />
              <InformationCard
                textAlign="right"
                title="membership status"
                value={membershipStatus || "N/A"}
              />
            </HStack>
          </Stack>
        </Box>

        <Box
          bg="#fff"
          rounded="6.81px"
          px="32px"
          py="25px"
          w={["100%", "100%", "48%", "40%"]}
        >
          <Text fontSize="15px" fontWeight="700" color="blue.blue500">
            More Information
          </Text>
          <Stack mt="32px" spacing="20px">
            <Flex justifyContent="space-between" flexWrap="wrap">
              <Box w={["48%", "48%", "30%", "30%"]}>
                <InformationCard
                  title="phone number"
                  value={phoneNumber || "N/A"}
                />
              </Box>
              <Box w={["48%", "48%", "30%", "30%"]}>
                <InformationCard title="email" value={email || "N/A"} />
              </Box>
              <Box w={["48%", "48%", "30%", "30%"]}>
                <InformationCard title="address" value={address || "N/A"} />
              </Box>
            </Flex>

            <Flex justifyContent="space-between" flexWrap="wrap">
              <Box w={["48%", "48%", "30%", "30%"]}>
                <InformationCard title="country" value={country || "N/A"} />
              </Box>
              <Box w={["48%", "48%", "30%", "30%"]}>
                <InformationCard
                  title="state of residence"
                  value={stateOfResidence || "N/A"}
                />
              </Box>
              <Box w={["48%", "48%", "30%", "30%"]}>
                <InformationCard title="LGA" value={LGA || "N/A"} />
              </Box>
            </Flex>

            <Flex justifyContent="space-between" flexWrap="wrap">
              <Box w={["48%", "48%", "30%", "30%"]}>
                <InformationCard
                  title="marital status"
                  value={maritalStatus || "N/A"}
                />
              </Box>
              <Box w={["48%", "48%", "30%", "30%"]}>
                <InformationCard
                  title="disability"
                  value={disability || "N/A"}
                />
              </Box>
              <Box w={["48%", "48%", "30%", "30%"]}>
                <InformationCard
                  title="occupation"
                  value={occupation || "N/A"}
                />
              </Box>
            </Flex>

            <Flex justifyContent="space-between" flexWrap="wrap">
              <Box w={["48%", "48%", "30%", "30%"]}>
                <InformationCard title="MRN" value={MRN || "N/A"} />
              </Box>
              <Box w={["48%", "48%", "30%", "30%"]}>
                <InformationCard title="old MRN" value={oldMRN || "N/A"} />
              </Box>
            </Flex>
          </Stack>
        </Box>
      </Flex>

      <Text fontSize="18px" mt="32px" fontWeight="700" color="blue.blue500">
        Billing History
      </Text>
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
                  Date
                </Th>
                <Th
                  fontSize="13px"
                  textTransform="capitalize"
                  color="#534D59"
                  fontWeight="600"
                >
                  Payment Type
                </Th>
                <Th
                  fontSize="13px"
                  textTransform="capitalize"
                  color="#534D59"
                  fontWeight="600"
                >
                  Payment Category
                </Th>
                <Th
                  fontSize="13px"
                  textTransform="capitalize"
                  color="#534D59"
                  fontWeight="600"
                >
                  Payment Reference
                </Th>
                <Th
                  fontSize="13px"
                  textTransform="capitalize"
                  color="#534D59"
                  fontWeight="600"
                >
                  Amount
                </Th>
                <Th
                  fontSize="13px"
                  textTransform="capitalize"
                  color="#534D59"
                  fontWeight="600"
                >
                  Status
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {PaginatedData?.map((payment, index) => (
                <TableRow
                  key={index}
                  type="billing-history"
                  date={moment(payment.createdAt).format("MMM DD YYYY")}
                  description={payment.paymentype || "N/A"}
                  category={payment.paymentcategory || "N/A"}
                  reference={payment.paymentreference || "N/A"}
                  amountPaid={payment.amount || "N/A"}
                  status={payment.status || "N/A"}
                />
              ))}
            </Tbody>
          </Table>
        </TableContainer>

        <Pagination
          postPerPage={PostPerPage}
          currentPage={CurrentPage}
          totalPosts={patientData?.payment.length}
          paginate={paginate}
        />
      </Box>

      {/* Appointments Section */}
      <Text fontSize="18px" mt="32px" fontWeight="700" color="blue.blue500">
        Appointments
      </Text>
      <Box
        bg="#fff"
        border="1px solid #EFEFEF"
        mt="12px"
        py="17px"
        px={["18px", "18px"]}
        rounded="10px"
      >
        {/* Filter Section */}
        <Flex justifyContent="space-between" flexWrap="wrap">
          <Flex
            alignItems="center"
            flexWrap="wrap"
            bg="#E4F3FF"
            rounded="7px"
            py="3.5px"
            px="5px"
            cursor="pointer"
          >
            <Box
              borderRight="1px solid #EDEFF2"
              pr="5px"
              onClick={() => filterAppointments("all")}
            >
              <Text
                py="8.5px"
                px="12px"
                bg={appointmentFilter === "all" ? "#fff" : "transparent"}
                rounded="7px"
                color={"#1F2937"}
                fontWeight={"500"}
                fontSize={"13px"}
              >
                All Appointments
                <Box color="#667085" as="span" fontWeight="400" fontSize="13px">
                  ({patientData?.appointment.length})
                </Box>
              </Text>
            </Box>
            <Box
              borderRight="1px solid #EDEFF2"
              pr="5px"
              onClick={() => filterAppointments("pending payment")}
            >
              <Text
                py="8.5px"
                px="12px"
                bg={
                  appointmentFilter === "pending payment"
                    ? "#fff"
                    : "transparent"
                }
                rounded="7px"
                color={"#1F2937"}
                fontWeight={"500"}
                fontSize={"13px"}
              >
                Pending Payments
              </Text>
            </Box>
            <Box
              borderRight="1px solid #EDEFF2"
              pr="5px"
              onClick={() => filterAppointments("examined")}
            >
              <Text
                py="8.5px"
                px="12px"
                bg={appointmentFilter === "examined" ? "#fff" : "transparent"}
                rounded="7px"
                color={"#1F2937"}
                fontWeight={"500"}
                fontSize={"13px"}
              >
                Examined
              </Text>
            </Box>
          </Flex>
        </Flex>

        {/* Filter Section End */}

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
                  >
                    Date
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#534D59"
                  >
                    Appointment Category
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#534D59"
                  >
                    Appointment Type
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#534D59"
                  >
                    Clinic
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#534D59"
                  >
                    Status
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {PaginatedAppointmentData.map((appointment, index) => (
                  <TableRow
                    key={index}
                    type="appointment"
                    appointmentdate={moment(appointment.appointmentdate).format(
                      "MMM DD YYYY"
                    )}
                    appointmentcategory={appointment.appointmentcategory}
                    appointmenttype={appointment.appointmenttype}
                    clinic={appointment.clinic}
                    status={appointment.status}
                  />
                ))}
              </Tbody>
            </Table>
          </TableContainer>

          <Pagination
            postPerPage={PostPerPage}
            currentPage={CurrentPageX}
            totalPosts={filteredAppointments.length}
            paginate={paginateX}
          />
        </Box>
      </Box>
    </MainLayout>
  );
}
