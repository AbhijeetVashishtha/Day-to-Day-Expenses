const fs = require('fs')
const express = require('express');
// Hypertext transfer protocol secure (HTTPS) is the secure version of HTTP, which is the primary protocol used
//  to send data between a web browser and a website. HTTPS is encrypted in order to increase security of data 
// transfer.
const https = require('https');
const path = require('path');
// Helmet is a nodejs package that helps protect your server from some well-known web vulnerabilities by 
// setting HTTP response headers appropriately, it comes with a collection of several middleware functions 
// that set security headers that are returned from your express application
const helmet = require('helmet');
// morgan is a Node. js and Express middleware to log HTTP requests and errors, and simplifies the process
const morgan = require('morgan');
//CORS (Cross-Origin Resource Sharing) is a mechanism by which data or any other resource of a site could be 
// shared intentionally to a third party website when there is a need. 
var cors = require('cors');
// Compression in Node. js and Express decreases the downloadable amount of data that's served to users. 
// Through the use of this compression, we can improve the performance of our Node. js applications as our payload
//  size is reduced drastically.
const compression = require('compression');
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

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    {flags: 'a'}
    );

const privateKey = fs.readFileSync('server.key');
const certificate = fs.readFileSync('server.cert');

dotenv.config();
app.use(helmet());
app.use(compression());
app.use(morgan('combined', {stream: accessLogStream}));
app.use(express.json());
app.use(cors());
app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumUserRoutes);
app.use('/password', forgotPassRoutes);

// app.use((req,res) => {
//     res.sendFile(path.join(__dirname, `Frontend/${req.url}`));
// })

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
    // https
    // .createServer({key: privateKey, cert: certificate}, app)
    // .listen(process.env.PORT || 4000);
    app.listen(process.env.PORT || 4000);
})
.catch((err) => {
    console.log(err);
});