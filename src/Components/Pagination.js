import { Box, Flex, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

export default function Pagination({ postPerPage, totalPosts, paginate, currentPage }) {
  // Define the block size of visible page numbers (15 in this case)
  const pageBlockSize = 15

  // Set the initial minimum and maximum page numbers visible
  const [minPageNumberLimit, setMinPageNumberLimit] = useState(1)
  const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(pageBlockSize)

  // Create an array of all page numbers
  const pageNumbers = []
  const totalPages = Math.ceil(totalPosts / postPerPage)
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i)
  }

  // Handler for "Next" button: shift the page block forward
  const handleNext = () => {
    setMinPageNumberLimit(minPageNumberLimit + pageBlockSize)
    setMaxPageNumberLimit(maxPageNumberLimit + pageBlockSize)
  }

  // Handler for "Previous" button: shift the page block backward
  const handlePrev = () => {
    setMinPageNumberLimit(minPageNumberLimit - pageBlockSize)
    setMaxPageNumberLimit(maxPageNumberLimit - pageBlockSize)
  }

  return (
    <Box my="6px" mx="10px">
      {pageNumbers.length > 1 && (
        <Flex justifyContent="center" flexWrap="wrap" maxW="100%" color="#fff" cursor="pointer">
          {/* Show Previous arrow only if not at the beginning */}
          {minPageNumberLimit > 1 && (
            <Text
              onClick={handlePrev}
              bg="blue.blue500"               // Arrow default background (switched from numbers)
              _hover={{ bg: "blue.blue400" }} // Arrow hover background (switched from numbers)
              mx="2"
              px="10px"
              py="5px"
              rounded="8px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <FaChevronLeft />
            </Text>
          )}

          {/* Display only the page numbers in the current block */}
          {pageNumbers
            .filter(number => number >= minPageNumberLimit && number <= maxPageNumberLimit)
            .map(number => (
              <Text
                key={number}
                onClick={() => paginate(number)}
                fontSize="10px"
                textAlign="center"
                my="2px"
                mx="2px"
                rounded="8px"
                px="10px"
                py="5px"
                bg={currentPage === number ? "blue.blue500" : "blue.blue400"}
                _hover={{ bg: "blue.blue500" }}
              >
                {number}
              </Text>
          ))}

          {/* Show Next arrow if there are more pages */}
          {maxPageNumberLimit < totalPages && (
            <Text
              onClick={handleNext}
              bg="blue.blue500"               // Arrow default background (switched from numbers)
              _hover={{ bg: "blue.blue400" }} // Arrow hover background (switched from numbers)
              mx="2"
              px="10px"
              py="5px"
              rounded="8px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <FaChevronRight />
            </Text>
          )}
        </Flex>
      )}
    </Box>
  )
}
