import React, { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    SimpleGrid,
    Flex,
} from '@chakra-ui/react';
import Input from './Input';
import Button from './Button';
import { AuthorizeClaimsApi } from '../Utils/ApiCalls';

export default function SingleClaimAuthorizationModal({ isOpen, onClose, activateNotifications, type, claimId }) {
    const [loading, setLoading] = useState(false);
    const [payload, setPayload] = useState({
        authorizationCode: '',
        approvalCode: '',
    });

    const handlePayload = (e) => {
        setPayload({ ...payload, [e.target.id]: e.target.value });
    };

    const handleAuthorizeClaim = async () => {
        setLoading(true);
        try {
            const result = await AuthorizeClaimsApi(payload, type, claimId);
            if (result.status === 200) {
                setLoading(false);
                setPayload({
                    authorizationCode: '',
                    approvalCode: '',
                });
                activateNotifications('Claim Authorized Successfully', 'success');
                onClose();
            }
        } catch (e) {
            setLoading(false);
            activateNotifications(e.message, 'error');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Authorize Claim</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mt={4}>
                        <Input
                            label="Authorization Code"
                            id="authorizationCode"
                            value={payload.authorizationCode}
                            onChange={handlePayload}
                            placeholder="Enter authorization code"
                        />
                        <Input
                            label="Approval Code"
                            id="approvalCode"
                            value={payload.approvalCode}
                            onChange={handlePayload}
                            placeholder="Enter approval code"
                        />
                    </SimpleGrid>
                </ModalBody>
                <ModalFooter>
                    <Button
                        onClick={handleAuthorizeClaim}
                        isLoading={loading}
                        background="#f8ddd1"
                        border="1px solid #EA5937"
                        color="blue.blue500"
                    >
                        Authorize
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
