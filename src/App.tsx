import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import BorrowerPage from "./pages/BorrowerPage";
import LenderPage from "./pages/LenderPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/borrower" element={<BorrowerPage />} />
      <Route path="/lender" element={<LenderPage />} />
    </Routes>
  );
}

export default App;
