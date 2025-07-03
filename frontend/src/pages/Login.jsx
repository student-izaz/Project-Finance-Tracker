import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });


  const navigate = useNavigate();

  const handleLoginData = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitLoginData = async (e) => {
    e.preventDefault();
    console.log('login data',loginData);

      try {
      const response = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();
  
      if (response.ok) {
        // Example: save token and redirect
          localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        console.error("Login failed:", data.message || "Unknown error");
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen  flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md p-8 rounded-2xl">
        <h2 className="text-2xl font-bold text-yellow-500 mb-6">
          Login to Your Account
        </h2>
        <form className="space-y-4" onSubmit={submitLoginData}>
          <div>
            <label
              className="block text-gray-500 font-medium mb-1"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              onChange={handleLoginData}
              placeholder="you@example.com"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>
          <div>
            <label
              className="block text-gray-500 font-medium mb-1"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              onChange={handleLoginData}
              placeholder="••••••••"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Sign In
          </button>
        </form>
        <p className="text-sm text-center text-gray-500 mt-4">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Signup
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
