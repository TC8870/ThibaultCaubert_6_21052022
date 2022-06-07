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
    // console.log('test1');
    // console.log(req.body);
    // console.log('test2');
    // console.log(req.protocol);
    // console.log('test3');
    // console.log(req.get('host'));
    // console.log('test4');
    // console.log(req.file);
    // console.log('test5');
    //console.log(req.file.filename);

    const myNewSauce = JSON.parse(req.body.sauce);
    delete myNewSauce._id;
    const sauce = new Sauce({
        ...myNewSauce,
        //imageUrl: `${req.protocol}://${req.get('host')}/Images/${req.file.filename}`,
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
    const mySauceToModify = {};
    // Si la modification contient une image 
    req.file ? (
        Sauce.findOne({ _id: req.params.id })
            .then((sauce) => {// On supprime l'ancienne image du serveur
                const filename = sauce.imageUrl.split('/Images/')[1]
                fs.unlinkSync(`Images/${filename}`)
            }),
        // On modifie les données et on ajoute la nouvelle image
        mySauceToModify = {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/Images/${req.file.filename}`,
        }
    ) : ( // Opérateur ternaire équivalent à if() {} else {} => condition ? Instruction si vrai : Instruction si faux
        // Si la modification ne contient pas de nouvelle image
        mySauceToModify = {
            ...req.body
        })
    //Application des paramètres
    Sauce.updateOne({ _id: req.params.id }, { ...mySauceToModify, _id: req.params.id })
        .then(() => res.status(201).json({ message: 'La sauce a été modifiée' }))
        .catch(error => res.status(400).json({ error }));
};

//Controller DELETE ****************************************************************************************************
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(
            (Sauce) => {
                if (!Sauce) {
                    res.status(404).json({ erreur: new Error('Objet non trouvé') })
                }
                if (Sauce.userId !== req.auth.userId) {
                    res.status(401).json({ erreur: new Error('Requête non autorisée') })
                }
                else {
                    sauce => {
                        const filename = sauce.imageUrl.split('/Images/')[1];
                        fs.unlink(`Images/${filename}`, () => {
                            Sauce.deleteOne({ _id: req.params.id })
                                .then(() => res.status(200).json({ message: 'La sauce a été supprimée' }))
                                .catch((error) => res.status(400).json({ error }));
                        });
                    }
                }
            })
        .catch(error => res.status(500).json({ error }));
};

//Controller LIKE DISLIKE ****************************************************************************************************
exports.likeDislike = (req, res, next) => {
    //Constantes
    const like = req.body.like
    const userId = req.body.userId
    const sauceId = req.params.id
    //Si like, ajout de l'utilisateur + compteur incrémenté de 1 => ajout du controle si déjà liké ou déjà disliké
    if (like === 1) {
        Sauce.updateOne({ _id: sauceId },
            {
                $push: { usersLiked: userId },
                $inc: { likes: +1 },
            })
            .then(() => { res.status(201).json({ message: 'Like ajouté !' }) })
            .catch((error) => res.status(400).json({ error }))
    }
    //Si dislike, ajout de l'utilisateur + compteur incrémenté de 1 => ajout du controle si déjà liké ou déjà disliké
    if (like === -1) {
        Sauce.updateOne({ _id: sauceId },
            {
                $push: { usersDisliked: userId },
                $inc: { dislikes: +1 },
            })
            .then(() => { res.status(201).json({ message: 'Dislike ajouté !' }) })
            .catch((error) => res.status(400).json({ error }))
    }
    //Si annuler like ou dislike 
    if (like === 0) {
        Sauce.findOne({ _id: sauceId })
            .then((sauce) => {
                // Si annulation like, on supprime l'utilisateur et on décrémente de 1
                if (sauce.usersLiked.includes(userId)) {
                    Sauce.updateOne({ _id: sauceId },
                        {
                            $pull: { usersLiked: userId },
                            $inc: { likes: -1 },
                        })
                        .then(() => res.status(201).json({ message: 'Like retiré !' }))
                        .catch((error) => res.status(400).json({ error }))
                }
                // Si annulation dislike, on supprime l'utilisateur et on décrémente de 1
                if (sauce.usersDisliked.includes(userId)) {
                    Sauce.updateOne({ _id: sauceId },
                        {
                            $pull: { usersDisliked: userId },
                            $inc: { dislikes: -1 },
                        })
                        .then(() => res.status(201).json({ message: 'Dislike retiré !' }))
                        .catch((error) => res.status(400).json({ error }))
                }
            })
            .catch((error) => res.status(404).json({
                error
            }))
    }
}