import React, { useState, useEffect } from "react";
import { Text, Flex, HStack, Box, useDisclosure } from "@chakra-ui/react";
import {
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
import ShowToast from "../Components/ToastNotification";
import { IoFilter } from "react-icons/io5";
import { BiSearch } from "react-icons/bi";
import { GetPreviousEyeRecordsApi } from "../Utils/ApiCalls";
import Preloader from "../Components/Preloader";
import { SlPlus } from "react-icons/sl";
import { useNavigate, useLocation } from "react-router-dom";
import { FaClock } from "react-icons/fa";
import { BsCalendar2DateFill } from "react-icons/bs";

// Utility function to convert camelCase to readable title
const formatFieldName = (fieldName) => {
  return fieldName
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

// Utility function to check if a value is a date string
const isDateString = (value) => {
  return (
    typeof value === "string" && moment(value, moment.ISO_8601, true).isValid()
  );
};

// Utility function to format date values
const formatDateValue = (value) => {
  if (isDateString(value)) {
    return moment(value).format("LL");
  }
  return value;
};

// Utility function to process preliminary test data
const processPreliminaryTestData = (preliminaryTest) => {
  const stringFields = ["eyeColour", "hyperEye", "npc", "stereopsis"];
  const complexFields = {};
  const others = {};

  Object.keys(preliminaryTest).forEach((key) => {
    if (stringFields.includes(key)) {
      others[key] = preliminaryTest[key];
    } else if (key !== "_id" && key !== "createdAt" && key !== "updatedAt") {
      complexFields[key] = preliminaryTest[key];
    }
  });

  return { complexFields, others };
};

// Render function for OD/OS pairs
const renderODOSPairs = (data, title) => {
  if (!data || (!data.OD && !data.OS)) return null;

  return (
    <Box>
      <Text
        fontSize="15px"
        mt="12px"
        fontWeight={"700"}
        textTransform="capitalize"
        color="blue.blue500"
      >
        {formatFieldName(title)}
      </Text>
      <SimpleGrid
        mt="12px"
        mb="5"
        columns={{ base: 1, md: 2, lg: 2 }}
        spacing={5}
      >
        {data.OD && <PreviewCard title="OD" value={data.OD} />}
        {data.OS && <PreviewCard title="OS" value={data.OS} />}
      </SimpleGrid>
    </Box>
  );
};

// Render function for visual acuity structures (far/near/pH)
const renderVisualAcuity = (data, title) => {
  if (!data) return null;

  const hasData = Object.values(data).some(
    (section) => section && Object.values(section).some((value) => value)
  );

  if (!hasData) return null;

  return (
    <Box>
      <Text
        fontSize="15px"
        mt="12px"
        fontWeight={"700"}
        textTransform="capitalize"
        color="blue.blue500"
      >
        {formatFieldName(title)}
      </Text>
      {data.far && (
        <SimpleGrid
          mt="12px"
          mb="5"
          columns={{ base: 1, md: 2, lg: 2 }}
          spacing={5}
        >
          {data.far.DIST && (
            <PreviewCard title="(Far, Dist.)" value={data.far.DIST} />
          )}
          {data.far.OD && <PreviewCard title="(Far, OD)" value={data.far.OD} />}
          {data.far.OS && <PreviewCard title="(Far, OS)" value={data.far.OS} />}
          {data.far.OU && <PreviewCard title="(Far, OU)" value={data.far.OU} />}
        </SimpleGrid>
      )}
      {data.near && (
        <SimpleGrid
          mt="12px"
          mb="5"
          columns={{ base: 1, md: 2, lg: 2 }}
          spacing={5}
        >
          {data.near.DIST && (
            <PreviewCard title="(Near, Dist.)" value={data.near.DIST} />
          )}
          {data.near.OD && (
            <PreviewCard title="(Near, OD)" value={data.near.OD} />
          )}
          {data.near.OS && (
            <PreviewCard title="(Near, OS)" value={data.near.OS} />
          )}
          {data.near.OU && (
            <PreviewCard title="(Near, OU)" value={data.near.OU} />
          )}
        </SimpleGrid>
      )}
      {data.pH && (
        <SimpleGrid
          mt="12px"
          mb="5"
          columns={{ base: 1, md: 2, lg: 2 }}
          spacing={5}
        >
          {data.pH.DIST && (
            <PreviewCard title="(pH, Dist.)" value={data.pH.DIST} />
          )}
          {data.pH.OD && <PreviewCard title="(pH, OD)" value={data.pH.OD} />}
          {data.pH.OS && <PreviewCard title="(pH, OS)" value={data.pH.OS} />}
          {data.pH.OU && <PreviewCard title="(pH, OU)" value={data.pH.OU} />}
        </SimpleGrid>
      )}
    </Box>
  );
};

// Render function for light projection
const renderLightProjection = (data, title) => {
  if (!data || (!data.OD && !data.OS)) return null;

  return (
    <Box>
      <Text
        fontSize="15px"
        mt="12px"
        fontWeight={"700"}
        textTransform="capitalize"
        color="blue.blue500"
      >
        {formatFieldName(title)}
      </Text>
      {data.OD && (
        <SimpleGrid
          mt="12px"
          mb="5"
          columns={{ base: 1, md: 2, lg: 2 }}
          spacing={5}
        >
          {data.OD.top && <PreviewCard title="OD Top" value={data.OD.top} />}
          {data.OD.bottom && (
            <PreviewCard title="OD Bottom" value={data.OD.bottom} />
          )}
          {data.OD.left && <PreviewCard title="OD Left" value={data.OD.left} />}
          {data.OD.right && (
            <PreviewCard title="OD Right" value={data.OD.right} />
          )}
        </SimpleGrid>
      )}
      {data.OS && (
        <SimpleGrid
          mt="12px"
          mb="5"
          columns={{ base: 1, md: 2, lg: 2 }}
          spacing={5}
        >
          {data.OS.top && <PreviewCard title="OS Top" value={data.OS.top} />}
          {data.OS.bottom && (
            <PreviewCard title="OS Bottom" value={data.OS.bottom} />
          )}
          {data.OS.left && <PreviewCard title="OS Left" value={data.OS.left} />}
          {data.OS.right && (
            <PreviewCard title="OS Right" value={data.OS.right} />
          )}
        </SimpleGrid>
      )}
    </Box>
  );
};

// Render function for pachymetry/tonometry with name and date/time
const renderNameDatePairs = (data, title) => {
  if (!data || (!data.OD && !data.OS)) return null;

  return (
    <Box>
      <Text
        fontSize="15px"
        mt="12px"
        fontWeight={"700"}
        textTransform="capitalize"
        color="blue.blue500"
      >
        {formatFieldName(title)}
      </Text>
      {data.OD && (
        <SimpleGrid
          mt="12px"
          mb="5"
          columns={{ base: 1, md: 2, lg: 2 }}
          spacing={5}
        >
          {data.OD.name && <PreviewCard title="OD Name" value={data.OD.name} />}
          {data.OD.date && (
            <PreviewCard
              title="OD Date"
              value={formatDateValue(data.OD.date)}
            />
          )}
          {data.OD.methodOrTime && (
            <PreviewCard
              title="OD Time"
              value={formatDateValue(data.OD.methodOrTime)}
            />
          )}
        </SimpleGrid>
      )}
      {data.OS && (
        <SimpleGrid
          mt="12px"
          mb="5"
          columns={{ base: 1, md: 2, lg: 2 }}
          spacing={5}
        >
          {data.OS.name && <PreviewCard title="OS Name" value={data.OS.name} />}
          {data.OS.date && (
            <PreviewCard
              title="OS Date"
              value={formatDateValue(data.OS.date)}
            />
          )}
          {data.OS.methodOrTime && (
            <PreviewCard
              title="OS Time"
              value={formatDateValue(data.OS.methodOrTime)}
            />
          )}
        </SimpleGrid>
      )}
    </Box>
  );
};

// Render function for glaucoma flowsheet
const renderGlaucomaFlowsheet = (data, title) => {
  if (!data) return null;

  return (
    <Box>
      <Text
        fontSize="15px"
        mt="12px"
        fontWeight={"700"}
        textTransform="capitalize"
        color="blue.blue500"
      >
        {formatFieldName(title)}
      </Text>
      {data.visualFields && (
        <SimpleGrid
          mt="12px"
          mb="5"
          columns={{ base: 1, md: 2, lg: 2 }}
          spacing={5}
        >
          {data.visualFields.OD && (
            <PreviewCard
              title="Visual Fields OD"
              value={data.visualFields.OD}
            />
          )}
          {data.visualFields.OS && (
            <PreviewCard
              title="Visual Fields OS"
              value={data.visualFields.OS}
            />
          )}
        </SimpleGrid>
      )}
      {data.cupDiskRatio && (
        <SimpleGrid
          mt="12px"
          mb="5"
          columns={{ base: 1, md: 2, lg: 2 }}
          spacing={5}
        >
          {data.cupDiskRatio.OD && (
            <PreviewCard
              title="Cup Disk Ratio OD"
              value={data.cupDiskRatio.OD}
            />
          )}
          {data.cupDiskRatio.OS && (
            <PreviewCard
              title="Cup Disk Ratio OS"
              value={data.cupDiskRatio.OS}
            />
          )}
        </SimpleGrid>
      )}
      {data.iop && (
        <SimpleGrid
          mt="12px"
          mb="5"
          columns={{ base: 1, md: 2, lg: 2 }}
          spacing={5}
        >
          {data.iop.OD && <PreviewCard title="IOP OD" value={data.iop.OD} />}
          {data.iop.OS && <PreviewCard title="IOP OS" value={data.iop.OS} />}
        </SimpleGrid>
      )}
    </Box>
  );
};

// Render function for simple key-value objects
const renderSimpleObject = (data, title) => {
  if (!data || typeof data !== "object") return null;

  const hasData = Object.values(data).some((value) => value);
  if (!hasData) return null;

  return (
    <Box>
      <Text
        fontSize="15px"
        mt="12px"
        fontWeight={"700"}
        textTransform="capitalize"
        color="blue.blue500"
      >
        {formatFieldName(title)}
      </Text>
      <SimpleGrid
        mt="12px"
        mb="5"
        columns={{ base: 1, md: 2, lg: 2 }}
        spacing={5}
      >
        {Object.entries(data).map(
          ([key, value]) =>
            value && (
              <PreviewCard
                key={key}
                title={formatFieldName(key)}
                value={value}
              />
            )
        )}
      </SimpleGrid>
    </Box>
  );
};

// Main render function for preliminary test fields
const renderPreliminaryTestFields = (preliminaryTest) => {
  const { complexFields, others } = processPreliminaryTestData(preliminaryTest);

  return (
    <>
      {/* Render complex fields dynamically */}
      {Object.entries(complexFields).map(([fieldName, fieldData]) => {
        if (!fieldData) return null;

        // Visual acuity fields
        if (fieldName.includes("visualAcuity")) {
          return (
            <React.Fragment key={fieldName}>
              {renderVisualAcuity(fieldData, fieldName)}
            </React.Fragment>
          );
        }

        // Light projection
        if (fieldName === "lightProjection") {
          return (
            <React.Fragment key={fieldName}>
              {renderLightProjection(fieldData, fieldName)}
            </React.Fragment>
          );
        }

        // Pachymetry and tonometry
        if (fieldName === "pachymetry" || fieldName === "tonometry") {
          return (
            <React.Fragment key={fieldName}>
              {renderNameDatePairs(fieldData, fieldName)}
            </React.Fragment>
          );
        }

        // Glaucoma flowsheet
        if (fieldName === "glaucomaFlowsheet") {
          return (
            <React.Fragment key={fieldName}>
              {renderGlaucomaFlowsheet(fieldData, fieldName)}
            </React.Fragment>
          );
        }

        // Pupillary distance (far/near structure)
        if (
          fieldName === "pupillaryDistance" &&
          fieldData.far &&
          fieldData.near
        ) {
          return (
            <React.Fragment key={fieldName}>
              {renderVisualAcuity(fieldData, fieldName)}
            </React.Fragment>
          );
        }

        // Simple OD/OS pairs
        if (fieldData.OD !== undefined || fieldData.OS !== undefined) {
          return (
            <React.Fragment key={fieldName}>
              {renderODOSPairs(fieldData, fieldName)}
            </React.Fragment>
          );
        }

        // Simple objects
        return (
          <React.Fragment key={fieldName}>
            {renderSimpleObject(fieldData, fieldName)}
          </React.Fragment>
        );
      })}

      {/* Render others section for string fields */}
      {Object.keys(others).length > 0 && (
        <Box>
          <Text
            fontSize="15px"
            mt="12px"
            fontWeight={"700"}
            textTransform="capitalize"
            color="blue.blue500"
          >
            Others
          </Text>
          <SimpleGrid
            mt="12px"
            mb="5"
            columns={{ base: 1, md: 2, lg: 2 }}
            spacing={5}
          >
            {Object.entries(others).map(
              ([key, value]) =>
                value && (
                  <PreviewCard
                    key={key}
                    title={formatFieldName(key)}
                    value={value}
                  />
                )
            )}
          </SimpleGrid>
        </Box>
      )}
    </>
  );
};

export default function EyePreliminaryTest({ hide = false, index }) {
  const [IsLoading, setIsLoading] = useState(true);
  const [All, setAll] = useState(true);
  const [InProgress, setInProgress] = useState(false);
  const [Completed, setCompleted] = useState(false);
  const [Data, setData] = useState([]);

  const [FilterData, setFilterData] = useState([]);
  const { isOpen } = useDisclosure();

  // Search Filter settings to follow
  const [SearchInput, setSearchInput] = useState("");

  const [FilteredData, setFilteredData] = useState(null);

  const filterBy = (title) => {
    if (title === "appointmentId") {
      let filter = Data.filter((item) =>
        item.appointmentid?.toLowerCase().includes(SearchInput.toLowerCase())
      );
      setFilteredData(filter);
    } else if (title === "appointmentCategory") {
      let filter = Data.filter((item) =>
        item.appointmentcategory
          ?.toLowerCase()
          .includes(SearchInput.toLowerCase())
      );
      setFilteredData(filter);
    } else if (title === "appointmentType") {
      let filter = Data.filter(
        (item) =>
          item.appointmenttype
            ?.toLowerCase()
            .includes(SearchInput.toLowerCase()) ||
          item.lastName?.toLowerCase().includes(SearchInput.toLowerCase())
      );
      setFilteredData(filter);
    }
  };

  // Search Filter settings to follow end here

  let id = localStorage.getItem("appointmentId");
  let PatientId = localStorage.getItem("patientId");

  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    status: "",
  });

  const GetSingleRecord = async () => {
    setIsLoading(true);

    try {
      const result = await GetPreviousEyeRecordsApi(PatientId);

      console.log("GetSingleRecord", result);

      if (result.status === "success") {
        setIsLoading(false);
        setData(result.data);
      }
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
      setShowToast({
        show: false,
      });
    }, 10000);
  };

  const filterAll = () => {
    setAll(true);
    setInProgress(false);
    setCompleted(false);
    setFilterData(Data);
  };

  const filterInProgress = () => {
    setAll(false);
    setInProgress(true);
    setCompleted(false);

    const filterData = Data.filter((item) => item.status === "inprogress");

    setFilterData(filterData);
  };
  const filterCompleted = () => {
    setAll(false);
    setInProgress(false);
    setCompleted(true);

    const filterData = Data.filter((item) => item.status === "complete");

    setFilterData(filterData);
  };

  const nav = useNavigate();
  const { pathname } = useLocation();

  const AddPreliminaryTest = () => {
    nav(`/dashboard/add-eye-preliminary-test/${id}`);
    localStorage.setItem("pathname", pathname);
  };

  const ViewLabResult = (id) => {
    nav(`/dashboard/lab-process/report/${id}`);
    localStorage.setItem("pathname", pathname);
  };

  useEffect(() => {
    GetSingleRecord();
  }, [isOpen, index]);

  return (
    <Box
      bg="#fff"
      border="1px solid #EFEFEF"
      mt="10px"
      py="17px"
      px={["18px", "18px"]}
      rounded="10px"
    >
      {IsLoading && <Preloader />}

      {showToast.show && (
        <ShowToast message={showToast.message} status={showToast.status} />
      )}
      {/* filter section  */}
      <Flex justifyContent="space-between" flexWrap="wrap">
        <Flex
          alignItems="center"
          flexWrap="wrap"
          bg="#E4F3FF"
          rounded="7px"
          py="3.5px"
          px="5px"
          cursor="pointer"
          mt={["10px", "10px", "0px", "0px"]}
        >
          <Box borderRight="1px solid #EDEFF2" pr="5px" onClick={filterAll}>
            <Text
              py="8.5px"
              px="12px"
              bg={All ? "#fff" : "transparent"}
              rounded="7px"
              color={"#1F2937"}
              fontWeight={"500"}
              fontSize={"13px"}
            >
              All{" "}
              <Box color="#667085" as="span" fontWeight="400" fontSize="13px">
                ({Data?.length})
              </Box>
            </Text>
          </Box>

          <Box
            borderRight="1px solid #EDEFF2"
            pr="5px"
            onClick={filterInProgress}
          >
            <Text
              py="8.5px"
              px="12px"
              bg={InProgress ? "#fff" : "transparent"}
              rounded="7px"
              color={"#1F2937"}
              fontWeight={"500"}
              fontSize={"13px"}
            >
              In Progress
            </Text>
          </Box>
          <Box
            borderRight="1px solid #EDEFF2"
            pr="5px"
            onClick={filterCompleted}
          >
            <Text
              py="8.5px"
              px="12px"
              bg={Completed ? "#fff" : "transparent"}
              rounded="7px"
              color={"#1F2937"}
              fontWeight={"500"}
              fontSize={"13px"}
            >
              Completed
            </Text>
          </Box>
        </Flex>

        {hide === false && (
          <Flex
            flexWrap="wrap"
            mt={["10px", "10px", "0px", "0px"]}
            alignItems="center"
            justifyContent={"flex-end"}
          >
            <HStack>
              <Input
                label="Search"
                onChange={(e) => setSearchInput(e.target.value)}
                value={SearchInput}
                bColor="#E4E4E4"
                leftIcon={<BiSearch />}
              />

              <Menu isLazy>
                <MenuButton as={Box}>
                  <HStack
                    border="1px solid #EA5937"
                    rounded="7px"
                    cursor="pointer"
                    py="11.64px"
                    px="16.98px"
                    bg="#f8ddd1"
                    color="blue.blue500"
                    fontWeight="500"
                    fontSize="14px"
                  >
                    <Text>Filter</Text>
                    <IoFilter />
                  </HStack>
                </MenuButton>
                <MenuList>
                  <MenuItem
                    onClick={() => filterBy("appointmentId")}
                    textTransform="capitalize"
                    fontWeight={"500"}
                    color="#2F2F2F"
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                  >
                    <HStack fontSize="14px">
                      <Text>by Appointment ID</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem
                    onClick={() => filterBy("appointmentCategory")}
                    textTransform="capitalize"
                    fontWeight={"500"}
                    color="#2F2F2F"
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                  >
                    <HStack fontSize="14px">
                      <Text>by Appointment Category</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem
                    onClick={() => filterBy("appointmentType")}
                    textTransform="capitalize"
                    fontWeight={"500"}
                    color="#2F2F2F"
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                  >
                    <HStack fontSize="14px">
                      <Text>by Appointment Type</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setFilteredData(null);
                      setSearchInput("");
                    }}
                    textTransform="capitalize"
                    fontWeight={"500"}
                    color="#2F2F2F"
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                  >
                    <HStack fontSize="14px">
                      <Text>clear filter</Text>
                    </HStack>
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </Flex>
        )}
      </Flex>

      {hide === false && (
        <Flex
          justifyContent="space-between"
          flexWrap="wrap"
          mt={["10px", "10px", "10px", "10px"]}
          w={["100%", "100%", "50%", "37%"]}
        >
          <Button
            w={["100%", "100%", "220px", "220px"]}
            onClick={AddPreliminaryTest}
            rightIcon={<SlPlus />}
          >
            Add Preliminary Test
          </Button>
        </Flex>
      )}

      {/* filter section end here */}

      <Box
        bg="#fff"
        border="1px solid #EFEFEF"
        mt="12px"
        py="15px"
        px="15px"
        rounded="10px"
        overflowX="auto"
      >
        <Text mb="20px" fontWeight="700" fontSize="16px" color="blue.blue500">
          Previous Preliminary Test
        </Text>

        {Data.map((item, i) => (
          <Box key={i} mt="20px">
            <HStack
              bg="orange.orange500"
              py="10px"
              px="10px"
              rounded="10px"
              color="blue.blue500"
              justifyContent="space-between"
              fontStyle="italic"
              fontSize="14px"
              fontWeight="500"
            >
              <HStack>
                <Box color="blue.blue500">
                  <BsCalendar2DateFill />
                </Box>
                <Text textAlign="center">
                  {moment(item.createdAt).format("L")}{" "}
                </Text>
                <Box color="blue.blue500">
                  <FaClock />
                </Box>
                <Text textAlign="center">
                  {" "}
                  {moment(item.createdAt).format("LT")}{" "}
                </Text>
              </HStack>
            </HStack>
            {item.doctor && (
              <Box>
                <Text
                  fontSize="15px"
                  mt="12px"
                  fontWeight={"700"}
                  textTransform="capitalize"
                  color="blue.blue500"
                >
                  Doctors Details
                </Text>
                <SimpleGrid
                  mt="12px"
                  mb="5"
                  columns={{ base: 1, md: 2, lg: 2 }}
                  spacing={5}
                >
                  <PreviewCard
                    title="first name"
                    value={item.doctor?.firstName}
                  />
                  <PreviewCard
                    title="last name"
                    value={item.doctor?.lastName}
                  />
                  <PreviewCard title="email" value={item.doctor?.email} />
                  <PreviewCard
                    title="phone number"
                    value={item.doctor?.phoneNumber}
                  />
                  <PreviewCard
                    title="Specialization details"
                    value={item.doctor?.specializationDetails}
                  />
                  <PreviewCard title="staff id" value={item.doctor?.staffId} />
                </SimpleGrid>
              </Box>
            )}
            {item.preliminaryTest &&
              renderPreliminaryTestFields(item.preliminaryTest)}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
