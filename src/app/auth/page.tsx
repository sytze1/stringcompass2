"use client"; 

import { useState } from "react";
import { signIn } from "next-auth/react";

import "../../styles/pages/authPage.css";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    location: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage("Registration successful! Please log in.");
      setMode("login");
    } else {
      setMessage(data.msg || "Registration failed");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
    });
    if (res?.ok) {
      setMessage("Login successful!");
    } else {
      setMessage(res?.error || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Toggle buttons */}
        <div className="auth-toggle">
          <button
            className={mode === "login" ? "active" : ""}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            className={mode === "register" ? "active" : ""}
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={mode === "login" ? handleLogin : handleRegister} className="auth-form">
          {mode === "register" && (
            <>
              <input
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <select name="role" value={form.role} onChange={handleChange}>
                <option value="user">Musician</option>
                <option value="luthier">Luthier</option>
                <option value="bowmaker">Bowmaker</option>
                <option value="dealer">Dealer</option>
              </select>
              <input
                name="location"
                placeholder="Location (City, Country)"
                value={form.location}
                onChange={handleChange}
              />
            </>
          )}
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="submit-btn">
            {mode === "login" ? "Login" : "Register"}
          </button>
        </form>

        {/* Feedback */}
        {message && <p className="auth-message">{message}</p>}

        {/* Redirect links */}
        <div className="auth-redirect">
          {mode === "login" ? (
            <p>
              Don’t have an account?{" "}
              <span onClick={() => setMode("register")}>Register here</span>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <span onClick={() => setMode("login")}>Login here</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
