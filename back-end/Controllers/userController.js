const User = require('../models/M_User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//Intégration des variables d'environnement
require('dotenv').config();
const KEY_TOKEN = process.env.KEY_TOKEN;
const EXPIRE_TIME = process.env.EXPIRE_TIME;

//Créer un compte utilisateur ********************************************************************************
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            })
            user.save()
                .then(() => res.status(201).json({ message: 'utilisateur créé' }))
                .catch(error => res.status(400).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
};

//Se connecter à un compte utilisateur*************************************************************************
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'utilisateur/mot de passe incorrect' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'utilisateur/mot de passe incorrect' });
                    }
                    res.status(200).json({
                        userId: user.id,
                        token: jwt.sign(
                            {userId : user.id},
                            KEY_TOKEN, 
                            {expiresIn : EXPIRE_TIME}
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
};