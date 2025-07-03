import React, { useEffect, useState } from "react";

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ category: '', limit: '' });

  const token = localStorage.getItem("token");

  const fetchBudgets = async () => {
    const res = await fetch("http://localhost:5000/api/budgets", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setBudgets(data);
  };

  const fetchExpenses = async () => {
    const res = await fetch("http://localhost:5000/api/expenses", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setExpenses(data);
  };

  useEffect(() => {
    fetchBudgets();
    fetchExpenses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:5000/api/budgets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    setForm({ category: '', limit: '' });
    fetchBudgets();
  };

  const deleteBudget = async (id) => {
    await fetch(`http://localhost:5000/api/budgets/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchBudgets();
  };

  const getSpent = (category) => {
    return expenses
      .filter(e => e.category.toLowerCase() === category.toLowerCase())
      .reduce((sum, e) => sum + Number(e.amount), 0);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto font-sans">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">📅 Set Monthly Budgets</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg mb-8"
      >
        <input
          type="text"
          placeholder="Category (e.g. Food)"
          className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Monthly Limit (₹)"
          className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none"
          value={form.limit}
          onChange={(e) => setForm({ ...form, limit: e.target.value })}
          required
        />
        <button
          type="submit"
          className="md:col-span-2 bg-gradient-to-r from-green-500 to-teal-600 hover:from-teal-500 hover:to-green-500 text-white font-medium py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Save Budget
        </button>
      </form>

      <h2 className="text-2xl font-semibold mb-4 text-gray-800">📊 Your Budgets</h2>
      <div className="space-y-4">
        {budgets.length === 0 ? (
          <p className="text-gray-500">No budgets set yet.</p>
        ) : (
          budgets.map(budget => {
            const spent = getSpent(budget.category);
            const percentage = Math.floor((spent / budget.limit) * 100);
            const progressColor =
              percentage >= 100
                ? 'bg-red-100 text-red-800 border-red-300'
                : percentage >= 80
                  ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                  : 'bg-green-100 text-green-800 border-green-300';

            return (
              <div
                key={budget._id}
                className={`border-l-4 ${progressColor} p-4 rounded-xl border shadow-sm flex justify-between items-start md:items-center transition hover:shadow-md`}
              >
                <div>
                  <div className="text-lg font-semibold">{budget.category}</div>
                  <div className="text-sm mt-1">
                    Spent: ₹{spent} / ₹{budget.limit} ({percentage}%)
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(percentage, 100)}%`,
                        backgroundColor: percentage >= 100 ? '#dc2626' : percentage >= 80 ? '#facc15' : '#22c55e'
                      }}
                    ></div>
                  </div>
                </div>
                <button
                  onClick={() => deleteBudget(budget._id)}
                  className="text-red-500 hover:underline mt-3 md:mt-0"
                >
                  Delete
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
