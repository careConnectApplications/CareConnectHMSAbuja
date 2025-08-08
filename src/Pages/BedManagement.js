import React, { useState, useEffect } from "react";
import {
  Text,
  Flex,
  HStack,
  Box,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import moment from "moment";
import { BsThreeDots } from "react-icons/bs";
import Button from "../Components/Button";
import CreateBedModal from "../Components/CreateBedModal";
import ShowToast from "../Components/ToastNotification";
import { SlPlus } from "react-icons/sl";
import { GetAllBedsApi, SoftDeleteRestoreBedApi } from "../Utils/ApiCalls";
import Pagination from "../Components/Pagination";
import { configuration } from "../Utils/Helpers";

export default function BedManagement() {
  const [all, setAll] = useState(true);
  const [vacant, setVacant] = useState(false);
  const [occupied, setOccupied] = useState(false);
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

  // Calculate indices for pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const paginatedData = filterData.slice(indexOfFirstPost, indexOfLastPost);

  const getAllBeds = async () => {
    try {
      const result = await GetAllBedsApi();
      const beds = result?.queryresult?.bedDetails || [];
      setData(beds);
      setFilterData(beds);
    } catch (e) {
      activateNotifications(e.message, "error");
      setData([]);
      setFilterData([]);
    }
  };

  const activateNotifications = (message, status) => {
    setShowToast({ show: true, message, status });
    setTimeout(
      () => setShowToast({ show: false, message: "", status: "" }),
      3000
    );
  };

  const filterAll = () => {
    setAll(true);
    setVacant(false);
    setOccupied(false);
    setFilterData(data);
  };

  const filterVacant = () => {
    setAll(false);
    setVacant(true);
    setOccupied(false);
    setFilterData(data.filter((item) => item.status === "vacant"));
  };

  const filterOccupied = () => {
    setAll(false);
    setVacant(false);
    setOccupied(true);
    setFilterData(data.filter((item) => item.status === "occupied"));
  };

const handleDeleteRestore = async (id, isCurrentlyDeleted) => {
  try {
    // Validate parameters
    if (!id) {
      activateNotifications('Invalid bed ID', 'error');
      return;
    }

    // Prepare payload - toggle the current deletion status
    const payload = {
      isDeleted: !isCurrentlyDeleted
    };

    // Call API
    const result = await SoftDeleteRestoreBedApi(id, payload);
    
    // Success handling
    if (result) {
      activateNotifications(
        `Bed ${isCurrentlyDeleted ? 'restored' : 'deleted'} successfully`, 
        'success'
      );
      setTrigger(!trigger); // Refresh the data
    }
  } catch (error) {
    console.error('Bed operation error:', error);
    activateNotifications(
      error.message || 'Failed to update bed status',
      'error'
    );
  }
};

  const createBed = () => {
    setModalState("new");
    onOpen();
  };

  const editBed = (item) => {
    setModalState("edit");
    setOldPayload(item);
    onOpen();
  };

  useEffect(() => {
    getAllBeds();
  }, [isOpen, trigger]);

  return (
    <Box
      bg="#fff"
      border="1px solid #EFEFEF"
      mt="10px"
      p="17px 18px"
      rounded="10px"
    >
      {showToast.show && (
        <ShowToast message={showToast.message} status={showToast.status} />
      )}

      {/* Filter Section */}
      <Flex justify="space-between" flexWrap="wrap">
        <Flex
          align="center"
          flexWrap="wrap"
          bg="#E4F3FF"
          rounded="7px"
          p="3.5px 5px"
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
              <Text as="span" color="#667085" fontWeight="400">
                ({data.length})
              </Text>
            </Text>
          </Box>
          <Box borderRight="1px solid #EDEFF2" pr="5px" onClick={filterVacant}>
            <Text
              py="8.5px"
              px="12px"
              bg={vacant ? "#fff" : "transparent"}
              rounded="7px"
              color="#1F2937"
              fontWeight="500"
              fontSize="13px"
            >
              Vacant
            </Text>
          </Box>
          <Box onClick={filterOccupied}>
            <Text
              py="8.5px"
              px="12px"
              bg={occupied ? "#fff" : "transparent"}
              rounded="7px"
              color="#1F2937"
              fontWeight="500"
              fontSize="13px"
            >
              Occupied
            </Text>
          </Box>
        </Flex>
      </Flex>

      <Flex
        justify="space-between"
        flexWrap="wrap"
        mt="10px"
        w={["100%", "100%", "50%", "37%"]}
      >
        <Button
          rightIcon={<SlPlus />}
          w={["100%", "165px", "205px"]}
          onClick={createBed}
        >
          Add Bed
        </Button>
      </Flex>

      {/* Table Section */}
      <Box
        bg="#fff"
        border="1px solid #EFEFEF"
        mt="12px"
        p="15px"
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
                  Bed Number
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Ward Name
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Specialization
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Status
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Patient
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Assigned Date
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Active
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Actions
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginatedData.map((item, i) => (
                <Tr key={i}>
                  <Td>
                    <Text fontSize="12px">{i + 1}</Text>
                  </Td>
                  <Td>
                    <Text fontSize="12px">{item.bednumber}</Text>
                  </Td>
                  <Td>
                    <Text fontSize="12px">{item.ward?.wardname || "N/A"}</Text>
                  </Td>
                  <Td>
                    <Text fontSize="12px">
                      {item.ward?.bedspecialization || "N/A"}
                    </Text>
                  </Td>
                  <Td>
                    <HStack
                      color={item.status === "vacant" ? "#027A48" : "#FD4739"}
                    >
                      <Box
                        w="8px"
                        h="8px"
                        rounded="full"
                        bg={item.status === "vacant" ? "#027A48" : "#FD4739"}
                      />
                      <Text fontSize="13px">{item.status}</Text>
                    </HStack>
                  </Td>
                  <Td>
                    <Text fontSize="12px">{item.assignedPatient || "N/A"}</Text>
                  </Td>
                  <Td>
                    <Text fontSize="12px">
                      {item.assignedDate
                        ? moment(item.assignedDate).format("lll")
                        : "N/A"}
                    </Text>
                  </Td>
                  <Td>
                    <Text
                      fontSize="12px"
                      color={item.isDeleted ? "red.500" : "green.500"}
                    >
                      {item.isDeleted ? "Inactive" : "Active"}
                    </Text>
                  </Td>
                  <Td>
                    <Menu>
                      <MenuButton as={Box}>
                        <BsThreeDots />
                      </MenuButton>
                      <MenuList>
                        <MenuItem
                          onClick={() => editBed(item)}
                          _hover={{ color: "white", bg: "blue.500" }}
                        >
                          Edit
                        </MenuItem>
                        {item.isDeleted ? (
                          <MenuItem
                            onClick={() => handleDeleteRestore(item._id, true)}
                            _hover={{ color: "white", bg: "green.500" }}
                          >
                            Restore
                          </MenuItem>
                        ) : (
                          <MenuItem
                            onClick={() => handleDeleteRestore(item._id, false)}
                            _hover={{ color: "white", bg: "red.500" }}
                          >
                            Delete
                          </MenuItem>
                        )}
                      </MenuList>
                    </Menu>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>

      {filterData.length > 0 && (
        <Pagination
          postPerPage={postsPerPage}
          currentPage={currentPage}
          totalPosts={filterData.length}
          paginate={setCurrentPage}
        />
      )}

      <CreateBedModal
        isOpen={isOpen}
        onClose={onClose}
        oldPayload={oldPayload}
        type={modalState}
        activateNotifications={activateNotifications}
        trigger={trigger}
        setTrigger={setTrigger}
      />
    </Box>
  );
}
