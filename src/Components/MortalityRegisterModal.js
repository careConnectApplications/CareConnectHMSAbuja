import React, { useState, useEffect } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Text,
    SimpleGrid,
    Textarea,
    Select,
    Box,
} from "@chakra-ui/react";
import Button from "./Button";
import Input from "./Input";
import { useColors } from "../Utils/colors";

export default function MortalityRegisterModal({
    isOpen,
    onClose,
    type,
    record,
    patientId,
    onCreate,
}) {
    const {
        bgColor,
        textColor,
        titleTextColor,
        primaryColor,
    } = useColors();

    const [formData, setFormData] = useState({
        name: "",
        sex: "",
        dateOfBirth: "",
        age: "",
        patientCardNumber: "",
        ward: "",
        state: "",
        lga: "",
        maternalMortality: false,
        maternalDeath: "",
        other: "",
        neonatalDeath: "",
        neonatalOther: "",
        Deathunderfive: "",
        DeathunderfiveOther: "",
    });

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (type === "edit" && record) {
            setFormData(record);
        } else if (type === "create") {
            setFormData({
                name: "",
                sex: "",
                dateOfBirth: "",
                age: "",
                patientCardNumber: "",
                ward: "",
                state: "",
                lga: "",
                maternalMortality: false,
                maternalDeath: "",
                other: "",
                neonatalDeath: "",
                neonatalOther: "",
                Deathunderfive: "",
                DeathunderfiveOther: "",
            });
        }
    }, [type, record, isOpen]);

    const handleInputChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const patientId = localStorage.getItem("patientId");
            const payload = {
                ...formData,
                patient: patientId || "",
            };
            await onCreate(payload);
            onClose();
        } catch (error) {
            // Optionally handle error UI here
        } finally {
            setIsLoading(false);
        }
    };

    const isReadOnly = type === "view";
    const modalTitle = type === "create"
        ? "Register Death"
        : type === "edit"
            ? "Edit Mortality Record"
            : "View Mortality Record";

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
            <ModalOverlay />
            <ModalContent bg={bgColor}>
                <ModalHeader color={titleTextColor}>{modalTitle}</ModalHeader>
                <ModalCloseButton />
                <ModalBody maxH="70vh" overflowY="auto">
                    <Text fontSize="16px" fontWeight="600" color={titleTextColor} mb="16px">
                        Mortality Record Information
                    </Text>
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                        <Input label="Name" value={formData.name} onChange={e => handleInputChange("name", e.target.value)} readOnly={isReadOnly} />
                        <Select placeholder="Sex" value={formData.sex} onChange={e => handleInputChange("sex", e.target.value)} disabled={isReadOnly}>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </Select>
                        <Input label="Date of Birth" type="date" value={formData.dateOfBirth} onChange={e => handleInputChange("dateOfBirth", e.target.value)} readOnly={isReadOnly} />
                        <Input label="Age" value={formData.age} onChange={e => handleInputChange("age", e.target.value)} readOnly={isReadOnly} />
                        <Input label="Patient Card Number" value={formData.patientCardNumber} onChange={e => handleInputChange("patientCardNumber", e.target.value)} readOnly={isReadOnly} />
                        <Input label="Ward" value={formData.ward} onChange={e => handleInputChange("ward", e.target.value)} readOnly={isReadOnly} />
                        <Input label="State" value={formData.state} onChange={e => handleInputChange("state", e.target.value)} readOnly={isReadOnly} />
                        <Input label="LGA" value={formData.lga} onChange={e => handleInputChange("lga", e.target.value)} readOnly={isReadOnly} />
                    </SimpleGrid>
                    <Text fontSize="16px" fontWeight="600" color={titleTextColor} mb="16px" mt="24px">Death Details</Text>
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                        <Select label="Type" placeholder="Type" value={formData.maternalMortality ? "Maternal" : formData.neonatalDeath ? "Neonatal" : formData.Deathunderfive ? "Under Five" : "Other"} onChange={e => handleInputChange("maternalMortality", e.target.value === "Maternal") } disabled={isReadOnly}>
                            <option value="Maternal">Maternal</option>
                            <option value="Neonatal">Neonatal</option>
                            <option value="Under Five">Under Five</option>
                            <option value="Other">Other</option>
                        </Select>
                        <Input label="Maternal Death" value={formData.maternalDeath} onChange={e => handleInputChange("maternalDeath", e.target.value)} readOnly={isReadOnly} />
                        <Input label="Other" value={formData.other} onChange={e => handleInputChange("other", e.target.value)} readOnly={isReadOnly} />
                        <Input label="Neonatal Death" value={formData.neonatalDeath} onChange={e => handleInputChange("neonatalDeath", e.target.value)} readOnly={isReadOnly} />
                        <Input label="Neonatal Other" value={formData.neonatalOther} onChange={e => handleInputChange("neonatalOther", e.target.value)} readOnly={isReadOnly} />
                        <Input label="Death Under Five" value={formData.Deathunderfive} onChange={e => handleInputChange("Deathunderfive", e.target.value)} readOnly={isReadOnly} />
                        <Input label="Death Under Five Other" value={formData.DeathunderfiveOther} onChange={e => handleInputChange("DeathunderfiveOther", e.target.value)} readOnly={isReadOnly} />
                    </SimpleGrid>
                </ModalBody>
                <ModalFooter gap="4">
                    <Button variant="outline" mr={3} onClick={onClose}>
                        {isReadOnly ? "Close" : "Cancel"}
                    </Button>
                    {!isReadOnly && (
                        <Button
                            bg={primaryColor}
                            color="white"
                            _hover={{ bg: primaryColor }}
                            onClick={handleSubmit}
                            isLoading={isLoading}
                        >
                            {type === "create" ? "Register Death" : "Update Record"}
                        </Button>
                    )}
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
