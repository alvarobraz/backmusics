const express         = require("express");
const routes          = require("./routes");
const cors            = require("cors");
const helmet          = require("helmet");
const app             = express();
// const mongoose        = require('mongoose');
const conn              = require('./app/models/connection')
// const swaggerUi       = require('swagger-ui-express');
// const swaggerDocument = require('./swagger.json');

const server = require("http").Server(app);
// const conn = mongoose.connection;


conn.on('error', () => console.error.bind(console, 'connection error'));
conn.once('open', () => console.info('Connection to Database is successful'));

app.use((req, res, next) => {
    req.conn = conn;
    next();
});


app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(routes);

module.exports = server;
