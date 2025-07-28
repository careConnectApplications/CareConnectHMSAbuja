import { Box, HStack, Select, Stack, SimpleGrid } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { AiFillCloseCircle, AiOutlineFieldNumber, AiOutlineSearch } from 'react-icons/ai'
import { SettingsApi } from "../Utils/ApiCalls";
import Input from './Input'
import { MdDateRange } from "react-icons/md";
import { CgArrangeFront } from "react-icons/cg";
import { BiUnite } from "react-icons/bi";
import { FaNoteSticky } from "react-icons/fa6";


export default function PreviousPregnancyCard({ Payload, setPayload, oldItem = [], data, i, testName }) {
    const [Data, setData] = useState([]);

    const [Settings, setSettings] = useState({});


    let itemToUpdate = oldItem;



    const handleYear = (e) => {
        //get the item index to update
        let objIndex = itemToUpdate.findIndex((obj, index) => index == i);

        // console.log("idd", objIndex, itemToUpdate[objIndex]);

        itemToUpdate[objIndex].year = e.target.value

        setPayload({ ...Payload, previouspregnancy: itemToUpdate });
    }
   
    const handledurationpregnancy = (e) => {
        //get the item index to update
        let objIndex = itemToUpdate.findIndex((obj, index) => index == i);

        // console.log("idd", objIndex, itemToUpdate[objIndex]);

        itemToUpdate[objIndex].durationpregnancy = e.target.value

        setPayload({ ...Payload, previouspregnancy: itemToUpdate });
    }
    const handleantenatalcomplication = (e) => {
        //get the item index to update
        let objIndex = itemToUpdate.findIndex((obj, index) => index == i);

        // console.log("idd", objIndex, itemToUpdate[objIndex]);

        itemToUpdate[objIndex].antenatalcomplication = e.target.value

        setPayload({ ...Payload, previouspregnancy: itemToUpdate });
    }
    const handlelabour = (e) => {
        //get the item index to update
        let objIndex = itemToUpdate.findIndex((obj, index) => index == i);

        // console.log("idd", objIndex, itemToUpdate[objIndex]);

        itemToUpdate[objIndex].labour = e.target.value

        setPayload({ ...Payload, previouspregnancy: itemToUpdate });
    }
    const handlepuerperium = (e) => {
        //get the item index to update
        let objIndex = itemToUpdate.findIndex((obj, index) => index == i);

        // console.log("idd", objIndex, itemToUpdate[objIndex]);

        itemToUpdate[objIndex].puerperium = e.target.value

        setPayload({ ...Payload, previouspregnancy: itemToUpdate });
    }
    const handlesex = (e) => {
        //get the item index to update
        let objIndex = itemToUpdate.findIndex((obj, index) => index == i);

        // console.log("idd", objIndex, itemToUpdate[objIndex]);

        itemToUpdate[objIndex].sex = e.target.value

        setPayload({ ...Payload, previouspregnancy: itemToUpdate });
    }
    const handlebirthWeight = (e) => {
        //get the item index to update
        let objIndex = itemToUpdate.findIndex((obj, index) => index == i);

        // console.log("idd", objIndex, itemToUpdate[objIndex]);

        itemToUpdate[objIndex].birthWeight = e.target.value

        setPayload({ ...Payload, previouspregnancy: itemToUpdate });
    }
   
    const removeItem = () => {
        let newItem = oldItem.filter((obj, index) => (
            index !== i
        ))

        setPayload({ ...Payload, previouspregnancy: newItem })
    }

    const getSettings = async () => {
        try {
            const result = await SettingsApi();

            console.log("getSettings", result)

            let checker = result?.testsubcomponent?.filter(item => item.type === testName)[0]?.subcomponent

            console.log("checkerX", checker)
            setData(checker)
            setSettings(result);
        } catch (e) {

        }
    };

    


    useEffect(() => {
        getSettings()

    }, []);

    return (
        <Stack spacing={"10px"} mt="10px">
            <Box cursor={"pointer"} onClick={removeItem} display={i == 0 ? "none" : "flex"} justifyContent="flex-end"><AiFillCloseCircle /></Box>
           
            <SimpleGrid mt="32px" columns={{ base: 1, md: 2 }} spacing={4}>

          

                            <Input leftIcon={<MdDateRange />} onChange={handleYear} label="Year" type="date"  value={data.year}  id="year" val={data.year !== "" ? true : false} />
                          
                            <Input leftIcon={<BiUnite />} label="Duration of Pregnancy"  onChange={handledurationpregnancy}  value={data.durationpregnancy}  id="durationpregnancy" val={data.durationpregnancy !== "" ? true : false} />
                            <Input leftIcon={<BiUnite />} label="Antenatal Complication"  onChange={handleantenatalcomplication}  value={data.antenatalcomplication}  id="antenatalcomplication" val={data.antenatalcomplication !== "" ? true : false} />
                            <Input leftIcon={<BiUnite />} label="Labour"  onChange={handlelabour}  value={data.labour}  id="labour" val={data.labour !== "" ? true : false} />
                            <Input leftIcon={<BiUnite />} label="Puerperium"  onChange={handlepuerperium}  value={data.puerperium}  id="puerperium" val={data.puerperium !== "" ? true : false} />
                            <Input leftIcon={<BiUnite />} label="Sex"  onChange={handlesex}  value={data.sex}  id="sex" val={data.sex !== "" ? true : false} />
                            <Input leftIcon={<BiUnite />} label="Birth Weight"  onChange={handlebirthWeight}  value={data.birthWeight}  id="birthWeight" val={data.birthWeight !== "" ? true : false} />
                           

                        </SimpleGrid>

        </Stack>
    )
}
