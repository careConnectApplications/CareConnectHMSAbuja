import { HStack, Text, Select, Box, SimpleGrid, Flex, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import Input from "./Input";
import TextArea from "./TextArea";
import Button from "./Button";
import ProcessLabCard from "./ProcessLabCard";
import { ProcessLabApi, GetTestComponentByTestNameApi } from "../Utils/ApiCalls";
import { MdMiscellaneousServices } from "react-icons/md";
import { FaMoneyBill } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import { TbUrgent } from "react-icons/tb";
import { FaUserDoctor, FaHourglassStart } from "react-icons/fa6";
import { SlPlus } from "react-icons/sl";

export default function CreateTestOrderModal({ isOpen, onClose, type, activateNotifications, oldPayload }) {
  const [Loading, setLoading] = useState(false);
  // State to store the subcomponent options from the API
  const [subComponentOptions, setSubComponentOptions] = useState([]);
  const [Payload, setPayload] = useState({
    subcomponents: [
      {
        subcomponent: "",
        result: "",
        nranges: "",
        unit: ""
      }
    ]
  });

  // Fetch the subcomponents for the test name passed in oldPayload when the modal opens
  useEffect(() => {
    if (oldPayload && oldPayload.testname) {
      GetTestComponentByTestNameApi(oldPayload.testname)
        .then(response => {
          // Check if we have testcomponentdetails and extract the subcomponents array
          if (
            response?.queryresult?.testcomponentdetails &&
            response.queryresult.testcomponentdetails.length > 0
          ) {
            const options = response.queryresult.testcomponentdetails[0].subcomponients;
            setSubComponentOptions(options);
          }
        })
        .catch(error => {
          console.error("Error fetching test components:", error);
        });
    }
  }, [oldPayload]);

  const ProcessLab = async () => {
    setLoading(true);
    try {
      const result = await ProcessLabApi(Payload, oldPayload._id);
      if (result.status === 200) {
        setLoading(false);
        onClose();
        setPayload({
          subcomponents: [
            {
              subcomponent: "",
              result: "",
              nranges: "",
              unit: ""
            }
          ]
        });
        setSubComponentOptions([]);
        activateNotifications("Lab Processed Successfully", "success");
      }
    } catch (e) {
      setLoading(false);
      activateNotifications(e.message, "error");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent maxW={{ base: "90%", md: "50%" }} maxH="80vh" overflowY="auto">
        <ModalHeader>Process Lab for {oldPayload.testname}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex justifyContent={"flex-end"} mb="15px">
            <Button
              w="150px"
              rightIcon={<SlPlus />}
              onClick={() =>
                setPayload({
                  ...Payload,
                  subcomponents: [
                    ...Payload.subcomponents,
                    {
                      subcomponent: "",
                      result: "",
                      nranges: "",
                      unit: ""
                    }
                  ]
                })
              }
            >
              Add
            </Button>
          </Flex>
          <>
            {Payload.subcomponents?.map((item, i) => (
              <ProcessLabCard
                data={item}
                oldItem={Payload.subcomponents}
                Payload={Payload}
                setPayload={setPayload}
                key={i}
                i={i}
                testName={oldPayload.testname}
                // Pass the subcomponent options to the card
                subComponentOptions={subComponentOptions}
              />
            ))}
            <Button mt="32px" onClick={ProcessLab} isLoading={Loading}>
              Process Order
            </Button>
          </>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
}
