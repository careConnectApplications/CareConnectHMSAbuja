import { Box, Select, Stack, SimpleGrid } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';
import { GetTestComponentByTestNameApi } from "../Utils/ApiCalls";
import Input from './Input';
import { FaCompressAlt } from "react-icons/fa";
import { CgArrangeFront } from "react-icons/cg";
import { BiUnite } from "react-icons/bi";

export default function ProcessLabCard({ Payload, setPayload, oldItem = [], data, i, testName }) {
  // State to store the subcomponent options from the API
  const [subComponentOptions, setSubComponentOptions] = useState([]);

  // Fetch the subcomponents for the given test name
  const getTestComponents = async () => {
    try {
      const response = await GetTestComponentByTestNameApi(testName);
      if (
        response?.queryresult?.testcomponentdetails &&
        response.queryresult.testcomponentdetails.length > 0
      ) {
        // Extract the subcomponents array from the first returned test component
        const subComponents = response.queryresult.testcomponentdetails[0].subcomponients;
        setSubComponentOptions(subComponents);
      }
    } catch (error) {
      console.error("Error fetching test components: ", error);
    }
  };

  useEffect(() => {
    if (testName) {
      getTestComponents();
    }
  }, [testName]);

  // Handler functions update the relevant field of the current subcomponent entry.
  const handleSubcomponent = (e) => {
    const updatedItems = [...oldItem];
    updatedItems[i].subcomponent = e.target.value;
    setPayload({ ...Payload, subcomponents: updatedItems });
  };

  const handleResult = (e) => {
    const updatedItems = [...oldItem];
    updatedItems[i].result = e.target.value;
    setPayload({ ...Payload, subcomponents: updatedItems });
  };

  const handleNRanges = (e) => {
    const updatedItems = [...oldItem];
    updatedItems[i].nranges = e.target.value;
    setPayload({ ...Payload, subcomponents: updatedItems });
  };

  const handleUnit = (e) => {
    const updatedItems = [...oldItem];
    updatedItems[i].unit = e.target.value;
    setPayload({ ...Payload, subcomponents: updatedItems });
  };

  const removeItem = () => {
    const newItem = oldItem.filter((_, index) => index !== i);
    setPayload({ ...Payload, subcomponents: newItem });
  };

  return (
    <Stack spacing="10px" mt="10px">
      {/* Remove button (hidden for the first item) */}
      <Box 
        cursor="pointer" 
        onClick={removeItem} 
        display={i === 0 ? "none" : "flex"} 
        justifyContent="flex-end"
      >
        <AiFillCloseCircle />
      </Box>
      <SimpleGrid mt="32px" columns={{ base: 1, md: 2 }} spacing={4}>
        {/* Subcomponent Dropdown */}
        <Select
          onChange={handleSubcomponent}
          placeholder="Select Subcomponent"
          border="2px solid"
          id="subcomponent"
          value={data.subcomponent}
          size="lg"
          fontSize={data.subcomponent ? "16px" : "13px"}
          borderColor="gray.500"
        >
          {subComponentOptions?.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </Select>

        {/* Result Input */}
        <Input
          leftIcon={<FaCompressAlt />}
          onChange={handleResult}
          label="Result"
          value={data.result}
          id="result"
          val={data.result !== "" ? true : false}
        />

        {/* NRanges Input */}
        <Input
          leftIcon={<CgArrangeFront />}
          onChange={handleNRanges}
          label="NRanges"
          value={data.nranges}
          id="nranges"
          val={data.nranges !== "" ? true : false}
        />

        {/* Unit Input */}
        <Input
          leftIcon={<BiUnite />}
          label="Unit"
          onChange={handleUnit}
          value={data.unit}
          id="unit"
          val={data.unit !== "" ? true : false}
        />
      </SimpleGrid>
    </Stack>
  );
}
