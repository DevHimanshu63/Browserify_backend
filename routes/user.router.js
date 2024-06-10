const express = require('express');
const user = require("../controller/user.controller")
const router = express.Router();


router.post('/login', user.login); 
router.post('/signup',user.signup)




module.exports = router;