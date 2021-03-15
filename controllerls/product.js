let Product = require("../models/product");



exports.getproducts  = async (req,res,next) =>{
    console.log("we are inside the getProducts");
    let products = await Product.products();
    return res.status(200).json({products:products,msg:"got All products"})
}


exports.addProduct = async (req,res,next) =>{
    console.log("we are inside the add product",typeof(+req.body.price))
    const title = req.body.title;
    const content = req.body.content;
    const price = +req.body.price;
    let imageUrl;
    if(req.file){
        imageUrl = req.file.path.replace('\\', '/');
    }
    let product  = {
        title: title,
        content:content,
        price:price,
        image:imageUrl
    }
    try {
   let savedProduct =  await Product.addProduct(product)
    return res.status(200).json({product:savedProduct})
    // check 
    }
    catch (error) {
        next(error)
        // res.status(401).json({error:error})
    }
}

exports.getProduct = async (req,res,next) =>{
    console.log("we are inside the getProduct")
    const productId  = req.params.id.toString();
    console.log(productId)
    console.log(productId)
    try {
        let product = await Product.product(productId)
        console.log(product)
        return res.status(200).json({product:product})

    }
    catch (err) {
        return res.status(500).json({error:err})
        
    }

}

exports.deleteProduct = async (req,res,next) =>{
    console.log("we are insde the delete Product")
    const productId  = req.params.id.toString();
    try {
        let product = await Product.deleteProduct(new ObjectID(productId))
        console.log(product)
        res.status(200).json({product:product})

    }
    catch (err) {
      return   res.status(401).json({error:err})
    }



}

exports.editProduct = async (req,res,next) => {
    console.log("we are  inside the edit product")
    try {
        let editData = {
            $set: {
                price:req.body.price,
                content:req.body.content,
                title:req.body.title
            }
        }
        let product = await Product.editProduct(productId,editData)
        console.log(product)
        res.status(200).json({product:product})

    }
    catch (err) {
      return   res.status(401).json({error:err})
    }

}


