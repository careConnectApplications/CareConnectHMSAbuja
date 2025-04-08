import { Box, HStack, Select, Stack, SimpleGrid } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { AiFillCloseCircle, AiOutlineFieldNumber, AiOutlineSearch } from 'react-icons/ai'
import { SettingsApi } from "../Utils/ApiCalls";
import Input from './Input'
import { MdDateRange } from "react-icons/md";
import { CgArrangeFront } from "react-icons/cg";
import { BiUnite } from "react-icons/bi";
import { FaNoteSticky } from "react-icons/fa6";


export default function PastObstetricCard({ Payload, setPayload, oldItem = [], data, i, testName }) {
    const [Data, setData] = useState([]);
    const [SearchText, setSearchText] = useState("");
    const [Settings, setSettings] = useState({});

    const [Switch, setSwitch] = useState(false);

    let itemToUpdate = oldItem;




   

    const handleYear = (e) => {
        //get the item index to update
        let objIndex = itemToUpdate.findIndex((obj, index) => index == i);

        // console.log("idd", objIndex, itemToUpdate[objIndex]);

        itemToUpdate[objIndex].year = e.target.value

        setPayload({ ...Payload, obstetrichistory: itemToUpdate });
    }
    const handleSex = (e) => {
        //get the item index to update
        let objIndex = itemToUpdate.findIndex((obj, index) => index == i);

        // console.log("idd", objIndex, itemToUpdate[objIndex]);

        itemToUpdate[objIndex].sexofchild = e.target.value

        setPayload({ ...Payload, obstetrichistory: itemToUpdate });
    }
    const handleGestage = (e) => {
        //get the item index to update
        let objIndex = itemToUpdate.findIndex((obj, index) => index == i);

        // console.log("idd", objIndex, itemToUpdate[objIndex]);

        itemToUpdate[objIndex].gestage = e.target.value

        setPayload({ ...Payload, obstetrichistory: itemToUpdate });
    }
    const handleBirthWeight = (e) => {
        //get the item index to update
        let objIndex = itemToUpdate.findIndex((obj, index) => index == i);

        // console.log("idd", objIndex, itemToUpdate[objIndex]);

        itemToUpdate[objIndex].birthweight = e.target.value

        setPayload({ ...Payload, obstetrichistory: itemToUpdate });
    }
    const handleLengthOfLabour = (e) => {
        //get the item index to update
        let objIndex = itemToUpdate.findIndex((obj, index) => index == i);

        // console.log("idd", objIndex, itemToUpdate[objIndex]);

        itemToUpdate[objIndex].lengthoflabour = e.target.value

        setPayload({ ...Payload, obstetrichistory: itemToUpdate });
    }
    const handleProblemsDuringPregnancy = (e) => {
        //get the item index to update
        let objIndex = itemToUpdate.findIndex((obj, index) => index == i);

        // console.log("idd", objIndex, itemToUpdate[objIndex]);

        itemToUpdate[objIndex].problemsduringpregancy = e.target.value

        setPayload({ ...Payload, obstetrichistory: itemToUpdate });
    }
    const handleProblemsDuringDelivery = (e) => {
        //get the item index to update
        let objIndex = itemToUpdate.findIndex((obj, index) => index == i);

        // console.log("idd", objIndex, itemToUpdate[objIndex]);

        itemToUpdate[objIndex].problemsduringdelivery = e.target.value

        setPayload({ ...Payload, obstetrichistory: itemToUpdate });
    }
    const handleProblemsAfterDelivery = (e) => {
        //get the item index to update
        let objIndex = itemToUpdate.findIndex((obj, index) => index == i);

        // console.log("idd", objIndex, itemToUpdate[objIndex]);

        itemToUpdate[objIndex].problemsafterdelivery = e.target.value

        setPayload({ ...Payload, obstetrichistory: itemToUpdate });
    }
    const handleModeOfDelivery = (e) => {
        //get the item index to update
        let objIndex = itemToUpdate.findIndex((obj, index) => index == i);

        // console.log("idd", objIndex, itemToUpdate[objIndex]);

        itemToUpdate[objIndex].modeofdelivery = e.target.value

        setPayload({ ...Payload, obstetrichistory: itemToUpdate });
    }
    const handlePlaceOfLabour = (e) => {
        //get the item index to update
        let objIndex = itemToUpdate.findIndex((obj, index) => index == i);

        // console.log("idd", objIndex, itemToUpdate[objIndex]);

        itemToUpdate[objIndex].placeofbirth = e.target.value

        setPayload({ ...Payload, obstetrichistory: itemToUpdate });
    }
    const handleTypeOfLabour = (e) => {
        //get the item index to update
        let objIndex = itemToUpdate.findIndex((obj, index) => index == i);

        // console.log("idd", objIndex, itemToUpdate[objIndex]);

        itemToUpdate[objIndex].typeofbirth = e.target.value

        setPayload({ ...Payload, obstetrichistory: itemToUpdate });
    }
    const handleComment = (e) => {
        //get the item index to update
        let objIndex = itemToUpdate.findIndex((obj, index) => index == i);

        // console.log("idd", objIndex, itemToUpdate[objIndex]);

        itemToUpdate[objIndex].comment = e.target.value

        setPayload({ ...Payload, obstetrichistory: itemToUpdate });
    }

    const removeItem = () => {
        let newItem = oldItem.filter((obj, index) => (
            index !== i
        ))

        setPayload({ ...Payload, obstetrichistory: newItem })
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
                            <Select
                                onChange={handleSex}
                                placeholder="Select Sex of Child"
                                border="2px solid"
                                id="sexofchild" value={data.sexofchild}
                                size="lg"
                                fontSize={data.sexofchild !== "" ? "16px" : "13px"}
                                borderColor="gray.500"
                            >
                               

                                        <option value={"Male"}>Male</option>
                                        <option value={"Female"}>Female</option>
                                       
                             
                            </Select>

                            <Input leftIcon={<BiUnite />} label="Gestage"  onChange={handleGestage}  value={data.gestage}  id="gestage" val={data.gestage !== "" ? true : false} />
                            <Input leftIcon={<BiUnite />} label="Birth Weight"  onChange={handleBirthWeight}  value={data.birthweight}  id="birthweight" val={data.birthweight !== "" ? true : false} />
                            <Input leftIcon={<BiUnite />} label="Length Of Labour"  onChange={handleLengthOfLabour}  value={data.lengthoflabour}  id="lengthoflabour" val={data.lengthoflabour !== "" ? true : false} />
                            <Input leftIcon={<BiUnite />} label="Problems During Pregnancy"  onChange={handleProblemsDuringPregnancy}  value={data.problemsduringpregancy}  id="problemsduringpregancy" val={data.problemsduringpregancy !== "" ? true : false} />
                            <Input leftIcon={<BiUnite />} label="Problems During Delivery"  onChange={handleProblemsDuringDelivery}  value={data.problemsduringdelivery}  id="problemsduringdelivery" val={data.problemsduringdelivery !== "" ? true : false} />
                            <Input leftIcon={<BiUnite />} label="Problems After Delivery"  onChange={handleProblemsAfterDelivery}  value={data.problemsafterdelivery}  id="problemsafterdelivery" val={data.problemsafterdelivery !== "" ? true : false} />
                            <Input leftIcon={<BiUnite />} label="Mode Of  Delivery"  onChange={handleModeOfDelivery}  value={data.modeofdelivery}  id="modeofdelivery" val={data.modeofdelivery !== "" ? true : false} />
                            <Input leftIcon={<BiUnite />} label="Place Of Labour"  onChange={handlePlaceOfLabour}  value={data.placeofbirth}  id="placeofbirth" val={data.placeofbirth !== "" ? true : false} />
                            <Input leftIcon={<BiUnite />} label="Type Of Labour"  onChange={handleTypeOfLabour}  value={data.typeofbirth}  id="typeofbirth" val={data.typeofbirth !== "" ? true : false} />
                            <Input leftIcon={<FaNoteSticky />} label="Comments"  onChange={handleComment}  value={data.comment}  id="comment" val={data.comment !== "" ? true : false} />


                        </SimpleGrid>

        </Stack>
    )
}
