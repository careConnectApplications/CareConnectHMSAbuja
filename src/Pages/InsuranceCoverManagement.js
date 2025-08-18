import React, { useState, useEffect } from "react";
import { Text, Flex, Box, useDisclosure } from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, TableContainer } from "@chakra-ui/react";
import moment from "moment";
import TableRowY from "../Components/TableRowY";
import Button from "../Components/Button";
import CreateInsuranceCoverModal from "../Components/CreateInsuranceCoverModal";
import ShowToast from "../Components/ToastNotification";
import { SlPlus } from "react-icons/sl";
import {
  GetAllHmoCategoryCoverApi,
  UpdatePriceStatusApi,
} from "../Utils/ApiCalls";
import Pagination from "../Components/Pagination";
import { configuration } from "../Utils/Helpers";

export default function InsuranceCoverManagement() {
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
  const postsPerPage = configuration.sizePerPage;
  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    status: "",
  });

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const paginatedData = filterData.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const fetchHmoCategoryCovers = async () => {
    try {
      const response = await GetAllHmoCategoryCoverApi();
      const categoryCovers = response.queryresult.hmocategorycoverdetails;
      setData(categoryCovers);
      setFilterData(categoryCovers);
    } catch (error) {
      activateNotifications(error.message, "error");
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
        setTimeout(
          () => setShowToast({ show: false, message: "", status: "" }),
          3000
        );
      }
    } catch (err) {}
  };

  const createInsuranceCover = () => {
    setModalState("new");
    onOpen();
  };

  const editInsuranceCover = (item) => {
    setModalState("edit");
    onOpen();
    setOldPayload(item);
  };

  useEffect(() => {
    fetchHmoCategoryCovers();
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
          <Box
            borderRight="1px solid #EDEFF2"
            pr="5px"
            onClick={filterInactive}
          >
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
          onClick={createInsuranceCover}
        >
          Add Insurance Cover
        </Button>
      </Flex>

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
                  Created Date
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  HMO
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Category
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Percentage Cover
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
                  type="insurance-cover-management"
                  sn={i + 1}
                  date={moment(item.createdAt).format("lll")}
                  hmo={item.hmoId.hmoname} 
                  category={item.category}
                  percentageCover={item.hmopercentagecover}
                  onEdit={() => editInsuranceCover(item)}
                />
              ))}{" "}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>

      <Pagination
        postPerPage={postsPerPage}
        currentPage={currentPage}
        totalPosts={filterData.length}
        paginate={paginate}
      />

      <CreateInsuranceCoverModal
        isOpen={isOpen}
        oldPayload={oldPayload}
        onClose={onClose}
        type={modalState}
        activateNotifications={activateNotifications}
      />
    </Box>
  );
}
