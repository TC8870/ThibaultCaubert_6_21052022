const mongoose = require ('mongoose');

//Création du schéma "Sauce"
const sauceSchema = mongoose.Schema ({
    userId : {type : String, required : true },
    name : {type : String, required : true },
    manufacturer : {type : String, required : true },
    description : {type : String, required : true },
    mainPepper : {type : String, required : true },
    imageUrl : {type : String, required : false },
    heat : {type : Number, required: true},
    likes : {type: Number, required: false, value : 0},
    dislikes : {type: Number, required: false, value : 0},
    usersLiked : [String],
    usersDisliked : [String],
    });

//Export du schéma
module.exports = mongoose.model('Sauce', sauceSchema);


