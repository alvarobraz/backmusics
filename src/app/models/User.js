const mongoose = require("mongoose");
//BASE User

const UserSchema = new mongoose.Schema({   

  name: { type: String, required: true },

  email: { type: String, required: false, lowercase: true },

  password: { type: String, required: true, select: false },

  role: { type: String, required: true, enum: ['admin', 'user'], default: "user" },

  favoritesMusics: [
    { 
      _id: { type: mongoose.Schema.Types.ObjectId, ref: "music", required: false },
      title: { type: String, required: false }
    }
  ],

  token: { type: String, required: true },

  firstAccess: { type: Boolean, required: true, default: true },

  status: { type: String, enum: ['active', 'inactive'], required: true, default: "active" }

}, { timestamps: {} });


module.exports = mongoose.model('user', UserSchema);