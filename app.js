const { MongoClient } = require('mongodb')
const express = require('express');
const app = express()
const  bodyParser = require('body-parser')
const path = require('path')
const  multer  = require('multer')

const connectDb =  require('./utils/db')
const authRoutes =  require('./routes/auth')
const productRoutes = require('./routes/products')
const cartRoutes = require('./routes/cart')
const AUTH = require('./utils/auth')


app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization','InterceptorSkipHeader');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
});





// fileStorage
const fileStorage = multer.diskStorage({
    destination: (req,file,cb)=>{
         cb(null,'images')
    },
    filename: (req,file,cb)=>{
        console.log(file.mimetype)
       cb(null, file.fieldname + '-' + Date.now()+ '.'+file.mimetype.split('/')[1])
    }
})


app.use(multer({ storage: fileStorage }).single('image'))
app.use(bodyParser.json())


// URl
const URL = "mongodb://localhost:27017/shop"


app.use('/static/images/',express.static(path.join(__dirname,'images'),{
    setHeaders: setCustomCacheControl
}))

app.use(AUTH);

function setCustomCacheControl (res, path) {
      res.setHeader('Content-Type','image/jpeg')
    }

app.get('/static/images/:imageid', function (req, res, next) {
    const fileName = req.params.imageid;
    res.sendFile(fileName, options, function (err) { /* ... */ });
  });

app.use('/auth',authRoutes)
app.use(productRoutes)
app.use(cartRoutes)



app.use((err,req,res,next)=>{
    if(err.statusCode && err) {
        console.log("//////////////////////////////")
        console.log(err.message,err.statusCode)
          res.status(err.statusCode).json({msg:"user ALredy Exist"})
    }
    else {
        console.log(Object.keys(err))
        res.status(500).json({msg:"Some error occured"})
  
    }
    next()
})


connectDb.mongoConnet(URL).then(conDb =>{
    app.listen(3000,()=>{
        console.log("Connected SuccessFully")
        console.log("we are listining to the Port 3000")
    })
 
}).catch(err=>{
    console.error(err)
})


// MongoClient.connect(URl)
// .then(val => {
//     console.log("you are connected to Db")
//     app.listen(3000)
// })
// .catch(err=>{
//     console.log(err)
// })
