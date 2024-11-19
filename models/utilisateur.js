// models/utilisateur.js
const mongoose = require('mongoose');

const utilisateurSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  balance: { 
    type: Number, 
    default: 100 }
});

const Utilisateur = mongoose.model('Utilisateur', utilisateurSchema);
module.exports = Utilisateur;