const path = require('path');
const express = require('express');
var cors = require('cors');

const sequelize = require('./util/database');
const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const User = require('./models/users');
const Expense = require('./models/expense');

const app = express();

app.use(express.json());
app.use(cors());
app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

sequelize.sync()
.then(() => {
    app.listen(4000);
})
.catch((err) => {
    console.log(err);
});