import React, { useState, useEffect } from "react";
import {
  Text,
  Flex,
  HStack,
  Box,
  useDisclosure,
  SimpleGrid,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import moment from "moment";
import Button from "../Components/Button";
import Input from "../Components/Input";
import PreviewCard from "../Components/PreviewCard";
import PreviewCardV2 from "../Components/PreviewCardV2";
import ShowToast from "../Components/ToastNotification";
import Preloader from "../Components/Preloader";
import { BiSearch } from "react-icons/bi";
import { IoFilter } from "react-icons/io5";
import { SlPlus } from "react-icons/sl";
import { MdModeEdit } from "react-icons/md";
import { FaClock } from "react-icons/fa";
import { BsCalendar2DateFill } from "react-icons/bs";
import { GetPreviousAnaesthesiaFormApi } from "../Utils/ApiCalls";
import { useNavigate, useLocation } from "react-router-dom";

export default function TheatreAnaesthesiaForm({ hide = false, index }) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [filteredData, setFilteredData] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [trigger, setTrigger] = useState(false);
  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    status: "",
  });

  const filterBy = (field) => {
    if (!data) return;
    const lower = searchInput.toLowerCase();
    let result = [];
    switch (field) {
      case "preopeassessment":
        result = data.preopeassessment.toLowerCase().includes(lower)
          ? [data]
          : [];
        break;
      case "allergies":
        result = data.allergies.toLowerCase().includes(lower) ? [data] : [];
        break;
      default:
        result = [data];
    }
    setFilteredData(result.length ? result[0] : null);
  };

  const appointmentId = localStorage.getItem("appointmentId");
  const patientId = localStorage.getItem("patientId");
  const nav = useNavigate();
  const { pathname } = useLocation();

  const activateNotifications = (message, status) => {
    setShowToast({ show: true, message, status });
    setTimeout(() => setShowToast({ show: false }), 10000);
  };

  const getAnaesthesia = async () => {
    setIsLoading(true);
    try {
      const result = await GetPreviousAnaesthesiaFormApi(patientId);
      if (result.status === true) {
        const record = result.queryresult;
        setData(record);
        localStorage.setItem("anaesthesiaRecord", JSON.stringify(record));
        setFilteredData(null);
      }
    } catch (e) {
      activateNotifications(e.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const addNew = () => {
    localStorage.setItem("pathname", pathname);
    nav(`/dashboard/add-theatre-anaesthesia-form/${appointmentId}`);
  };
  const editRecord = () => {
    localStorage.setItem("pathname", pathname);
    localStorage.setItem("oldAnaesthesiaRecord", JSON.stringify(data));
    nav(`/dashboard/edit-theatre-anaesthesia-form/${data._id}`);
  };

  useEffect(() => {
    getAnaesthesia();
  }, [isOpen, trigger, index]);

  const display = filteredData || data;

  return (
    <Box
      bg="#fff"
      border="1px solid #EFEFEF"
      mt="10px"
      py="17px"
      px={["18px", "18px"]}
      rounded="10px"
    >
      {isLoading && <Preloader />}
      {showToast.show && (
        <ShowToast message={showToast.message} status={showToast.status} />
      )}

      {/* Navigation Tabs */}
      {display && (
        <Flex mb="4" gap="2">
          <Box
            as="button"
            onClick={() => nav(`/dashboard/food-given/${display._id}`)}
            border="1px solid #EA5937"
            cursor="pointer"
            bg="#f8ddd1"
            color="blue.blue500"
            fontWeight="500"
            px="4"
            py="2"
            rounded="md"
            _hover={{ bg: "blue.blue400" }}
          >
            Food Given
          </Box>
          <Box
            as="button"
            onClick={() => nav(`/dashboard/drug-given/${display._id}`)}
            border="1px solid #EA5937"
            cursor="pointer"
            bg="#f8ddd1"
            color="blue.blue500"
            fontWeight="500"
            px="4"
            py="2"
            rounded="md"
            _hover={{ bg: "blue.blue400" }}
          >
            Drug Given
          </Box>
        </Flex>
      )}

      {/* Search & Filter */}
      <Flex justify="space-between" flexWrap="wrap">
        <Flex
          align="center"
          bg="#E4F3FF"
          rounded="7px"
          py="3.5px"
          px="5px"
          mt={["10px", "10px", "0", "0"]}
        >
          <Text
            py="8.5px"
            px="12px"
            bg="#fff"
            rounded="7px"
            color="#1F2937"
            fontWeight="500"
            fontSize="13px"
            cursor="pointer"
            onClick={() => setFilteredData(null)}
          >
            All
          </Text>
        </Flex>

        {!hide && (
          <Flex
            flexWrap="wrap"
            mt={["10px", "10px", "0", "0"]}
            align="center"
            justify="flex-end"
          >
            <HStack spacing={2}>
              <Input
                label="Search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                leftIcon={<BiSearch />}
              />
              <Menu>
                <MenuButton>
                  <Flex
                    border="1px solid #EA5937"
                    rounded="7px"
                    py="11.6px"
                    px="16.9px"
                    bg="#f8ddd1"
                    color="blue.blue500"
                    fontWeight="500"
                    fontSize="14px"
                    cursor="pointer"
                  >
                    <Text>Filter</Text>
                    <IoFilter />
                  </Flex>
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => filterBy("preopeassessment")}>
                    by Pre-op Assessment
                  </MenuItem>
                  <MenuItem onClick={() => filterBy("allergies")}>
                    by Allergies
                  </MenuItem>
                  <MenuItem onClick={() => setFilteredData(null)}>
                    Clear Filter
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </Flex>
        )}
      </Flex>

      {/* Add / Edit Button */}
      {!hide && (
        <Flex
          justify={display ? "flex-start" : "flex-start"}
          mt="10px"
          w={["100%", "100%", "50%", "37%"]}
        >
          {display ? (
            <Button rightIcon={<MdModeEdit />} onClick={editRecord} w="144px">
              Edit
            </Button>
          ) : (
            <Button rightIcon={<SlPlus />} onClick={addNew} w="144px">
              Add New
            </Button>
          )}
        </Flex>
      )}

      {/* Display Record */}
      {display && (
        <Box mt="20px" overflowX="auto">
          <Text mb="20px" fontWeight="700" fontSize="16px" color="blue.blue500">
            Previous Anaesthesia Form
          </Text>

          <HStack
            bg="orange.orange500"
            py="10px"
            px="10px"
            rounded="10px"
            color="blue.blue500"
            justify="space-between"
            fontStyle="italic"
            fontSize="14px"
            fontWeight="500"
          >
            <HStack>
              <BsCalendar2DateFill />
              <Text>{moment(display.createdAt).format("L")}</Text>
            </HStack>
            <HStack>
              <FaClock />
              <Text>{moment(display.createdAt).format("LT")}</Text>
            </HStack>
          </HStack>

          {/* Details */}
          <Text
            mt="12px"
            mb="5"
            fontSize="15px"
            fontWeight="700"
            color="blue.blue500"
          >
            Anaesthesia Details
          </Text>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
            <PreviewCard
              title="Pre-op Assessment"
              value={display.preopeassessment}
            />
            <PreviewCard title="Allergies" value={display.allergies} />
            <PreviewCard title="Weight" value={display.weight} />
            <PreviewCard title="ASA Grade" value={display.asa} />
            <PreviewCard title="Temperature" value={display.temp} />
            <PreviewCard title="Premedication" value={display.premedication} />
            <PreviewCard
              title="Time Given Premedication"
              value={moment(display.timegivenpremedication).format("L")}
            />
            <PreviewCard
              title="Time of Last Food"
              value={moment(display.timeoflastfood).format("L")}
            />
            <PreviewCard title="V-line Site" value={display.vlinesite} />
            <PreviewCard title="Cannula Size" value={display.cannulasize} />
          </SimpleGrid>

          {/* Technique */}
          {display.technique?.length > 0 && (
            <>
              <Text
                mt="12px"
                mb="5"
                fontSize="15px"
                fontWeight="700"
                color="blue.blue500"
              >
                Technique
              </Text>
              {display.technique.map((item, i) => (
                <Box key={i} mb="2">
                  <PreviewCardV2 value={item} />
                </Box>
              ))}
            </>
          )}

          {/* Input / Output */}
          <Text
            mt="12px"
            mb="5"
            fontSize="15px"
            fontWeight="700"
            color="blue.blue500"
          >
            Input / Output
          </Text>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
            <PreviewCard title="Blood Loss" value={display.bloodloss} />
            <PreviewCard title="Total Input" value={display.totalinput} />
          </SimpleGrid>

          {/* Post Instructions */}
          {display.postofinstruction?.length > 0 && (
            <>
              <Text
                mt="12px"
                mb="5"
                fontSize="15px"
                fontWeight="700"
                color="blue.blue500"
              >
                Post Instructions
              </Text>
              {display.postofinstruction.map((item, i) => (
                <Box key={i} mb="2">
                  <PreviewCardV2 value={item} />
                </Box>
              ))}
            </>
          )}

          {/* Drugs Given */}
          {display.druggiven?.length > 0 && (
            <>
              <Text
                mt="12px"
                mb="5"
                fontSize="15px"
                fontWeight="700"
                color="blue.blue500"
              >
                Drugs Given
              </Text>
              {display.druggiven.map((item, i) => (
                <Box key={i} mb="2">
                  <PreviewCardV2 value={item} />
                </Box>
              ))}
            </>
          )}

          {/* Fluids/Food Given */}
          {display.fluidsfoodgiven?.length > 0 && (
            <>
              <Text
                mt="12px"
                mb="5"
                fontSize="15px"
                fontWeight="700"
                color="blue.blue500"
              >
                Fluids/Food Given
              </Text>
              {display.fluidsfoodgiven.map((item, i) => (
                <Box key={i} mb="2">
                  <PreviewCardV2 value={item} />
                </Box>
              ))}
            </>
          )}
        </Box>
      )}
    </Box>
  );
}
