import React from "react";
import Home from "./components/routes/Home";
import Navbar from "./components/Navbar";
import "./App.css";
import Footer from "./components/Footer";

const App = () => {
  return (
    <div className="App">
      <Navbar />
      <Home />
      <Footer />
    </div>
  );
};

export default App;
