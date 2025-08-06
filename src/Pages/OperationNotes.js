import React, { useState, useEffect, useRef } from "react";
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
import Preloader from "../Components/Preloader";
import { SlPlus } from "react-icons/sl";
import { useNavigate, useLocation } from "react-router-dom";
import { FaClock } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { BsCalendar2DateFill } from "react-icons/bs";
import { AiOutlineDownload } from "react-icons/ai";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FacilityName } from "../Utils/ApiConfig";
import { GetPreviousEyeRecordsApi } from "../Utils/ApiCalls";
import { baseUrl } from "../Utils/ApiConfig";


// Utility function to format field names
const formatFieldName = (fieldName) => {
  return fieldName
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

// Utility function to format date values
const formatDateValue = (value) => {
  if (typeof value === "string" && moment(value, moment.ISO_8601, true).isValid()) {
    return moment(value).format("LL");
  }
  return value;
};

// Render function for operation note images
const renderOperationNoteImages = (operationNote) => {
 

  const hasImages = operationNote.length > 0;

  if (!hasImages) return null;

  return (
    <>
      {/* CVF Image */}

      {
        operationNote.map((note,index) =>(
           <Box>
          <Text
            fontSize="15px"
            mt="12px"
            fontWeight={"700"}
            textTransform="capitalize"
            color="blue.blue500"
          >
           {note.resultType}
          </Text>
          <Box mt="12px" mb="5">
            <img 
              src={`${baseUrl}/${note.fileUrl}`} 
              alt="CVF" 
              style={{ 
                maxWidth: "100%", 
                height: "auto", 
                border: "1px solid #E2E8F0", 
                borderRadius: "8px" 
              }} 
            />
          </Box>
        </Box>
        ))
      }

     
    </>
  );
};

export default function OperationNotes({ hide = false, index }) {
  const [IsLoading, setIsLoading] = useState(true);
  const [All, setAll] = useState(true);
  const [InProgress, setInProgress] = useState(false);
  const [Completed, setCompleted] = useState(false);
  const [Data, setData] = useState([]);
  const [FilterData, setFilterData] = useState([]);
  const { isOpen } = useDisclosure();

  // Search Filter settings
  const [SearchInput, setSearchInput] = useState("");
  const [FilteredData, setFilteredData] = useState(null);
  
  // Ref for PDF export
  const pdfRef = useRef();
  const [isExporting, setIsExporting] = useState(false);

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
        // Filter for operation note records only (when API is ready)
        setData(result.data || []);
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

  const AddOperationNote = () => {
    nav(`/eye-module/operational-notes/appointment/${id}/patient/${PatientId}`);
    localStorage.setItem("pathname", pathname);
    localStorage.setItem("state", "new");
  };

  const EditOperationNote = () => {
    nav(`/eye-module/operational-notes/appointment/${id}/patient/${PatientId}`);
    localStorage.setItem("pathname", pathname);
     localStorage.setItem("state", "edit");
  };

  // PDF Export Function
  const exportToPDF = async () => {
    if (!pdfRef.current || Data.length === 0) {
      activateNotifications("No data available to export", "error");
      return;
    }

    setIsExporting(true);
    
    try {
      // Get patient info from the first record in Data
      const firstRecord = Data[0];
      const patient = firstRecord?.patient;
      const patientName = patient ? `${patient.title || ''} ${patient.firstName || ''} ${patient.lastName || ''}`.trim() : "Patient";
      const patientMRN = patient?.MRN || "N/A";
      const patientAge = patient?.age || "N/A";
      const patientGender = patient?.gender || "N/A";
      const patientPhone = patient?.phoneNumber || "N/A";
      const currentDate = moment().format("YYYY-MM-DD");
      
      // Create a temporary container for PDF content
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '0';
      tempDiv.style.width = '210mm'; // A4 width
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.padding = '20px';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      
      // Add header with facility name and patient details
      tempDiv.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #2B6CB0; padding-bottom: 20px;">
          <h1 style="color: #2B6CB0; margin: 0; font-size: 24px; margin-bottom: 10px;">${FacilityName}</h1>
          <h2 style="color: #2B6CB0; margin: 0; font-size: 20px; margin-bottom: 15px;">Operation Notes Report</h2>
          <table style="width: 100%; margin-top: 15px; border-collapse: collapse;">
            <tr>
              <td style="width: 50%; vertical-align: top; padding-right: 20px;">
                <p style="margin: 3px 0; color: #333; font-size: 12px; text-align: left;"><strong>Patient:</strong> ${patientName}</p>
                <p style="margin: 3px 0; color: #333; font-size: 12px; text-align: left;"><strong>MRN:</strong> ${patientMRN}</p>
                <p style="margin: 3px 0; color: #333; font-size: 12px; text-align: left;"><strong>Age:</strong> ${patientAge} years</p>
              </td>
              <td style="width: 50%; vertical-align: top; padding-left: 20px;">
                <p style="margin: 3px 0; color: #333; font-size: 12px; text-align: right;"><strong>Gender:</strong> ${patientGender}</p>
                <p style="margin: 3px 0; color: #333; font-size: 12px; text-align: right;"><strong>Phone:</strong> ${patientPhone}</p>
                <p style="margin: 3px 0; color: #333; font-size: 12px; text-align: right;"><strong>Generated:</strong> ${moment().format("MMMM DD, YYYY")}</p>
              </td>
            </tr>
          </table>
        </div>
      `;
      
      // Clone the content from pdfRef
      const contentToExport = pdfRef.current.cloneNode(true);
      
      // Remove any buttons or interactive elements from the cloned content
      const buttons = contentToExport.querySelectorAll('button');
      buttons.forEach(button => button.remove());
      
      // Style adjustments for PDF
      contentToExport.style.width = '100%';
      contentToExport.style.maxWidth = 'none';
      contentToExport.style.margin = '0';
      contentToExport.style.padding = '0';
      
      tempDiv.appendChild(contentToExport);
      document.body.appendChild(tempDiv);
      
      // Generate PDF
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: tempDiv.scrollWidth,
        height: tempDiv.scrollHeight
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;
      
      // If content is too long, split into multiple pages
      const pageHeight = pdfHeight;
      const contentHeight = imgHeight * ratio;
      
      if (contentHeight <= pageHeight) {
        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      } else {
        let position = 0;
        const pageCanvas = document.createElement('canvas');
        const pageCtx = pageCanvas.getContext('2d');
        pageCanvas.width = canvas.width;
        
        while (position < contentHeight) {
          const remainingHeight = contentHeight - position;
          const currentPageHeight = Math.min(pageHeight / ratio, remainingHeight / ratio);
          
          pageCanvas.height = currentPageHeight;
          pageCtx.drawImage(canvas, 0, position / ratio, canvas.width, currentPageHeight, 0, 0, canvas.width, currentPageHeight);
          
          const pageImgData = pageCanvas.toDataURL('image/png');
          
          if (position > 0) {
            pdf.addPage();
          }
          
          pdf.addImage(pageImgData, 'PNG', imgX, 0, imgWidth * ratio, currentPageHeight * ratio);
          position += pageHeight;
        }
      }
      
      // Clean up
      document.body.removeChild(tempDiv);
      
      // Save PDF
      const fileName = `Operation_Notes_${patientName.replace(/\s+/g, '_')}_${currentDate}.pdf`;
      pdf.save(fileName);
      
      activateNotifications("PDF exported successfully!", "success");
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      activateNotifications("Failed to export PDF. Please try again.", "error");
    } finally {
      setIsExporting(false);
    }
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

      {/* Filter section */}
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
          w={["100%", "100%", "100%", "100%"]}
          gap="10px"
        >
          <Button
            w={["100%", "100%", "220px", "220px"]}
            onClick={AddOperationNote}
            rightIcon={<SlPlus />}
          >
            Add Operation Note
          </Button>
          
          {Data.length > 0 && (
            <Button
              w={["100%", "100%", "200px", "200px"]}
              onClick={exportToPDF}
              rightIcon={<AiOutlineDownload />}
              bg="green.500"
              color="white"
              _hover={{ bg: "green.600" }}
              isLoading={isExporting}
              loadingText="Exporting..."
            >
              Export as PDF
            </Button>
          )}
        </Flex>
      )}

      {/* Content section */}
      <Box
        ref={pdfRef}
        bg="#fff"
        border="1px solid #EFEFEF"
        mt="12px"
        py="15px"
        px="15px"
        rounded="10px"
        overflowX="auto"
      >
        <Text mb="20px" fontWeight="700" fontSize="16px" color="blue.blue500">
          Previous Operation Notes
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
              <HStack alignItems="center">
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
               <Box color="blue.blue500" fontSize="24px" fontWeight="500" cursor="pointer" onClick={EditOperationNote}>
                 <MdEdit />
                </Box>
            </HStack>

            {item.operationalTest &&
              renderOperationNoteImages(item.operationalTest)}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
