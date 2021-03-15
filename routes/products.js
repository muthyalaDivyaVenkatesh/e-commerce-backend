const express = require('express');
const { route } = require('./auth');
const router = express.Router()

const productControllerls = require('../controllerls/product')

router.get('/products',productControllerls.getproducts)

router.post('/add-product',productControllerls.addProduct);

router.get('/product/:id',productControllerls.getProduct) 

router.patch('/product/:id',productControllerls.editProduct)

router.delete('/product/:id',productControllerls.deleteProduct);




// export router
module.exports = router