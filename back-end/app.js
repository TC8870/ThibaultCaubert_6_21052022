//Express
const { json } = require('express');
const express = require('express');
const app = express();
app.use(express.json());

//Mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://123:123@cluster0.0daop.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//Middleware général pour dire au navigateur de pouvoir utiliser l'API depuis n'importe où
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

//Import du routeur Sauces
const sauceRoutes = require ('./Routes/R_Sauce');
app.use ('/api/sauces', sauceRoutes);

//Import du routeur Users
const userRoutes = require ('./Routes/R_User');
app.use ('/api/auth', userRoutes);

//Export
module.exports = app;
