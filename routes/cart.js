const express = require('express');
const router = express.Router()

// getControllerls
const cartControllerls =  require('../controllerls/cart')

router.get('/add-cart',cartControllerls.getCart)

router.post('/add-cart',cartControllerls.postCart)


router.get('/orders',cartControllerls.getOrders)


router.get('/addres',cartControllerls.getAddress)

router.post('/address',cartControllerls.postAddress)


module.exports = router