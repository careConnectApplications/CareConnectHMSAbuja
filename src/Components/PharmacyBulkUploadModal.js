import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  Text,
  VStack,
  Link,
  Image,
  Select,
  useBreakpointValue,
} from "@chakra-ui/react";
import Button from "./Button";
import uploadImg from "../Assets/upload.png";
import {
  DownloadPharmacySampleFileApi,
  PharmacyBulkUploadApi,
  GetAllClinicApi,
} from "../Utils/ApiCalls";
import ShowToast from "./ToastNotification";

function PharmacyBulkUploadModal({ isOpen, onClose }) {
  const [toast, setToast] = useState(null);
  const [pharmacy, setPharmacy] = useState("");
  const [pharmacyOptions, setPharmacyOptions] = useState([]);

  // Fetch pharmacy options from clinics with type "pharmacy"
  useEffect(() => {
    const fetchPharmacies = async () => {
      try {
        const clinicResult = await GetAllClinicApi();
        const clinics = clinicResult?.queryresult?.clinicdetails || [];
        const pharmacies = clinics.filter((item) => item.type === "pharmacy");
        setPharmacyOptions(pharmacies);
      } catch (error) {
        setToast({ status: "error", message: "Failed to fetch pharmacies" });
        setTimeout(() => setToast(null), 2000);
      }
    };
    fetchPharmacies();
  }, []);

  const handleFileChange = async (event) => {
    const files = event.target.files;
    // Ensure a file is selected and a pharmacy is chosen
    if (files.length > 0 && pharmacy) {
      const file = files[0];

      const formData = new FormData();
      formData.append("file", file);
      formData.append("Pharmacy", pharmacy);

      try {
        await PharmacyBulkUploadApi(formData);
        setToast({ status: "success", message: "File uploaded successfully!" });
        onClose();
      } catch (error) {
        console.error("Error uploading file:", error);
        setToast({
          status: "error",
          message: error.message || "Failed to upload the file.",
        });
      }
      setTimeout(() => setToast(null), 2000);
    } else if (!pharmacy) {
      setToast({
        status: "error",
        message: "Please select a Pharmacy before uploading the file.",
      });
      setTimeout(() => setToast(null), 2000);
    }
  };

  const triggerFileInput = () => {
    document.getElementById("file-input").click();
  };

  const handleDownloadSampleFile = async () => {
    try {
      await DownloadPharmacySampleFileApi();
    } catch (error) {
      console.error("Error downloading the sample file:", error.message);
    }
  };

  const modalSize = useBreakpointValue({ base: "full", md: "lg" });
  const modalPadding = useBreakpointValue({ base: 4, md: 6 });

  return (
    <>
      {toast && <ShowToast status={toast.status} message={toast.message} />}

      <Modal isOpen={isOpen} onClose={onClose} size={modalSize} isCentered>
        <ModalOverlay />
        <ModalContent borderRadius="lg" p={modalPadding} bg="white">
          <ModalHeader
            textAlign="center"
            fontWeight="bold"
            fontSize={{ base: "lg", md: "xl" }}
            color="#0060B6"
          >
            Bulk Upload Inventory Data
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <VStack
              spacing={4}
              align="center"
              bg="gray.50"
              borderRadius="md"
              p={{ base: 4, md: 6 }}
              textAlign="center"
            >
              {/* Dropdown for selecting Pharmacy */}
              <Select
                placeholder="Select Pharmacy"
                value={pharmacy}
                onChange={(e) => setPharmacy(e.target.value)}
                size="md"
              >
                {pharmacyOptions.map((item, index) => (
                  <option key={index} value={item.clinic}>
                    {item.clinic}
                  </option>
                ))}
              </Select>

              <Image
                src={uploadImg}
                alt="Upload Icon"
                boxSize={{ base: "60px", md: "80px" }}
                mb={4}
              />
              <input
                id="file-input"
                type="file"
                accept=".xlsx"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <Button
                onClick={triggerFileInput}
                size="md"
                w="fit-content"
                mb={2}
                fontWeight="semibold"
              >
                Click to upload
              </Button>
              <Link
                fontSize="sm"
                color="gray.500"
                onClick={triggerFileInput}
                cursor="pointer"
              >
                Or Browse Files
              </Link>
              <Text fontSize="xs" color="gray.400">
                *Only XLSx Format (Max 200MB)
              </Text>
            </VStack>

            <Box mt={6} textAlign="center">
              <Link
                fontWeight="bold"
                color="#0060B6"
                textDecoration="underline"
                onClick={handleDownloadSampleFile}
              >
                Or Download Sample File
              </Link>
              <Text fontSize="sm" color="gray.500" mt={1}>
                This serves as a guide for your uploads
              </Text>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default PharmacyBulkUploadModal;
