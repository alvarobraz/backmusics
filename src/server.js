const app = require("./app");
const mongoose = require('mongoose');
require("dotenv/config");
require("../config.json")

app.listen(process.env.PORT || 9000)