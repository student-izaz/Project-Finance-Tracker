const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const budgetRoutes = require('./routes/budget');

dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: "https://project-finance-tracker-two.vercel.app/",
  credentials: true
}));
app.use(express.json());


app.use('/api/users', userRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/budgets', budgetRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));
