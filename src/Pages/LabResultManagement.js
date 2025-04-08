import React, { useState, useEffect } from "react";
import { Text, Flex, Box, useDisclosure } from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, TableContainer } from "@chakra-ui/react";
import moment from "moment";
import TableRowY from "../Components/TableRowY"; // This component should render table rows when type === "test"
import Button from "../Components/Button";
import CreateTestComponentModal from "../Components/CreateTestComponentModal";
import ShowToast from "../Components/ToastNotification";
import { SlPlus } from "react-icons/sl";
import Pagination from "../Components/Pagination";
import { GetAllTestComponentApi } from "../Utils/ApiCalls";
import { configuration } from "../Utils/Helpers";

export default function LabResultManagement() {
  const [data, setData] = useState([]);
  const [modalState, setModalState] = useState(""); // "new" or "edit"
  const [oldPayload, setOldPayload] = useState({});
  const [filterData, setFilterData] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [trigger, setTrigger] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = configuration.sizePerPage;
  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    status: "",
  });

  // Filter state variables matching theatre management filter
  const [all, setAll] = useState(true);
  const [active, setActive] = useState(false);
  const [inActive, setInActive] = useState(false);

  // Pagination calculations
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const paginatedData = filterData.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Fetch all test component details and log response to console
  const getAllTestComponents = async () => {
    try {
      const result = await GetAllTestComponentApi();
      console.log("getAllTestComponents response:", result);
      const testComponents = result.queryresult.testcomponentdetails;
      setData(testComponents);
      setFilterData(testComponents);
    } catch (e) {
      activateNotifications(e.message, "error");
    }
  };

  // Notification function
  const activateNotifications = (message, status) => {
    setShowToast({
      show: true,
      message,
      status,
    });
    setTimeout(() => {
      setShowToast({ show: false, message: "", status: "" });
    }, 3000);
  };

  // Filter functions (All, Active, Inactive) matching theatre management
  const filterAll = () => {
    setAll(true);
    setActive(false);
    setInActive(false);
    setFilterData(data);
  };

  const filterActive = () => {
    setAll(false);
    setActive(true);
    setInActive(false);
    const filtered = data.filter((item) => item.status === "active");
    setFilterData(filtered);
  };

  const filterInactive = () => {
    setAll(false);
    setActive(false);
    setInActive(true);
    const filtered = data.filter((item) => item.status === "inactive");
    setFilterData(filtered);
  };

  // Open modal to create a new test component
  const createTestComponent = () => {
    setModalState("new");
    onOpen();
  };

  // Open modal to edit a test component
  const editTestComponent = (item) => {
    setModalState("edit");
    setOldPayload(item);
    onOpen();
  };

  useEffect(() => {
    getAllTestComponents();
  }, [isOpen, trigger]);

  return (
    <Box bg="#fff" border="1px solid #EFEFEF" mt="10px" py="17px" px={["18px", "18px"]} rounded="10px">
      {showToast.show && <ShowToast message={showToast.message} status={showToast.status} />}

      {/* Filter Section matching theatre management filter */}
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
          <Box borderRight="1px solid #EDEFF2" pr="5px" onClick={filterAll}>
            <Text
              py="8.5px"
              px="12px"
              bg={all ? "#fff" : "transparent"}
              rounded="7px"
              color="#1F2937"
              fontWeight="500"
              fontSize="13px"
            >
              All{" "}
              <Box as="span" color="#667085" fontWeight="400" fontSize="13px">
                ({data?.length})
              </Box>
            </Text>
          </Box>
          <Box borderRight="1px solid #EDEFF2" pr="5px" onClick={filterActive}>
            <Text
              py="8.5px"
              px="12px"
              bg={active ? "#fff" : "transparent"}
              rounded="7px"
              color="#1F2937"
              fontWeight="500"
              fontSize="13px"
            >
              Active
            </Text>
          </Box>
          <Box borderRight="1px solid #EDEFF2" pr="5px" onClick={filterInactive}>
            <Text
              py="8.5px"
              px="12px"
              bg={inActive ? "#fff" : "transparent"}
              rounded="7px"
              color="#1F2937"
              fontWeight="500"
              fontSize="13px"
            >
              Inactive
            </Text>
          </Box>
        </Flex>
      </Flex>

      <Flex justifyContent="space-between" flexWrap="wrap" mt="10px" w={["100%", "100%", "50%", "37%"]}>
        <Button rightIcon={<SlPlus />} w={["100%", "100%", "165px", "205px"]} onClick={createTestComponent}>
          Add Test Component
        </Button>
      </Flex>

      {/* Table Section */}
      <Box bg="#fff" border="1px solid #EFEFEF" mt="12px" py="15px" px="15px" rounded="10px" overflowX="auto">
        <TableContainer>
          <Table variant="striped">
            <Thead bg="#fff">
              <Tr>
                <Th fontSize="13px" color="#534D59" fontWeight="600">S/N</Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">Test Name</Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">Subcomponents</Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">Created Date</Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">Updated Date</Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginatedData.map((item, i) => (
                <TableRowY
                  key={i}
                  type="test"
                  sn={i + 1}
                  testName={item.testname}
                  subcomponients={item.subcomponients}
                  createdAt={moment(item.createdAt).format("lll")}
                  updatedAt={moment(item.updatedAt).format("lll")}
                  onEdit={() => editTestComponent(item)}
                />
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>

      {/* Pagination */}
      <Pagination
        postPerPage={postsPerPage}
        currentPage={currentPage}
        totalPosts={filterData.length}
        paginate={paginate}
      />

      {/* Create / Edit Modal */}
      <CreateTestComponentModal
        isOpen={isOpen}
        oldPayload={oldPayload}
        onClose={onClose}
        type={modalState}
        activateNotifications={activateNotifications}
      />
    </Box>
  );
}
