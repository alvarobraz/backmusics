const mongoose = require("mongoose");
//BASE Music

const MusicSchema = new mongoose.Schema({   

  title: { type: String, required: true },

  author: { type: String, required: true },

  url: { type: String, required: false },

  releaseDateOf: { type: Date, required: true },

  keyWords: [String],

  category: { 
    _id: { type: mongoose.Schema.Types.ObjectId, ref: "musicCategory", required: true },
    name: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive'], required: true, default: "active" },
  },

  favoriteCount: { type: Number, required: false, default: 0 },

  status: { type: String, enum: ['active', 'inactive'], required: true, default: "active" },

}, { timestamps: {} });


module.exports = mongoose.model('Music', MusicSchema);