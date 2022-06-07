const mongoose = require ('mongoose');
const uniqueValidator = require ('mongoose-unique-validator');

//Création du schéma "Sauce"
const userSchema = mongoose.Schema ({
    email : {type : String, required : true, unique :true, match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, "Format email invalide"]},
    password : {type : String, required : true },
    })
//Associer le validateur unique au schéma
    userSchema.plugin(uniqueValidator)

//Export du schéma
module.exports = mongoose.model('User', userSchema);