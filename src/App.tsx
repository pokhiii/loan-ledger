import React, { useState } from "react";
import { ethers } from "ethers";
import { loanLedgerABI } from "./contractABI";

const CONTRACT_ADDRESS =
  process.env.REACT_APP_CONTRACT_ADDRESS ||
  "0x0000000000000000000000000000000000000000";

function App() {
  // 🗝️ State variables
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>("");
  const [role, setRole] = useState<string>(""); // Borrower, Lender, or Viewer

  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

  /**
   * 🔌 Connect wallet
   * - Accepts an index (0 = lender, 1 = borrower, etc.)
   */
  const connectWallet = async (index: number) => {
    const accounts = await provider.listAccounts();
    const selectedAccount = accounts[index].address;
    setAccount(selectedAccount);

    await loadRole(selectedAccount);
    await loadBalance(selectedAccount);
  };

  /**
   * 🎭 Determine role (Borrower or Lender)
   */
  const loadRole = async (connectedAccount: string) => {
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      loanLedgerABI,
      provider
    );

    const borrower = await contract.borrower();
    const lender = await contract.lender();

    if (connectedAccount.toLowerCase() === borrower.toLowerCase()) {
      setRole("Borrower");
    } else if (connectedAccount.toLowerCase() === lender.toLowerCase()) {
      setRole("Lender");
    } else {
      setRole("Viewer");
    }
  };

  /**
   * 📖 Load current loan balance
   */
  const loadBalance = async (connectedAccount: string) => {
    const signer = await provider.getSigner(connectedAccount);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, loanLedgerABI, signer);
    const bal = await contract.getBalance();
    setBalance(bal.toString());
  };

  /**
   * 💸 Record a repayment (only borrower allowed)
   */
  const recordPayment = async (amount: number) => {
    if (!account || role !== "Borrower") return;
    const signer = await provider.getSigner(account);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, loanLedgerABI, signer);

    const tx = await contract.recordPayment(amount);
    await tx.wait();

    loadBalance(account);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Loan Ledger</h1>

      {/* 🔗 Wallet connect buttons for demo */}
      {!account ? (
        <div>
          <button onClick={() => connectWallet(0)}>
            Connect as Lender (Account #0)
          </button>
          <button onClick={() => connectWallet(1)}>
            Connect as Borrower (Account #1)
          </button>
        </div>
      ) : (
        <p>
          Connected: {account} <br />
          Role: <strong>{role || "Unknown"}</strong>
        </p>
      )}

      {/* 📊 Loan balance */}
      {balance && <h2>Outstanding Balance: {balance}</h2>}

      {/* 💸 Borrower-only actions */}
      {role === "Borrower" && (
        <>
          <button onClick={() => recordPayment(10000)}>Pay 10,000</button>
          <button onClick={() => recordPayment(5000)}>Pay 5,000</button>
        </>
      )}

      {/* 👀 Lender view */}
      {role === "Lender" && (
        <p>You are the lender. You can only view the loan balance.</p>
      )}

      {/* 🔒 Viewer fallback */}
      {role === "Viewer" && (
        <p>You are not part of this loan. You can only view the balance.</p>
      )}
    </div>
  );
}

export default App;
