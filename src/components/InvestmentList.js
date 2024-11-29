import React, { useState, useEffect, useCallback } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import AddInvestment from "./AddTransaction.js";

const InvestmentList = () => {
  const [investments, setInvestments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newValue, setNewValue] = useState("");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const fetchInvestments = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "investimentos"));
      const investmentsArray = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        let formattedDate = "";

        if (data.data) {
          formattedDate = formatDate(data.data);
        } else {
          formattedDate = data.data || "Data inválida";
        }

        return {
          id: doc.id,
          ...data,
          data: formattedDate,
        };
      });
      setInvestments(investmentsArray);
    } catch (e) {
      console.error("Erro ao buscar documentos: ", e);
    }
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "investimentos", id));
      setInvestments(investments.filter((investment) => investment.id !== id));
    } catch (e) {
      console.error("Erro ao excluir o investimento: ", e);
    }
  };

  const handleEdit = (id, currentValue) => {
    setEditingId(id);
    setNewValue(currentValue);
  };

  const handleUpdate = async () => {
    if (!newValue) {
      alert("Por favor, insira um valor!");
      return;
    }

    try {
      const investmentRef = doc(db, "investimentos", editingId);
      await updateDoc(investmentRef, {
        valor: newValue,
      });

      fetchInvestments();

      setEditingId(null);
      setNewValue("");
    } catch (e) {
      console.error("Erro ao atualizar o investimento: ", e);
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, [fetchInvestments]);

  return (
    <div>
      <AddInvestment fetchInvestments={fetchInvestments} />{" "}
      <ul>
        {investments.map((investment) => (
          <li key={investment.id}>
            <strong>Valor:</strong> R$ {investment.valor} |{" "}
            <strong>Data:</strong> {investment.data}{" "}
            <button onClick={() => handleEdit(investment.id, investment.valor)}>
              Editar
            </button>
            <button onClick={() => handleDelete(investment.id)}>Excluir</button>
          </li>
        ))}
      </ul>
      {editingId && (
        <div>
          <h3>Editar Investimento</h3>
          <input
            type="number"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Novo valor"
            required
          />
          <button onClick={handleUpdate}>Salvar Alterações</button>
          <button onClick={() => setEditingId(null)}>Cancelar</button>
        </div>
      )}
    </div>
  );
};

export default InvestmentList;
