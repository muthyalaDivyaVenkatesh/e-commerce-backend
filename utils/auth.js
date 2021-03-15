var jwt = require("jsonwebtoken");

// exports 
module.exports = (req,res,next) =>{
    try {
        console.log("we are insde the middleware",req.headers)
        if(req.headers.interceptorskipheader == 'X-Skip-Interceptor'){
            console.log("we  rae inside the interceptSkipHeaders")
            next()
        }
        else {
        const token = req.headers.authorization.split(' ')[1]
        const decodedToken = jwt.verify(token,  "superSecretKey")
        console.log(decodedToken)
        const userId = decodedToken.id
        req.userId = userId
        next()
        }
    }
    catch (err){
        throw err.statis(404).json({'msg':'plese Login to access these page'})
    }
}