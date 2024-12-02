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
import "../assets/css/InvestmentList.css";

const InvestmentList = () => {
  const [investments, setInvestments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newValue, setNewValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

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

      console.log("Investimentos recuperados:", investmentsArray); // Adicionado para verificar os dados
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
    if (!newValue || isNaN(newValue) || Number(newValue) <= 0) {
      alert("Por favor, insira um valor válido!");
      return;
    }

    try {
      const investmentRef = doc(db, "investimentos", editingId);
      await updateDoc(investmentRef, {
        valor: Number(newValue),
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
    <>
      <div className="container-investment-list">
        <ul className="investment-list">
          {investments.map((investment) => (
            <li key={investment.id}>
              <div className="investment-data">
                <strong>R${investment.valor}</strong> {investment.data}
              </div>
              <div className="investment-icons">
                <button
                  onClick={() => handleEdit(investment.id, investment.valor)}
                  aria-label="Editar"
                >
                  <i class="fa-solid fa-pencil"></i>
                </button>
                <button
                  onClick={() => handleDelete(investment.id)}
                  aria-label="Excluir"
                >
                  <i class="fa-solid fa-delete-left"></i>
                </button>
              </div>
            </li>
          ))}
        </ul>

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button
                className="close-button"
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </button>
              <AddInvestment fetchInvestments={fetchInvestments} />
            </div>
          </div>
        )}

        {editingId && (
          <div className="edit-container">
            <h3>Editar Aporte</h3>
            <input
              type="number"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="Novo valor"
              required
            />
            <button onClick={handleUpdate}>Salvar</button>
            <button onClick={() => setEditingId(null)}>Cancelar</button>
          </div>
        )}
      </div>
      <button
        className="add-button-outside"
        onClick={() => setIsModalOpen(true)}
      >
        +
      </button>
    </>
  );
};

export default InvestmentList;
