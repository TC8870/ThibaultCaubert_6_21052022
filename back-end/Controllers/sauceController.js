//Import du modèle
const Sauce = require('../models/M_Sauce');
// Récupération du module 'file system' de Node permettant de gérer ici les téléchargements et modifications d'images
const fs = require('fs');

//Controller GET ALL *************************************************************************************************
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

//Controller GET ONE **************************************************************************************************
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

//Controller POST ****************************************************************************************************
exports.createSauce = (req, res, next) => {
    const myNewSauce = JSON.parse(req.body.sauce);
    delete myNewSauce._id;
    const sauce = new Sauce({
        ...myNewSauce,
        imageUrl: `${req.protocol}://${req.get('host')}/Images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'La sauce a été créée' }))
        .catch(error => res.status(400).json({ error }));
};

//Controller PUT ****************************************************************************************************
exports.modifySauce = (req, res, next) => {
    const mySauceToModify = req.file ? {
        //Si Image
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/Images/${req.file.filename}`,
    } : {
        //Si aucune Image
        ...req.body
    };
    //Trouver la sauce
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            //Si Id ne correspond pas
            if (sauce.userId !== req.auth.userId) {
                res.status(403).json({ error: 'Requête non authorisée' });
            }
            //Sinon
            else {
                Sauce.updateOne({ _id: req.params.id }, { ...mySauceToModify, _id: req.params.id })
                    .then(() => res.status(201).json({ message: 'La sauce a été modifiée' }))
                    .catch(error => res.status(400).json({ error }));
            }
        })
}

//Controller DELETE ****************************************************************************************************
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(
            (sauce) => {
                if (!sauce) {
                    res.status(404).json({ erreur: new Error('Sauce non trouvée') })
                }
                if (sauce.userId !== req.auth.userId) {
                    res.status(401).json({ erreur: new Error('Requête non autorisée') })
                }
                else {
                        const filename = sauce.imageUrl.split('/Images/')[1];
                        fs.unlink(`Images/${filename}`, () => {
                            Sauce.deleteOne({ _id: req.params.id })
                                .then(() => res.status(200).json({ message: 'La sauce a été supprimée' }))
                                .catch((error) => res.status(400).json({ error }));
                        });
                }
            })
        .catch(error => res.status(500).json({ error }));
};

//Controller LIKE DISLIKE ****************************************************************************************************
exports.likeDislike = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            //Si like, contrôle si déjà liké, si ok alors ajout de l'ID utilisateur + compteur incrémenté de 1 
            if (req.body.like === 1) {
                if (sauce.usersLiked.includes(req.body.userId)) {
                    res.status(401).json({ error: 'Sauce déja liké' });
                }
                else {
                    Sauce.updateOne({ _id: req.params.id },
                        {
                            $push: { usersLiked: req.body.userId },
                            $inc: { likes: req.body.like++ },
                        })
                        .then(() => { res.status(201).json({ message: 'Like ajouté !' }) })
                        .catch((error) => res.status(400).json({ error }))
                }
            }
            //Si dislike, contrôle si déjà disliké, si ok alors ajout de l'ID utilisateur + compteur incrémenté de 1 
            if (req.body.like === -1) {
                if (sauce.usersDisliked.includes(req.body.userId)) {
                    res.status(401).json({ error: 'Sauce déja disliké' });
                }
                else {
                    Sauce.updateOne({ _id: req.params.id },
                        {
                            $push: { usersDisliked: req.body.userId },
                            $inc: { dislikes: (req.body.like++) * -1 },
                        })
                        .then(() => { res.status(201).json({ message: 'Dislike ajouté !' }) })
                        .catch((error) => res.status(400).json({ error }))
                }
            }
            //Sinon annuler like ou dislike 
            else {
                if (sauce.usersLiked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id },
                        {
                            $pull: { usersLiked: req.body.userId },
                            $inc: { likes: -1 },
                        })
                        .then(() => res.status(201).json({ message: 'Like retiré !' }))
                        .catch((error) => res.status(400).json({ error }))
                }
                if (sauce.usersDisliked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id },
                        {
                            $pull: { usersDisliked: req.body.userId },
                            $inc: { dislikes: -1 },
                        })
                        .then(() => res.status(201).json({ message: 'Dislike retiré !' }))
                        .catch((error) => res.status(400).json({ error }))
                }
            }
        })
        .catch((error) => res.status(404).json({ error }))
}