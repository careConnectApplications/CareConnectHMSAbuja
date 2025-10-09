import {
  HStack,
  Box,
  Text,
  Spacer,
  Image,
  Flex,
  SimpleGrid,
  Td,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import Button from "../Components/Button";
import PrintCard from "../Components/PrintCard";
import { Table, Thead, Tbody, Tr, Th, TableContainer } from "@chakra-ui/react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { MdLocalPrintshop } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import logo from "../Assets/carelogo.png";
import { GetPaymentReceiptApi } from "../Utils/ApiCalls";
import moment from "moment";
import { FacilityName } from "../Utils/ApiConfig";
import TableRow from "../Components/TableRow";
import Preloader from "../Components/Preloader";
import { useColors } from "../Utils/colors";

export default function PrintReportSummary() {
  const {
    bgColor,
    textColor,
    borderColor,
    titleTextColor,
    subTitleTextColor,
    chartFillColor,
  } = useColors();
  const { id } = useParams();
  const nav = useNavigate();
  const pathname = localStorage.getItem("pathname");
  const Data = JSON.parse(localStorage.getItem("reportSummary"));
  const DateRange = JSON.parse(localStorage.getItem("dateRange"));
  const Category = localStorage.getItem("reportCategory");

  const [TotalAmount, setTotalAmount] = useState([]);
  const [ResultData, setResultData] = useState([]);
  const [Hide, setHide] = useState(false);

  const printNow = () => {
    setHide(true);
    setTimeout(() => {
      window.print();
    }, 1000);
    setTimeout(() => {
      setHide(false);
    }, 2000);
  };

  useEffect(() => { }, []);

  const formatCategory = (category) => {
    return category.replace(/([A-Z])/g, ' $1').trim();
  };

  return (
    <Box px="6%" mt="32px">
      {Hide === false && (
        <HStack mb="12px">
          <Button
            leftIcon={<IoMdArrowRoundBack />}
            w="150px"
            onClick={() => nav(`${pathname}`)}
          >
            Back
          </Button>
          <Spacer />
          <Button w="150px" rightIcon={<MdLocalPrintshop />} onClick={printNow}>
            Print
          </Button>
        </HStack>
      )}
      <Flex justifyContent="center">
        <Image src={logo} width={"10%"} onClick={() => nav("/")} />
      </Flex>
      <Text
        textAlign="center"
        fontSize="20px"
        textTransform="uppercase"
        fontWeight="900"
        color={titleTextColor}
      >
        {FacilityName}
      </Text>
      <Text
        textAlign="center"
        fontSize="16px"
        textTransform="uppercase"
        fontWeight="500"
        color={subTitleTextColor}
      >
        Report Summary for {Category.replace("aggregate", " aggregate")}{" "}
        {`From ${DateRange.from} to ${DateRange.to}`}{" "}
      </Text>
      <Box>
        {Category === "financialaggregate" && (
          <>
            <TableContainer mt="15px">
              <Table variant="striped">
                <Thead>
                  <Tr>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color={subTitleTextColor}
                      fontWeight="600"
                    >
                      S/N
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color={subTitleTextColor}
                      fontWeight="600"
                    >
                      Payment Category
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color={subTitleTextColor}
                      fontWeight="600"
                    >
                      Total Amount (&#8358;)
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color={subTitleTextColor}
                      fontWeight="600"
                    >
                      Status
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {Data.map((item, i) => (
                    <TableRow
                      type="financial-aggregate"
                      sn={i + 1}
                      category={item.paymentcategory}
                      total={item.totalAmount?.toLocaleString()}
                      status={item.status}
                    />
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
            <Box
              mt="20px"
              p="20px"
              borderWidth="1px"
              borderColor={borderColor}
              borderRadius="md"
              bg={chartFillColor}
            >
              <Text fontWeight="700" fontSize="16px" color={titleTextColor}>
                Grand Total Amount: &#8358;{" "}
                {
                  JSON.parse(localStorage.getItem("reportGrandTotal"))
                    ?.grandtotalAmount
                }
              </Text>
            </Box>
          </>
        )}

        {Category === "cashieraggregate" && (
          <>
            <TableContainer mt="15px">
              <Table variant="striped">
                <Thead>
                  <Tr>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color="#000"
                      fontWeight="600"
                    >
                      S/N
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color="#000"
                      fontWeight="600"
                    >
                      Cashier Email
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color="#000"
                      fontWeight="600"
                    >
                      Cashier Name
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color="#000"
                      fontWeight="600"
                    >
                      Cashier ID
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color="#000"
                      fontWeight="600"
                    >
                      Total Amount (&#8358;)
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color="#000"
                      fontWeight="600"
                    >
                      Status
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {Data.map((item, i) => (
                    <TableRow
                      type="cashier-aggregate"
                      sn={i + 1}
                      email={item.cashieremail}
                      name={item.cashiername}
                      id={item.cashierid}
                      total={item.totalAmount?.toLocaleString()}
                      status={item.status}
                    />
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
            <Box
              mt="20px"
              p="20px"
              borderWidth="1px"
              borderColor="gray.200"
              borderRadius="md"
              bg="gray.50"
            >
              <Text fontWeight="700" fontSize="16px">
                Grand Total Amount: &#8358;{" "}
                {JSON.parse(
                  localStorage.getItem("reportGrandTotal")
                )?.grandtotalAmount.toLocaleString()}
              </Text>
            </Box>
          </>
        )}

        {Category === "appointmentaggregate" && (
          <>
            <TableContainer mt="15px">
              <Table variant="striped">
                <Thead>
                  <Tr>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color="#000"
                      fontWeight="600"
                    >
                      S/N
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color="#000"
                      fontWeight="600"
                    >
                      Number of Appointment
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color="#000"
                      fontWeight="600"
                    >
                      Clinic
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color="#000"
                      fontWeight="600"
                    >
                      Status
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {Data.map((item, i) => (
                    <TableRow
                      type="appointment-aggregate"
                      sn={i + 1}
                      appointment={item.Numberofappointment}
                      clinic={item.clinic}
                      status={item.status}
                    />
                  ))}

                  {/* Newborn Health Outcome of Pregnancy */}
                  {Category === "newborn outcome of pregnancy" && Data && (
                    <>
                      <Text mt="4" fontWeight="700" fontSize="18px" color={titleTextColor}>
                        Newborn Health (Outcome of Pregnancy)
                      </Text>
                      <TableContainer mt="15px">
                        <Table variant="striped" size="sm">
                          <Thead>
                            <Tr>
                              <Th>Birth Type</Th>
                              <Th isNumeric>Male</Th>
                              <Th isNumeric>Female</Th>
                              <Th isNumeric>Total</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            <Tr>
                              <Td>Live Births &lt;2.5kg</Td>
                              <Td isNumeric>{Data.liveBirths["under2.5kg"].male}</Td>
                              <Td isNumeric>{Data.liveBirths["under2.5kg"].female}</Td>
                              <Td isNumeric>{Data.liveBirths["under2.5kg"].total}</Td>
                            </Tr>
                            <Tr>
                              <Td>Live Births ≥2.5kg</Td>
                              <Td isNumeric>{Data.liveBirths["≥2.5kg"].male}</Td>
                              <Td isNumeric>{Data.liveBirths["≥2.5kg"].female}</Td>
                              <Td isNumeric>{Data.liveBirths["≥2.5kg"].total}</Td>
                            </Tr>
                            <Tr>
                              <Td>Fresh Still Births (FSB)</Td>
                              <Td isNumeric colSpan={2}></Td>
                              <Td isNumeric>{Data.stillBirths["Fresh Still Births (FSB)"]}</Td>
                            </Tr>
                            <Tr>
                              <Td>Macerated Still Births (MSB)</Td>
                              <Td isNumeric colSpan={2}></Td>
                              <Td isNumeric>{Data.stillBirths["Macerated Still Births (MSB)"]}</Td>
                            </Tr>
                          </Tbody>
                        </Table>
                      </TableContainer>
                      <Box mt="20px" p="20px" borderWidth="1px" borderColor={borderColor} borderRadius="md" bg={chartFillColor}>
                        <Text fontWeight="700" fontSize="16px" color={titleTextColor}>
                          Grand Total Live Births: {JSON.parse(localStorage.getItem("reportGrandTotal"))?.liveBirthsTotal}
                        </Text>
                        <Text fontWeight="700" fontSize="16px" color={titleTextColor}>
                          Grand Total Still Births: {JSON.parse(localStorage.getItem("reportGrandTotal"))?.stillBirthsTotal}
                        </Text>
                      </Box>
                    </>
                  )}
                </Tbody>
              </Table>
            </TableContainer>
            <Box
              mt="20px"
              p="20px"
              borderWidth="1px"
              borderColor="gray.200"
              borderRadius="md"
              bg="gray.50"
            >
              <Text fontWeight="700" fontSize="16px">
                Grand Total Number Of Appointments:{" "}
                {
                  JSON.parse(localStorage.getItem("reportGrandTotal"))
                    ?.GrandTotalNumberofappointment
                }
              </Text>
            </Box>
          </>
        )}

        {Category === "admissionaggregate" && (
          <>
            <TableContainer mt="15px">
              <Table variant="striped">
                <Thead>
                  <Tr>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color="#000"
                      fontWeight="600"
                    >
                      S/N
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color="#000"
                      fontWeight="600"
                    >
                      Number of Admission
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color="#000"
                      fontWeight="600"
                    >
                      WardName
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color="#000"
                      fontWeight="600"
                    >
                      Status
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {Data.map((item, i) => (
                    <TableRow
                      type="appointment-aggregate"
                      sn={i + 1}
                      appointment={item.Numberofadmission}
                      clinic={item.wardname}
                      status={item.status}
                    />
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
            <Box
              mt="20px"
              p="20px"
              borderWidth="1px"
              borderColor="gray.200"
              borderRadius="md"
              bg="gray.50"
            >
              <Text fontWeight="700" fontSize="16px">
                Grand Total Number Of Admissions:{" "}
                {
                  JSON.parse(localStorage.getItem("reportGrandTotal"))
                    ?.TotalNumberofadmission
                }
              </Text>
            </Box>
          </>
        )}

        {Category === "procedureaggregate" && (
          <>
            <TableContainer mt="15px">
              <Table variant="striped">
                <Thead>
                  <Tr>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color="#000"
                      fontWeight="600"
                    >
                      S/N
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color="#000"
                      fontWeight="600"
                    >
                      Clinic
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color="#000"
                      fontWeight="600"
                    >
                      Number of Procedures
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color="#000"
                      fontWeight="600"
                    >
                      Total Amount (&#8358;)
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {Data.map((item, i) => (
                    <TableRow
                      type="procedure-aggregate"
                      sn={i + 1}
                      clinic={item.clinic}
                      procedures={item.Numberofprocedures}
                      total={item.totalAmount?.toLocaleString()}
                    />
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
            <Box
              mt="20px"
              p="20px"
              borderWidth="1px"
              borderColor="gray.200"
              borderRadius="md"
              bg="gray.50"
            >
              <Text fontWeight="700" fontSize="16px" mb="2">
                Grand Total Procedures:{" "}
                {
                  JSON.parse(localStorage.getItem("procedureGrandTotal"))
                    .TotalNumberofprocedures
                }
              </Text>
              <Text fontWeight="700" fontSize="16px">
                Grand Total Amount: &#8358;{" "}
                {JSON.parse(
                  localStorage.getItem("procedureGrandTotal")
                ).GrandtotalAmount?.toLocaleString()}
              </Text>
            </Box>
          </>
        )}

        {Category === "clinicalaggregate" && (
          <TableContainer mt="15px">
            <Table variant="striped">
              <Thead>
                <Tr>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#000"
                    fontWeight="600"
                  >
                    S/N
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#000"
                    fontWeight="600"
                  >
                    Number of Appointments
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#000"
                    fontWeight="600"
                  >
                    Diagnosis
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {Data.map((item, i) => (
                  <TableRow
                    type="clinical-aggregate"
                    sn={i + 1}
                    appointment={item.Numberofappointment}
                    diagnosis={item.diagnosis}
                  />
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}

        {Category === "hmoaggregate" && Data.hmolabsummary?.length > 0 && (
          <>
            <Text>HMO Lab Summary</Text>
            <TableContainer mt="15px">
              <Table variant="striped">
                <Thead>
                  <Tr>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color="#000"
                      fontWeight="600"
                    >
                      S/N
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color="#000"
                      fontWeight="600"
                    >
                      Total Number
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color="#000"
                      fontWeight="600"
                    >
                      HMO Name
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {Data.hmolabsummary?.map((item, i) => (
                    <TableRow
                      type="clinical-aggregate"
                      sn={i + 1}
                      appointment={item.TotalNumber}
                      diagnosis={item.HMOName}
                    />
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
            <Box
              mt="20px"
              p="20px"
              borderWidth="1px"
              borderColor="gray.200"
              borderRadius="md"
              bg="gray.50"
            >
              <Text fontWeight="700" fontSize="16px">
                Grand Total:{" "}
                {Data.hmolabsummary.reduce(
                  (acc, item) => acc + item.TotalNumber,
                  0
                )}
              </Text>
            </Box>
          </>
        )}
        {Category === "hmoaggregate" && Data.hmopharmacysummary?.length > 0 && (
          <>
            <Text>HMO Pharmacy Summary</Text>
            <TableContainer mt="15px">
              <Table variant="striped">
                <Thead>
                  <Tr>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color="#000"
                      fontWeight="600"
                    >
                      S/N
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color="#000"
                      fontWeight="600"
                    >
                      Total Number
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color="#000"
                      fontWeight="600"
                    >
                      HMO Name
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {Data.hmopharmacysummary?.map((item, i) => (
                    <TableRow
                      type="clinical-aggregate"
                      sn={i + 1}
                      appointment={item.TotalNumber}
                      diagnosis={item.HMOName}
                    />
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
            <Box
              mt="20px"
              p="20px"
              borderWidth="1px"
              borderColor="gray.200"
              borderRadius="md"
              bg="gray.50"
            >
              <Text fontWeight="700" fontSize="16px">
                Grand Total:{" "}
                {Data.hmopharmacysummary.reduce(
                  (acc, item) => acc + item.TotalNumber,
                  0
                )}
              </Text>
            </Box>
          </>
        )}
        {Category === "hmoaggregate" &&
          Data.hmoproceduresummary?.length > 0 && (
            <>
              <Text>HMO Procedure Summary</Text>
              <TableContainer mt="15px">
                <Table variant="striped">
                  <Thead>
                    <Tr>
                      <Th
                        fontSize="13px"
                        textTransform="capitalize"
                        color="#000"
                        fontWeight="600"
                      >
                        S/N
                      </Th>
                      <Th
                        fontSize="13px"
                        textTransform="capitalize"
                        color="#000"
                        fontWeight="600"
                      >
                        Total Number
                      </Th>
                      <Th
                        fontSize="13px"
                        textTransform="capitalize"
                        color="#000"
                        fontWeight="600"
                      >
                        HMO Name
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {Data.hmoproceduresummary?.map((item, i) => (
                      <TableRow
                        type="clinical-aggregate"
                        sn={i + 1}
                        appointment={item.TotalNumber}
                        diagnosis={item.HMOName}
                      />
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
              <Box
                mt="20px"
                p="20px"
                borderWidth="1px"
                borderColor="gray.200"
                borderRadius="md"
                bg="gray.50"
              >
                <Text fontWeight="700" fontSize="16px">
                  Grand Total:{" "}
                  {Data.hmoproceduresummary.reduce(
                    (acc, item) => acc + item.TotalNumber,
                    0
                  )}
                </Text>
              </Box>
            </>
          )}
        {Category === "hmoaggregate" &&
          Data.hmoradiologysummary?.length > 0 && (
            <>
              <Text>HMO Radiology Summary</Text>
              <TableContainer mt="15px">
                <Table variant="striped">
                  <Thead>
                    <Tr>
                      <Th
                        fontSize="13px"
                        textTransform="capitalize"
                        color="#000"
                        fontWeight="600"
                      >
                        S/N
                      </Th>
                      <Th
                        fontSize="13px"
                        textTransform="capitalize"
                        color="#000"
                        fontWeight="600"
                      >
                        Total Number
                      </Th>
                      <Th
                        fontSize="13px"
                        textTransform="capitalize"
                        color="#000"
                        fontWeight="600"
                      >
                        HMO Name
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {Data.hmoradiologysummary?.map((item, i) => (
                      <TableRow
                        type="clinical-aggregate"
                        sn={i + 1}
                        appointment={item.TotalNumber}
                        diagnosis={item.HMOName}
                      />
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
              <Box
                mt="20px"
                p="20px"
                borderWidth="1px"
                borderColor="gray.200"
                borderRadius="md"
                bg="gray.50"
              >
                <Text fontWeight="700" fontSize="16px">
                  Grand Total:{" "}
                  {Data.hmoradiologysummary.reduce(
                    (acc, item) => acc + item.TotalNumber,
                    0
                  )}
                </Text>
              </Box>
            </>
          )}
        {Category === "hmoaggregate" &&
          Data.hmsappointmentsummary?.length > 0 && (
            <>
              <Text>HMO Appointment Summary</Text>
              <TableContainer mt="15px">
                <Table variant="striped">
                  <Thead>
                    <Tr>
                      <Th
                        fontSize="13px"
                        textTransform="capitalize"
                        color="#000"
                        fontWeight="600"
                      >
                        S/N
                      </Th>
                      <Th
                        fontSize="13px"
                        textTransform="capitalize"
                        color="#000"
                        fontWeight="600"
                      >
                        Total Number
                      </Th>
                      <Th
                        fontSize="13px"
                        textTransform="capitalize"
                        color="#000"
                        fontWeight="600"
                      >
                        HMO Name
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {Data.hmsappointmentsummary?.map((item, i) => (
                      <TableRow
                        type="clinical-aggregate"
                        sn={i + 1}
                        appointment={item.TotalNumber}
                        diagnosis={item.HMOName}
                      />
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
              <Box
                mt="20px"
                p="20px"
                borderWidth="1px"
                borderColor="gray.200"
                borderRadius="md"
                bg="gray.50"
              >
                <Text fontWeight="700" fontSize="16px">
                  Grand Total:{" "}
                  {Data.hmsappointmentsummary.reduce(
                    (acc, item) => acc + item.TotalNumber,
                    0
                  )}
                </Text>
              </Box>
            </>
          )}
        {/* nutrition Aggregate  */}

        {Category === "nutritionaggregate" &&
          Data.children0to59thatreceivednutirtion?.length > 0 && (
            <>
              <Text mt="2" fontWeight="600">
                Children 0 to 59 that received nutrition
              </Text>
              <TableContainer mt="15px">
                <Table variant="striped">
                  <Thead>
                    <Tr>
                      <Th
                        fontSize="13px"
                        textTransform="capitalize"
                        color="#000"
                        fontWeight="600"
                      >
                        Count
                      </Th>
                      <Th
                        fontSize="13px"
                        textTransform="capitalize"
                        color="#000"
                        fontWeight="600"
                      >
                        age in months
                      </Th>
                      <Th
                        fontSize="13px"
                        textTransform="capitalize"
                        color="#000"
                        fontWeight="600"
                      >
                        Gender
                      </Th>
                      <Th
                        fontSize="13px"
                        textTransform="capitalize"
                        color="#000"
                        fontWeight="600"
                      >
                        Supplement
                      </Th>
                      <Th
                        fontSize="13px"
                        textTransform="capitalize"
                        color="#000"
                        fontWeight="600"
                      >
                        Type of Visit
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {Data.children0to59thatreceivednutirtion?.map((item, i) => (
                      <TableRow
                        type="nutrition-summary"
                        count={item.count}
                        age={item.parameters?.ageinmonths}
                        gender={item.parameters?.gender}
                        supplement={item.parameters?.vitaminasupplement}
                        visitType={item.parameters?.typeofvisit}
                      />
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </>
          )}
        {Category === "nutritionaggregate" &&
          Data.children0to59growingwell?.length > 0 && (
            <>
              <Text mt="2" fontWeight="600">
                Children 0 to 59 that are growing well
              </Text>
              <TableContainer mt="15px">
                <Table variant="striped">
                  <Thead>
                    <Tr>
                      <Th
                        fontSize="13px"
                        textTransform="capitalize"
                        color="#000"
                        fontWeight="600"
                      >
                        Count
                      </Th>
                      <Th
                        fontSize="13px"
                        textTransform="capitalize"
                        color="#000"
                        fontWeight="600"
                      >
                        age in months
                      </Th>
                      <Th
                        fontSize="13px"
                        textTransform="capitalize"
                        color="#000"
                        fontWeight="600"
                      >
                        Gender
                      </Th>
                      <Th
                        fontSize="13px"
                        textTransform="capitalize"
                        color="#000"
                        fontWeight="600"
                      >
                        Supplement
                      </Th>
                      <Th
                        fontSize="13px"
                        textTransform="capitalize"
                        color="#000"
                        fontWeight="600"
                      >
                        Type of Visit
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {Data.children0to59growingwell?.map((item, i) => (
                      <TableRow
                        type="nutrition-summary"
                        count={item.count}
                        age={item.parameters?.ageinmonths}
                        gender={item.parameters?.gender}
                        supplement={item.parameters?.vitaminasupplement}
                        visitType={item.parameters?.typeofvisit}
                      />
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </>
          )}
        {Category === "nutritionaggregate" &&
          Data.children0to5exclusivebreadstfeeding?.length > 0 && (
            <>
              <Text mt="2" fontWeight="600">
                Children 0 to 5 that received exclusive breast feeding
              </Text>
              <TableContainer mt="15px">
                <Table variant="striped">
                  <Thead>
                    <Tr>
                      <Th
                        fontSize="13px"
                        textTransform="capitalize"
                        color="#000"
                        fontWeight="600"
                      >
                        Count
                      </Th>
                      <Th
                        fontSize="13px"
                        textTransform="capitalize"
                        color="#000"
                        fontWeight="600"
                      >
                        age in months
                      </Th>
                      <Th
                        fontSize="13px"
                        textTransform="capitalize"
                        color="#000"
                        fontWeight="600"
                      >
                        Gender
                      </Th>
                      <Th
                        fontSize="13px"
                        textTransform="capitalize"
                        color="#000"
                        fontWeight="600"
                      >
                        Supplement
                      </Th>
                      <Th
                        fontSize="13px"
                        textTransform="capitalize"
                        color="#000"
                        fontWeight="600"
                      >
                        Type of Visit
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {Data.children0to5exclusivebreadstfeeding?.map(
                      (item, i) => (
                        <TableRow
                          type="nutrition-summary"
                          count={item.count}
                          age={item.parameters?.ageinmonths}
                          gender={item.parameters?.gender}
                          supplement={item.parameters?.vitaminasupplement}
                          visitType={item.parameters?.typeofvisit}
                        />
                      )
                    )}
                  </Tbody>
                </Table>
              </TableContainer>
            </>
          )}
        {Category === "nutritionaggregate" &&
          Data.children0to59givenvitaminasupplement?.length > 0 && (
            <>
              <Text mt="2" fontWeight="600">
                Children 0 to 59 given vitamin A supplement
              </Text>
              <TableContainer mt="15px">
                <Table variant="striped">
                  <Thead>
                    <Tr>
                      <Th
                        fontSize="13px"
                        textTransform="capitalize"
                        color="#000"
                        fontWeight="600"
                      >
                        Count
                      </Th>
                      <Th
                        fontSize="13px"
                        textTransform="capitalize"
                        color="#000"
                        fontWeight="600"
                      >
                        age in months
                      </Th>
                      <Th
                        fontSize="13px"
                        textTransform="capitalize"
                        color="#000"
                        fontWeight="600"
                      >
                        Gender
                      </Th>
                      <Th
                        fontSize="13px"
                        textTransform="capitalize"
                        color="#000"
                        fontWeight="600"
                      >
                        Supplement
                      </Th>
                      <Th
                        fontSize="13px"
                        textTransform="capitalize"
                        color="#000"
                        fontWeight="600"
                      >
                        Type of Visit
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {Data.children0to59givenvitaminasupplement?.map(
                      (item, i) => (
                        <TableRow
                          type="nutrition-summary"
                          count={item.count}
                          age={item.parameters?.ageinmonths}
                          gender={item.parameters?.gender}
                          supplement={item.parameters?.vitaminasupplement}
                          visitType={item.parameters?.typeofvisit}
                        />
                      )
                    )}
                  </Tbody>
                </Table>
              </TableContainer>
            </>
          )}
        {Category === "nutritionaggregate" &&
          Data.children12to59receiveddeworming?.length > 0 && (
            <>
              <Text mt="2" fontWeight="600">
                Children 12 to 59 who received deworming medication{" "}
              </Text>
              <TableContainer mt="15px">
                <Table variant="striped">
                  <Thead>
                    <Tr>
                      <Th
                        fontSize="13px"
                        textTransform="capitalize"
                        color="#000"
                        fontWeight="600"
                      >
                        Count
                      </Th>
                      <Th
                        fontSize="13px"
                        textTransform="capitalize"
                        color="#000"
                        fontWeight="600"
                      >
                        age in months
                      </Th>
                      <Th
                        fontSize="13px"
                        textTransform="capitalize"
                        color="#000"
                        fontWeight="600"
                      >
                        Gender
                      </Th>
                      <Th
                        fontSize="13px"
                        textTransform="capitalize"
                        color="#000"
                        fontWeight="600"
                      >
                        Supplement
                      </Th>
                      <Th
                        fontSize="13px"
                        textTransform="capitalize"
                        color="#000"
                        fontWeight="600"
                      >
                        Type of Visit
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {Data.children12to59receiveddeworming?.map((item, i) => (
                      <TableRow
                        type="nutrition-summary"
                        count={item.count}
                        age={item.parameters?.ageinmonths}
                        gender={item.parameters?.gender}
                        supplement={item.parameters?.vitaminasupplement}
                        visitType={item.parameters?.typeofvisit}
                      />
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </>
          )}
        {Category === "health facility attendance" && (
          <>
            {/* Outpatient Attendance Section */}
            {Data.outpatientattendance?.length > 0 && (
              <>
                <Text mt="2" fontWeight="600">
                  Outpatient Attendance
                </Text>
                <TableContainer mt="15px">
                  <Table variant="striped">
                    <Thead>
                      <Tr>
                        <Th>Count</Th>
                        <Th>Gender</Th>
                        <Th>Age Group</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {Data.outpatientattendance.map((item, i) => (
                        <Tr key={i}>
                          <Td>{item.count}</Td>
                          <Td>{item.gender}</Td>
                          <Td>{item.ageGroup}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}

            {/* General Attendance Section */}
            {Data.generalattendance?.length > 0 && (
              <>
                <Text mt="2" fontWeight="600">
                  General Attendance
                </Text>
                <TableContainer mt="15px">
                  <Table variant="striped">
                    <Thead>
                      <Tr>
                        <Th>Count</Th>
                        <Th>Gender</Th>
                        <Th>Age Group</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {Data.generalattendance.map((item, i) => (
                        <Tr key={i}>
                          <Td>{item.count}</Td>
                          <Td>{item.gender}</Td>
                          <Td>{item.ageGroup}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}
          </>
        )}
        {Category === "inpatient care" && (
          <>
            <Text mt="2" fontWeight="600">
              Inpatient Care
            </Text>
            <TableContainer mt="15px">
              <Table variant="striped">
                <Thead>
                  <Tr>
                    <Th>Count</Th>
                    <Th>Gender</Th>
                    <Th>Age Group</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {Data.map((item, i) => (
                    <Tr key={i}>
                      <Td>{item.count}</Td>
                      <Td>{item.gender}</Td>
                      <Td>{item.ageGroup}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </>
        )}
        {Category === "Family Planning" && (
          <>
            {/* Oral Pills Section */}
            {Data.clientsgivenoralpill?.length > 0 && (
              <>
                <Text mt="4" fontWeight="600">
                  Oral Contraceptive Pills
                </Text>
                <TableContainer mt="2">
                  <Table variant="striped">
                    <Thead>
                      <Tr>
                        <Th>Unique Clients</Th>
                        <Th>Cycles Dispensed</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td>
                          {Data.clientsgivenoralpill[0]
                            ?.uniqueOralPillsPatients || 0}
                        </Td>
                        <Td>
                          {Data.oralpillcyclesdispensed[0]
                            ?.totalCyclesDispensed || 0}
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}

            {/* Injectables Section */}
            {Data.injectablesgiven?.length > 0 && (
              <>
                <Text mt="4" fontWeight="600">
                  Injectable Contraceptives
                </Text>
                <TableContainer mt="2">
                  <Table variant="striped">
                    <Thead>
                      <Tr>
                        <Th>Type</Th>
                        <Th>Quantity Given</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td>
                          {Data.injectablesgiven[0]?.injectableName || "N/A"}
                        </Td>
                        <Td>{Data.injectablesgiven[0]?.totalQuantity || 0}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}

            {/* Long-Acting Methods Section */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mt="4">
              {/* Implants */}
              {Data.Implantsinserted?.length > 0 && (
                <Box>
                  <Text fontWeight="600">Implants</Text>
                  <TableContainer mt="2">
                    <Table variant="striped">
                      <Thead>
                        <Tr>
                          <Th>Type</Th>
                          <Th>Insertions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        <Tr>
                          <Td>
                            {Data.Implantsinserted[0]?.implantType || "N/A"}
                          </Td>
                          <Td>
                            {Data.Implantsinserted[0]?.totalInsertions || 0}
                          </Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {/* IUDs */}
              {Data.iudInserteds?.length > 0 && (
                <Box>
                  <Text fontWeight="600">Intrauterine Devices (IUDs)</Text>
                  <TableContainer mt="2">
                    <Table variant="striped">
                      <Thead>
                        <Tr>
                          <Th>Type</Th>
                          <Th>Insertions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        <Tr>
                          <Td>{Data.iudInserteds[0]?.iudType || "N/A"}</Td>
                          <Td>{Data.iudInserteds[0]?.totalInsertions || 0}</Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </SimpleGrid>

            {/* Postpartum Section */}
            {Data.postpartumIUDinserted?.length > 0 && (
              <>
                <Text mt="4" fontWeight="600">
                  Postpartum Family Planning
                </Text>
                <TableContainer mt="2">
                  <Table variant="striped">
                    <Thead>
                      <Tr>
                        <Th>Postpartum IUDs Inserted</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td>
                          {Data.postpartumIUDinserted[0]
                            ?.postPartumIUDInserted || 0}
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}

            {/* Summary Totals */}
            <Box mt="6" p="4" bg="gray.50" borderRadius="md">
              <Text fontSize="lg" fontWeight="700" mb="2">
                Summary Totals
              </Text>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={3}>
                <Box>
                  <Text fontWeight="600">Oral Pill Clients</Text>
                  <Text>
                    {JSON.parse(localStorage.getItem("reportGrandTotal"))
                      ?.oralPillClients || 0}
                  </Text>
                </Box>
                <Box>
                  <Text fontWeight="600">Injectable Contraceptives</Text>
                  <Text>
                    {JSON.parse(localStorage.getItem("reportGrandTotal"))
                      ?.injectables || 0}
                  </Text>
                </Box>
                <Box>
                  <Text fontWeight="600">Implants</Text>
                  <Text>
                    {JSON.parse(localStorage.getItem("reportGrandTotal"))
                      ?.implants || 0}
                  </Text>
                </Box>
                <Box>
                  <Text fontWeight="600">IUDs</Text>
                  <Text>
                    {JSON.parse(localStorage.getItem("reportGrandTotal"))
                      ?.iuds || 0}
                  </Text>
                </Box>
                <Box>
                  <Text fontWeight="600">Postpartum IUDs</Text>
                  <Text>
                    {JSON.parse(localStorage.getItem("reportGrandTotal"))
                      ?.postpartumIUDs || 0}
                  </Text>
                </Box>
              </SimpleGrid>
            </Box>
          </>
        )}

        {Category === "inpatients records" && (
          <TableContainer mt="15px">
            <Table variant="striped">
              <Thead>
                <Tr>
                  <Th>Category</Th>
                  <Th isNumeric>Male</Th>
                  <Th isNumeric>Female</Th>
                  <Th isNumeric>Total</Th>
                </Tr>
              </Thead>
              <Tbody>
                {Object.entries(Data).map(([key, value], i) => (
                  <TableRow
                    key={i}
                    type="generic-gender-total-aggregate"
                    category={formatCategory(key)}
                    male={value.male}
                    female={value.female}
                    total={value.total}
                  />
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}

        {Category === "outpatients records" && (
          <TableContainer mt="15px">
            <Table variant="striped">
              <Thead>
                <Tr>
                  <Th>Category</Th>
                  <Th isNumeric>Male</Th>
                  <Th isNumeric>Female</Th>
                  <Th isNumeric>Total</Th>
                </Tr>
              </Thead>
              <Tbody>
                {Object.entries(Data).map(([key, value], i) => (
                  <TableRow
                    key={i}
                    type="generic-gender-total-aggregate"
                    category={key}
                    male={value.male}
                    female={value.female}
                    total={value.total}
                  />
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}

        {Category === "accident and emergency records" && (
          <TableContainer mt="15px">
            <Table variant="striped">
              <Thead>
                <Tr>
                  <Th>Category</Th>
                  <Th isNumeric>Male</Th>
                  <Th isNumeric>Female</Th>
                  <Th isNumeric>Total</Th>
                </Tr>
              </Thead>
              <Tbody>
                {Object.entries(Data).map(([key, value], i) => (
                  <TableRow
                    key={i}
                    type="generic-gender-total-aggregate"
                    category={key}
                    male={value.male}
                    female={value.female}
                    total={value.total}
                  />
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}

        {Category === "national health insurance services" && (
          <>
            <TableContainer mt="15px">
              <Table variant="striped">
                <Thead>
                  <Tr>
                    <Th>S/N</Th>
                    <Th>Insurance Name</Th>
                    <Th isNumeric>Male</Th>
                    <Th isNumeric>Female</Th>
                    <Th isNumeric>Total</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {Data.map((item, i) => {
                    let maleCount = 0;
                    let femaleCount = 0;
                    item.data.forEach((d) => {
                      if (d._id.toLowerCase() === "male") {
                        maleCount += d.count;
                      } else if (d._id.toLowerCase() === "female") {
                        femaleCount += d.count;
                      }
                    });
                    const total = maleCount + femaleCount;
                    return (
                      <TableRow
                        key={i}
                        type="nhis-aggregate"
                        sn={i + 1}
                        name={item._id}
                        male={maleCount}
                        female={femaleCount}
                        total={total}
                      />
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
            <Box
              mt="20px"
              p="20px"
              borderWidth="1px"
              borderColor="gray.200"
              borderRadius="md"
              bg="gray.50"
            >
              <Text fontWeight="700" fontSize="16px">
                Grand Total Male:{" "}
                {
                  JSON.parse(localStorage.getItem("reportGrandTotal"))
                    ?.male
                }
              </Text>
              <Text fontWeight="700" fontSize="16px">
                Grand Total Female:{" "}
                {
                  JSON.parse(localStorage.getItem("reportGrandTotal"))
                    ?.female
                }
              </Text>
              <Text fontWeight="700" fontSize="16px">
                Grand Total:{" "}
                {
                  JSON.parse(localStorage.getItem("reportGrandTotal"))
                    ?.total
                }
              </Text>
            </Box>
          </>
        )}

        {(Category === "lab investigation report" ||
          Category === "radiology diagnosis" ||
          Category === "operation" ||
          Category === "special consultative" ||
          Category === "immunization") && (
            <>
              <TableContainer mt="15px">
                <Table variant="striped">
                  <Thead>
                    <Tr>
                      <Th>Category</Th>
                      <Th isNumeric>Male</Th>
                      <Th isNumeric>Female</Th>
                      <Th isNumeric>Total</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {Object.entries(Data).map(([key, value], i) => (
                      <TableRow
                        key={i}
                        type="generic-gender-total-aggregate"
                        category={key}
                        male={value.male}
                        female={value.female}
                        total={value.total}
                      />
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
              <Box
                mt="20px"
                p="20px"
                borderWidth="1px"
                borderColor="gray.200"
                borderRadius="md"
                bg="gray.50"
              >
                <Text fontWeight="700" fontSize="16px">
                  Grand Total Male:{" "}
                  {
                    JSON.parse(localStorage.getItem("reportGrandTotal"))
                      ?.male
                  }
                </Text>
                <Text fontWeight="700" fontSize="16px">
                  Grand Total Female:{" "}
                  {
                    JSON.parse(localStorage.getItem("reportGrandTotal"))
                      ?.female
                  }
                </Text>
                <Text fontWeight="700" fontSize="16px">
                  Grand Total:{" "}
                  {
                    JSON.parse(localStorage.getItem("reportGrandTotal"))
                      ?.total
                  }
                </Text>
              </Box>
            </>
          )}

        {Category === "maternity" && (
          <>
            <TableContainer mt="15px">
              <Table variant="striped">
                <Thead>
                  <Tr>
                    <Th>Category</Th>
                    <Th isNumeric>Male</Th>
                    <Th isNumeric>Female</Th>
                    <Th isNumeric>Total</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {Object.entries(Data).map(([key, value], i) => (
                    <TableRow
                      key={i}
                      type="generic-gender-total-aggregate"
                      category={key}
                      male={value.male !== undefined ? value.male : "-"}
                      female={value.female !== undefined ? value.female : "-"}
                      total={value.total}
                    />
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
            <Box
              mt="20px"
              p="20px"
              borderWidth="1px"
              borderColor="gray.200"
              borderRadius="md"
              bg="gray.50"
            >
              <Text fontWeight="700" fontSize="16px">
                Grand Total Male:{" "}
                {
                  JSON.parse(localStorage.getItem("reportGrandTotal"))
                    ?.male
                }
              </Text>
              <Text fontWeight="700" fontSize="16px">
                Grand Total Female:{" "}
                {
                  JSON.parse(localStorage.getItem("reportGrandTotal"))
                    ?.female
                }
              </Text>
              <Text fontWeight="700" fontSize="16px">
                Grand Total:{" "}
                {
                  JSON.parse(localStorage.getItem("reportGrandTotal"))
                    ?.total
                }
              </Text>
            </Box>
          </>
        )}

        {Category === "disease cases" && Data?.diseases && (
          <>
            {/* New Cases Table */}
            <Text fontSize="18px" fontWeight="700" mt="20px" mb="3" color={titleTextColor}>
              NEW CASES
            </Text>
            <TableContainer>
              <Table variant="striped" size="sm">
                <Thead>
                  <Tr>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color={subTitleTextColor}
                      fontWeight="600"
                      rowSpan={3}
                    >
                      S/N
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color={subTitleTextColor}
                      fontWeight="600"
                      rowSpan={3}
                      minW="200px"
                    >
                      Disease Case
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color={subTitleTextColor}
                      fontWeight="600"
                      colSpan={4}
                      textAlign="center"
                    >
                      Male
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color={subTitleTextColor}
                      fontWeight="600"
                      colSpan={4}
                      textAlign="center"
                    >
                      Female
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color={subTitleTextColor}
                      fontWeight="600"
                      rowSpan={3}
                      isNumeric
                    >
                      Total New Cases
                    </Th>
                  </Tr>
                  <Tr>
                    {/* Male age groups */}
                    <Th fontSize="12px" isNumeric>&lt;5</Th>
                    <Th fontSize="12px" isNumeric>&lt;15</Th>
                    <Th fontSize="12px" isNumeric>15-19</Th>
                    <Th fontSize="12px" isNumeric>20+</Th>
                    {/* Female age groups */}
                    <Th fontSize="12px" isNumeric>&lt;5</Th>
                    <Th fontSize="12px" isNumeric>&lt;15</Th>
                    <Th fontSize="12px" isNumeric>15-19</Th>
                    <Th fontSize="12px" isNumeric>20+</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {Data.diseases.map((item, i) => {
                    const newCasesTotal =
                      (item.newCases?.male?.["<5"] || 0) +
                      (item.newCases?.male?.["<15"] || 0) +
                      (item.newCases?.male?.["15-19"] || 0) +
                      (item.newCases?.male?.["20+"] || 0) +
                      (item.newCases?.female?.["<5"] || 0) +
                      (item.newCases?.female?.["<15"] || 0) +
                      (item.newCases?.female?.["15-19"] || 0) +
                      (item.newCases?.female?.["20+"] || 0);

                    return (
                      <Tr key={i}>
                        <Td fontSize="12px">{item.sn || i + 1}</Td>
                        <Td fontSize="12px" whiteSpace="normal">
                          {item.case}
                        </Td>
                        {/* Male new cases */}
                        <Td fontSize="12px" isNumeric>
                          {item.newCases?.male?.["<5"] || 0}
                        </Td>
                        <Td fontSize="12px" isNumeric>
                          {item.newCases?.male?.["<15"] || 0}
                        </Td>
                        <Td fontSize="12px" isNumeric>
                          {item.newCases?.male?.["15-19"] || 0}
                        </Td>
                        <Td fontSize="12px" isNumeric>
                          {item.newCases?.male?.["20+"] || 0}
                        </Td>
                        {/* Female new cases */}
                        <Td fontSize="12px" isNumeric>
                          {item.newCases?.female?.["<5"] || 0}
                        </Td>
                        <Td fontSize="12px" isNumeric>
                          {item.newCases?.female?.["<15"] || 0}
                        </Td>
                        <Td fontSize="12px" isNumeric>
                          {item.newCases?.female?.["15-19"] || 0}
                        </Td>
                        <Td fontSize="12px" isNumeric>
                          {item.newCases?.female?.["20+"] || 0}
                        </Td>
                        {/* Total new cases */}
                        <Td fontSize="12px" isNumeric fontWeight="600">
                          {newCasesTotal}
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>

            {/* Follow-Up Cases Table */}
            <Text fontSize="18px" fontWeight="700" mt="30px" mb="3" color={titleTextColor}>
              FOLLOW-UP CASES
            </Text>
            <TableContainer>
              <Table variant="striped" size="sm">
                <Thead>
                  <Tr>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color={subTitleTextColor}
                      fontWeight="600"
                      rowSpan={3}
                    >
                      S/N
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color={subTitleTextColor}
                      fontWeight="600"
                      rowSpan={3}
                      minW="200px"
                    >
                      Disease Case
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color={subTitleTextColor}
                      fontWeight="600"
                      colSpan={4}
                      textAlign="center"
                    >
                      Male
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color={subTitleTextColor}
                      fontWeight="600"
                      colSpan={4}
                      textAlign="center"
                    >
                      Female
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color={subTitleTextColor}
                      fontWeight="600"
                      rowSpan={3}
                      isNumeric
                    >
                      Total Follow-Up
                    </Th>
                  </Tr>
                  <Tr>
                    {/* Male age groups */}
                    <Th fontSize="12px" isNumeric>&lt;5</Th>
                    <Th fontSize="12px" isNumeric>&lt;15</Th>
                    <Th fontSize="12px" isNumeric>15-19</Th>
                    <Th fontSize="12px" isNumeric>20+</Th>
                    {/* Female age groups */}
                    <Th fontSize="12px" isNumeric>&lt;5</Th>
                    <Th fontSize="12px" isNumeric>&lt;15</Th>
                    <Th fontSize="12px" isNumeric>15-19</Th>
                    <Th fontSize="12px" isNumeric>20+</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {Data.diseases.map((item, i) => {
                    const followUpTotal =
                      (item.followUp?.male?.["<5"] || 0) +
                      (item.followUp?.male?.["<15"] || 0) +
                      (item.followUp?.male?.["15-19"] || 0) +
                      (item.followUp?.male?.["20+"] || 0) +
                      (item.followUp?.female?.["<5"] || 0) +
                      (item.followUp?.female?.["<15"] || 0) +
                      (item.followUp?.female?.["15-19"] || 0) +
                      (item.followUp?.female?.["20+"] || 0);

                    return (
                      <Tr key={i}>
                        <Td fontSize="12px">{item.sn || i + 1}</Td>
                        <Td fontSize="12px" whiteSpace="normal">
                          {item.case}
                        </Td>
                        {/* Male follow-up */}
                        <Td fontSize="12px" isNumeric>
                          {item.followUp?.male?.["<5"] || 0}
                        </Td>
                        <Td fontSize="12px" isNumeric>
                          {item.followUp?.male?.["<15"] || 0}
                        </Td>
                        <Td fontSize="12px" isNumeric>
                          {item.followUp?.male?.["15-19"] || 0}
                        </Td>
                        <Td fontSize="12px" isNumeric>
                          {item.followUp?.male?.["20+"] || 0}
                        </Td>
                        {/* Female follow-up */}
                        <Td fontSize="12px" isNumeric>
                          {item.followUp?.female?.["<5"] || 0}
                        </Td>
                        <Td fontSize="12px" isNumeric>
                          {item.followUp?.female?.["<15"] || 0}
                        </Td>
                        <Td fontSize="12px" isNumeric>
                          {item.followUp?.female?.["15-19"] || 0}
                        </Td>
                        <Td fontSize="12px" isNumeric>
                          {item.followUp?.female?.["20+"] || 0}
                        </Td>
                        {/* Total follow-up */}
                        <Td fontSize="12px" isNumeric fontWeight="600">
                          {followUpTotal}
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>

            {/* Mortality Summary Table */}
            <Text fontSize="18px" fontWeight="700" mt="30px" mb="3" color={titleTextColor}>
              MORTALITY SUMMARY
            </Text>
            <TableContainer>
              <Table variant="striped" size="sm">
                <Thead>
                  <Tr>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color={subTitleTextColor}
                      fontWeight="600"
                    >
                      S/N
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color={subTitleTextColor}
                      fontWeight="600"
                    >
                      Disease Case
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color={subTitleTextColor}
                      fontWeight="600"
                      isNumeric
                    >
                      Total Cases
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color={subTitleTextColor}
                      fontWeight="600"
                      isNumeric
                    >
                      Mortality
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {Data.diseases
                    .filter(item => item.mortality > 0)
                    .map((item, i) => (
                      <Tr key={i}>
                        <Td fontSize="12px">{item.sn || i + 1}</Td>
                        <Td fontSize="12px">{item.case}</Td>
                        <Td fontSize="12px" isNumeric fontWeight="600">
                          {item.total || 0}
                        </Td>
                        <Td fontSize="12px" isNumeric fontWeight="600" color="red.600">
                          {item.mortality || 0}
                        </Td>
                      </Tr>
                    ))}
                </Tbody>
              </Table>
            </TableContainer>

            {/* Summary Statistics */}
            {Data?.summary && (
              <Box
                mt="20px"
                p="20px"
                borderWidth="1px"
                borderColor={borderColor}
                borderRadius="md"
                bg={chartFillColor}
              >
                <Text fontSize="18px" fontWeight="700" mb="3" color={titleTextColor}>
                  Summary Statistics
                </Text>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3}>
                  <Box>
                    <Text fontWeight="600" fontSize="15px" color={subTitleTextColor}>
                      Total Disease Types:
                    </Text>
                    <Text fontWeight="700" fontSize="16px" color={titleTextColor}>
                      {Data.summary.totalDiseases || 0}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontWeight="600" fontSize="15px" color={subTitleTextColor}>
                      Total Cases:
                    </Text>
                    <Text fontWeight="700" fontSize="16px" color={titleTextColor}>
                      {Data.summary.totalCases || 0}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontWeight="600" fontSize="15px" color={subTitleTextColor}>
                      Total Mortality:
                    </Text>
                    <Text fontWeight="700" fontSize="16px" color={titleTextColor}>
                      {Data.summary.totalMortality || 0}
                    </Text>
                  </Box>
                </SimpleGrid>
              </Box>
            )}
          </>
        )}

        {Category === "eyecondition" && Data?.diagnosis && (
          <>
            <TableContainer mt="15px">
              <Table variant="striped" size="sm">
                <Thead>
                  <Tr>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color={subTitleTextColor}
                      fontWeight="600"
                      rowSpan={2}
                    >
                      S/N
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color={subTitleTextColor}
                      fontWeight="600"
                      rowSpan={2}
                    >
                      Diagnosis
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color={subTitleTextColor}
                      fontWeight="600"
                      colSpan={5}
                      textAlign="center"
                    >
                      Male
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color={subTitleTextColor}
                      fontWeight="600"
                      colSpan={5}
                      textAlign="center"
                    >
                      Female
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color={subTitleTextColor}
                      fontWeight="600"
                      rowSpan={2}
                      isNumeric
                    >
                      Total
                    </Th>
                  </Tr>
                  <Tr>
                    {/* Male age groups */}
                    <Th fontSize="12px" isNumeric>0-14</Th>
                    <Th fontSize="12px" isNumeric>15-29</Th>
                    <Th fontSize="12px" isNumeric>30-44</Th>
                    <Th fontSize="12px" isNumeric>45+</Th>
                    <Th fontSize="12px" isNumeric>Total</Th>
                    {/* Female age groups */}
                    <Th fontSize="12px" isNumeric>0-14</Th>
                    <Th fontSize="12px" isNumeric>15-29</Th>
                    <Th fontSize="12px" isNumeric>30-44</Th>
                    <Th fontSize="12px" isNumeric>45+</Th>
                    <Th fontSize="12px" isNumeric>Total</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {Data.diagnosis.map((item, i) => (
                    <Tr key={i}>
                      <Td fontSize="13px">{i + 1}</Td>
                      <Td fontSize="13px" textTransform="capitalize">
                        {item.diagnosis}
                      </Td>
                      {/* Male data */}
                      <Td fontSize="13px" isNumeric>
                        {item.data?.male?.["0-14"] || 0}
                      </Td>
                      <Td fontSize="13px" isNumeric>
                        {item.data?.male?.["15-29"] || 0}
                      </Td>
                      <Td fontSize="13px" isNumeric>
                        {item.data?.male?.["30-44"] || 0}
                      </Td>
                      <Td fontSize="13px" isNumeric>
                        {item.data?.male?.["45+"] || 0}
                      </Td>
                      <Td fontSize="13px" isNumeric fontWeight="600">
                        {item.data?.male?.total || 0}
                      </Td>
                      {/* Female data */}
                      <Td fontSize="13px" isNumeric>
                        {item.data?.female?.["0-14"] || 0}
                      </Td>
                      <Td fontSize="13px" isNumeric>
                        {item.data?.female?.["15-29"] || 0}
                      </Td>
                      <Td fontSize="13px" isNumeric>
                        {item.data?.female?.["30-44"] || 0}
                      </Td>
                      <Td fontSize="13px" isNumeric>
                        {item.data?.female?.["45+"] || 0}
                      </Td>
                      <Td fontSize="13px" isNumeric fontWeight="600">
                        {item.data?.female?.total || 0}
                      </Td>
                      {/* Grand total */}
                      <Td fontSize="13px" isNumeric fontWeight="700">
                        {item.data?.grandTotal || 0}
                      </Td>
                    </Tr>
                  ))}
                  {/* Grand Total Row */}
                  {(() => {
                    const grandTotalData = JSON.parse(
                      localStorage.getItem("reportGrandTotal") || "{}"
                    );
                    return (
                      <Tr bg="gray.100">
                        <Td fontSize="13px" fontWeight="700" colSpan={2}>
                          GRAND TOTAL
                        </Td>
                        {/* Male grand totals */}
                        <Td fontSize="13px" isNumeric fontWeight="600">
                          {grandTotalData?.male?.["0-14"] || 0}
                        </Td>
                        <Td fontSize="13px" isNumeric fontWeight="600">
                          {grandTotalData?.male?.["15-29"] || 0}
                        </Td>
                        <Td fontSize="13px" isNumeric fontWeight="600">
                          {grandTotalData?.male?.["30-44"] || 0}
                        </Td>
                        <Td fontSize="13px" isNumeric fontWeight="600">
                          {grandTotalData?.male?.["45+"] || 0}
                        </Td>
                        <Td fontSize="13px" isNumeric fontWeight="700">
                          {grandTotalData?.male?.total || 0}
                        </Td>
                        {/* Female grand totals */}
                        <Td fontSize="13px" isNumeric fontWeight="600">
                          {grandTotalData?.female?.["0-14"] || 0}
                        </Td>
                        <Td fontSize="13px" isNumeric fontWeight="600">
                          {grandTotalData?.female?.["15-29"] || 0}
                        </Td>
                        <Td fontSize="13px" isNumeric fontWeight="600">
                          {grandTotalData?.female?.["30-44"] || 0}
                        </Td>
                        <Td fontSize="13px" isNumeric fontWeight="600">
                          {grandTotalData?.female?.["45+"] || 0}
                        </Td>
                        <Td fontSize="13px" isNumeric fontWeight="700">
                          {grandTotalData?.female?.total || 0}
                        </Td>
                        {/* Overall grand total */}
                        <Td fontSize="14px" isNumeric fontWeight="700">
                          {grandTotalData?.grandTotal || 0}
                        </Td>
                      </Tr>
                    );
                  })()}
                </Tbody>
              </Table>
            </TableContainer>

            {/* Summary Statistics */}
            {Data?.summary && (
              <Box
                mt="20px"
                p="20px"
                borderWidth="1px"
                borderColor={borderColor}
                borderRadius="md"
                bg={chartFillColor}
              >
                <Text fontSize="18px" fontWeight="700" mb="3" color={titleTextColor}>
                  Summary Statistics
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                  <Box>
                    <Text fontWeight="600" fontSize="15px" color={subTitleTextColor}>
                      Total Diagnoses:
                    </Text>
                    <Text fontWeight="700" fontSize="16px" color={titleTextColor}>
                      {Data.summary.totalDiagnoses || 0}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontWeight="600" fontSize="15px" color={subTitleTextColor}>
                      Total Patients:
                    </Text>
                    <Text fontWeight="700" fontSize="16px" color={titleTextColor}>
                      {Data.summary.totalPatients || 0}
                    </Text>
                  </Box>
                </SimpleGrid>
              </Box>
            )}
          </>
        )}


        {Category === "Newborn Health(Outcome of pregnancy(Outcome of pregnancy)" && Data && (
          <>
            <Text mt="4" fontWeight="700" fontSize="18px" color={titleTextColor}>
              Newborn Health (Outcome of Pregnancy)
            </Text>

            {/* Live Births Section */}
            <Text mt="4" fontWeight="600" fontSize="16px" color={subTitleTextColor}>
              Live Births
            </Text>
            <TableContainer mt="2">
              <Table variant="striped" size="sm">
                <Thead>
                  <Tr>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color={subTitleTextColor}
                      fontWeight="600"
                    >
                      Birth Weight Category
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color={subTitleTextColor}
                      fontWeight="600"
                      isNumeric
                    >
                      Male
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color={subTitleTextColor}
                      fontWeight="600"
                      isNumeric
                    >
                      Female
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color={subTitleTextColor}
                      fontWeight="600"
                      isNumeric
                    >
                      Total
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td fontSize="13px">Live Births &lt;2.5kg</Td>
                    <Td fontSize="13px" isNumeric>
                      {Data.liveBirths?.["under2.5kg"]?.male || 0}
                    </Td>
                    <Td fontSize="13px" isNumeric>
                      {Data.liveBirths?.["under2.5kg"]?.female || 0}
                    </Td>
                    <Td fontSize="13px" isNumeric fontWeight="600">
                      {Data.liveBirths?.["under2.5kg"]?.total || 0}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td fontSize="13px">Live Births ≥2.5kg</Td>
                    <Td fontSize="13px" isNumeric>
                      {Data.liveBirths?.["≥2.5kg"]?.male || 0}
                    </Td>
                    <Td fontSize="13px" isNumeric>
                      {Data.liveBirths?.["≥2.5kg"]?.female || 0}
                    </Td>
                    <Td fontSize="13px" isNumeric fontWeight="600">
                      {Data.liveBirths?.["≥2.5kg"]?.total || 0}
                    </Td>
                  </Tr>
                  {/* Total Live Births Row */}
                  <Tr bg={chartFillColor}>
                    <Td fontSize="13px" fontWeight="700">
                      Total Live Births
                    </Td>
                    <Td fontSize="13px" isNumeric fontWeight="700">
                      {(Data.liveBirths?.["under2.5kg"]?.male || 0) +
                        (Data.liveBirths?.["≥2.5kg"]?.male || 0)}
                    </Td>
                    <Td fontSize="13px" isNumeric fontWeight="700">
                      {(Data.liveBirths?.["under2.5kg"]?.female || 0) +
                        (Data.liveBirths?.["≥2.5kg"]?.female || 0)}
                    </Td>
                    <Td fontSize="13px" isNumeric fontWeight="700">
                      {(Data.liveBirths?.["under2.5kg"]?.total || 0) +
                        (Data.liveBirths?.["≥2.5kg"]?.total || 0)}
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>

            {/* Still Births Section */}
            <Text mt="6" fontWeight="600" fontSize="16px" color={subTitleTextColor}>
              Still Births
            </Text>
            <TableContainer mt="2">
              <Table variant="striped" size="sm">
                <Thead>
                  <Tr>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color={subTitleTextColor}
                      fontWeight="600"
                    >
                      Still Birth Type
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color={subTitleTextColor}
                      fontWeight="600"
                      isNumeric
                    >
                      Count
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td fontSize="13px">Fresh Still Births (FSB)</Td>
                    <Td fontSize="13px" isNumeric fontWeight="600">
                      {Data.stillBirths?.["Fresh Still Births (FSB)"] || 0}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td fontSize="13px">Macerated Still Births (MSB)</Td>
                    <Td fontSize="13px" isNumeric fontWeight="600">
                      {Data.stillBirths?.["Macerated Still Births (MSB)"] || 0}
                    </Td>
                  </Tr>
                  {/* Total Still Births Row */}
                  <Tr bg={chartFillColor}>
                    <Td fontSize="13px" fontWeight="700">
                      Total Still Births
                    </Td>
                    <Td fontSize="13px" isNumeric fontWeight="700">
                      {(Data.stillBirths?.["Fresh Still Births (FSB)"] || 0) +
                        (Data.stillBirths?.["Macerated Still Births (MSB)"] || 0)}
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>

            {/* Grand Total Summary */}
            <Box
              mt="20px"
              p="20px"
              borderWidth="1px"
              borderColor={borderColor}
              borderRadius="md"
              bg={chartFillColor}
            >
              <Text fontSize="18px" fontWeight="700" mb="3" color={titleTextColor}>
                Summary Statistics
              </Text>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <Box>
                  <Text fontWeight="600" fontSize="15px" color={subTitleTextColor}>
                    Total Live Births:
                  </Text>
                  <Text fontWeight="700" fontSize="18px" color={titleTextColor}>
                    {(Data.liveBirths?.["under2.5kg"]?.total || 0) +
                      (Data.liveBirths?.["≥2.5kg"]?.total || 0)}
                  </Text>
                </Box>
                <Box>
                  <Text fontWeight="600" fontSize="15px" color={subTitleTextColor}>
                    Total Still Births:
                  </Text>
                  <Text fontWeight="700" fontSize="18px" color={titleTextColor}>
                    {(Data.stillBirths?.["Fresh Still Births (FSB)"] || 0) +
                      (Data.stillBirths?.["Macerated Still Births (MSB)"] || 0)}
                  </Text>
                </Box>
                <Box>
                  <Text fontWeight="600" fontSize="15px" color={subTitleTextColor}>
                    Low Birth Weight (&lt;2.5kg):
                  </Text>
                  <Text fontWeight="700" fontSize="18px" color={titleTextColor}>
                    {Data.liveBirths?.["under2.5kg"]?.total || 0}
                  </Text>
                </Box>
                <Box>
                  <Text fontWeight="600" fontSize="15px" color={subTitleTextColor}>
                    Normal Birth Weight (≥2.5kg):
                  </Text>
                  <Text fontWeight="700" fontSize="18px" color={titleTextColor}>
                    {Data.liveBirths?.["≥2.5kg"]?.total || 0}
                  </Text>
                </Box>
              </SimpleGrid>
            </Box>
          </>
        )}

        {Category === "birth registration" && Data && (
          <>
            <Text mt="4" fontWeight="700" fontSize="18px" color={titleTextColor}>
              Birth Report
            </Text>

            <TableContainer mt="15px">
              <Table variant="striped" size="sm">
                <Thead>
                  <Tr>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color={subTitleTextColor}
                      fontWeight="600"
                    >
                      S/N
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color={subTitleTextColor}
                      fontWeight="600"
                    >
                      Category
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color={subTitleTextColor}
                      fontWeight="600"
                      isNumeric
                    >
                      Male
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color={subTitleTextColor}
                      fontWeight="600"
                      isNumeric
                    >
                      Female
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color={subTitleTextColor}
                      fontWeight="600"
                      isNumeric
                    >
                      Total
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td fontSize="13px">1</Td>
                    <Td fontSize="13px">Children Under 1 Year Registered</Td>
                    <Td fontSize="13px" isNumeric>
                      {Data["Children Under 1 Year Registered"]?.male || 0}
                    </Td>
                    <Td fontSize="13px" isNumeric>
                      {Data["Children Under 1 Year Registered"]?.female || 0}
                    </Td>
                    <Td fontSize="13px" isNumeric fontWeight="600">
                      {Data["Children Under 1 Year Registered"]?.total || 0}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td fontSize="13px">2</Td>
                    <Td fontSize="13px">Birth Certificates Issued</Td>
                    <Td fontSize="13px" isNumeric>
                      {Data["Birth Certificates Issued"]?.male || 0}
                    </Td>
                    <Td fontSize="13px" isNumeric>
                      {Data["Birth Certificates Issued"]?.female || 0}
                    </Td>
                    <Td fontSize="13px" isNumeric fontWeight="600">
                      {Data["Birth Certificates Issued"]?.total || 0}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td fontSize="13px">3</Td>
                    <Td fontSize="13px">Birth Certificates Collected</Td>
                    <Td fontSize="13px" isNumeric>
                      {Data["Birth Certificates Collected"]?.male || 0}
                    </Td>
                    <Td fontSize="13px" isNumeric>
                      {Data["Birth Certificates Collected"]?.female || 0}
                    </Td>
                    <Td fontSize="13px" isNumeric fontWeight="600">
                      {Data["Birth Certificates Collected"]?.total || 0}
                    </Td>
                  </Tr>
                  {/* Grand Total Row */}
                  <Tr bg={chartFillColor}>
                    <Td fontSize="13px" fontWeight="700" colSpan={2}>
                      GRAND TOTAL
                    </Td>
                    <Td fontSize="13px" isNumeric fontWeight="700">
                      {JSON.parse(localStorage.getItem("reportGrandTotal") || "{}")?.male || 0}
                    </Td>
                    <Td fontSize="13px" isNumeric fontWeight="700">
                      {JSON.parse(localStorage.getItem("reportGrandTotal") || "{}")?.female || 0}
                    </Td>
                    <Td fontSize="13px" isNumeric fontWeight="700">
                      {JSON.parse(localStorage.getItem("reportGrandTotal") || "{}")?.total || 0}
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>

            {/* Summary Statistics */}
            <Box
              mt="20px"
              p="20px"
              borderWidth="1px"
              borderColor={borderColor}
              borderRadius="md"
              bg={chartFillColor}
            >
              <Text fontSize="18px" fontWeight="700" mb="3" color={titleTextColor}>
                Summary Statistics
              </Text>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                <Box>
                  <Text fontWeight="600" fontSize="15px" color={subTitleTextColor}>
                    Total Children Registered:
                  </Text>
                  <Text fontWeight="700" fontSize="18px" color={titleTextColor}>
                    {Data["Children Under 1 Year Registered"]?.total || 0}
                  </Text>
                </Box>
                <Box>
                  <Text fontWeight="600" fontSize="15px" color={subTitleTextColor}>
                    Total Certificates Issued:
                  </Text>
                  <Text fontWeight="700" fontSize="18px" color={titleTextColor}>
                    {Data["Birth Certificates Issued"]?.total || 0}
                  </Text>
                </Box>
                <Box>
                  <Text fontWeight="600" fontSize="15px" color={subTitleTextColor}>
                    Total Certificates Collected:
                  </Text>
                  <Text fontWeight="700" fontSize="18px" color={titleTextColor}>
                    {Data["Birth Certificates Collected"]?.total || 0}
                  </Text>
                </Box>
              </SimpleGrid>

              {/* Additional Insights */}
              <Box mt="4" pt="4" borderTopWidth="1px" borderColor={borderColor}>
                <Text fontSize="16px" fontWeight="600" mb="2" color={titleTextColor}>
                  Additional Insights
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                  <Box>
                    <Text fontSize="14px" color={subTitleTextColor}>
                      Collection Rate:
                    </Text>
                    <Text fontSize="16px" fontWeight="600" color={titleTextColor}>
                      {Data["Birth Certificates Issued"]?.total > 0
                        ? (
                          (Data["Birth Certificates Collected"]?.total /
                            Data["Birth Certificates Issued"]?.total) *
                          100
                        ).toFixed(1)
                        : 0}
                      %
                    </Text>
                  </Box>
                  <Box>
                    <Text fontSize="14px" color={subTitleTextColor}>
                      Pending Collection:
                    </Text>
                    <Text fontSize="16px" fontWeight="600" color={titleTextColor}>
                      {(Data["Birth Certificates Issued"]?.total || 0) -
                        (Data["Birth Certificates Collected"]?.total || 0)}
                    </Text>
                  </Box>
                </SimpleGrid>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
