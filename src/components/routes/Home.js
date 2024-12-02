import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import InvestmentList from "../InvestmentList";
import "../../assets/css/Home.css";
import star from "../../assets/images/star.png";
import piggy from "../../assets/images/piggy.svg";

const Home = () => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadInvestments = async () => {
    const db = getFirestore();
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error("Usuário não autenticado");
      return;
    }

    const userId = user.uid;
    const investmentsRef = collection(db, "investimentos");
    const q = query(investmentsRef, where("userId", "==", userId));

    try {
      const querySnapshot = await getDocs(q);
      const userInvestments = [];
      querySnapshot.forEach((doc) => {
        userInvestments.push(doc.data());
      });
      setInvestments(userInvestments);
    } catch (error) {
      console.error("Erro ao carregar investimentos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvestments();
  }, []);

  return (
    <div className="home">
      <div className="container-home">
        <div className="home-left-side">
          <div className="text-home">
            <h1>Wealth Builder</h1>
            <p>Construa seu patrimônio lorem ipsum.</p>
          </div>
          {loading ? (
            <p>Carregando investimentos...</p>
          ) : (
            <InvestmentList investments={investments} />
          )}
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
