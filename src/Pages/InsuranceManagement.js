import React, { useState, useEffect } from "react";
import { Text, Flex, Box, useDisclosure } from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, TableContainer } from "@chakra-ui/react";
import moment from "moment";
import TableRowY from "../Components/TableRowY";
import Button from "../Components/Button";
import CreateInsuranceModal from "../Components/CreateInsuranceModal";
import ShowToast from "../Components/ToastNotification";
import { SlPlus } from "react-icons/sl";
import Pagination from "../Components/Pagination";
import { GetAllInsuranceApi } from "../Utils/ApiCalls";
import { configuration } from "../Utils/Helpers";

export default function InsuranceManagement() {
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [modalState, setModalState] = useState("");
  const [oldPayload, setOldPayload] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [trigger, setTrigger] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = configuration.sizePerPage; // Use posts per page from configuration
  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    status: "",
  });

  // Pagination calculations
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const paginatedData = filterData.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Fetch all insurance records
  const getAllInsurance = async () => {
    try {
      const result = await GetAllInsuranceApi();
      console.log("getAllInsurance", result);
      // Assuming the API returns data under queryresult.hmomanagementdetails
      setData(result.queryresult.hmomanagementdetails);
      setFilterData(result.queryresult.hmomanagementdetails);
    } catch (e) {
      activateNotifications(e.message, "error");
    }
  };

  // Notification function
  const activateNotifications = (message, status) => {
    setShowToast({
      show: true,
      message: message,
      status: status,
    });
    setTimeout(() => {
      setShowToast({ show: false, message: "", status: "" });
    }, 3000);
  };

  // Filtering functions (if insurance records include a status field)
  const filterAll = () => {
    setFilterData(data);
  };

  const filterActive = () => {
    const filtered = data.filter((item) => item.status === "active");
    setFilterData(filtered);
  };

  const filterInactive = () => {
    const filtered = data.filter((item) => item.status === "inactive");
    setFilterData(filtered);
  };

  // Open modal to create a new insurance entry
  const createInsurance = () => {
    setModalState("new");
    onOpen();
  };

  // Open modal to edit an insurance entry
  const editInsurance = (item) => {
    setModalState("edit");
    setOldPayload(item);
    onOpen();
  };

  useEffect(() => {
    getAllInsurance();
  }, [isOpen, trigger]);

  return (
    <Box
      bg="#fff"
      border="1px solid #EFEFEF"
      mt="10px"
      py="17px"
      px={["18px", "18px"]}
      rounded="10px"
    >
      {showToast.show && (
        <ShowToast message={showToast.message} status={showToast.status} />
      )}

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
          <Box borderRight="1px solid #EDEFF2" pr="5px" onClick={filterAll}>
            <Text
              py="8.5px"
              px="12px"
              bg="#fff"
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
              bg="transparent"
              rounded="7px"
              color="#1F2937"
              fontWeight="500"
              fontSize="13px"
            >
              Active
            </Text>
          </Box>
          <Box
            borderRight="1px solid #EDEFF2"
            pr="5px"
            onClick={filterInactive}
          >
            <Text
              py="8.5px"
              px="12px"
              bg="transparent"
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

      {/* Buttons Section */}
      <Flex justifyContent="space-between" flexWrap="wrap" mt="10px">
        <Button
          rightIcon={<SlPlus />}
          w={["100%", "100%", "165px", "205px"]}
          onClick={createInsurance}
        >
          Add Insurance
        </Button>
      </Flex>

      {/* Table Section */}
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
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  S/N
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  HMO Name
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  ID
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Coverage
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Created Date
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Updated Date
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Actions
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginatedData.map((item, i) => (
                <TableRowY
                  key={i}
                  type="insurance-management"
                  sn={i + 1}
                  hmoname={item.hmoname}
                  id={item.id}
                  coverage={item.hmopercentagecover}
                  createdAt={moment(item.createdAt).format("lll")}
                  updatedAt={moment(item.updatedAt).format("lll")}
                  onEdit={() => editInsurance(item)}
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

      {/* Modal for creating/updating insurance */}
      <CreateInsuranceModal
        isOpen={isOpen}
        oldPayload={oldPayload}
        onClose={onClose}
        type={modalState}
        activateNotifications={activateNotifications}
      />
    </Box>
  );
}
