import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import "../assets/css/AddTransaction.css";

const AddInvestment = ({ fetchInvestments, setIsModalOpen }) => {
  const [value, setValue] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  const validateValue = (value) => {
    if (value <= 0) return "O valor não pode ser negativo ou zero.";
    return "";
  };

  const validateDate = (date) => {
    const year = new Date(date).getFullYear();
    if (year < 2000 || year > 2099) return "Ajuste o ano";
    return "";
  };

  const handleAddInvestment = async (e) => {
    e.preventDefault();

    const valueError = validateValue(value);
    const dateError = validateDate(date);

    if (valueError || dateError) {
      setError(valueError || dateError);
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      setError("Você precisa estar logado para adicionar um investimento.");
      return;
    }

    const userId = user.uid;

    try {
      await addDoc(collection(db, "investimentos"), {
        data: date,
        tipo: "Aporte",
        valor: value,
        userId: userId,
      });
      fetchInvestments();
      setValue("");
      setDate("");
      setError("");
      setIsModalOpen(false);
    } catch (e) {
      console.error("Erro ao adicionar documento: ", e);
      setError("Erro ao adicionar o investimento.");
    }
  };

  return (
    <div>
      <form onSubmit={handleAddInvestment}>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Valor do investimento"
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <button type="submit" className="add-btn">
          Adicionar
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default AddInvestment;
