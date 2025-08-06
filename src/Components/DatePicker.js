import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Box,
  FormControl,
  FormLabel,
  Input as InputBox,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
} from '@chakra-ui/react';
import { MdDateRange } from 'react-icons/md';

export default function DatePickerComponent({
  id,
  label,
  selected,
  onChange,
  ...rest
}) {
  const labelBg = useColorModeValue('#fff', 'gray.800');
  const [active, setActive] = useState(rest.value);

  return (
    <FormControl id={id} pos="relative" zIndex="10" >
      <FormLabel
        pos="absolute"
        transform={`translateY(-14px) translateX(30px)`}
        bottom={'3'}
        zIndex="10"
        fontSize={'xs'}
        fontWeight="400"
        color="#000"
        bg={labelBg}
        px="4px"
        textTransform="capitalize"
      >
        {label}
      </FormLabel>
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          children={<Box as={MdDateRange} color="gray.400" />}
          color={active ? "blue.blue500" : "#6B7280"}
        />
        <DatePicker
        
          zIndex="100"
          
          id={id}
          selected={selected}
          onChange={onChange}
          dateFormat="dd/MM/yyyy"
          customInput={<InputBox {...rest} pl="10" _focus={{ borderColor: "blue.blue500" }} borderWidth="2px" borderColor = "#6B7280" _hover={{borderColor: "#7A27AB"}} />}
        />
      </InputGroup>
    </FormControl>
  );
}
