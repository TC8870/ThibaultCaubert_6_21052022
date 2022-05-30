//Import du modèle
const Sauce = require ('../models/M_Sauce');

//Controller POST
exports.createSauce = (req, res, next) => {
    //delete req.body._id; => a mettre ?
    const sauce = new Sauce ({
    ...req.body
    });
    sauce.save()
    .then (()=> res.status(201).json ({ message : 'La sauce a été créée'}))
    .catch (error => res.status(400).json ({error}));
    };

//Controller PUT
exports.modifySauce = (req, res, next) => {
    Sauce.updateOne( {userId: req.params.userId}, {...req.body, userId: req.params.userId})
        .then (()=> res.status(201).json ({ message : 'La sauce a été modifiée'}))
        .catch (error => res.status(400).json ({error}));
    };

//Controller GET ALL
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then (sauces => res.status(200).json(sauces))
        .catch (error => res.status(400).json ({error}));
    };

//Controller GET ONE
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({userId : req.params.userId })
        .then (sauce => res.status(200).json(sauce))
        .catch (error => res.status(404).json ({error}));
    };

//Controller DELETE
exports.deleteSauce =  (req, res, next) => {
    Sauce.findOne ({userId : req.params.userId})
        .then (
            (Sauce)=> {
            if (!Sauce){
                res.status(404).json({erreur : new Error('Objet non trouvé')})
        }
            if (Sauce.userId !== req.auth.userId){
                res.status(401).json({erreur : new Error('Requête non autorisée')})
        }
    Sauce.deleteOne( {userId: req.params.userId})
        .then (()=> res.status(200).json ({ message : 'La sauce a été supprimée'}))
        .catch ((error) => res.status(400).json ({error}));
        })
    }


    