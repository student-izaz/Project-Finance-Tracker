import React, { useEffect, useState } from "react";
import { FiFilter } from "react-icons/fi";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [form, setForm] = useState({
    amount: "",
    category: "",
    date: "",
    paymentMethod: "",
    notes: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const [search, setSearch] = useState("");
  const [filterMethod, setFilterMethod] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });

  const token = localStorage.getItem("token");

  const fetchExpenses = async () => {
    const res = await fetch("http://localhost:5000/api/expenses", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setExpenses(data);
    setFiltered(data);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editingId
      ? `http://localhost:5000/api/expenses/${editingId}`
      : "http://localhost:5000/api/expenses";

    const method = editingId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    setForm({
      amount: "",
      category: "",
      date: "",
      paymentMethod: "",
      notes: "",
    });
    setEditingId(null);
    fetchExpenses();
  };

  const deleteExpense = async (id) => {
    await fetch(`http://localhost:5000/api/expenses/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchExpenses();
  };

  const handleEdit = (expense) => {
    setForm({
      amount: expense.amount,
      category: expense.category,
      date: expense.date?.slice(0, 10),
      paymentMethod: expense.paymentMethod,
      notes: expense.notes || "",
    });
    setEditingId(expense._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    let temp = [...expenses];

    if (search.trim()) {
      const term = search.toLowerCase();
      temp = temp.filter(
        (e) =>
          e.notes?.toLowerCase().includes(term) ||
          e.category.toLowerCase().includes(term)
      );
    }

    if (filterMethod) {
      temp = temp.filter(
        (e) => e.paymentMethod.toLowerCase() === filterMethod.toLowerCase()
      );
    }

    if (dateRange.from && dateRange.to) {
      const from = new Date(dateRange.from);
      const to = new Date(dateRange.to);
      temp = temp.filter((e) => {
        const d = new Date(e.date);
        return d >= from && d <= to;
      });
    }

    setFiltered(temp);
  }, [search, filterMethod, dateRange, expenses]);

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto font-sans">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
        {editingId ? "✏️ Edit Expense" : "💸 Add Expense"}
      </h2>

      {/* ===== Form ===== */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 sm:p-6 rounded-2xl shadow-lg mb-8"
      >
        <input
          type="number"
          placeholder="Amount (₹)"
          className="p-3 rounded-xl border w-full"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Category"
          className="p-3 rounded-xl border w-full"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          required
        />
        <input
          type="date"
          className="p-3 rounded-xl border w-full"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Payment Method"
          className="p-3 rounded-xl border w-full"
          value={form.paymentMethod}
          onChange={(e) =>
            setForm({ ...form, paymentMethod: e.target.value })
          }
          required
        />
        <textarea
          placeholder="Notes"
          className="p-3 rounded-xl border w-full sm:col-span-2"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        ></textarea>
        <div className="sm:col-span-2 flex gap-3 flex-wrap">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-5 rounded-xl font-semibold shadow"
          >
            {editingId ? "Update Expense" : "Add Expense"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({
                  amount: "",
                  category: "",
                  date: "",
                  paymentMethod: "",
                  notes: "",
                });
              }}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-5 rounded-xl font-semibold"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* ===== Filter Header ===== */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">📃 Expenses</h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-sm text-blue-600 bg-blue-100 px-3 py-2 rounded-md hover:bg-blue-200"
        >
          <FiFilter />
          Filters
        </button>
      </div>

      {/* ===== Filters ===== */}
      {showFilters && (
        <div className="bg-white p-4 rounded-xl shadow mb-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="🔍 Search by category or note"
            className="p-2 border rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="p-2 border rounded"
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value)}
          >
            <option value="">All Payment Methods</option>
            <option value="UPI">UPI</option>
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="Net Banking">Net Banking</option>
          </select>
          <input
            type="date"
            className="p-2 border rounded"
            value={dateRange.from}
            onChange={(e) =>
              setDateRange({ ...dateRange, from: e.target.value })
            }
          />
          <input
            type="date"
            className="p-2 border rounded"
            value={dateRange.to}
            onChange={(e) =>
              setDateRange({ ...dateRange, to: e.target.value })
            }
          />
        </div>
      )}

      {/* ===== Expense Cards ===== */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <p className="text-gray-500">
            No expenses found for the selected criteria.
          </p>
        ) : (
          filtered.map((exp) => (
            <div
              key={exp._id}
              className="flex flex-col sm:flex-row sm:justify-between bg-white p-4 rounded-xl shadow border hover:shadow-md transition"
            >
              <div className="mb-2 sm:mb-0">
                <div className="text-lg font-semibold text-blue-700">
                  ₹{exp.amount} — {exp.category}
                </div>
                <div className="text-sm text-gray-500">
                  {exp.paymentMethod} on{" "}
                  {new Date(exp.date).toLocaleDateString()}
                </div>
                {exp.notes && (
                  <div className="text-sm italic text-gray-600">
                    Note: {exp.notes}
                  </div>
                )}
              </div>
              <div className="flex gap-3 items-center justify-end">
                <button
                  onClick={() => handleEdit(exp)}
                  className="text-blue-600 hover:text-blue-800 text-lg"
                  title="Edit"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => deleteExpense(exp._id)}
                  className="text-red-500 hover:text-red-700 text-lg"
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
