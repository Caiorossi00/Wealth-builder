import React from "react";
import InvestmentList from "../InvestmentList";
import "../../assets/css/Home.css";

const Home = () => {
  return (
    <div className="home">
      <div className="container-home">
        <div className="text-home">
          <h1>Wealth Builder</h1>
          <p>Lorem Ipsum</p>
        </div>
        <InvestmentList />
      </div>
    </div>
  );
};

export default Home;
