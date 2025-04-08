import React, { useState } from "react";
import { Text, Flex, Box, useDisclosure } from "@chakra-ui/react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  HStack,
} from "@chakra-ui/react";
import TableRowY from "../Components/TableRowY";
import Button from "../Components/Button";
import ShowToast from "../Components/ToastNotification";
import { IoFilter } from "react-icons/io5";
import { SlPlus } from "react-icons/sl";
import Pagination from "../Components/Pagination";
import { configuration } from "../Utils/Helpers";

export default function DailyWardReport() {
  const [All, setAll] = useState(true);
  const [Active, setActive] = useState(false);
  const [InActive, setInActive] = useState(false);
  const [Data] = useState([
    {
      specialization: "ICU",
      ward: "A1",
      createdBy: "Dr. Smith",
      createdOn: "2025-01-30",
      status: "active",
    },
    {
      specialization: "General",
      ward: "B2",
      createdBy: "Nurse John",
      createdOn: "2025-01-29",
      status: "inactive",
    },
    {
      specialization: "Pediatrics",
      ward: "C3",
      createdBy: "Dr. Jane",
      createdOn: "2025-01-28",
      status: "active",
    },
  ]);
  const [FilterData, setFilterData] = useState(Data);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [CurrentPage, setCurrentPage] = useState(1);
  const PostPerPage = configuration.sizePerPage;
  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    status: "",
  });

  const filterAll = () => {
    setAll(true);
    setActive(false);
    setInActive(false);
    setFilterData(Data);
  };

  const filterActive = () => {
    setAll(false);
    setActive(true);
    setInActive(false);
    setFilterData(Data.filter((item) => item.status === "active"));
  };

  const filterInactive = () => {
    setAll(false);
    setActive(false);
    setInActive(true);
    setFilterData(Data.filter((item) => item.status === "inactive"));
  };

  const indexOfLastPost = CurrentPage * PostPerPage;
  const indexOfFirstPost = indexOfLastPost - PostPerPage;
  const PaginatedData = FilterData.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Box
      bg="#fff"
      border="1px solid #EFEFEF"
      mt="10px"
      py="17px"
      px="18px"
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
              bg={All ? "#fff" : "transparent"}
              rounded="7px"
              color="#1F2937"
              fontWeight="500"
              fontSize="13px"
            >
              All{" "}
              <Box as="span" color="#667085" fontWeight="400" fontSize="13px">
                ({Data?.length})
              </Box>
            </Text>
          </Box>
          <Box borderRight="1px solid #EDEFF2" pr="5px" onClick={filterActive}>
            <Text
              py="8.5px"
              px="12px"
              bg={Active ? "#fff" : "transparent"}
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
              bg={InActive ? "#fff" : "transparent"}
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
        <Button rightIcon={<SlPlus />} w={["100%", "100%", "144px", "144px"]}>
          Add Report
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
                  Specialization
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Ward
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Created By
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Created On
                </Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">
                  Actions
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {PaginatedData.map((item, i) => (
                <TableRowY
                  key={i}
                  type="DailyWardReport"
                  specialization={item.specialization}
                  ward={item.ward}
                  createdBy={item.createdBy}
                  createdOn={item.createdOn}
                  onView={() => console.log("Viewing", item)}
                />
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>

      <Pagination
        postPerPage={PostPerPage}
        currentPage={CurrentPage}
        totalPosts={FilterData.length}
        paginate={paginate}
      />
    </Box>
  );
}
