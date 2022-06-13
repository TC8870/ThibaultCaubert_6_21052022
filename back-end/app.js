//Import des Require Express, BodyParser, Mongoose et Path
const express = require('express');
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose');
const path = require ('path');
//Import du module de variable d'environnement Dotenv
const dotenv = require('dotenv');
dotenv.config();

//Import des routeurs
const sauceRoutes = require ('./Routes/R_Sauce');
const userRoutes = require ('./Routes/R_User');

//Création application express
const app = express();

// utilisation du module 'dotenv' pour masquer les informations de connexion à la base de données à l'aide de variables d'environnement
  require('dotenv').config();
  const userIdentifiant = process.env.userIdentifiant;
  const userPassword =process.env.userPassword;
  
mongoose.connect('mongodb+srv://'+ userIdentifiant + ':' + userPassword +'@cluster0.0daop.mongodb.net/?retryWrites=true&w=majority',
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

// Middleware qui permet de parser les requêtes envoyées par le client, on peut y accéder grâce à req.body
app.use(bodyParser.urlencoded({extended: true}));
//Transforme les données arrivant de la requête POST en un objet JSON facilement exploitable
app.use(bodyParser.json());

app.use ('/Images', express.static(path.join(__dirname, 'Images')));
app.use ('/api/sauces', sauceRoutes);
app.use ('/api/auth', userRoutes);

//Export de l'application 
module.exports = app;