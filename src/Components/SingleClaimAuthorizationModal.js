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
    Radio,
    RadioGroup,
    Stack,
    Text,
} from '@chakra-ui/react';
import Input from './Input';
import Button from './Button';
import { AuthorizeClaimsApi, GroupAuthorizeClaimsApi } from '../Utils/ApiCalls';

export default function SingleClaimAuthorizationModal({ isOpen, onClose, activateNotifications, type, claimId,state }) {
    const [loading, setLoading] = useState(false);
    const [action, setAction] = useState('approve');
    const [payload, setPayload] = useState({
        authorizationCode: '',
        approvalCode: '',
    });

    const handlePayload = (e) => {
        setPayload({ ...payload, [e.target.id]: e.target.value });
    };

    const handleAuthorizeClaim = async () => {
        setLoading(true);
        const payloadWithAction = {
            ...payload,
            action: action
        };
        try {
            const result = state === "single" ? await AuthorizeClaimsApi(payloadWithAction, type, claimId): await GroupAuthorizeClaimsApi(payloadWithAction, type, claimId);
            if (result.status === 200) {
                setLoading(false);
                setPayload({
                    authorizationCode: '',
                    approvalCode: '',
                });
                setAction('approve');
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
                    <Flex direction="column" mb={4}>
                        <Text fontWeight="bold" mb={2}>Action *</Text>
                        <RadioGroup onChange={setAction} value={action}>
                            <Stack direction="row" spacing={4}>
                                <Radio value="approve" colorScheme="red">Approve</Radio>
                                <Radio value="reject" colorScheme="red">Reject</Radio>
                            </Stack>
                        </RadioGroup>
                    </Flex>
                    <SimpleGrid columns={{ base: 1, md: 1 }} spacing={4}>
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
