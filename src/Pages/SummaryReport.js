import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MainLayout from "../Layouts/Index";
import { Text, Flex, HStack, Box, useDisclosure } from "@chakra-ui/react";
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
  SimpleGrid,
  Select,
} from "@chakra-ui/react";
import * as XLSX from "xlsx/xlsx.mjs";
import TableRow from "../Components/TableRow";
import Button from "../Components/Button";
import Input from "../Components/Input";
import Preloader from "../Components/Preloader";
import ShowToast from "../Components/ToastNotification";
import { CgSearch } from "react-icons/cg";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import CreateUserModal from "../Components/CreateUserModal";
import BulkUploadModal from "../Components/BulkUploadModal";
import {
  GetFullReportSummaryApi,
  UpdateUserStatusApi,
  GetReportSummarySettingsApi,
} from "../Utils/ApiCalls";
import moment from "moment";
import Seo from "../Utils/Seo";
import { FaCalendarAlt } from "react-icons/fa";
import { IoFilter } from "react-icons/io5";
import { HiOutlineDocumentArrowUp } from "react-icons/hi2";
import { BiSearch } from "react-icons/bi";
import { SlPlus } from "react-icons/sl";
import Pagination from "../Components/Pagination";
import { configuration } from "../Utils/Helpers";
import { useColors } from "../Utils/colors";

