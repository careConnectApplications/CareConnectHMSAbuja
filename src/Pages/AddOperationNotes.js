import {
  Box,
  Flex,
  SimpleGrid,
  Text,
  Stack,
  Image,
  VStack,
  Input as ChakraInput,
} from "@chakra-ui/react";
import React, { useState } from "react";
import MainLayout from "../Layouts/Index";
import Seo from "../Utils/Seo";
import Button from "../Components/Button";
import ShowToast from "../Components/ToastNotification";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import PatientInfoCard from "../Components/PatientInfoCard";
import { FaImage, FaUpload } from "react-icons/fa6";
import { AddOperationNoteApi } from "../Utils/ApiCalls";

export default function AddOperationNotes() {
  const { appointmentId, patientId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    status: "",
  });

  const [payload, setPayload] = useState({
    patientId: patientId,
    appointmentId: appointmentId,
    CVF: null,
    OCT: null,
    FundusPhotograph: null, 
    FFA: null,
  });

  const [imagePreviews, setImagePreviews] = useState({
    CVF: null,
    OCT: null,
    FundusPhotograph: null,
    FFA: null,
  });

  const handleImageUpload = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setShowToast({
          show: true,
          message: "Please upload only image files (JPEG, PNG, GIF)",
          status: "error",
        });
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setShowToast({
          show: true,
          message: "File size should be less than 5MB",
          status: "error",
        });
        return;
      }

      // Update payload with the file
      setPayload(prev => ({
        ...prev,
        [fieldName]: file
      }));

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreviews(prev => ({
        ...prev,
        [fieldName]: previewUrl
      }));
    }
  };

  const removeImage = (fieldName) => {
    setPayload(prev => ({
      ...prev,
      [fieldName]: null
    }));
    
    // Cleanup preview URL
    if (imagePreviews[fieldName]) {
      URL.revokeObjectURL(imagePreviews[fieldName]);
    }
    
    setImagePreviews(prev => ({
      ...prev,
      [fieldName]: null
    }));
  };

  const handleSubmit = async () => {
    // Check if at least one image is uploaded
    const hasImages = payload.CVF || payload.OCT || payload.FundusPhotograph || payload.FFA;
    
    if (!hasImages) {
      setShowToast({
        show: true,
        message: "Please upload at least one image",
        status: "error",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Create FormData for file uploads
      const formData = new FormData();
     
      
      // Append files to FormData
      if (payload.CVF) {
        formData.append('CVF', payload.CVF);
      }
      if (payload.OCT) {
        formData.append('OCT', payload.OCT);
      }
      if (payload.FundusPhotograph) {
        formData.append('FundusPhotograph', payload.FundusPhotograph);
      }
      if (payload.FFA) {
        formData.append('FFA', payload.FFA);
      }

      const result = await AddOperationNoteApi(formData,payload.appointmentId,payload.patientId);   

    
      console.log("Operation note payload:", result);
      
      setShowToast({
        show: true,
        message: "Operation note added successfully",
        status: "success",
      });
      
      setTimeout(() => {
        nav(-1);
      }, 2000);
    } catch (error) {
      setShowToast({
        show: true,
        message: error.message || "Failed to add operation note",
        status: "error",
      });

      setTimeout(() => {
        setShowToast({  
          show: false,
        });
      }, 5000);
      
    } finally {
      setIsLoading(false);
    }
  };

  const nav = useNavigate();

  // Image upload component
  const ImageUploadField = ({ label, fieldName, description }) => (
    <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
      <Text fontSize="lg" fontWeight="bold" mb={2} color="blue.blue500">
        {label}
      </Text>
      <Text fontSize="sm" color="gray.600" mb={4}>
        {description}
      </Text>
      
      {!imagePreviews[fieldName] ? (
        <VStack
          border="2px dashed #CBD5E0"
          borderRadius="md"
          p={8}
          spacing={4}
          cursor="pointer"
          _hover={{ borderColor: "blue.blue500", bg: "gray.50" }}
          onClick={() => document.getElementById(`upload-${fieldName}`).click()}
        >
          <FaUpload size={40} color="#CBD5E0" />
          <Text color="gray.500" textAlign="center">
            Click to upload {label} image
          </Text>
          <Text fontSize="xs" color="gray.400" textAlign="center">
            Supported formats: JPEG, PNG, GIF (Max 5MB)
          </Text>
          <ChakraInput
            id={`upload-${fieldName}`}
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, fieldName)}
            style={{ display: 'none' }}
          />
        </VStack>
      ) : (
        <Box>
          <Image
            src={imagePreviews[fieldName]}
            alt={label}
            maxH="300px"
            w="100%"
            objectFit="contain"
            border="1px solid #E2E8F0"
            borderRadius="md"
            mb={4}
          />
          <Flex justifyContent="space-between" align="center">
            <Text fontSize="sm" color="green.600" fontWeight="medium">
              ✓ {label} uploaded successfully
            </Text>
            <Button
              size="sm"
              variant="outline"
              colorScheme="red"
              onClick={() => removeImage(fieldName)}
            >
              Remove
            </Button>
          </Flex>
        </Box>
      )}
    </Box>
  );

  return (
    <MainLayout>
      {showToast.show && (
        <ShowToast message={showToast.message} status={showToast.status} />
      )}
      <Seo
        title="Add Operation Note"
        description="Add a new operation note with images for a patient"
      />

      <Box>
        <Button
          leftIcon={<IoMdArrowRoundBack />}
          px="40px"
          w="100px"
          onClick={() => nav(-1)}
        >
          Back
        </Button>

        <PatientInfoCard />

        <Stack spacing={6} mt="32px">
          <Box>
            <Text fontSize="1xl" fontWeight="bold" mb={6} color="blue.blue500">
              Operation Note Images
            </Text>
            <Text fontSize="md" color="gray.600" mb={8}>
              Please upload the relevant medical images for this operation note.
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <ImageUploadField
              label="CVF"
              fieldName="CVF"
              description="Computerized Visual Field test results image"
            />

            <ImageUploadField
              label="OCT"
              fieldName="OCT"
              description="Optical Coherence Tomography scan image"
            />

            <ImageUploadField
              label="Fundus Photograph"
              fieldName="FundusPhotograph"
              description="Fundus photography image showing the back of the eye"
            />

            <ImageUploadField
              label="FFA"
              fieldName="FFA"
              description="Fluorescein Fundus Angiography image"
            />
          </SimpleGrid>

          <Flex justifyContent="center" mt={8}>
            <Button
              onClick={handleSubmit}
              isLoading={isLoading}
              loadingText="Uploading..."
              w={{ base: "100%", md: "250px" }}
              rightIcon={<FaImage />}
            >
              Submit Operation Note
            </Button>
          </Flex>
        </Stack>
      </Box>
    </MainLayout>
  );
}
