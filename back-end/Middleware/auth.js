const jwt = require('jsonwebtoken');
const KEY_TOKEN = process.env.KEY_TOKEN;

// On vérifie le TOKEN de l'utilisateur, s'il correspond à l'id de l'utilisateur dans la requête, il sera autorisé à changer les données correspondantes.
// Ce middleware sera appliqué à toutes les routes afin de les sécuriser
module.exports = (req, res, next) => {
  try {
    // On récupère le token dans le header de la requête autorisation, on récupère uniquement le deuxième élément du tableau (car split bearer)
    const token = req.headers.authorization.split(' ')[1];
    // On vérifie le token décodé avec la clé secrète initiée avec la création du token encodé initialement (Cf Controller user), les clés doivent correspondre
    const decodedToken = jwt.verify(token, KEY_TOKEN);
    // On vérifie que le userId envoyé avec la requête correspond au userId encodé dans le token
    const userId = decodedToken.userId;
    //Test afficahe ID
    console.log('ID: ' + userId)
    //Test de l'userID
    req.auth ={userId}
    next(); // si tout est valide on passe au prochain middleware
  } catch (error) { // probleme d'autentification si erreur dans les inscrutions
    console.log (error)
    res.status(401).json({error: error | '401: unauthorized request !' })
  }
}