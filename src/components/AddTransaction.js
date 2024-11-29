import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

const AddInvestment = ({ fetchInvestments }) => {
  const [value, setValue] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  const validateValue = (value) => {
    if (value <= 0) {
      return "O valor não pode ser negativo ou zero.";
    }
    return "";
  };

  const validateDate = (date) => {
    const year = new Date(date).getFullYear();

    if (year < 2000 || year > 2099) {
      return "Ajuste o ano";
    }

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

    try {
      const docRef = await addDoc(collection(db, "investimentos"), {
        data: date,
        tipo: "Aporte",
        valor: value,
      });
      console.log("Documento adicionado com ID: ", docRef.id);

      fetchInvestments();

      setValue("");
      setDate("");
      setError("");
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
        <button type="submit">Adicionar</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}{" "}
    </div>
  );
};

export default AddInvestment;
