import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [disableLogin, setDisableLogin] = useState(true);
  const [errors, setErrors] = useState({});
  const [unavailable, setUnavailable] = useState("");
  const { closeModal } = useModal();

  useEffect(() => {
    if (
      !email ||
      !username ||
      !firstName ||
      !lastName ||
      !password ||
      !confirmPassword
    ) {
      setDisableLogin(true);
      setUnavailable("unavailable");
    } else {
      setDisableLogin(false);
      setUnavailable("");
    }
  },[email, username, firstName, lastName, password, confirmPassword]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword:
        "Confirm Password field must be the same as the Password field",
    });
  };

  return (
    <>
      <h1 className="signup title">Sign Up</h1>
      <form className="signup form" onSubmit={handleSubmit}>
        <input
          className="signup email"
          placeholder="Email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {errors.email && <p className="signup error">{errors.email}</p>}
        <input
          className="signup username"
          placeholder="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        {errors.username && <p className="signup error">{errors.username}</p>}
        <input
          className="signup firstname"
          placeholder="First Name"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        {errors.firstName && <p className="signup error">{errors.firstName}</p>}
        <input
          className="signup lastname"
          placeholder="Last Name"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        {errors.lastName && <p className="signup error">{errors.lastName}</p>}
        <input
          className="signup password"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {errors.password && <p className="signup error">{errors.password}</p>}
        <input
          className="signup confirmpassword"
          placeholder="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {errors.confirmPassword && (
          <p className="signup error">{errors.confirmPassword}</p>
        )}
        <button
          type="submit"
          disabled={disableLogin}
          className={`signup button ${unavailable}`}
        >
          Sign Up
        </button>
      </form>
    </>
  );
}

export default SignupFormModal;
