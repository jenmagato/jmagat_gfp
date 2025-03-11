// src/App.tsx

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Account from "./pages/Account";
import IssueDetails from "./pages/IssueDetails";
import "bootstrap/dist/css/bootstrap.min.css";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Account />} />
        <Route
          path="/issue/:username/:repository/:id"
          element={<IssueDetails />}
        />
      </Routes>
    </Router>
  );
};

export default App;
