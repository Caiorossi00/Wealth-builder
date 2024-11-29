import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

const AddInvestment = ({ fetchInvestments }) => {
  // Recebe a função fetchInvestments como prop
  const [value, setValue] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState(""); // Estado para armazenar erros de validação

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

    // Validações
    const valueError = validateValue(value);
    const dateError = validateDate(date);

    if (valueError || dateError) {
      setError(valueError || dateError); // Exibe o erro de validação
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "investimentos"), {
        data: date,
        tipo: "Aporte",
        valor: value,
      });
      console.log("Documento adicionado com ID: ", docRef.id);

      // Chama a função fetchInvestments para atualizar a lista após adicionar o investimento
      fetchInvestments();

      // Limpa os campos após a adição
      setValue("");
      setDate("");
      setError(""); // Limpa o erro após a adição bem-sucedida
    } catch (e) {
      console.error("Erro ao adicionar documento: ", e);
      setError("Erro ao adicionar o investimento."); // Exibe erro genérico se algo der errado
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
      {/* Exibe o erro de validação, se houver */}
    </div>
  );
};

export default AddInvestment;
