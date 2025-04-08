import React, { useState, useEffect } from "react";
import { Text, Flex, HStack, Box, useDisclosure } from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, TableContainer } from "@chakra-ui/react";
import moment from "moment";
import TableRow from "../Components/TableRow";
import Button from "../Components/Button";
import CreateWardModal from "../Components/CreateWardModal";
import Input from "../Components/Input";
import ShowToast from "../Components/ToastNotification";
import { IoFilter } from "react-icons/io5";
import { BiSearch } from "react-icons/bi";
import { SlPlus } from "react-icons/sl";
import { GetAllWardApi, UpdatePriceStatusApi } from "../Utils/ApiCalls";
import Pagination from "../Components/Pagination";
import { configuration } from "../Utils/Helpers";

export default function WardManagement() {
  const [all, setAll] = useState(true);
  const [active, setActive] = useState(false);
  const [inActive, setInActive] = useState(false);
  const [data, setData] = useState([]);
  const [modalState, setModalState] = useState("");
  const [oldPayload, setOldPayload] = useState({});
  const [filterData, setFilterData] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [trigger, setTrigger] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = configuration.sizePerPage; // Using configuration for posts per page
  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    status: "",
  });

  // Calculate indices for pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const paginatedData = filterData.slice(indexOfFirstPost, indexOfLastPost);

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getAllWard = async () => {
    try {
      const result = await GetAllWardApi();
      console.log("getAllWard", result);
      setData(result.queryresult.wardmanagementdetails);
      setFilterData(result.queryresult.wardmanagementdetails);
    } catch (e) {
      activateNotifications(e.message, "error");
    }
  };

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
    const filteredData = data.filter((item) => item.status === "active");
    setFilterData(filteredData);
  };

  const filterInactive = () => {
    setAll(false);
    setActive(false);
    setInActive(true);
    const filteredData = data.filter((item) => item.status === "inactive");
    setFilterData(filteredData);
  };

  const onChangeStatus = async (id) => {
    try {
      const result = await UpdatePriceStatusApi(id);
      if (result.status === 200) {
        setTrigger(!trigger);
        setShowToast({
          show: true,
          message: "Status Updated Successfully",
          status: "success",
        });
        setTimeout(() => setShowToast({ show: false, message: "", status: "" }), 3000);
      }
    } catch (err) {}
  };

  const createWard = () => {
    setModalState("new");
    onOpen();
  };

  const editWard = (item) => {
    setModalState("edit");
    onOpen();
    setOldPayload(item);
  };

  useEffect(() => {
    getAllWard();
  }, [isOpen, trigger]);

  return (
    <Box bg="#fff" border="1px solid #EFEFEF" mt="10px" py="17px" px={["18px", "18px"]} rounded="10px">
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
              bg={all ? "#fff" : "transparent"}
              rounded="7px"
              color="#1F2937"
              fontWeight="500"
              fontSize="13px"
            >
              All{" "}
              <Box color="#667085" as="span" fontWeight="400" fontSize="13px">
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
      <Flex
        justifyContent="space-between"
        flexWrap="wrap"
        mt={["10px", "10px", "10px", "10px"]}
        w={["100%", "100%", "50%", "37%"]}
      >
        <Button
          rightIcon={<SlPlus />}
          w={["100%", "100%", "165px", "205px"]}
          onClick={createWard}
        >
          Add Ward
        </Button>
      </Flex>

      {/* Table Section */}
      <Box bg="#fff" border="1px solid #EFEFEF" mt="12px" py="15px" px="15px" rounded="10px" overflowX="auto">
        <TableContainer>
          <Table variant="striped">
            <Thead bg="#fff">
              <Tr>
                <Th fontSize="13px" color="#534D59" fontWeight="600">S/N</Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">Created Date</Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">Bed Specialization</Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">Ward Name</Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">Total Bed</Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">Occupied Bed</Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">Vacant Bed</Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">Price</Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">Status</Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginatedData.map((item, i) => (
                <TableRow
                  key={i}
                  type="ward-management"
                  sn={i + 1}
                  date={moment(item.createdAt).format("lll")}
                  bedSpec={item.bedspecialization}
                  wardName={item.wardname}
                  totalBed={item.totalbed}
                  occupiedBed={item.occupiedbed}
                  vacantBed={item.vacantbed}
                  price={item.price}
                  status={item.status}
                  onEdit={() => editWard(item)}
                  onChangeStatus={() => onChangeStatus(item._id)}
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

      <CreateWardModal
        isOpen={isOpen}
        oldPayload={oldPayload}
        onClose={onClose}
        type={modalState}
        activateNotifications={activateNotifications}
      />
    </Box>
  );
}
