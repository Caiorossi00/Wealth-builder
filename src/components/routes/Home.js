import React from "react";
import InvestmentList from "../InvestmentList";
import "../../assets/css/Home.css";
import star from "../../assets/images/star.png";
import piggy from "../../assets/images/piggy.svg";

const Home = () => {
  return (
    <div className="home">
      <div className="container-home">
        <div className="home-left-side">
          <div className="text-home">
            <h1>Wealth Builder</h1>
            <p>Lorem Ipsum</p>
          </div>
          <InvestmentList />
        </div>
        <div className="home-right-side">
          <img src={star} alt="Star" className="star-right" />
          <img src={piggy} alt="piggy" className="piggy-right" />
        </div>
      </div>
    </div>
  );
};

export default Home;
