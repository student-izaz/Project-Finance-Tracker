import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Expenses from "./pages/Expenses";
import Budget from "./pages/Budget";
import Dashboard from "./pages/Dashboard";
import Start from "./pages/Start";
import Navbar from "./components/Navbar";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

   // Check if token exists on initial render
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // convert to boolean
    // console.log(isLoggedIn)
  }, []);

  const handleLogin = () => setIsLoggedIn(true);
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Start/>}/>
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/expenses" element={isLoggedIn ? <Expenses /> : <Navigate to="/login" />} />
        <Route path="/budgets" element={isLoggedIn ? <Budget /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;
