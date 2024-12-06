import React, { useState } from "react";

const CheckIn = () => {
  const [valorInicial, setValorInicial] = useState("");
  const [mesSelecionado, setMesSelecionado] = useState("");
  const [anoSelecionado, setAnoSelecionado] = useState("");
  const [checkIns, setCheckIns] = useState([]);

  const meses = [
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
  ];

  const anos = [];
  for (let i = 2010; i <= new Date().getFullYear(); i++) {
    anos.push(i);
  }

  anos.reverse();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (mesSelecionado && anoSelecionado && valorInicial) {
      const novoCheckIn = {
        mes: mesSelecionado,
        ano: anoSelecionado,
        valor: valorInicial,
      };
      setCheckIns([...checkIns, novoCheckIn]);
      setValorInicial("");
      setMesSelecionado("");
      setAnoSelecionado("");
    }
  };

  return (
    <div className="container-checkin">
      <h2>Check-in Mensal</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-valor-inicial">
          <label htmlFor="valorInicial">Valor inicial no dia 01:</label>
          <input
            id="valorInicial"
            type="number"
            value={valorInicial}
            onChange={(e) => setValorInicial(e.target.value)}
            placeholder="Insira o valor inicial"
          />
        </div>
        <div className="input-mes">
          <label htmlFor="mesSelecionado">Mês:</label>
          <select
            id="mesSelecionado"
            value={mesSelecionado}
            onChange={(e) => setMesSelecionado(e.target.value)}
          >
            <option value="" disabled>
              Selecione um mês
            </option>
            {meses.map((mes, index) => (
              <option key={index} value={mes}>
                {mes}
              </option>
            ))}
          </select>
        </div>
        <div className="input-ano">
          <label htmlFor="anoSelecionado">Ano:</label>
          <select
            id="anoSelecionado"
            value={anoSelecionado}
            onChange={(e) => setAnoSelecionado(e.target.value)}
          >
            <option value="" disabled>
              Selecione um ano
            </option>
            {anos.map((ano, index) => (
              <option key={index} value={ano}>
                {ano}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Salvar Check-in</button>
      </form>

      <h3>Registros de Check-in</h3>
      <ul className="check-in-list">
        {checkIns.map((checkIn, index) => (
          <li key={index}>
            {checkIn.mes}/{checkIn.ano}: {checkIn.valor} reais
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CheckIn;
