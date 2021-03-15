const express = require('express');
const router = express.Router()


// controllers
const  authControllers = require('../controllerls/auth')


// SignUp
// router.get('signup',auth.getSignin)

//  signin
router.post('/signin',authControllers.postSignin)

// login 
router.post('/login',authControllers.postLogin)

// reset Password
router.post('/resetpassword',authControllers.resetPassword);


// setNew Password
router.post('/setnewpassword/:id',authControllers.setNewPassword)


module.exports = router