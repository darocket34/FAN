import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";
import * as sessionActions from "../../store/session";
import "./LoginForm.css";
import { Link } from "react-router-dom";

function LoginFormModal() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [disableLogin, setDisableLogin] = useState(true);
  const { closeModal } = useModal();
  const [unavailable, setUnavailable] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .then(history.push("/"))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  useEffect(() => {
    if (credential.length < 4 || password.length < 6) {
      setDisableLogin(true);
      setUnavailable("unavailable");
    } else {
      setDisableLogin(false);
      setUnavailable("");
    }
  }, [credential, password]);

  return (
    <div className="login modal">
      <h1 className="login title">Log In</h1>
      <form className="login form" onSubmit={handleSubmit}>
        {errors.credential && (
          <p className="login error">{errors.credential}</p>
        )}
        <input
          className="login input1"
          type="text"
          placeholder="Username or Email"
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
          required
        />
        <input
          className="login input2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          className={`login button ${unavailable}`}
          type="submit"
          disabled={disableLogin}
        >
          Log In
        </button>
        <button
          className="demo user link"
          onClick={() => {
            setCredential("john_doe");
            setPassword("password1");
          }}
        >
          Demo User
        </button>
      </form>
    </div>
  );
}

export default LoginFormModal;
