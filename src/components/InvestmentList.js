import React, { useState, useEffect, useCallback } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import AddInvestment from "./AddTransaction.js";
import "../assets/css/InvestmentList.css";

const InvestmentList = () => {
  const [investments, setInvestments] = useState([]);
  const [totalInvested, setTotalInvested] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [newValue, setNewValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const localDate = new Date(
      date.getTime() + date.getTimezoneOffset() * 60000
    );

    const day = String(localDate.getDate()).padStart(2, "0");
    const month = String(localDate.getMonth() + 1).padStart(2, "0");
    const year = localDate.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const formatValue = (value) => {
    return parseFloat(value).toFixed(2).replace(".", ",");
  };

  const fetchInvestments = useCallback(async () => {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;

    if (!userId) {
      console.error("Usuário não autenticado");
      return;
    }

    try {
      const q = query(
        collection(db, "investimentos"),
        where("userId", "==", userId)
      );

      const querySnapshot = await getDocs(q);
      const investmentsArray = [];
      let total = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        let formattedDate = "";

        if (data.data) {
          formattedDate = formatDate(data.data);
        } else {
          formattedDate = data.data || "Data inválida";
        }

        total += parseFloat(data.valor || 0);

        investmentsArray.push({
          id: doc.id,
          ...data,
          valor: formatValue(data.valor),
          data: formattedDate,
          rawDate: data.data,
        });
      });

      investmentsArray.sort(
        (a, b) => new Date(b.rawDate) - new Date(a.rawDate)
      );

      setInvestments(investmentsArray);
      setTotalInvested(total);
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
    setNewValue(currentValue.replace(",", "."));
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
                  <i className="fa-solid fa-pencil"></i>
                </button>
                <button
                  onClick={() => handleDelete(investment.id)}
                  aria-label="Excluir"
                >
                  <i className="fa-solid fa-delete-left"></i>
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
              <AddInvestment
                fetchInvestments={fetchInvestments}
                setIsModalOpen={setIsModalOpen}
              />
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
      <div className="add-investment-container">
        <button
          className="add-button-outside"
          onClick={() => setIsModalOpen(true)}
        >
          +
        </button>
        <p className="total-invested">
          Total investido: R${totalInvested.toFixed(2).replace(".", ",")}
        </p>
      </div>
    </>
  );
};

export default InvestmentList;
