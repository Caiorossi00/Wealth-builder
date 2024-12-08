import React from "react";
import "../../assets/css/Home.css";
import star from "../../assets/images/star.png";
import piggy from "../../assets/images/piggy.svg";
import InvestmentList from "../InvestmentList";

const Home = () => {
  return (
    <div className="home">
      <div className="container-home">
        <div className="home-left-side">
          <div className="text-home">
            <h1>Wealth Builder</h1>
            <p>Viva enquanto seu dinheiro hiberna.</p>
          </div>
          <InvestmentList />
        </div>
        <div className="home-right-side">
          <img src={star} alt="Star" className="star-right" />
          <img src={piggy} alt="Piggy" className="piggy-right" />
        </div>
      </div>
    </div>
  );
};

export default Home;
