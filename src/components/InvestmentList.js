import React, { useState, useEffect, useCallback } from "react"; // Importe useCallback
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase"; // Importando a configuração do Firebase
import AddInvestment from "./AddTransaction.js"; // Importando o componente de adicionar investimento

const InvestmentList = () => {
  const [investments, setInvestments] = useState([]); // Estado para armazenar os investimentos
  const [editingId, setEditingId] = useState(null); // Armazena o id do investimento sendo editado
  const [newValue, setNewValue] = useState(""); // Armazena o novo valor a ser atualizado

  // Função para formatar a data
  const formatDate = (dateString) => {
    const date = new Date(dateString); // Cria um objeto Date
    const day = String(date.getDate()).padStart(2, "0"); // Obtém o dia com 2 dígitos
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Obtém o mês com 2 dígitos
    const year = date.getFullYear(); // Obtém o ano
    return `${day}/${month}/${year}`; // Retorna a data no formato "dd/mm/yyyy"
  };

  // Função para buscar os investimentos do Firestore com useCallback
  const fetchInvestments = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "investimentos"));
      const investmentsArray = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        let formattedDate = "";

        // Verifica se a data está no formato esperado e a formata
        if (data.data) {
          formattedDate = formatDate(data.data); // Formata a data
        } else {
          formattedDate = data.data || "Data inválida"; // Caso a data seja inválida
        }

        return {
          id: doc.id,
          ...data,
          data: formattedDate,
        };
      });
      setInvestments(investmentsArray); // Atualiza o estado com os investimentos
    } catch (e) {
      console.error("Erro ao buscar documentos: ", e);
    }
  }, []); // useCallback com array de dependências vazio

  // Função para excluir um investimento
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "investimentos", id));
      setInvestments(investments.filter((investment) => investment.id !== id));
    } catch (e) {
      console.error("Erro ao excluir o investimento: ", e);
    }
  };

  // Função para editar um investimento
  const handleEdit = (id, currentValue) => {
    setEditingId(id); // Define o investimento a ser editado
    setNewValue(currentValue); // Define o valor atual no campo de edição
  };

  // Função para atualizar um investimento
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

      // Atualiza a lista de investimentos
      fetchInvestments();

      // Limpa os campos de edição
      setEditingId(null);
      setNewValue("");
    } catch (e) {
      console.error("Erro ao atualizar o investimento: ", e);
    }
  };

  // Usando useEffect para buscar os dados quando o componente for montado
  useEffect(() => {
    fetchInvestments();
  }, [fetchInvestments]); // Agora fetchInvestments está seguro nas dependências

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
