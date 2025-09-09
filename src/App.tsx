import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { loanLedgerABI } from "./contractABI";

// 👉 Replace with the deployed contract address from Remix/Sepolia
const CONTRACT_ADDRESS = "0xYourContractAddressHere";

function App() {
  // 🗝️ State to store connected wallet address
  const [account, setAccount] = useState<string | null>(null);

  // 📉 State to store current outstanding loan balance
  const [balance, setBalance] = useState<string>("");

  /**
   * 🔌 Connect wallet (MetaMask)
   * - Requests access to user's Ethereum accounts
   * - Stores the first account in state
   * - Calls loadBalance() to read from blockchain
   */
  const connectWallet = async () => {
    if ((window as any).ethereum) {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      loadBalance(provider);
    } else {
      alert("Please install MetaMask!");
    }
  };

  /**
   * 📖 Load the loan balance from blockchain
   * - Uses ethers.js Contract object
   * - Calls getBalance() from our smart contract
   */
  const loadBalance = async (provider: any) => {
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, loanLedgerABI, signer);
    const bal = await contract.getBalance();
    setBalance(bal.toString());
  };

  /**
   * 💸 Record a repayment
   * - Calls recordPayment(amount) on the contract
   * - Waits for transaction to confirm
   * - Reloads the balance after payment
   */
  const recordPayment = async (amount: number) => {
    if (!account) return;
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, loanLedgerABI, signer);

    const tx = await contract.recordPayment(amount); // submit tx
    await tx.wait(); // wait for mining confirmation

    loadBalance(provider);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Loan Ledger</h1>

      {/* 🔗 Wallet connect button */}
      {!account ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <p>Connected: {account}</p>
      )}

      {/* 📊 Show current loan balance */}
      <h2>Outstanding Balance: {balance}</h2>

      {/* 💸 Payment buttons */}
      <button onClick={() => recordPayment(10000)}>Pay 10,000</button>
      <button onClick={() => recordPayment(5000)}>Pay 5,000</button>
    </div>
  );
}

export default App;
