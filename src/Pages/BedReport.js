import React, { useState, useEffect } from "react";
import { Text, Flex, Box } from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, TableContainer } from "@chakra-ui/react";
import TableRowY from "../Components/TableRowY";
import ShowToast from "../Components/ToastNotification";
import Pagination from "../Components/Pagination";
import { GetAllWardApi } from "../Utils/ApiCalls";
import { configuration } from "../Utils/Helpers";

export default function BedReport() {
  const [CurrentPage, setCurrentPage] = useState(1);
  const PostPerPage = configuration.sizePerPage;
  const [Data, setData] = useState([]);
  const [showToast, setShowToast] = useState({ show: false, message: "", status: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await GetAllWardApi();
        setData(result.queryresult.wardmanagementdetails || []);
      } catch (e) {
        activateNotifications(e.message, "error");
      }
    };
    fetchData();
  }, []);

  const activateNotifications = (message, status) => {
    setShowToast({ show: true, message, status });
    setTimeout(() => setShowToast({ show: false }), 3000);
  };

  const indexOfLastPost = CurrentPage * PostPerPage;
  const indexOfFirstPost = indexOfLastPost - PostPerPage;
  const PaginatedData = Data.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Box bg="#fff" border="1px solid #EFEFEF" mt="10px" py="17px" px="18px" rounded="10px">
      {showToast.show && <ShowToast message={showToast.message} status={showToast.status} />}

      <Flex justifyContent="space-between" flexWrap="wrap">
        <Text fontSize="20px" fontWeight="600">Bed Report</Text>
      </Flex>

      <Box bg="#fff" border="1px solid #EFEFEF" mt="12px" py="15px" px="15px" rounded="10px" overflowX="auto">
        <TableContainer>
          <Table variant="striped">
            <Thead bg="#fff">
              <Tr>
                <Th fontSize="13px" color="#534D59" fontWeight="600">Bed Specialization</Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">Ward Name</Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">Total Beds</Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">Occupied Beds</Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">Vacant Beds</Th>
              </Tr>
            </Thead>
            <Tbody>
              {PaginatedData.map((item, i) => (
                <TableRowY
                  key={i}
                  type="BedReport"
                  bedSpecialization={item.bedspecialization}
                  ward={item.wardname}
                  totalBed={item.totalbed}
                  occupiedBed={item.occupiedbed}
                  vacantBed={item.vacantbed}
                />
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>

      <Pagination
        postPerPage={PostPerPage}
        currentPage={CurrentPage}
        totalPosts={Data.length}
        paginate={paginate}
      />
    </Box>
  );
}
