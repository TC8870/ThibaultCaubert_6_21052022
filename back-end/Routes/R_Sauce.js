const express = require ('express');
const router = express.Router();
const sauceRoutes = require('../Controllers/C_Sauce');
const auth = require ('../Middleware/auth')

//Requêtes 
router.get ('/', sauceRoutes.getAllSauce);
router.get ('/:userId', auth, sauceRoutes.getOneSauce);
router.post ('/', auth, sauceRoutes.createSauce);
router.put ('/:userId', auth, sauceRoutes.modifySauce);
router.delete ('/:userId', auth, sauceRoutes.deleteSauce);

module.exports = router;
