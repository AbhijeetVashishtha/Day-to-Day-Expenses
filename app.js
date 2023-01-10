const express = require('express');
var cors = require('cors');

const sequelize = require('./util/database');
const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase');
const premiumUserRoutes = require('./routes/premiumuser');
const forgotPassRoutes = require('./routes/forgotpass');
const User = require('./models/users');
const Expense = require('./models/expense');
const Order = require('./models/orders');
const forgotPass = require('./models/forgotpassword');

const app = express();
const dotenv = require('dotenv');

dotenv.config();

app.use(express.json());
app.use(cors());
app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumUserRoutes);
app.use('/password', forgotPassRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(forgotPass);
forgotPass.belongsTo(User);

sequelize.sync()
.then(() => {
    app.listen(4000);
})
.catch((err) => {
    console.log(err);
});