const User = require('../models/M_User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//Créer un compte utilisateur
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.password,
                password: hash
            })
            user.save()
                .then(() => res.status(201).json({ message: 'utilisateur créé' }))
                .catch(error => res.status(400).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
};

//Se connecter à un compte utilisateur
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'utilisateur non trouvé' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'mot de passe incorrect' });
                    }
                    res.status(200).json({
                        userId: user.userId,
                        token: jwt.sign(
                            {userId : user.userId},
                            'RFMC56DD5DDZFFE96GF3GF14GZ3A68S31F8V9ZE1FE67FEG1V886NN57VD66CT44T',
                            {expiresIn : '2h'}
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
};