import React, { useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    amount: '',
    category: '',
    date: '',
    paymentMethod: '',
    notes: ''
  });

  const token = localStorage.getItem("token");

  const fetchExpenses = async () => {
    const res = await fetch(`${API_URL}/api/expenses`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setExpenses(data);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/api/expenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });
    setForm({ amount: '', category: '', date: '', paymentMethod: '', notes: '' });
    fetchExpenses();
  };

  const deleteExpense = async (id) => {
    await fetch(`${API_URL}/api/expenses/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchExpenses();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto font-sans">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">💸 Track Your Expenses</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg mb-8"
      >
        <input
          type="number"
          placeholder="Amount (₹)"
          className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Category (e.g. Food)"
          className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          required
        />
        <input
          type="date"
          className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Payment Method (e.g. UPI)"
          className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
          value={form.paymentMethod}
          onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
          required
        />
        <textarea
          placeholder="Notes"
          className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none md:col-span-2"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        ></textarea>
        <button
          type="submit"
          className="md:col-span-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-500 hover:to-blue-500 text-white font-medium py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Add Expense
        </button>
      </form>

      <h2 className="text-2xl font-semibold mb-4 text-gray-800">📃 Your Expenses</h2>
      <div className="space-y-4">
        {expenses.length === 0 ? (
          <p className="text-gray-500">No expenses yet.</p>
        ) : (
          expenses.map((exp) => (
            <div
              key={exp._id}
              className="flex justify-between items-start md:items-center bg-white p-4 rounded-xl shadow-md border hover:shadow-lg transition"
            >
              <div>
                <div className="text-lg font-semibold text-blue-600">₹{exp.amount} — {exp.category}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {exp.paymentMethod} on {new Date(exp.date).toLocaleDateString()}
                </div>
                {exp.notes && (
                  <div className="text-sm italic text-gray-600 mt-1">Note: {exp.notes}</div>
                )}
              </div>
              <button
                onClick={() => deleteExpense(exp._id)}
                className="text-red-500 hover:underline font-medium mt-2 md:mt-0"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
