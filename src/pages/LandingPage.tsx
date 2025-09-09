import { Box, Button, Heading, VStack, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <Box
      h="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
    >
      <VStack gap={6}>
        <Heading size="lg">You are the:</Heading>
        <Text>Select your role</Text>
        <Button colorScheme="blue" size="lg" onClick={() => navigate("/borrower")}>
          Borrower
        </Button>
        <Button colorScheme="teal" size="lg" onClick={() => navigate("/lender")}>
          Lender
        </Button>
      </VStack>
    </Box>
  );
}

export default LandingPage;
