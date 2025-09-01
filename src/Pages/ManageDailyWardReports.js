import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Select,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  SimpleGrid,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
} from "@chakra-ui/react";
import { BiSearch } from "react-icons/bi";
import { IoFilter } from "react-icons/io5";
import { FaCalendarAlt } from "react-icons/fa";
import TableRowY from "../Components/TableRowY";
import Pagination from "../Components/Pagination";
import ShowToast from "../Components/ToastNotification";
import Input from "../Components/Input";
import Preloader from "../Components/Preloader";
import {
  GetAllWardApi,
  GetAllDailyWardReportsByWardApi,
} from "../Utils/ApiCalls";
import DailyWardReportModal from "../Components/DailyWardReportModal";
import Button from "../Components/Button";
import { configuration } from "../Utils/Helpers";
import { useColors } from "../Utils/colors";

export default function ManageDailyWardReports() {
  const {
    bgColor,
    textColor,
    borderColor,
    titleTextColor,
    selectTitleTextColor,
    subTitleTextColor,
    chartFillColor,
    primaryColor,
    secondaryColor,
    NavListBg,
  } = useColors();
  const [wards, setWards] = useState([]);
  const [selectedWard, setSelectedWard] = useState("");
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const [statusFilter, setStatusFilter] = useState("all");
  const [ByDate, setByDate] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const postPerPage = configuration.sizePerPage;

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    (async () => {
      try {
        const res = await GetAllWardApi();
        setWards(res.queryresult.wardmanagementdetails || []);
      } catch {
        /* ignore */
      }
    })();
  }, []);

  const fetchReports = async () => {
    if (!selectedWard) return;
    setLoading(true);
    setError(null);
    try {
      const res = await GetAllDailyWardReportsByWardApi(selectedWard);
      const data = res.queryresult.dailywardreportsdetails || [];
      setReports(data);
      setFilteredReports(data);
    } catch {
      setError("Failed to load reports");
      setToast({ message: "Failed to load reports", status: "error" });
    } finally {
      setLoading(false);
      setCurrentPage(1);
    }
  };

  useEffect(() => {
    let data = reports;
    if (statusFilter !== "all") {
      data = data.filter((r) => r.ward.status === statusFilter);
    }
    setFilteredReports(data);
    setCurrentPage(1);
  }, [reports, statusFilter]);

  const filterBy = (field) => {
    const q = searchInput.toLowerCase();
    let data = reports.filter((r) =>
      field === "ward"
        ? r.ward.wardname.toLowerCase().includes(q)
        : r.staffname.toLowerCase().includes(q)
    );
    if (statusFilter !== "all") {
      data = data.filter((r) => r.ward.status === statusFilter);
    }
    setFilteredReports(data);
    setCurrentPage(1);
  };

  const filterByDate = () => {
    if (!startDate || !endDate) return;
    const end = new Date(endDate);
    end.setDate(end.getDate() + 1);
    let data = reports.filter((r) => {
      const created = new Date(r.createdAt);
      return created >= new Date(startDate) && created < end;
    });
    if (statusFilter !== "all") {
      data = data.filter((r) => r.ward.status === statusFilter);
    }
    setFilteredReports(data);
    setCurrentPage(1);
  };

  const lastIdx = currentPage * postPerPage;
  const firstIdx = lastIdx - postPerPage;
  const paginated = filteredReports.slice(firstIdx, lastIdx);

  const handleCreateClose = () => {
    setShowCreateModal(false);
    fetchReports();
  };
  const handleEditClose = () => {
    setShowEditModal(false);
    fetchReports();
  };
  const handleViewClose = () => setShowViewModal(false);

  return (
    <Box bg={bgColor} p="18px" rounded="10px">
      {toast && <ShowToast status={toast.status} message={toast.message} />}

      <Button
        mb="4"
        w={["100%", "100%", "144px", "144px"]}
        onClick={() => setShowCreateModal(true)}
      >
        Create Report
      </Button>

      <Text color={primaryColor} fontWeight="400" fontSize="15px" mb="4">
        Kindly select a Ward to manage Daily Ward Reports
      </Text>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb="6">
        <Select
          placeholder="Select Ward"
          value={selectedWard}
          onChange={(e) => setSelectedWard(e.target.value)}
          fontSize={selectedWard ? "16px" : "13px"}
          borderWidth="2px"
          borderColor={borderColor}
          color={selectTitleTextColor}
        >
          {wards.map((w) => (
            <option key={w._id} value={w._id}>
              {w.wardname}
            </option>
          ))}
        </Select>
        <Button
          isLoading={loading}
          disabled={!selectedWard}
          onClick={fetchReports}
        >
          Fetch Reports
        </Button>
      </SimpleGrid>

      <DailyWardReportModal
        isOpen={showCreateModal}
        onClose={handleCreateClose}
        type="new"
        activateNotifications={(msg, status) =>
          setToast({ message: msg, status })
        }
      />
      <DailyWardReportModal
        isOpen={showViewModal}
        onClose={handleViewClose}
        type="view"
        oldPayload={selectedReport}
        activateNotifications={(msg, status) =>
          setToast({ message: msg, status })
        }
      />
      <DailyWardReportModal
        isOpen={showEditModal}
        onClose={handleEditClose}
        type="edit"
        oldPayload={selectedReport}
        activateNotifications={(msg, status) =>
          setToast({ message: msg, status })
        }
      />

      {selectedWard && (
        <>
          <Flex justify="space-between" flexWrap="wrap" mt="20px">
          <Flex
              alignItems="center"
              flexWrap="wrap"
              bg={chartFillColor}
              rounded="7px"
              py="3.5px"
              px="5px"
              cursor="pointer"
            >
              {["All", "Active", "Inactive"].map((s, i) => (
                <Box
                  key={s}
                  pr="5px"
                  borderRight={i < 2 ? "1px solid #EDEFF2" : undefined}
                  onClick={() => setStatusFilter(s.toLowerCase())}
                >
                  <Text
                    py="8.5px"
                    px="12px"
                    bg={
                      statusFilter === s.toLowerCase() ? bgColor : "transparent"
                    }
                    rounded="7px"
                    color={titleTextColor}
                    fontWeight="500"
                    fontSize="13px"
                  >
                    {s} (
                    {
                      reports.filter(
                        (r) => s === "All" || r.ward.status === s.toLowerCase()
                      ).length
                    }
                    )
                  </Text>
                </Box>
              ))}
            </Flex>

            <Flex
              flexWrap="wrap"
              mt={["10px", "10px", "20px", "20px"]}
              alignItems="center"
              justifyContent="flex-end"
            >
              <HStack flexWrap={["wrap", "nowrap"]} spacing={2}>
                {ByDate ? (
                  <HStack flexWrap={["wrap", "nowrap"]} spacing={2}>
                    <Input
                      label="Start Date"
                      type="date"
                      onChange={(e) => setStartDate(e.target.value)}
                      value={startDate}
                      bColor={borderColor}
                      leftIcon={<FaCalendarAlt />}
                    />
                    <Input
                      label="End Date"
                      type="date"
                      onChange={(e) => setEndDate(e.target.value)}
                      value={endDate}
                      bColor={borderColor}
                      leftIcon={<FaCalendarAlt />}
                    />
                    <Flex
                      onClick={filterByDate}
                      cursor="pointer"
                      px="5px"
                      py="3px"
                      rounded="5px"
                      bg={primaryColor}
                      color={bgColor}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <BiSearch />
                    </Flex>
                  </HStack>
                ) : (
                  <Input
                    label="Search"
                    onChange={(e) => setSearchInput(e.target.value)}
                    value={searchInput}
                    bColor={borderColor}
                    leftIcon={<BiSearch />}
                  />
                )}

                <Menu isLazy>
                  <MenuButton as={Box}>
                    <HStack
                      border={`1px solid ${NavListBg}`}
                      rounded="7px"
                      cursor="pointer"
                      py="11.64px"
                      px="16.98px"
                      bg={NavListBg}
                      color={secondaryColor}
                      fontWeight="500"
                      fontSize="14px"
                    >
                      <Text>Filter</Text>
                      <IoFilter />
                    </HStack>
                  </MenuButton>
                  <MenuList bg={bgColor} border={`1px solid ${borderColor}`}>
                    <MenuItem
                      onClick={() => filterBy("ward")}
                      _hover={{
                        color: bgColor,
                        fontWeight: "400",
                        bg: NavListBg,
                      }}
                    >
                      by Ward
                    </MenuItem>
                    <MenuItem
                      onClick={() => filterBy("staff")}
                      _hover={{
                        color: bgColor,
                        fontWeight: "400",
                        bg: NavListBg,
                      }}
                    >
                      by Staff Name
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setByDate(true);
                      }}
                      _hover={{
                        color: bgColor,
                        fontWeight: "400",
                        bg: NavListBg,
                      }}
                    >
                      by date
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setSearchInput("");
                        setByDate(false);
                        setFilteredReports(
                          statusFilter === "all"
                            ? reports
                            : reports.filter(
                                (r) => r.ward.status === statusFilter
                              )
                        );
                      }}
                      _hover={{
                        color: bgColor,
                        fontWeight: "400",
                        bg: NavListBg,
                      }}
                    >
                      clear filter
                    </MenuItem>
                  </MenuList>
                </Menu>
