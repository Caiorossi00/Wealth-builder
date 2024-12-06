import React, { useState, useEffect } from "react";

const EstatisticasAportes = ({ aportes }) => {
  const [valorInicial, setValorInicial] = useState(0);
  const [somaAportes, setSomaAportes] = useState(0);
  const [rendimento, setRendimento] = useState(0);

  useEffect(() => {
    const totalAportes = aportes.reduce(
      (total, aporte) => total + parseFloat(aporte.valor),
      0
    );
    setSomaAportes(totalAportes);

    setRendimento(totalAportes - Number(valorInicial));
  }, [aportes, valorInicial]);

  return (
    <div className="estatisticas-aportes">
      <h2>Estatísticas do Mês</h2>
      <div className="input-valor-inicial">
        <label htmlFor="valorInicial">Valor no início do mês:</label>
        <input
          id="valorInicial"
          type="number"
          value={valorInicial}
          onChange={(e) => setValorInicial(e.target.value)}
          placeholder="Insira o valor inicial"
        />
      </div>
      <div className="resultado-estatisticas">
        <p>
          <strong>Soma dos Aportes:</strong> R${somaAportes.toFixed(2)}
        </p>
        <p>
          <strong>Rendimento Total:</strong> R${rendimento.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default EstatisticasAportes;
