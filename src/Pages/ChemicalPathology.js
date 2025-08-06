import React, { useEffect, useState } from "react";
import { Text, Flex, HStack, Box, useDisclosure } from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, TableContainer,Td } from "@chakra-ui/react";
import TableRow from "../Components/TableRow";
import Input from "../Components/Input";
import { BiSearch } from "react-icons/bi";
import moment from "moment";
import Seo from "../Utils/Seo";
import { ReadAllScheduledLabOptimizedHematologyAndChemicalPathologyApi } from "../Utils/ApiCalls";
import Pagination from "../Components/Pagination";
import { configuration } from "../Utils/Helpers";
import Preloader from "../Components/Preloader";
import MainLayout from "../Layouts/Index";
import ChemicalPathologyReportModal from "../Components/ChemicalPathologyReportModal";
import ShowToast from "../Components/ToastNotification";

export default function ChemicalPathology() {
  const [IsLoading, setIsLoading] = useState(true);
  const [Data, setData] = useState([]);
  const [FilterData, setFilterData] = useState([]);
  const [CurrentPage, setCurrentPage] = useState(1);
  const [PostPerPage] = useState(configuration.sizePerPage);
  const [TotalData, setTotalData] = useState(0);
  const [SearchInput, setSearchInput] = useState("");
  const [Trigger, setTrigger] = useState(false);
  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    status: "",
  });

  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();
  const [selectedTestId, setSelectedTestId] = useState(null);
  const [modalType, setModalType] = useState("new");
  const [selectedPayload, setSelectedPayload] = useState({});

  const paginate = (pageNumber) => {
    console.log("[PAGINATION] Changing to page:", pageNumber);
    setCurrentPage(pageNumber);
  };

  const activateNotifications = (message, status) => {
    console.log("[NOTIFICATION] Activating toast:", { message, status });
    setShowToast({
      show: true,
      message: message,
      status: status,
    });
    setTimeout(() => {
      setShowToast({ show: false });
    }, 3000);
  };

  const getChemicalPathologyLabs = async () => {
    console.log(
      "[API] Starting getChemicalPathologyLabs for labcategory: chemicalpathology"
    );
    setIsLoading(true);
    try {
      const result =
        await ReadAllScheduledLabOptimizedHematologyAndChemicalPathologyApi(
          "chemicalpathology"
        );
      console.log(
        "[API] ReadAllScheduledLabOptimizedHematologyAndChemicalPathologyApi response:",
        result
      );
      if (result.status === true) {
        setData(result.queryresult.labdetails);
        setFilterData(result.queryresult.labdetails);
        setTotalData(result.queryresult.totallabdetails);
      }
    } catch (e) {
      console.error("[API] Error in getChemicalPathologyLabs:", e.message);
      activateNotifications(
        "Failed to fetch chemical pathology lab data",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const filterBySearch = (searchTerm) => {
    if (!searchTerm) {
      setFilterData(Data);
      return;
    }
    const filtered = Data.filter(
      (item) =>
        item.testid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${item.patient?.firstName} ${item.patient?.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.patient?.MRN?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.testname?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilterData(filtered);
  };

  const handleProcessChemicalPathology = (testId) => {
    console.log(
      "[ACTION] Process Chemical Pathology Report for testId:",
      testId
    );
    setSelectedTestId(testId);
    setModalType("new");
    setSelectedPayload({});
    onModalOpen();
  };

  const handleViewChemicalReport = (testId, labDetail) => {
    console.log(
      "[ACTION] View Chemical Pathology Report for testId:",
      testId,
      "labDetail:",
      labDetail
    );

    const reportData = labDetail?.chemicalpathologyreport || null;
    if (!reportData) {
      activateNotifications("No chemical pathology report available", "error");
      return;
    }

    setSelectedTestId(testId);
    setModalType("view");
    setSelectedPayload({
      comment: reportData.comment || "",
    });
    onModalOpen();
  };

  useEffect(() => {
    getChemicalPathologyLabs();
  }, [CurrentPage, Trigger]);

  useEffect(() => {
    filterBySearch(SearchInput);
  }, [SearchInput, Data]);

  return (
    <MainLayout>
      {IsLoading && <Preloader />}
      <Seo
        title="Chemical Pathology Lab"
        description="Manage Chemical Pathology Lab Orders"
      />
      {showToast.show && (
        <ShowToast message={showToast.message} status={showToast.status} />
      )}
      <HStack>
        <Text color="#1F2937" fontWeight="600" fontSize="19px">
          Chemical Pathology Lab
        </Text>
        <Text color="#667085" fontWeight="400" fontSize="18px">
          ({TotalData})
        </Text>
      </HStack>
      <Text color="#686C75" mt="9px" fontWeight="400" fontSize="15px">
        View chemical pathology lab orders.
      </Text>
      <Box
        bg="#fff"
        border="1px solid #EFEFEF"
        mt="12px"
        py={["10px", "15px"]}
        px={["10px", "15px"]}
        rounded="10px"
      >
        <Flex justifyContent="space-between" flexWrap="wrap">
          <HStack flexWrap={["wrap", "nowrap"]}>
            <Input
              label="Search"
              onChange={(e) => {
                setSearchInput(e.target.value);
                setCurrentPage(1);
              }}
              value={SearchInput}
              bColor="#E4E4E4"
              leftIcon={<BiSearch />}
            />
          </HStack>
        </Flex>
      </Box>

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
                  Test ID
                </Th>
                <Th
                  fontSize="13px"
                  textTransform="capitalize"
                  color="#534D59"
                  fontWeight="600"
                >
                  Patient Name
                </Th>
                <Th
                  fontSize="13px"
                  textTransform="capitalize"
                  color="#534D59"
                  fontWeight="600"
                >
                  Department
                </Th>
                <Th
                  fontSize="13px"
                  textTransform="capitalize"
                  color="#534D59"
                  fontWeight="600"
                >
                  Test Name
                </Th>
                <Th
                  fontSize="13px"
                  textTransform="capitalize"
                  color="#534D59"
                  fontWeight="600"
                >
                  Order Date
                </Th>
                <Th
                  fontSize="13px"
                  textTransform="capitalize"
                  color="#534D59"
                  fontWeight="600"
                >
                  Lab Status
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
              {FilterData?.length > 0 ? (
                FilterData.map((item, i) => (
                  <TableRow
                    key={i}
                    type="pathology"
                    testid={item.testid}
                    name={`${item.patient?.firstName} ${item.patient?.lastName}`}
                    mrn={item.patient?.MRN}
                    department={item.department}
                    testName={item.testname}
                    date={moment(item.createdAt).format("lll")}
                    labStatus={item.status}
                    _id={item._id}
                    report={item}
                    onProcessChemicalPathology={handleProcessChemicalPathology}
                    onViewChemicalReport={handleViewChemicalReport}
                  />
                ))
              ) : (
                <Tr>
                  <Td colSpan={7}>
                    <Text textAlign="center" mt="32px" color="black">
                      *--No record found--*
                    </Text>
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>
        <Pagination
          postPerPage={PostPerPage}
          currentPage={CurrentPage}
          totalPosts={TotalData}
          paginate={paginate}
        />
      </Box>

      <ChemicalPathologyReportModal
        isOpen={isModalOpen}
        onClose={() => {
          onModalClose();
          setTrigger((prev) => !prev);
          setSelectedPayload({});
        }}
        testId={selectedTestId}
        activateNotifications={activateNotifications}
        type={modalType}
        oldPayload={selectedPayload}
      />
    </MainLayout>
  );
}
