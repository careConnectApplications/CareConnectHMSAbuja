import React from "react";
import { Box, SimpleGrid, Select, Flex } from "@chakra-ui/react";
import Input from "./Input";
import PatientSearchInput from "./PatientSearchInput"; // Import the new component
import Button from "./Button";

const AdvancedSearchFilter = ({ fields, payload, onInputChange, onPatientSelect, onFilter, onClear }) => {
  const renderField = (field) => {
    switch (field.type) {
      case "text":
      case "number":
      case "date":
        return (
          <Box key={field.name}>
            <Input
              type={field.type}
              name={field.name}
              value={payload[field.name] || ""}
              onChange={onInputChange}
              label={field.label}
              bColor="#E4E4E4"
            />
          </Box>
        );
      case "select":
        return (
          <Box key={field.name}>
            <Select
              placeholder={field.label}
              name={field.name}
              value={payload[field.name] || ""}
              onChange={onInputChange}
              borderColor="#E4E4E4"
              h="45px"
              borderRadius="5px"
              fontSize={payload[field.name] ? "14px" : "12px"}
            >
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Box>
        );
      case "patient-search":
        return (
          <Box key={field.name}>
            <PatientSearchInput
              onPatientSelect={onPatientSelect}
              initialValue={payload[field.name] || ""}
            />
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box mt="16px">
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
        {fields.map(renderField)}
      </SimpleGrid>
      <Flex mt="20px" justifyContent="flex-end" gap="12px">
        <Button
          onClick={onClear}
          background="#fff"
          border="1px solid #E4E4E4"
          color="#667085"
          w={["100%", "100%", "120px", "120px"]}
        >
          Clear
        </Button>
        <Button
          onClick={onFilter}
          background="#1F2937"
          color="#fff"
          w={["100%", "100%", "120px", "120px"]}
        >
          Filter
        </Button>
      </Flex>
    </Box>
  );
};

export default AdvancedSearchFilter;
