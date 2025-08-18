import { HStack, Text } from "@chakra-ui/react";
import React from "react";
import MainLayout from "../Layouts/Index";
import Seo from "../Utils/Seo";

export default function Claims() {
  return (
    <MainLayout>
      <Seo title="Claims" description="Care Connect Claims" />

      <HStack>
        <Text color="#1F2937" fontWeight="600" fontSize="19px">
          Claims
        </Text>
      </HStack>
      <Text color="#686C75" mt="9px" fontWeight="400" fontSize="15px">
        Manage and view all claims.
      </Text>
    </MainLayout>
  );
}
