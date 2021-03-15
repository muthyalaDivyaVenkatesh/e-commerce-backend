const db = require('../utils/db').getDb
var bcrypt = require('bcryptjs');

let auth = {
    // signup a user 
    signUp  :  async function   (signupObj) {
        const email = signupObj.email;
        const password = signupObj.password;
        const name = signupObj.name;
        // hashthe password
        let hashedPssword = bcrypt.hashSync(password,12)
        // check whether email is Alredy taken 
        const userDb  = await db()
        const user = await userDb.collection('user').findOne({email:email})
        if(user) {
            // console.log("user",user)
            let err =  new Error("User Alredy Presetnt")
            throw err
        }
          // insetOne
         const savedUser  = await userDb.collection('user').insertOne({
         email:email,
         password:hashedPssword,
         name:name
         })
         return savedUser
   },

   login : async function (loginObj) {
       const email = loginObj.email;
       const userDb = db();
       let loginUser = await userDb.collection('user').findOne({email:email})
       console.log("check Login User",loginUser)
       return loginUser
  } 

}

module.exports = auth