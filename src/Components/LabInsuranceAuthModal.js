import { HStack, Radio, RadioGroup, Text } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
     Table,
      Thead,
      Tbody,
      Tr,
      Th,
      TableContainer,
      
    Stack, SimpleGrid, Select, Flex
} from '@chakra-ui/react'
import { SlPlus } from "react-icons/sl";
import Input from "./Input";
import TextArea from "./TextArea";
import Button from "./Button";
import TableRow from "./TableRow";
import ReferralDiagnosisCard from "./ReferralDiagnosisCard";
import { FaNoteSticky } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { IoColorFilter } from "react-icons/io5";
import { SettingsApi, confirmPaymentAPI, confirmAllPaymentAPI, GetAllDetailApi } from "../Utils/ApiCalls";
import { FaArrowsToDot } from "react-icons/fa6";
import { AiFillDatabase } from "react-icons/ai";
import moment from "moment";
import SingleClaimAuthorizationModal from './SingleClaimAuthorizationModal';

export default function LabInsuranceAuthModal({ isOpen, onClose, setOldPayload, activateNotifications, type, oldPayload }) {

    console.log("oldPayload", oldPayload)

    const [Disabled, setDisabled] = useState(true);
    const [Loading, setLoading] = useState(false);
    const [Clinics, setClinics] = useState([]);
    const [Data, setData] = useState([]);
    const [TotalAmount, setTotalAmount] = useState([]);
    const [Settings, setSettings] = useState("");
    const [Trigger, setTrigger] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [selectedClaimId, setSelectedClaimId] = useState(null);
    


    const id = localStorage.getItem('patientId')
    const [Payload, setPayload] = useState({

       note:""

    })
    const [UpdatedPayload, setUpdatedPayload] = useState({
      note:""
    })




    const handlePayload = (e) => {
        setPayload({ ...Payload, [e.target.id]: e.target.value })

    }

    const handleUpdatedPayload = (e) => {
        setUpdatedPayload({ ...UpdatedPayload, [e.target.id]: e.target.value })

    }




    const getSettings = async () => {
        try {
            const result = await SettingsApi();
            setSettings(result);
        } catch (e) {

        }
    };




 
    const getAllDetails = async () => {
        try {
            const result = await GetAllDetailApi(oldPayload.id, type);

            console.log("getAllDetails", result)

            setData(result.queryresult.labdetails);
           

          
        } catch (e) {
            console.log(e.message, "error");
        }
    };
    const { pathname } = useLocation()
      const nav = useNavigate();
     const PrintReceipt = (item) => {
        nav(`/dashboard/billing-payment/receipt/${item.paymentreference}`)
        
        localStorage.setItem("pathname", pathname)
       
      }

      const onChangeStatus = (id) => {
        setSelectedClaimId(id);
        setIsAuthModalOpen(true);
    };

      const handleAuthorizeAll = () => {
        setSelectedClaimId(oldPayload.id);
        setIsAuthModalOpen(true);
    };


    useEffect(() => {
        getAllDetails()
      
       

    }, [isOpen, Payload, Trigger,isAuthModalOpen]);

    return (

        <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
            <ModalOverlay />
            <ModalContent maxW={{ base: "90%", md: "80%" }} maxH="80vh"
                overflowY="auto">
                <ModalHeader>Insurance Details </ModalHeader>
                <ModalCloseButton />
                <ModalBody>

        
          <TableContainer>
                    <Table variant="striped">
                      <Thead bg="#fff">
                        <Tr>
                          <Th
                            fontSize="13px"
                            textTransform="capitalize"
                            color="#534D59"
                            fontWeight="600"
                          >
                            patient name
                          </Th>
                          <Th
                            fontSize="13px"
                            textTransform="capitalize"
                            color="#534D59"
                            fontWeight="600"
                          >
                            MRN
                          </Th>
                          <Th
                            fontSize="13px"
                            textTransform="capitalize"
                            color="#534D59"
                            fontWeight="600"
                          >
                            phone
                          </Th>
                          <Th
                            fontSize="13px"
                            textTransform="capitalize"
                            color="#534D59"
                            fontWeight="600"
                          >
                            age
                          </Th>
        
                          <Th
                            fontSize="13px"
                            textTransform="capitalize"
                            color="#534D59"
                            fontWeight="600"
                          >
                            status
                          </Th>
                          <Th
                            fontSize="13px"
                            textTransform="capitalize"
                            color="#534D59"
                            fontWeight="600"
                          >
                            Test ID
                          </Th>
                          <Th
                            fontSize="13px"
                            textTransform="capitalize"
                            color="#534D59"
                            fontWeight="600"
                          >
                            Test Name
                          </Th>
                          <Th
                            fontSize="13px"
                            textTransform="capitalize"
                            color="#534D59"
                            fontWeight="600"
                          >
                            amount
                          </Th>
                          <Th
                            fontSize="13px"
                            textTransform="capitalize"
                            color="#534D59"
                            fontWeight="600"
                          >
                            quantity
                          </Th>
                         
                          <Th
                            fontSize="13px"
                            textTransform="capitalize"
                            color="#534D59"
                            fontWeight="600"
                          >
                            Total Amount
                          </Th>
                          <Th
                            fontSize="13px"
                            textTransform="capitalize"
                            color="#534D59"
                            fontWeight="600"
                          >
                            date created
                          </Th>
                          <Th
                            fontSize="13px"
                            textTransform="capitalize"
                            color="#534D59"
                            fontWeight="600"
                          >
                            actions
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
        
        
        
                        {
                    
                            Data?.map((item, i) => (
                              <TableRow
                                key={i}
                                type="insurance-table-Unauthorized"
                                name={`${item.patient?.firstName} ${item.patient?.lastName}`}
                                email={item.patient?.email}
                                age={item.patient?.age}
                                phone={item.patient?.phoneNumber}
                                mrn={item.patient?.MRN}
                                amount={item.amount}
                                quantity={item.qty||"1"}
                                total={item.amount}
                                status={item.status}
                                testId={item.testid}
                                testName={item.testname}
                                date={moment(item.createdAt).format("lll")}
                                onClick={() => onChangeStatus(item._id)}
                                onPrint={() => PrintReceipt(item)}
                              />
                            ))
                         
        
                        }
        
        
                      </Tbody>
                    </Table>
                  </TableContainer>

                  <Flex
                        justifyContent="flex-end"
                        flexWrap="wrap"
                        mt={["10px", "10px", "10px", "10px"]}
                        w={"100%"}
                    >
                        <Button
                            mt={["10px", "10px", "0px", "0px"]}
                            isLoading={Loading}
                            background="#f8ddd1 "
                            border="1px solid #EA5937"
                            color="blue.blue500"
                            w={["100%", "100%", "144px", "144px"]}
                            onClick={handleAuthorizeAll}
                            
                        >
                            Authorize All
                        </Button>
                        </Flex>

                </ModalBody>

                <ModalFooter>

                </ModalFooter>
            </ModalContent>
            <SingleClaimAuthorizationModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                activateNotifications={activateNotifications}
                type={type}
                claimId={selectedClaimId}
            />
        </Modal>
    )
}
