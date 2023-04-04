const mongoose = require('mongoose'); 
require("dotenv").config();
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.connect(process.env.DB_CONNECTION_STRING, { 
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

// console.log(process.env.DB_CONNECTION_STRING)

const conn = mongoose.connection;

module.exports = conn;
