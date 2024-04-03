import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import toast from 'react-hot-toast';
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createEmptyCart, fetchCartItems,updateUserFromLocalStorage } from "../features/cartSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  Axios.defaults.withCredentials = true;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios.post("http://localhost:3001/auth/login", {
        email,
        password,
      });
      if (response.status === 200 && response.data.status) {
        const userData = response.data.user;
        localStorage.setItem("user", JSON.stringify(userData));
        dispatch(updateUserFromLocalStorage()); // Update user_id in Redux store
        dispatch(createEmptyCart(userData._id));
         dispatch(fetchCartItems(userData._id));

        if (userData.role === "visitor") {
          toast.success("Welcome");
          setTimeout(() => {
            navigate("/", { state: { userEmail: userData.email } });
          }, 4000);
        } else if (userData.role === "admin") {
          toast.success("Welcome Admin");
          setTimeout(() => {
            navigate("/admin", { state: { userEmail: userData.email } });
          }, 4000);
        } else if (userData.role === "staff") {
          toast.success("Welcome Staff");
          setTimeout(() => {
            navigate("/staff", { state: { userEmail: userData.email } });
          }, 4000);
        }
      }
    } catch (error) {
      toast.error("Failed to Login, Check Credentials");
      console.error("Login Error:", error);
    }
  };

  return (
    <div className="container">
      <div
        className="sign-up-container "
        style={{ backgroundColor: "black", position: "relative" }}
      >
        <h2 style={{ color: "white", textAlign: "center" }}>Login</h2>
        <form className="sign-up-form" onSubmit={handleSubmit}>
          <label htmlFor="email" style={{ color: "white" }}>
            Email
          </label>
          <input
            type="email"
            autoComplete="off"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password" style={{ color: "white" }}>
            Password
          </label>
          <input
            type="password"
            placeholder="********"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="menuBtn">Login</button>

          <p style={{ color: "white" }}>
            New User? <Link to="/signup">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
