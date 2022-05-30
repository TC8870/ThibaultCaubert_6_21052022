const express = require ('express');
const router = express.Router();
const userRoutes = require('../Controllers/C_User');

//Requêtes 
router.post ('/', userRoutes.signup);
router.post ('/', userRoutes.login);

module.exports= router;