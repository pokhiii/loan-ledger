/**
 * 📘 contractABI.ts
 *
 * In blockchain, a **smart contract** is like a program deployed on the blockchain.
 * To interact with it from our frontend (React app), we don’t need the entire Solidity source code,
 * we just need a description of:
 *   - What functions exist
 *   - What inputs they take
 *   - What outputs they return
 *   - What events they emit
 *
 * That description is called the **ABI (Application Binary Interface)**.
 *
 * 👉 Think of ABI like a "menu card" for the smart contract:
 *     - It doesn’t tell you how the kitchen (Solidity code) works,
 *     - It just tells you what dishes (functions) you can order, and what you’ll get back.
 *
 * In our Loan Ledger app, this file holds the **minimal ABI** we need to:
 *   - Read loan details (borrower, lender, amount, balance)
 *   - Record repayments
 *   - Listen to repayment events
 */

export const loanLedgerABI = [
  // 🏦 Returns the address of the borrower
  // Example: "0xabc123..." (Ethereum wallet address of employee)
  "function borrower() view returns (address)",

  // 🏦 Returns the address of the lender
  // Example: "0xdef456..." (Ethereum wallet address of ColoredCow/company)
  "function lender() view returns (address)",

  // 💰 Returns the total loan amount (at the start)
  // Example: 100000 (representing ₹1,00,000 in our demo)
  "function loanAmount() view returns (uint256)",

  // 📉 Returns the current outstanding balance
  // Example: if loan was 100000 and you paid 20000, this returns 80000
  "function balance() view returns (uint256)",

  // 📝 Records a repayment of a given amount
  // Example: recordPayment(10000) → reduces balance by 10000
  "function recordPayment(uint256 amount)",

  // 🔍 Reads the balance (same as balance(), but explicitly included)
  // Note: Some contracts expose multiple ways to read state
  "function getBalance() view returns (uint256)",

  // 📢 Event that gets emitted when a payment is recorded
  // Logs who paid, how much, and what the remaining balance is
  // Example log: PaymentRecorded(0xabc123, 10000, 90000)
  "event PaymentRecorded(address from, uint amount, uint remaining)"
];
