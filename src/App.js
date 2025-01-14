import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/routes/Home";
import Login from "./components/routes/Login";
import MonthAportes from "./components/routes/MonthAportes";

import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Login />} />
          <Route path="/aportes" element={<MonthAportes />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
