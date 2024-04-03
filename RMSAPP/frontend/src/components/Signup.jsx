import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast"; // Import toast from react-hot-toast
import Axios from "axios";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [role, setRole] = useState("visitor");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    const usernameRegex = /^[a-zA-Z0-9_]{4,16}$/;

    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number."
      );
      return;
    }

    if (!usernameRegex.test(username)) {
      toast.error(
        "Username must be between 4 to 16 characters long and can only contain letters, numbers, and underscores."
      );
      return;
    }

    try {
      const res = await Axios.post("http://localhost:3001/auth/signup", {
        fullname,
        username,
        email,
        password,
        role,
      });

      if (res.status === 200) {
        toast.success("Account created successfully");
        setTimeout(() => {
          navigate("/login");
        }, 5000);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Failed to create account");
    }
  };

  return (
    <div className="container" style={{ width: "100%", margin: "0 auto" }}> {/* Apply styling to increase width and center the form */}
      <div className="sign-up-container">
        <h2>Sign Up Here!</h2>
        <form className="sign-up-form" onSubmit={handleSubmit}>
          <label htmlFor="fullname">FullName</label>
          <input
            type="text"
            placeholder="FullName"
            onChange={(e) => setFullname(e.target.value)}
          />
          <label htmlFor="username">Username</label>
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            autoComplete="off"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            placeholder="********"
            onChange={(e) => setPassword(e.target.value)}
          />

          <label htmlFor="role">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{
              width: "100%", // Make the select element 100% width
              height: "50px", // Increase the height of the select element
              padding: "10px", // Increase padding for better visibility and spacing
              fontSize: "16px", // Increase font size for better readability
              borderRadius: "5px", // Add some border radius for a softer look
            }}
          >
            <option value="visitor">Visitor</option>
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>

          <br />
          <br></br>
          <button type="submit">Sign Up</button>
          <p>
            Have an Account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
