import { Box, HStack, Select, Stack, SimpleGrid } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { AiFillCloseCircle, AiOutlineFieldNumber, AiOutlineSearch } from 'react-icons/ai'
import { SettingsApi } from "../Utils/ApiCalls";
import Input from './Input'
import { FaCompressAlt } from "react-icons/fa";
import { CgArrangeFront } from "react-icons/cg";
import { BiUnite } from "react-icons/bi";


export default function DiagnosisCard({ Payload, setPayload, oldItem = [], data, i}) {
   

    let itemToUpdate = oldItem;

    const handleDiagnosis = (e) => {
        //get the item index to update
        let objIndex = itemToUpdate.findIndex((obj, index) => index == i);


        itemToUpdate[objIndex].diagnosis = e.target.value

        setPayload({ ...Payload, alldiagnosis: itemToUpdate });
    }

    const handleNote = (e) => {
        let objIndex = itemToUpdate.findIndex((obj, index) => index == i);


        itemToUpdate[objIndex].note = e.target.value

        setPayload({ ...Payload, alldiagnosis: itemToUpdate });
    }


    const removeItem = () => {
        let newItem = oldItem.filter((obj, index) => (
            index !== i
        ))

        setPayload({ ...Payload, alldiagnosis: newItem })
    }




    useEffect(() => {


    }, []);

    return (
        <Stack spacing={"10px"} mt="10px">
            <Box cursor={"pointer"} onClick={removeItem} display={"flex"} justifyContent="flex-end"><AiFillCloseCircle /></Box>

            <SimpleGrid mt="32px" columns={{ base: 1, md: 2 }} spacing={4}>




                <Input leftIcon={<BiUnite />} label="Diagnosis" onChange={handleDiagnosis} value={data.diagnosis} id="diagnosis" val={data.diagnosis !== "" ? true : false} />
                <Input leftIcon={<CgArrangeFront />} onChange={handleNote} label="Note" value={data.note} id="note" val={data.note !== "" ? true : false} />


            </SimpleGrid>

        </Stack>
    )
}
