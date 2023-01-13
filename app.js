const express = require('express');
//CORS (Cross-Origin Resource Sharing) is a mechanism by which data or any other resource of a site could be 
// shared intentionally to a third party website when there is a need. 
var cors = require('cors');

// Sequelize is an (Object Relational Mapper) for Node.js. Sequelize lets us connect to a database and perform 
// operations without writing raw SQL queries. It abstracts SQL queries and makes it easier to interact with 
// database models as objects.
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
const downloadUrl = require('./models/downloadurls');

const app = express();
//  A . env file or dotenv file is a simple text configuration file for controlling your Applications
//  environment constants.
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

User.hasMany(downloadUrl);
downloadUrl.belongsTo(User);

//sequelize.sync() will create all of the tables in the specified database. If you pass {force: true} as a 
// parameter to sync method, it will remove tables on every startup and create new ones.
sequelize.sync()
.then(() => {
    app.listen(4000);
})
.catch((err) => {
    console.log(err);
});