const express = require ('express');
const router = express.Router();
const sauceController = require('../Controllers/sauceController');
const auth = require ('../Middleware/auth');
const multer = require ('../Middleware/multer-config');

//Requêtes
router.get ('/',  auth, sauceController.getAllSauce); 
router.get ('/:id', auth, sauceController.getOneSauce);
router.post ('/', auth, multer,  sauceController.createSauce); 
router.post('/:id/like', auth, sauceController.likeDislike)
router.put ('/:id',  auth, multer, sauceController.modifySauce);
router.delete ('/:id', auth, sauceController.deleteSauce);

module.exports = router;

