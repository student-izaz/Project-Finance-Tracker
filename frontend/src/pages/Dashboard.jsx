import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
const API_URL = import.meta.env.VITE_API_URL;

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const token = localStorage.getItem("token");

  const fetchExpenses = async () => {
    const res = await fetch(`${API_URL}/api/expenses`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.error === "Invalid or expired token") {
      localStorage.removeItem("token");
      window.location.href = "/login"; // or use navigate("/login") if using react-router
    }
    setExpenses(data);
  };

  const fetchBudgets = async () => {
    const res = await fetch(`${API_URL}/api/budgets`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setBudgets(data);
  };

  useEffect(() => {
    fetchExpenses();
    fetchBudgets();
  }, []);

  useEffect(() => {
    if (!expenses.length || !budgets.length) return;

    const newAlerts = [];

    budgets.forEach((budget) => {
      const category = budget.category.toLowerCase();
      const limit = Number(budget.limit);

      const spent = expenses
        .filter((e) => e.category.toLowerCase() === category)
        .reduce((sum, e) => sum + Number(e.amount), 0);

      const percent = (spent / limit) * 100;

      if (percent >= 100) {
        newAlerts.push({
          type: "danger",
          message: `⚠️ You have exceeded your budget for "${budget.category}". Spent ₹${spent} / ₹${limit}`,
        });
      } else if (percent >= 80) {
        newAlerts.push({
          type: "warning",
          message: `⚠️ You're reaching your budget limit for "${budget.category}". Spent ₹${spent} / ₹${limit}`,
        });
      }
    });

    setAlerts(newAlerts);
  }, [expenses, budgets]);

  const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  const categoryTotals = {};
  expenses.forEach((e) => {
    const cat = e.category;
    categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(e.amount);
  });

  const pieData = Object.entries(categoryTotals).map(([key, val]) => ({
    name: key,
    value: val,
  }));

  const topCategory =
    pieData.sort((a, b) => b.value - a.value)[0]?.name || "N/A";

  const paymentMethods = {};
  expenses.forEach((e) => {
    const method = e.paymentMethod;
    paymentMethods[method] = (paymentMethods[method] || 0) + 1;
  });

  const top3Methods = Object.entries(paymentMethods)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([k]) => k);

  const lineData = [];
  const dateMap = {};
  expenses.forEach((e) => {
    const date = new Date(e.date).toLocaleDateString("en-IN");
    if (!dateMap[date]) dateMap[date] = 0;
    dateMap[date] += Number(e.amount);
  });

  for (const date in dateMap) {
    lineData.push({ date, amount: dateMap[date] });
  }

  const COLORS = [
    "#6366F1",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        📊 Personal Finance Dashboard
      </h2>

      {/* Budget Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-4 mb-6">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className={`relative p-4 rounded-xl text-white ${
                alert.type === "danger" ? "bg-red-500" : "bg-yellow-500"
              }`}
            >
              {alert.message}
              <button
                onClick={() => {
                  const updatedAlerts = [...alerts];
                  updatedAlerts.splice(index, 1);
                  setAlerts(updatedAlerts);
                }}
                className="absolute top-2 right-3 text-white text-xl hover:text-gray-200"
                aria-label="Close"
              >
                <IoClose />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-tr from-blue-100 to-blue-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
          <h3 className="text-xl font-semibold mb-2 text-blue-900">
            Total Spent This Month
          </h3>
          <p className="text-3xl font-bold text-blue-600">₹{totalSpent}</p>
        </div>

        <div className="bg-gradient-to-tr from-green-100 to-green-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
          <h3 className="text-xl font-semibold mb-2 text-green-900">
            Top Category
          </h3>
          <p className="text-2xl text-green-600 font-medium">{topCategory}</p>
        </div>

        <div className="bg-gradient-to-tr from-purple-100 to-purple-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition md:col-span-2">
          <h3 className="text-xl font-semibold mb-4 text-purple-900">
            Top 3 Payment Methods
          </h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            {top3Methods.map((method) => (
              <li key={method}>{method}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          📌 Spending by Category
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius={110}
              fill="#8884d8"
              label
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          📅 Spending Over Time
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#6366F1"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
