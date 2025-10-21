import React, { useState, useEffect } from "react";
import { Box, Text, HStack, Spacer } from "@chakra-ui/react";
import Button from "../Components/Button";
import { IoMdArrowRoundBack } from "react-icons/io";
import { MdLocalPrintshop } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import BottleLabelPrint from "../Components/BottleLabelPrint";

export default function PrintBottleLabel() {
  const nav = useNavigate();
  const [Hide, setHide] = useState(false);
  const [PrintData, setPrintData] = useState(null);

  const printNow = () => {
    setHide(true);
    setTimeout(() => {
      window.print();
    }, 1000);
    setTimeout(() => {
      setHide(false);
    }, 2000);
  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("printData"));
    setPrintData(data);
  }, []);

  return (
    <Box px="6%" mt="32px">
      {Hide === false && (
        <HStack mb="12px">
          <Button
            leftIcon={<IoMdArrowRoundBack />}
            w="150px"
            onClick={() => nav(-1)}
          >
            Back
          </Button>
          <Spacer />
          <Button w="150px" rightIcon={<MdLocalPrintshop />} onClick={printNow}>
            Print
          </Button>
        </HStack>
      )}
      {PrintData && <BottleLabelPrint labData={PrintData} />}
    </Box>
  );
}
