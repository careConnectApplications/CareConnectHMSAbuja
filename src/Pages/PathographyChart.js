import React, { useState, useEffect } from "react";
import { Box, Text, Flex, Spinner } from "@chakra-ui/react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { GetAllPartographHistoryApi } from "../Utils/ApiCalls";

const PathographyChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Trigger to refresh chart data automatically
  const [trigger, setTrigger] = useState(false);


  const patientId = localStorage.getItem("patientId");

  // Function to fetch and transform data
  const fetchData = () => {
    if (patientId) {
      setLoading(true);
      GetAllPartographHistoryApi(patientId)
        .then((response) => {
          const rawData = response?.queryresult?.pathographdetails || [];
          const transformedData = rawData.map((item) => ({
            id: item._id,
            // Format date as YYYY-MM-DD
            date: new Date(item.createdAt).toISOString().split("T")[0],
            temperature: parseFloat(item.temperature),
            respiratory: parseFloat(item.respiratoryrate),
            contraction: parseFloat(item.contraction),
            liquor: item.liquor,
            moulding: item.moulding,
            doctor: item.staffname,
            status: item.status,
          }));
          setData(transformedData);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching partograph data:", err);
          setError(err.message);
          setLoading(false);
        });
    }
  };


  useEffect(() => {
    fetchData();
  }, [patientId, trigger]);

  // Automatically refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTrigger((prev) => !prev);
    }, 30000);
    return () => clearInterval(interval);
  }, []);


  const chartData = {
    labels: data.map((item) => item.date),
    datasets: [
      {
        label: "Temperature",
        data: data.map((item) => item.temperature),
        fill: false,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
      },
      {
        label: "Respiratory Rate",
        data: data.map((item) => item.respiratory),
        fill: false,
        backgroundColor: "rgba(255,99,132,0.4)",
        borderColor: "rgba(255,99,132,1)",
      },
      {
        label: "Contraction",
        data: data.map((item) => item.contraction),
        fill: false,
        backgroundColor: "rgba(54, 162, 235, 0.4)",
        borderColor: "rgba(54, 162, 235, 1)",
      },
    ],
  };

  return (
    <Box bg="#fff" border="1px solid #EFEFEF" mt="10px" py="17px" px="18px" rounded="10px">
      <Box p="10px" border="1px solid #EFEFEF" rounded="10px">
        {loading ? (
          <Flex justifyContent="center" alignItems="center" minH="100px">
            <Spinner size="xl" />
          </Flex>
        ) : error ? (
          <Text color="red.500" textAlign="center">
            {error}
          </Text>
        ) : (
          <Line data={chartData} />
        )}
      </Box>
    </Box>
  );
};

export default PathographyChart;
