import { useState } from "react";
import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { ethers } from "ethers";
import { loanLedgerABI } from "../contractABI";

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS as string;
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

function LenderPage() {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>("");

  const connectLender = async () => {
    const accounts = await provider.listAccounts();
    const lender = accounts[0].address;
    setAccount(lender);
    await loadBalance(lender);
  };

  const loadBalance = async (addr: string) => {
    const signer = await provider.getSigner(addr);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, loanLedgerABI, signer);
    const bal = await contract.getBalance();
    setBalance(bal.toString());
  };

  return (
    <Box p={8}>
      <Heading mb={4}>Lender Dashboard</Heading>
      {!account ? (
        <Button colorScheme="teal" onClick={connectLender}>
          Connect as Lender
        </Button>
      ) : (
        <>
          <Text>Connected: {account}</Text>
          <Text>Outstanding Balance: {balance}</Text>
          <Text mt={4} color="gray.600">
            You are the lender. You can only view repayments.
          </Text>
        </>
      )}
    </Box>
  );
}

export default LenderPage;
