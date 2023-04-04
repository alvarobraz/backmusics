const mongoose = require("mongoose");

//BASE MusicCategory
const MusicCategorySchema = new mongoose.Schema({

  name: { type: String, required: true },

  status: { type: String, enum: ['active', 'inactive'], required: true, default: "active" },

}, { timestamps: {} });

module.exports = mongoose.model('musicCategory', MusicCategorySchema);