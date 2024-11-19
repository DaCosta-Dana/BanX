// models/utilisateur.js

function generateRandomIban() {
  return 'BX' + Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

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
    default: 100 
  },
  iban: {
    type: String,
    required: true,
    default: generateRandomIban
  },
  beneficiaries: [{
    name: String,
    iban: String
  }]
});

const Utilisateur = mongoose.model('Utilisateur', utilisateurSchema);
module.exports = Utilisateur;