// App.jsx
import React from "react";
import Home from "./components/routes/Home"; // Importando o Home

const App = () => {
  return (
    <div className="App">
      <Home />{" "}
      {/* Renderizando o Home que já contém os outros dois componentes */}
    </div>
  );
};

export default App;