>>>>>>> Stashed changes
              </HStack>
            </Flex>
          </Flex>

          <Box
            bg={bgColor}
            border={`1px solid ${borderColor}`}
            mt="12px"
            rounded="10px"
            overflowX="auto"
          >
            {loading ? (
              <Preloader />
            ) : error ? (
              <Text color="red.500" textAlign="center" py="20px">
                {error}
              </Text>
            ) : (
              <TableContainer>
                <Table variant="striped">
                  <Thead bg={bgColor}>
                    <Tr>
                      <Th color={subTitleTextColor}>Ward ID</Th>
                      <Th color={subTitleTextColor}>Ward Name</Th>

                      <Th color={subTitleTextColor}>Specialization</Th>

                      <Th color={subTitleTextColor}>Total Bed</Th>
                      <Th color={subTitleTextColor}>Occupied Bed</Th>
                      <Th color={subTitleTextColor}>Vacant Bed</Th>

                      <Th color={subTitleTextColor}>Staff Name</Th>
                      <Th color={subTitleTextColor}>Status</Th>
                      <Th color={subTitleTextColor}>Created At</Th>
                      <Th color={subTitleTextColor}>Updated At</Th>
                      <Th color={subTitleTextColor}>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {paginated.map((item) => (
                      <TableRowY
                        key={item._id}
                        type="dailywardreport"
                        wardid={item.ward.wardid}
                        wardname={item.ward.wardname}
                        bedspecialization={item.ward.bedspecialization}
                        totalbed={item.ward.totalbed}
                        occupiedbed={item.ward.occupiedbed}
                        vacantbed={item.ward.vacantbed}
                        staffname={item.staffname}
                        status={item.ward.status}
                        createdAt={item.createdAt}
                        updatedAt={item.updatedAt}
                        onViewDailyWardReport={() => {
                          setSelectedReport(item);
                          setShowViewModal(true);
                        }}
                        onEditDailyWardReport={() => {
                          setSelectedReport(item);
                          setShowEditModal(true);
                        }}
                      />
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            )}
            {!loading && filteredReports.length > postPerPage && (
              <Pagination
                postPerPage={postPerPage}
                currentPage={currentPage}
                totalPosts={filteredReports.length}
                paginate={setCurrentPage}
              />
            )}
          </Box>
        </>
      )}
    </Box>
  );
}
