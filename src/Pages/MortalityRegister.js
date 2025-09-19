import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useDisclosure,
} from "@chakra-ui/react";
import Button from "../Components/Button";
import Input from "../Components/Input";
import { IoFilter } from "react-icons/io5";
import { BiSearch } from "react-icons/bi";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import MortalityRegisterModal from "../Components/MortalityRegisterModal";
import TableRow from "../Components/TableRow";
import { useColors } from "../Utils/colors";
import { SlPlus } from "react-icons/sl";
import { GetMortalityRegisterByPatientApi, CreateMortalityRegisterApi } from "../Utils/ApiCalls";


export default function MortalityRegister({ id }) {
  const {
    bgColor,
    textColor,
    borderColor,
    titleTextColor,
    subTitleTextColor,
  } = useColors();
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalType, setModalType] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [trigger, setTrigger] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    GetMortalityRegisterByPatientApi(id)
      .then((result) => {
        setData(result?.queryresult?.mortalityregister || []);
      })
      .catch((e) => {
  // Optionally handle error UI here
      })
      .finally(() => setLoading(false));
  }, [id, trigger]);

  const handleCreate = async (payload) => {
    try {
      await CreateMortalityRegisterApi(payload);
  // Optionally handle success UI here
      setTrigger((prev) => !prev);
      onClose();
    } catch (e) {
  // Optionally handle error UI here
    }
  };
  return (
    <Box bg="#fff" border="1px solid #EFEFEF" mt="10px" py="17px" px={["18px", "18px"]} rounded="10px">
      {/* Header Section */}
      <Text color={titleTextColor} fontWeight="600" fontSize="18px" mb="20px">
        Mortality Register
      </Text>

      {/* Filter, Search & Add Button Section */}
      <Flex justifyContent="space-between" flexWrap="wrap" mb="20px">
        <Flex alignItems="center" flexWrap="wrap" bg="#E4F3FF" rounded="7px" py="3.5px" px="5px" cursor="pointer">
          {/* Example filter buttons, can be customized for mortality types */}
          <Box borderRight="1px solid #EDEFF2" pr="5px">
            <Text py="8.5px" px="12px" bg="#fff" rounded="7px" color="#1F2937" fontWeight="500" fontSize="13px">
              All <Box as="span" color="#667085" fontWeight="400" fontSize="13px">({data?.length})</Box>
            </Text>
          </Box>
        </Flex>

        {/* Search Input & Filter Dropdown */}
        <Flex alignItems="center" mt={["10px", "0px"]}>
          <Box maxW="300px" mr="10px">
            <Input
              label="Search"
              placeholder="Search"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              bColor="#E4E4E4"
              leftIcon={<BiSearch />}
            />
          </Box>
          <Menu isLazy>
            <MenuButton as={Box}>
              <Flex border="1px solid #EA5937" rounded="7px" cursor="pointer" py="11.64px" px="16.98px" bg="#f8ddd1" color="blue.blue500" fontWeight="500" fontSize="14px" alignItems="center">
                <Text>Filter</Text>
                <IoFilter />
              </Flex>
            </MenuButton>
            <MenuList fontSize="14px">
              <MenuItem textTransform="capitalize" fontWeight="500" color="#2F2F2F" _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}>
                By Type
              </MenuItem>
              <MenuItem textTransform="capitalize" fontWeight="500" color="#2F2F2F" _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}>
                By Ward
              </MenuItem>
              <MenuItem textTransform="capitalize" fontWeight="500" color="#2F2F2F" _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}>
                Clear Filter
              </MenuItem>
            </MenuList>
          </Menu>
       
        </Flex>
      </Flex>

         {/* Add Price Button */}
      <Flex justifyContent="space-between" flexWrap="wrap" mt={["10px", "10px", "10px", "10px"]} w={["100%", "100%", "50%", "37%"]}>
        <Button rightIcon={<SlPlus />} w={["100%", "100%", "144px", "144px"]} onClick={() => { setModalType("create"); onOpen(); }}>
          Add Mortality 
        </Button>
      </Flex>

      {/* Table Section */}
      <Box
        bg={bgColor}
        border={`1px solid ${borderColor}`}
        mt="12px"
        py="15px"
        px="15px"
        rounded="10px"
        overflowX="auto"
      >
        <TableContainer>
          <Table variant="striped">
            <Thead bg={bgColor}>
              <Tr>
                <Th fontSize="13px" textTransform="capitalize" color={subTitleTextColor} fontWeight="600">Date/Time of Death</Th>
                <Th fontSize="13px" textTransform="capitalize" color={subTitleTextColor} fontWeight="600">Name</Th>
                <Th fontSize="13px" textTransform="capitalize" color={subTitleTextColor} fontWeight="600">Age</Th>
                <Th fontSize="13px" textTransform="capitalize" color={subTitleTextColor} fontWeight="600">Sex</Th>
                <Th fontSize="13px" textTransform="capitalize" color={subTitleTextColor} fontWeight="600">Type</Th>
                <Th fontSize="13px" textTransform="capitalize" color={subTitleTextColor} fontWeight="600">Cause of Death</Th>
                <Th fontSize="13px" textTransform="capitalize" color={subTitleTextColor} fontWeight="600">Ward</Th>
                <Th fontSize="13px" textTransform="capitalize" color={subTitleTextColor} fontWeight="600">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {loading ? (
                <Tr>
                  <Td colSpan={8}>
                    <Text textAlign="center" mt="32px" color={textColor}>Loading...</Text>
                  </Td>
                </Tr>
              ) : data.length === 0 ? (
                <Tr>
                  <Td colSpan={8}>
                    <Text textAlign="center" mt="32px" color={textColor}>No mortality records found</Text>
                  </Td>
                </Tr>
              ) : (
                data.map((row, idx) => (
                  <TableRow
                    key={row._id || idx}
                    name={row.name}
                    age={row.age}
                    sex={row.sex}
                    type={row.maternalMortality ? "Maternal" : row.neonatalDeath ? "Neonatal" : row.Deathunderfive ? "Under Five" : "Other"}
                    cause={row.maternalDeath || row.neonatalDeath || row.Deathunderfive || row.other}
                    ward={row.ward}
                    date={row.dateOfBirth}
                    // Add more props as needed for actions
                  />
                ))
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>

      <MortalityRegisterModal
        isOpen={isOpen}
        onClose={onClose}
        patientId={id}
        onCreate={handleCreate}
        type={modalType}
      />
      {/* ShowToast component can be added here if needed */}
    </Box>
  );
}
