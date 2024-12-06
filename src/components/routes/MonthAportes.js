import React, { useState, useEffect, useCallback, useMemo } from "react";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "../../assets/css/MonthAportes.css";
import EstatisticasAportes from "../EstatisticasAportes";

const MonthAportes = () => {
  const [aportes, setAportes] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  const monthNames = useMemo(
    () => [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ],
    []
  );

  const formatMonthYear = useCallback(
    (dateString) => {
      const date = new Date(dateString);
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();
      return `${month}/${year}`;
    },
    [monthNames]
  );

  const formatCurrency = (value) => {
    return parseFloat(value).toFixed(2).replace(".", ",");
  };

  const filterAportesByMonth = useCallback(
    (aportesArray, monthYear) => {
      const filteredAportes = aportesArray.filter((aporte) => {
        const aporteMonthYear = formatMonthYear(aporte.data);
        return aporteMonthYear === monthYear;
      });
      setAportes(filteredAportes);
    },
    [formatMonthYear]
  );

  const fetchAportes = useCallback(async () => {
    if (!userId) {
      return;
    }

    setLoading(true);
    try {
      const q = query(
        collection(db, "investimentos"),
        where("userId", "==", userId)
      );

      const querySnapshot = await getDocs(q);
      const aportesArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const months = aportesArray.map((aporte) => formatMonthYear(aporte.data));
      const uniqueMonths = [...new Set(months)];

      setAvailableMonths(uniqueMonths);

      if (uniqueMonths.length > 0) {
        setCurrentMonthIndex(0);
        filterAportesByMonth(aportesArray, uniqueMonths[0]);
      }
    } catch (e) {
      console.error("Erro ao buscar aportes: ", e);
    } finally {
      setLoading(false);
    }
  }, [userId, formatMonthYear, filterAportesByMonth]);

  const handleMonthChange = (direction) => {
    const newIndex =
      direction === "next"
        ? Math.min(currentMonthIndex + 1, availableMonths.length - 1)
        : Math.max(currentMonthIndex - 1, 0);

    setCurrentMonthIndex(newIndex);
    fetchAportesByMonth(availableMonths[newIndex]);
  };

  const fetchAportesByMonth = useCallback(
    async (monthYear) => {
      try {
        const q = query(
          collection(db, "investimentos"),
          where("userId", "==", userId)
        );

        const querySnapshot = await getDocs(q);
        const aportesArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        filterAportesByMonth(aportesArray, monthYear);
      } catch (e) {
        console.error("Erro ao buscar aportes: ", e);
      }
    },
    [userId, filterAportesByMonth]
  );

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!authLoading) {
      fetchAportes();
    }
  }, [authLoading, fetchAportes]);

  return (
    <div className="container-month-aportes">
      {authLoading || loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          <div className="month-navigation">
            <button
              onClick={() => handleMonthChange("prev")}
              disabled={currentMonthIndex === 0}
            >
              Anterior
            </button>
            <h2>
              {availableMonths[currentMonthIndex] || "Sem meses disponíveis"}
            </h2>
            <button
              onClick={() => handleMonthChange("next")}
              disabled={currentMonthIndex === availableMonths.length - 1}
            >
              Próximo
            </button>
          </div>
          <ul className="aportes-list">
            {aportes.length > 0 ? (
              aportes.map((aporte) => (
                <li key={aporte.id}>
                  <div className="aporte-data">
                    <strong>R${formatCurrency(aporte.valor)}</strong>
                  </div>
                </li>
              ))
            ) : (
              <p>Nenhum aporte encontrado para este mês.</p>
            )}
          </ul>
        </>
      )}
      <EstatisticasAportes aportes={aportes} />
    </div>
  );
};

export default MonthAportes;
