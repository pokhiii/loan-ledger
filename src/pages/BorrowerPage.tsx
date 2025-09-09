import { useState } from "react";
import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import { ethers } from "ethers";
import { loanLedgerABI } from "../contractABI";

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS as string;
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

function BorrowerPage() {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>("");

  const connectBorrower = async () => {
    const accounts = await provider.listAccounts();
    const borrower = accounts[1].address;
    setAccount(borrower);
    await loadBalance(borrower);
  };

  const loadBalance = async (addr: string) => {
    const signer = await provider.getSigner(addr);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, loanLedgerABI, signer);
    const bal = await contract.getBalance();
    setBalance(bal.toString());
  };

  const recordPayment = async (amount: number) => {
    if (!account) return;
    const signer = await provider.getSigner(account);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, loanLedgerABI, signer);
    const tx = await contract.recordPayment(amount);
    await tx.wait();
    loadBalance(account);
  };

  return (
    <Box p={8}>
      <Heading mb={4}>Borrower Dashboard</Heading>
      {!account ? (
        <Button colorScheme="blue" onClick={connectBorrower}>
          Connect as Borrower
        </Button>
      ) : (
        <>
          <Text>Connected: {account}</Text>
          <Text>Outstanding Balance: {balance}</Text>
          <VStack gap={4} marginTop={4}>
            <Button colorScheme="green" onClick={() => recordPayment(10000)}>
              Pay 10,000
            </Button>
            <Button colorScheme="orange" onClick={() => recordPayment(5000)}>
              Pay 5,000
            </Button>
          </VStack>
        </>
      )}
    </Box>
  );
}

export default BorrowerPage;
