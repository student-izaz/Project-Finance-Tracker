import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import GenerateReportButton from "../pages/GenerateReport";

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    setDrawerOpen(false);
    navigate("/login");
  };

  return (
    <>
      {/* Sticky Top Navbar */}
      <nav className="sticky top-0 z-50 bg-white shadow-md border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold tracking-wide text-blue-600">
            💰 BudgetWise
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex space-x-6 items-center font-medium">
            <li><Link to="/dashboard" className="hover:text-blue-600">Dashboard</Link></li>
            <li><Link to="/expenses" className="hover:text-blue-600">Expenses</Link></li>
            <li><Link to="/budgets" className="hover:text-blue-600">Budgets</Link></li>
            {isLoggedIn && (
              <li>
                <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                  Logout
                </button>
              </li>
            )}
          </ul>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-blue-600"
            onClick={() => setDrawerOpen(true)}
          >
            <FiMenu size={24} />
          </button>
        </div>
      </nav>

      {/* Drawer Overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={() => setDrawerOpen(false)}
        ></div>
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-50 transform ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-blue-600">Menu</h2>
          <button onClick={() => setDrawerOpen(false)} className="text-gray-600">
            <FiX size={24} />
          </button>
        </div>
        <ul className="flex flex-col p-4 space-y-4 font-medium text-gray-800">
          <li>
            <Link to="/dashboard" onClick={() => setDrawerOpen(false)}>
              📊 Dashboard
            </Link>
          </li>
          <li>
            <Link to="/expenses" onClick={() => setDrawerOpen(false)}>
              💸 Expenses
            </Link>
          </li>
          <li>
            <Link to="/budgets" onClick={() => setDrawerOpen(false)}>
              📁 Budgets
            </Link>
          </li>
          {isLoggedIn && (
            <li>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded w-full text-left"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
        <div className="p-6">
      <GenerateReportButton />
    </div>
      </div>
    </>
  );
}
