import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
  HStack,
  Text,
  Switch,
  Box,
} from '@chakra-ui/react';
import Button from "./Button";
import { CreateUnitApi, UpdateUnitApi, GetAllClinicApi } from '../Utils/ApiCalls';

const CreateUnitModal = ({ isOpen, onClose, oldPayload, fetchData,activateNotifications }) => {
  const [unitName, setUnitName] = useState('');
  const [clinicId, setClinicId] = useState('');
  const [clinics, setClinics] = useState([]);
  const [status, setStatus] = useState(true);
  const [loading, setLoading] = useState(false);
  const toast = useToast();


  useEffect(() => {
    if (oldPayload) {
      setUnitName(oldPayload.unit || '');
      setClinicId(oldPayload.clinicId||  '');
     
    } else {
      resetForm();
    }
  }, [oldPayload]);

  useEffect(() => {
    fetchClinics();
   
  }, []);

  const fetchClinics = async () => {
    try {
      const response = await GetAllClinicApi();
      console.log("response clinic", response)
      if (response) {
        setClinics(response.queryresult.clinicdetails || []);
      }
    } catch (error) {
      console.error('Error fetching clinics:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch clinics',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const resetForm = () => {
    setUnitName('');
    setClinicId('');
    setStatus(true);
  };

  const handleSubmit = async () => {
    if (!unitName || !clinicId) {
      toast({
        title: 'Validation Error',
        description: 'Please fill all required fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    const payload = {
      unit: unitName,
      clinicId: clinicId,
      
    };

    try {
      let response;
      if (oldPayload && oldPayload._id) {
        response = await UpdateUnitApi(oldPayload._id, payload);
      } else {
        response = await CreateUnitApi(payload);
      }

      if (response.data) {
        activateNotifications(oldPayload ? 'Unit updated successfully' : 'Unit created successfully', "success")
        resetForm();
        onClose();
       
      }
    } catch (error) {
      console.error('Error:', error);
      activateNotifications(error.message || 'An error occurred', "error")
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg" isCentered >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{oldPayload ? 'Edit Unit' : 'Create New Unit'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4} isRequired>
            <FormLabel>Unit Name</FormLabel>
            <Input
              placeholder="Enter unit name"
              value={unitName}
              onChange={(e) => setUnitName(e.target.value)}
            />
          </FormControl>

          <FormControl mb={4} isRequired>
            <FormLabel>Clinic</FormLabel>
            <Select
              placeholder="Select clinic"
              value={clinicId}
              onChange={(e) => setClinicId(e.target.value)}
            >
              {clinics.map((clinic) => (
                <option key={clinic._id} value={clinic._id}>
                  {clinic.clinic}
                </option>
              ))}
            </Select>
          </FormControl>

        
        </ModalBody>

        <ModalFooter gap={3}>
          <Button variant="ghost" mr={3} onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            isLoading={loading}
            loadingText={oldPayload ? 'Updating...' : 'Creating...'}
          >
            {oldPayload ? 'Update' : 'Create'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateUnitModal;
