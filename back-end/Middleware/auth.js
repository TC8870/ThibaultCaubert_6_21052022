const jwt = require('jsonwebtoken');
require('dotenv').config();
const KEY_TOKEN = 'RFMC56DD5DDZFFE96GF3GF14GZ3A68S31F8V9ZE1FE67FEG1V886NN57VD66CT44T';

// On vérifie le TOKEN de l'utilisateur, s'il correspond à l'id de l'utilisateur dans la requête, il sera autorisé à changer les données correspondantes.
// Ce middleware sera appliqué à toutes les routes afin de les sécuriser
module.exports = (req, res, next) => {
  try {

    // console.log("test1")
    // console.log(req.headers.authorization.split(' ')[1])
    // console.log("test2")
    // console.log(KEY_TOKEN)
    // console.log("test3")
    // console.log(req.body.userId)

    // On récupère le token dans le header de la requête autorisation, on récupère uniquement le deuxième élément du tableau (car split bearer)
    const token = req.headers.authorization.split(' ')[1];
    // On vérifie le token décodé avec la clé secrète initiée avec la création du token encodé initialement (Cf Controller user), les clés doivent correspondre
    const decodedToken = jwt.verify(token, KEY_TOKEN);
    // On vérifie que le userId envoyé avec la requête correspond au userId encodé dans le token
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {  // Bug ici
      throw 'User ID non valable'; // si le token ne correspond pas au userId : erreur
    } else {
      next(); // si tout est valide on passe au prochain middleware
    }
  } catch (error) { // probleme d'autentification si erreur dans les inscrutions
    console.log (error)
    res.status(401).json({error: error | '401: unauthorized request !' })
  }
}