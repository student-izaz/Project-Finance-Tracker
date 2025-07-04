# Project-Finance-Tracker

💡 What This App Does
Personal Finance Tracker helps users manage their income and expenses in one place. Here's what it offers:

✅ Track Expenses
Easily log daily expenses with amount, category, date, payment method, and notes.

✅ Set Monthly Budgets
Define how much you plan to spend in categories like Food, Travel, Shopping, etc.

✅ Visualize Spending
View pie charts for spending by category and line charts for daily trends.

✅ Filter & Search
Find expenses using keyword search, payment method, or date range filters.

✅ Get Budget Alerts
The app warns users if spending in any category reaches 80% or exceeds 100% of the set budget.

✅ Generate Monthly Reports
At the end of each month (or manually), generate a summary report stored in MySQL, including:

Total spent

Top spending category

Overbudget categories

✅ Mobile Friendly
Clean responsive layout with a mobile drawer navigation menu.

✅ Authentication System
Users must sign up and log in to manage their own finance data securely.


# 💰 Personal Finance Tracker

A full-stack web application to track your income and expenses, set monthly budgets, visualize spending habits, and generate monthly reports.

---

## 🚀 Features

- ✅ Add/Edit/Delete Expenses
- ✅ Set Monthly Budgets by Category
- ✅ Visual Dashboard (Pie/Line Charts with Recharts)
- ✅ Filter/Search/Sort Expenses
- ✅ Budget Alerts (80% / 100% warning)
- ✅ Monthly Reports Saved in MySQL
- ✅ Responsive UI with Mobile Drawer Nav
- ✅ JWT Authentication (Signup/Login)
- ✅ Protected Routes
- ✅ Toast Notifications

---

## 🧱 Tech Stack

| Layer      | Tech                            |
|------------|----------------------------------|
| Frontend   | React + Tailwind CSS + Recharts |
| Backend    | Node.js + Express               |
| Database 1 | MongoDB (Expenses, Budgets, Users) |
| Database 2 | MySQL (Monthly Reports)         |
| Auth       | JWT                             |

---

## 📁 Folder Structure

finance-tracker/
├── backend/
│ ├── models/ # MongoDB models (User, Expense, Budget)
│ ├── routes/ # Express routes (auth, expenses, budgets, reports)
│ ├── controllers/ # Logic for each route
│ ├── middleware/ # Auth middleware (JWT)
│ ├── db.js # MySQL DB connection
│ └── server.js # Main entry point
├── frontend/
│ ├── src/
│ │ ├── components/ # Navbar, Drawer, Charts, Forms
│ │ ├── pages/ # Dashboard, Login, Signup, Expenses
│ │ └── App.jsx # Routing & Layout
├── .env # Environment variables
├── package.json # Root (optional monorepo)
└── README.md

🚀 How to Run the Project (Frontend + Backend)

finance-tracker/
├── backend/
├── frontend/

🔧 Backend Setup
1. Navigate to the backend folder:

cd backend

2. Install dependencies:

npm install

4. Start the backend server:

npm server.js

The backend will run on: http://localhost:5000


🎨 Frontend Setup
1. Navigate to the frontend folder:

cd frontend

2. Install dependencies:

npm install

3. Start the frontend dev server:

npm run dev

The frontend will run on: http://localhost:5173 (or the port Vite shows)

✅ Ready to Use
1. Go to http://localhost:5173 in your browser.
2. Sign up or log in.
3. Add expenses, set budgets, and view reports from the dashboard!


1: Use Existing Credentials
If you've already signed up from the frontend:

Email: user@gmail.com
Password: 12345

Use those to log in.

🚀 1. Backend (Node.js + Express) Deployment using Render
 Link: https://project-finance-tracker-fgid.onrender.com

 🌐 2. Frontend (React + Vite) Deployment using Vercel
 Link: https://finance-tracker-eight-drab.vercel.app/