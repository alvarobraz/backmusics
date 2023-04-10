const mongoose = require("mongoose");
//BASE Music

const MusicSchema = new mongoose.Schema({   

  title: { type: String, required: true },

  author: { type: String, required: true },

  descrition: { type: String, required: true },

  img: { type: String, required: true, default: 'https://i.ytimg.com/vi/j5C-p0od8MI/hq720.jpg?sqp=-oaymwEcCOgCEMoBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAF3VM7ZXr9iw21rIn3EWKH7bhS8w' },

  url: { type: String, required: false },

  releaseDateOf: { type: Date, required: true },

  keyWords: [String],

  category: { 
    _id: { type: mongoose.Schema.Types.ObjectId, ref: "musicCategory", required: false },
    name: { type: String, required: false }
  },

  favoriteCount: { type: Number, required: false, default: 0 },

  status: { type: String, enum: ['active', 'inactive'], required: true, default: "active" },

}, { timestamps: {} });


module.exports = mongoose.model('music', MusicSchema);