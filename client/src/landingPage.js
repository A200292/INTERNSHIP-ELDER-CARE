import React, { useState } from "react";
import "./index.css"; 
import logo from "./assets/elderlogo.jpg"; 
import axios from "axios";

export default function LandingPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("elder");

  const handleSOS = () => {
    alert("🚨 SOS Alert Triggered! Caregivers & Family have been notified.");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    axios.post("http://localhost:3000/api/user/login", { email, password })
      .then(response => {
        const user = response.data.user;
        if (user.role === "elder") window.location.href = "/elderProfile";
        else if (user.role === "caregiver") window.location.href = "/caregiverProfile";
        else if (user.role === "family_member") window.location.href = "/familyMemberProfile";
        else if (user.role === "admin") window.location.href = "/adminProfile";
      })
      .catch(err => {
        console.error(err);
        alert("Invalid credentials");
      });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    const name = e.target.name?.value || e.target[0].value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const passwordConfirm = e.target.passwordConfirm?.value;
    if (password !== passwordConfirm) {
      alert("Passwords do not match!");
      return;
    }

    axios.post("http://localhost:3000/api/user/signup", { 
  name, 
  email, 
  password, 
  passwordConfirm,   
  role 
})
      .then(res => { 
        alert("Signup successful! You can now log in.");
        setIsLogin(true);
      })
      .catch(err => {
        console.error(err);
        alert("Signup failed. " + (err.response?.data?.message || err.message));
      });
  };

  return (
    <div className="landing-page">
      <button onClick={handleSOS} className="sos-btn">SOS</button>

      {/* Logo + Title */}
      <div className="logo-title">
        <img src={logo} alt="Elderly Care Logo" className="logo" />
        <h1 className="title">Welcome to  Elder Care Connect </h1>
      </div>

      {/* Text + Image side by side */}
      <div className="intro-container">
        <div className="intro-left">
          <p>
            Our service helps elders live safely and independently while keeping family and caregivers connected. Request help in emergencies, manage health information, and stay supported every day—all in one easy-to-use application.
          </p>
        </div>
        <div className="intro-right">
          <img src={require("./assets/caregiver.jpg")} alt="Elder Care Illustration" />
        </div>
      </div>

      {/* Login/Signup Card */}
      <div className="login-card">
        <h2 className="login-title">{isLogin ? "Login to Your Account" : "Create a New Account"}</h2>

        <form onSubmit={isLogin ? handleLogin : handleSignup} className="form">
          {!isLogin && <input type="text" placeholder="Full Name" className="input" name="name" required />}
          <input type="email" placeholder="Email" className="input" name="email" required />
          <input type="password" placeholder="Password" className="input" name="password" required />
          {!isLogin && (
            <input 
              type="password" 
              placeholder="Confirm Password" 
              className="input" 
              name="passwordConfirm" 
              required 
            />
          )}
          {!isLogin && (
            <select value={role} onChange={(e) => setRole(e.target.value)} className="input" required>
              <option value="">Select Role</option>
              <option value="elder">Elder</option>
              <option value="caregiver">Caregiver</option>
              <option value="family_member">Family Member</option>
              <option value="admin">Admin</option>
            </select>
          )}
          <button type="submit" className="btn">{isLogin ? "Login" : "Sign Up"}</button>
        </form>

        <p className="switch-text">
          {isLogin ? "Don't have an account?" : "Already registered?"}{" "}
          <button className="switch-btn" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