export default function SummaryReport() {
  const {
    bgColor,
    textColor,
    borderColor,
    titleTextColor,
    subTitleTextColor,
    chartFillColor,
    primaryColor,
    secondaryColor,
    NavListBg,
  } = useColors();
  const [IsLoading, setIsLoading] = useState(true);
  const [Loading, setLoading] = useState(false);
  const [All, setAll] = useState(true);
  const [Active, setActive] = useState(false);
  const [InActive, setInActive] = useState(false);
  const [Trigger, setTrigger] = useState(false);
  const [Data, setData] = useState([]);
  const [FilterData, setFilterData] = useState([]);
  const [ModalState, setModalState] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [FilterUser, setFilterUser] = useState({});

  // filter by date
  const [ByDate, setByDate] = useState(false);
  const [StartDate, setStartDate] = useState("");
  const [EndDate, setEndDate] = useState("");

  // Pagination settings to follow
  const [CurrentPage, setCurrentPage] = useState(1);
  const [PostPerPage, setPostPerPage] = useState(configuration.sizePerPage);

  //get current post
  const indexOfLastSra = CurrentPage * PostPerPage;
  const indexOfFirstSra = indexOfLastSra - PostPerPage;
  const PaginatedData = FilterData.slice(indexOfFirstSra, indexOfLastSra);
  //change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Pagination settings to follow end here

  const [QuerySettings, setQuerySettings] = useState([]);
  const [QueryType, setQueryType] = useState("");
  const [QueryGroup, setQueryGroup] = useState("");
  const [QueryStartDate, setQueryStartDate] = useState("");
  const [QueryEndDate, setQueryEndDate] = useState("");

  // Search Filter settings to follow
  const [SearchInput, setSearchInput] = useState("");
  const [FilteredData, setFilteredData] = useState(null);

  const handleInputChange = (e) => {
    let filter = Data.filter(
      (item) =>
        item.role?.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.email?.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.firstName?.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.lastName?.toLowerCase().includes(e.target.value.toLowerCase())
    );
    console.log("filter checking", filter);
    setFilteredData(filter);
    setSearchInput(e.target.value);
  };

  const filterBy = (title) => {
    console.log("filter checking", title);

    if (title === "role") {
      let filter = Data.filter((item) =>
        item.role?.toLowerCase().includes(SearchInput.toLowerCase())
      );
      setFilteredData(filter);
      console.log("filter checking", filter);
    } else if (title === "email") {
      let filter = Data.filter((item) =>
        item.email?.toLowerCase().includes(SearchInput.toLowerCase())
      );
      setFilteredData(filter);
      console.log("filter checking", filter);
    } else if (title === "name") {
      let filter = Data.filter(
        (item) =>
          item.firstName?.toLowerCase().includes(SearchInput.toLowerCase()) ||
          item.lastName?.toLowerCase().includes(SearchInput.toLowerCase())
      );
      setFilteredData(filter);
      console.log("filter checking", filter);
    } else if (title === "date") {
      // add 1 day to end date
      let endDate = new Date(EndDate);
      endDate.setDate(endDate.getDate() + 1);
      // format date back
      let formatedEndDate = endDate.toISOString().split("T")[0];
      let filter = Data.filter(
        (item) =>
          item.createdAt >= StartDate && item.createdAt <= formatedEndDate
      );
      setFilteredData(filter);
      setSearchInput("s");
      console.log(" Date filter checking", filter);
      console.log(" Date plus  checking", endDate.toISOString());
    }
  };

  // Search Filter settings to follow end here

  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    status: "",
  });

  const nav = useNavigate();
  const { pathname } = useLocation();

  const fetchReport = async () => {
    setLoading(true);
    try {
      const result = await GetFullReportSummaryApi(
        QueryType,
        QueryStartDate,
        QueryEndDate
      );

      console.log("result GetFullReportSummaryApi", result);

      if (result.status === true) {
        setLoading(false);
        localStorage.setItem("pathname", pathname);
        localStorage.setItem(
          "dateRange",
          JSON.stringify({
            from: QueryStartDate,
            to: QueryEndDate,
          })
        );
        if (QueryType === "financialaggregate") {
          let arr = [...result.queryresult?.paid];
          localStorage.setItem("reportSummary", JSON.stringify(arr));
          localStorage.setItem(
            "reportGrandTotal",
            JSON.stringify(result.queryresult?.grandtotal[0])
          );
          localStorage.setItem("reportCategory", QueryType);
          nav("/dashboard/report-analytics/print-summary");
        } else if (QueryType === "cashieraggregate") {
          let arr = [...result.queryresult?.paid];
          localStorage.setItem("reportSummary", JSON.stringify(arr));
          localStorage.setItem(
            "reportGrandTotal",
            JSON.stringify(result.queryresult?.grandtotal[0])
          );
          localStorage.setItem("reportCategory", QueryType);
          nav("/dashboard/report-analytics/print-summary");
        } else if (QueryType === "appointmentaggregate") {
          let arr = [
            ...result.queryresult?.complete,
            ...result.queryresult?.inprogress,
            ...result.queryresult?.scheduled,
          ];
          localStorage.setItem("reportSummary", JSON.stringify(arr));
          localStorage.setItem(
            "reportGrandTotal",
            JSON.stringify(result.queryresult?.totalnumberofappointments[0])
          );
          localStorage.setItem("reportCategory", QueryType);
          nav("/dashboard/report-analytics/print-summary");
        } else if (QueryType === "admissionaggregate") {
          let arr = [
            ...result.queryresult?.admited,
            ...result.queryresult?.discharged,
            ...result.queryresult?.transfered,
          ];
          localStorage.setItem("reportSummary", JSON.stringify(arr));
          localStorage.setItem(
            "reportGrandTotal",
            JSON.stringify(result.queryresult?.totalnumberofadmissions[0])
          );

          localStorage.setItem("reportCategory", QueryType);
          nav("/dashboard/report-analytics/print-summary");
        } else if (QueryType === "procedureaggregate") {
          let arr = [...result.queryresult?.paid];
          localStorage.setItem("reportSummary", JSON.stringify(arr));
          localStorage.setItem("reportCategory", QueryType);
          localStorage.setItem(
            "procedureGrandTotal",
            JSON.stringify(result.queryresult?.grandtotal[0])
          );
          nav("/dashboard/report-analytics/print-summary");
        } else if (QueryType === "clinicalaggregate") {
          let arr = [...result.queryresult?.clinicalreport];
          localStorage.setItem("reportSummary", JSON.stringify(arr));
          localStorage.setItem("reportCategory", QueryType);
          nav("/dashboard/report-analytics/print-summary");
        } else if (QueryType === "hmoaggregate") {
          localStorage.setItem(
            "reportSummary",
            JSON.stringify(result.queryresult)
          );
          localStorage.setItem("reportCategory", QueryType);
          nav("/dashboard/report-analytics/print-summary");
        } else if (QueryType === "nutritionaggregate") {
          localStorage.setItem(
            "reportSummary",
            JSON.stringify(result.queryresult)
          );
          localStorage.setItem("reportCategory", QueryType);
          nav("/dashboard/report-analytics/print-summary");
        } // Handle Health Facility Attendance Report
        else if (QueryType === "health facility attendance") {
          console.log(
            "Processing healthfacilityattendance data:",
            result.queryresult
          );
          // Calculate totals
          const totalOutpatient =
            result.queryresult.outpatientattendance.reduce(
              (sum, item) => sum + item.count,
              0
            );
          const totalGeneral = result.queryresult.generalattendance.reduce(
            (sum, item) => sum + item.count,
            0
          );

          localStorage.setItem(
            "reportSummary",
            JSON.stringify(result.queryresult)
          );
          localStorage.setItem("reportCategory", QueryType);
          localStorage.setItem(
            "reportGrandTotal",
            JSON.stringify({ totalOutpatient, totalGeneral })
          );
          nav("/dashboard/report-analytics/print-summary");
        }
        // Handle Inpatient Care Report
        else if (QueryType === "inpatient care") {
          console.log("Processing inpatient data:", result.queryresult);
          // Calculate total
          const totalInpatient = result.queryresult.reduce(
            (sum, item) => sum + item.count,
            0
          );

          localStorage.setItem(
            "reportSummary",
            JSON.stringify(result.queryresult)
          );
          localStorage.setItem("reportCategory", QueryType);
          localStorage.setItem(
            "reportGrandTotal",
            JSON.stringify({ totalInpatient })
          );
          nav("/dashboard/report-analytics/print-summary");
        } else if (QueryType === "Family Planning") {
          // Process family planning data
          const totals = {
            oralPillClients:
              result.queryresult.clientsgivenoralpill?.[0]
                ?.uniqueOralPillsPatients || 0,
            oralPillCycles:
              result.queryresult.oralpillcyclesdispensed?.[0]
                ?.totalCyclesDispensed || 0,
            injectables:
              result.queryresult.injectablesgiven?.[0]?.totalQuantity || 0,
            implants:
              result.queryresult.Implantsinserted?.[0]?.totalInsertions || 0,
            iuds: result.queryresult.iudInserteds?.[0]?.totalInsertions || 0,
            postpartumIUDs:
              result.queryresult.postpartumIUDinserted?.[0]
                ?.postPartumIUDInserted || 0,
          };

          localStorage.setItem(
            "reportSummary",
            JSON.stringify(result.queryresult)
          );
          localStorage.setItem("reportCategory", QueryType);
          localStorage.setItem("reportGrandTotal", JSON.stringify(totals));
          nav("/dashboard/report-analytics/print-summary");
        } else if (QueryType === "inpatients records") {
          localStorage.setItem(
            "reportSummary",
            JSON.stringify(result.queryresult)
          );
          localStorage.setItem("reportCategory", QueryType);
          nav("/dashboard/report-analytics/print-summary");
        } else if (QueryType === "outpatients records") {
          localStorage.setItem(
            "reportSummary",
            JSON.stringify(result.queryresult)
          );
          localStorage.setItem("reportCategory", QueryType);
          nav("/dashboard/report-analytics/print-summary");
        } else if (QueryType === "accident and emergency records") {
          localStorage.setItem(
            "reportSummary",
            JSON.stringify(result.queryresult)
          );
          localStorage.setItem("reportCategory", QueryType);
          nav("/dashboard/report-analytics/print-summary");
        } else if (QueryType === "national health insurance services") {
          const grandTotal = {
            male: 0,
            female: 0,
            total: 0,
          };

          result.queryresult[0].totalPatientsByInsurance.forEach((item) => {
            item.data.forEach((genderData) => {
              if (genderData._id.toLowerCase() === "male") {
                grandTotal.male += genderData.count;
              } else if (genderData._id.toLowerCase() === "female") {
                grandTotal.female += genderData.count;
              }
            });
          });

          grandTotal.total = grandTotal.male + grandTotal.female;

          localStorage.setItem(
            "reportSummary",
            JSON.stringify(result.queryresult[0].totalPatientsByInsurance)
          );
          localStorage.setItem("reportGrandTotal", JSON.stringify(grandTotal));

          localStorage.setItem("reportCategory", QueryType);
          nav("/dashboard/report-analytics/print-summary");
        } else if (
          QueryType === "lab investigation report" ||
          QueryType === "radiology diagnosis" ||
          QueryType === "operation" ||
          QueryType === "special consultative" ||
          QueryType === "immunization"
        ) {
          const grandTotal = Object.values(result.queryresult).reduce(
            (acc, curr) => {
              acc.male += curr.male;
              acc.female += curr.female;
              acc.total += curr.total;
              return acc;
            },
            { male: 0, female: 0, total: 0 }
          );

          localStorage.setItem(
            "reportSummary",
            JSON.stringify(result.queryresult)
          );
          localStorage.setItem("reportGrandTotal", JSON.stringify(grandTotal));
          localStorage.setItem("reportCategory", QueryType);
          nav("/dashboard/report-analytics/print-summary");
        } else if (QueryType === "maternity") {
          const grandTotal = Object.values(result.queryresult).reduce(
            (acc, curr) => {
              acc.male += curr.male || 0;
              acc.female += curr.female || 0;
              acc.total += curr.total || 0;
              return acc;
            },
            { male: 0, female: 0, total: 0 }
          );

          localStorage.setItem(
            "reportSummary",
            JSON.stringify(result.queryresult)
          );
          localStorage.setItem("reportGrandTotal", JSON.stringify(grandTotal));
          localStorage.setItem("reportCategory", QueryType);
          nav("/dashboard/report-analytics/print-summary");
        }
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  const getReportSettings = async () => {
    setIsLoading(true);
    try {
      const result = await GetReportSummarySettingsApi();

      console.log("getReportSettings", result);

      if (result.status === true) {
        setIsLoading(false);
        setQuerySettings(result.querygroupsettings);
      }
    } catch (e) {
      console.log(e.message);
    }
  };

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

    const filterData = Data.filter((item) => item.status === "active");

    setFilterData(filterData);
  };

  const filterInactive = () => {
    setAll(false);
    setActive(false);
    setInActive(true);

    const filterData = Data.filter((item) => item.status === "inactive");

    setFilterData(filterData);
  };

  useEffect(() => {
    getReportSettings();
  }, [isOpen, Trigger]);

  return (
    <MainLayout>
      {IsLoading && <Preloader />}

      <Seo title="User Management" description="Care Connect Patients" />

      {showToast.show && (
        <ShowToast message={showToast.message} status={showToast.status} />
      )}
      <HStack>
        <Text color={titleTextColor} fontWeight="600" fontSize="19px">
          Report Summary
        </Text>
        <Text color={subTitleTextColor} fontWeight="400" fontSize="18px">
          ({Data?.length})
        </Text>
      </HStack>
      <Text color={subTitleTextColor} mt="9px" fontWeight="400" fontSize="15px">
        Access reports, and analytics across departments all in one place
      </Text>
      {/* filters needed for the get full report */}
      <Box
        bg={bgColor}
        border={`1px solid ${borderColor}`}
        mt="12px"
        py="17px"
        px={["18px", "18px"]}
        rounded="10px"
      >
        <SimpleGrid mt="12px" columns={{ base: 2, md: 3 }} spacing={2}>
          <Box>
            <Text color={titleTextColor} fontWeight="500" fontSize="14px">
              Report Category
            </Text>
            <Select
              fontSize={QueryType !== "" ? "16px" : "13px"}
              h="45px"
              borderWidth="2px"
              borderColor={borderColor}
              _hover={{ borderColor: primaryColor }}
              _focus={{ borderColor: primaryColor }}
              textTransform="capitalize"
              value={QueryType}
              onChange={(e) => {
                setQueryType(e.target.value);
                setData([]);
              }}
              placeholder="Select Report Category"
              color={textColor}
            >
              {QuerySettings?.map((item, i) => (
                <option value={`${item}`} key={i}>
                  {item.replace("aggregate", " aggregate")}{" "}
                </option>
              ))}
            </Select>
          </Box>

          <Box>
            <Text color={titleTextColor} fontWeight="500" fontSize="14px">
              Start Date
            </Text>
            <Input
              type="date"
              onChange={(e) => {
                setQueryStartDate(e.target.value);
                setData([]);
              }}
              value={QueryStartDate}
              bColor={borderColor}
              leftIcon={<FaCalendarAlt />}
            />
          </Box>
          <Box>
            <Text color={titleTextColor} fontWeight="500" fontSize="14px">
              End Date
            </Text>
            <Input
              type="date"
              onChange={(e) => {
                setQueryEndDate(e.target.value);
                setData([]);
              }}
              value={QueryEndDate}
              bColor={borderColor}
              leftIcon={<FaCalendarAlt />}
            />
          </Box>
        </SimpleGrid>

        <Flex justifyContent="flex-end" mt="2">
          <Button
            mt={["10px", "10px", "0px", "0px"]}
            isLoading={Loading}
            loadingText="Fetching..."
            w={["100%", "100%", "144px", "144px"]}
            onClick={fetchReport}
            disabled={
              QueryType !== "" && QueryStartDate !== "" && QueryEndDate !== ""
                ? false
                : true
            }
          >
            Fetch Report
          </Button>
        </Flex>
      </Box>
      {/* filters needed for the get full report end heree ....*/}
    </MainLayout>
  );
}
