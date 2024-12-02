import React, { useState } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import revenueBro from "../../assets/images/revenue-bro.svg";
import "../../assets/css/Login.css";

const Login = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      navigate("/home");
    } catch (err) {
      setError("Erro ao fazer login com Google.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-left-container">
        <h1>Login</h1>
        {error && <p className="error-message">{error}</p>}
        <p>Entrar com Google</p>
        <div className="google-login">
          <button onClick={handleGoogleLogin} className="google-login-button">
            <i className="fab fa-google"></i>
          </button>
        </div>
      </div>
      <div className="login-right-container">
        <img
          src={revenueBro}
          alt="Ilustração de um homem com um notebook"
          className="revenueBro"
        />
      </div>
    </div>
  );
};

export default Login;
