const express = require('express');
var cors = require('cors');

const sequelize = require('./util/database');
const userRoutes = require('./routes/user');

const app = express();

app.use(express.json());
app.use(cors());
app.use('/user', userRoutes);

sequelize.sync()
.then(() => {
    app.listen(4000);
})
.catch((err) => {
    console.log(err);
});