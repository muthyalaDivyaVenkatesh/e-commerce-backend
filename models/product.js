 const db = require('../utils/db').getDb;
 const ObjectID = require('mongodb').ObjectID;

 let products =  {
    //  getAllproducts 
    products : async function () {
          let productDb = db();
          const allProducts = await productDb.collection('products').find().toArray()
          return allProducts;
     },

    //  getproduct
    product : async function(id) {
        let productDb = db();
        try {
        const product = await productDb.collection('products').findOne({_id: new ObjectID(id)})
        return product
        }
        catch (err){
            Promise.reject('Canot find the Product')
        }
       
    },

    editProduct : async function(updatedProduct) {
        let productDb = db();
        try {
         const product = await productDb.collection('products').findOneAndUpdate({_id:id,updatedProduct})
         }
            catch {
               Promise.reject('Unable to delete the product')
            }

    },

    // deleteProduct 
    deleteProduct : async  function (id) {
         let productDb = db();
         try {
         const product = await productDb.collection('products').findOneAndDelete({_id:id})
         }
         catch {
            Promise.reject('Unable to delete the product')
         }
    },

    addProduct : async function(addProduct){
        let productDb = db();
        console.log("we are inside teh AddProduct")
      try {
          console.log("we are inside the addProduct",+addProduct.price,addProduct.image)
         const product = await productDb.collection("products").insertOne({
             title:addProduct.title,
             content:addProduct.content,
             price:addProduct.price,
             imageUrl:addProduct.image.toString()
         })
         console.log("we are seeing the Saved Products",product.ops)
         return product.ops
         }
         catch (err){
             console.error(err)
             next(err)
            // Promise.reject('Unable to Add the Product')
         }
    }

 }

module.exports = products