import React, { useEffect, useState } from "react";
import MainLayout from "../Layouts/Index";
import Seo from "../Utils/Seo";
import {
  Box,
  Flex,
  Text,
  SimpleGrid,
  useTheme,
  HStack,
} from "@chakra-ui/react";

import { useColors } from '../Utils/colors'
import DashboardCard from "../Components/DashboardCard";
import Preloader from "../Components/Preloader";
import { DashboardApi } from "../Utils/ApiCalls";
import { BarChart, Bar, PieChart, XAxis, Cell, YAxis, CartesianGrid, Tooltip, Legend, Pie } from 'recharts';


export default function Dashboard() {
  const [IsLoading, setIsLoading] = useState(true);
  const [DataX, setDataX] = useState("");
  const [Data, setData] = useState({});

  const {
    bgColor,
    textColor,
    borderColor,
    titleTextColor,
    subTitleTextColor,
    chartFillColorBar,
    chartFillXColorBar,
    cardBgColor,
    primaryColor,
    secondaryColor,
    dangerColor,
    successColor,
    warningColor,
    infoColor,
    NavbarText,
    lightTextColor,
    NavListColor,
    NavListBg,
  } = useColors();
  const theme = useTheme();

 const onlineUser = JSON.parse(localStorage.getItem("onlineUser"))


    const getAllDashboard = async () => {
      try {
        setIsLoading(true);
        const result = await DashboardApi();
        console.log("Dashboard data", result);
        if (result.status === true) {
          setDataX(result.datax)
          setData(result)
        }
      } catch (e) {
        console.error(e.message);
      } finally {
        setIsLoading(false);
      }
    };
  


  useEffect(() => {
    getAllDashboard()
    var reloadCount = localStorage.getItem("reloadCount");
    if(!reloadCount){
      localStorage.setItem('reloadCount', + parseInt(1))

    }
    if(reloadCount < 2) {
      localStorage.setItem('reloadCount', parseInt(reloadCount) + 1);
      setTimeout(() =>
      window.location.reload(1), 2000)
    } else {
      localStorage.removeItem('reloadCount');
    }

  }, []);






  return (
    <MainLayout>
      {IsLoading && <Preloader />}
      <Seo title="Dashboard" description="Dashboard" />
      <HStack>
        <Text color={titleTextColor} fontWeight="600" fontSize="18px">
          Dashboard
        </Text>
      </HStack>
      <Text color={subTitleTextColor} mt="9px" fontWeight="400" fontSize="12px">
        Welcome back, {` ${onlineUser?.firstName}`} &#x1F44B; These are the latest update for the last 7 days
      </Text>
      <Box
        bg={bgColor}
        border={`1px solid ${borderColor}`}
        mt="12px"
        py="17px"
        px={["18px", "18px"]}
        rounded="10px"
      >
        <SimpleGrid columns={["1", "2", "3", "4"]} spacing={4} bg={primaryColor} rounded="10px" p='5'>
          <DashboardCard
            title="Total Out Patient"
            value={Data.totalnumberofactivepatient?.toLocaleString()}
          />
          <DashboardCard
            title="Total admitted"
            value={Data.totaladmittedpatient?.toLocaleString()}
          />
          <DashboardCard
            title="Total discharged"
            value={Data.totaldischargepatient?.toLocaleString()}
          />
          <DashboardCard
            title="total Pending procedure"
            value={Data.totalpendingprocedures?.toLocaleString()}
          />
          <DashboardCard
            title="Other Staff "
            value={Data.totalnumberfactiveusers?.toLocaleString()}
          />
          <DashboardCard
            title="Total pending Appointment"
            value={Data.totalpendingappointments?.toLocaleString()}
          />
          <DashboardCard
            title="total Pending lab"
            value={Data.totalpendinglabappointment?.toLocaleString()}
          />
          <DashboardCard
            title="total Pending radiology"
            value={Data.totalpendingradiologyappointment?.toLocaleString()}
          />

        </SimpleGrid>

        <Text mt="22px" color={subTitleTextColor} fontSize={"16px"} fontWeight="600">Patients Statistic</Text>

        <Box width="100%" mt="22px" overflowX="auto">
        <BarChart
          width={950}
          height={300}
          data={DataX}
          color="red"
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" color="red" />
          <YAxis />
          <Tooltip  color="red"/>
          <Legend color="red"/>
          <Bar dataKey="OutPatients" fill={theme.colors.blue.blue400} background={{ fill: chartFillColorBar}} />
          <Bar dataKey="InPatients" fill={theme.colors.blue.blue500} background={{ fill: chartFillXColorBar }}/>
        </BarChart>
        </Box>

       
      </Box>
    </MainLayout>
  );
}
