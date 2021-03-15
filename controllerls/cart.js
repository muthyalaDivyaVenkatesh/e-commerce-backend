let auth = require("../models/auth");
const db = require('../utils/db').getDb;
const ObjectID = require('mongodb').ObjectID;

// postCard
exports.postCart = async (req,res,next) => {
    console.log(req.userId,"bingoooooo")
    console.log("we are inside post To Cart",req.body[0])
    // get Data from body 
    const product = req.body[0].title;
    const qty = req.body[0].qty  || 1
    const productId = req.body[0].prodId
    console.log("we are looking at products",product,qty,productId)
    try {
    // get the userData 
    const userDb = db();
    let loginUser = await userDb.collection('user').updateOne({_id:new ObjectID(req.userId)}, 
        { 
        $push :{ "orders.products":product }, 
        $set :{'orders.quantity' :qty, 'orders.productId':new ObjectID(productId) } 
    })
    //   console.log("we are seeing teh update document",await userDb.collection('user').findOne({_id:new ObjectID(req.userId)}))
    //    return loginUser
    }
    catch (err){
        console.log(err)
        next(err)
    }
    
}

// get Cart 
exports.getCart = async (req,res,next) => {
    console.log("we are inside get To Cart")
    // now do bingo
    const userDb = db();
    // only get cart 
    try {
    let cartDetails = await userDb.collection('user').getOne({_id: new ObjectID(req.userId)},{product:1,quantity:1,productId:1})
    return cartDetails 
    }
    catch(err){
        console.err(err)
        next(err)
    }
}

// getOrders
exports.getOrders = async (req,res,next) => {
    console.log("we are inside getOrders")
    const userDb = db()
    try {
        let orders = await userDb.collection('user').aggregate([
        {$match:{id: new ObjectID(req.userId)}},
        {
           '$lookup':  {
            "from" : "products",
            "localField" : "orders.productId", 
            "foreignField" : "_id", 
            "as" : "orders_by_customers"
            }
      }]).toArray();
      console.log("///////////////////////////////////////////////////////////")
      console.log(await userDb.collection('user').aggregate({
        '$lookup':  {
         "from" : "products",
         "localField" : "orders.productId", 
         "foreignField" : "_id", 
         "as" : "orders_by_customers"
         }
   }).toArray())
    //   return orders
    }
    catch (err) {
        console.log(err)
        next(err)
    }
}


exports.getAddress = async(req,res,next) => {
    console.log("we are inside getAddress")
    const userDb = db();
    try {
    let addres = await userDb.collection('user').findOne({_id:new ObjectID(req.userId)},{address:1})
    console.log(cart)
    res.staus(200).json({msg:address})
    }
    catch {
        console.log(err)
        throw err
    }

}

exports.postAddress = async(req,res,next) =>{
    console.log("we are inside the PostAddress")
    let userDb = db()
    try {
        const address = req.body
        // let findUser = userDb.collection('user').findOne({_id:req.userId})
        // console.log("we are looking at FindUser",findUser)
        let user = await userDb.collection('user').updateOne({_id:new ObjectID(req.userId)},
            {$set:{address:{
                'name':address.name,
                'mobileNo':address.mobileNo,
                'pinCode':address.pinCode,
                'locality':address.locality,
                'address':address.address,
                'city':address.city,
                'state':address.state,
                'landMark':address.landMark
            }}})
    //   console.log(user)
      res.status(200).json({msg:"Address Saved Succesful"})
    }
    catch(err) {
        console.log(err)
        throw err
    }
}