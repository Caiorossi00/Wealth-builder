// Home.jsx
import React from "react";
import InvestmentList from "../InvestmentList"; // Importando InvestmentList

const Home = () => {
  return (
    <div>
      <h1>Bem-vindo ao Gerenciamento de Investimentos</h1>
      <InvestmentList />
    </div>
  );
};

export default Home;
