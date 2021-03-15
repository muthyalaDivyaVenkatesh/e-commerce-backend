let auth = require("../models/auth");
var bcrypt = require("bcryptjs");
var CryptoJS = require("crypto-js");

var jwt = require("jsonwebtoken");
const db = require("../utils/db").getDb;
var nodemailer = require("nodemailer");

exports.postSignin = async (req, res, next) => {
  console.log(req.body)
  // console.log("we are inside post Login",JSON.parse(req.body));
  try {
    let savedRes = await auth.signUp(req.body);
    console.log(savedRes);
    return res.status(200).json({ message: "Succefully user Created" });
  } catch (err) {

    // console.log(err);
     let error =  new Error ("User Alredy exists With This email");
    //  console.log(error)
     error.statusCode  = 409;
    //  console.log(Object.keys(error.message))
     next(error)
  }
};


exports.postLogin = async (req, res, next) => {
  console.log("we are inside postLogin");
  try {
    let loginUser = await auth.login(req.body);
    if (!loginUser) {
      return res.status(404).json({ message: "User Not Found" });
    }
    console.log(loginUser);
    const isEqual = bcrypt.compare(loginUser.password, req.body.password);
    if (isEqual) {
      let token = jwt.sign(
        { email: loginUser.email, id: loginUser._id },
        "superSecretKey",
        { expiresIn: "1h" }
      );
      res.status(200).json({token: token, userId: loginUser._id.toString()})
    }
    // return res.status(422).json({ message: "Password Missmatch" });
  } catch (err) {
    console.log(err);
    res.status(401).json({ msg: "User login failed" });
  }
};

// resetPassword
exports.resetPassword = async (req, res, next) => {
  console.log("we are inside restPassword", req.body.email);
  const email = req.body.email;
  var ciphertext = jwt.sign({ email: email }, "superSecretKey", {
    expiresIn: "1h",
  });
  console.log(jwt.verify(ciphertext,'superSecretKey'))
  let userDb = db();
  var newValues = {
    $set: {
      resetToken: ciphertext,
      resetTokenExpirey: new Date(Date.now() + 3600000),
    },
  };
  try {
    let userDoc = await userDb
      .collection("user")
      .updateOne({ email: email }, newValues);

      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'mdvenkatesh1421@gmail.com',
          pass: '19june19junemd'
        }
      });
      
      var mailOptions = {
        from: 'mdvenkatesh1421@gmail.com',
        to: email,
        subject: 'Sending Email for password reset',
        text: `<h4>plese reset your password using  <a>localhost:3000/auth/setnewpassword/${ciphertext}</a></h4>`
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    return res
      .status(200)
      .json({ msg: "Plese check the Email For Reset Token", user: userDoc });
  } catch (err) {
    next(err);
  }
};

// setNewPassword
exports.setNewPassword = async (req, res, next) => {
  const resetToken = req.params.id;
  let userDb = db();
  // decrypt jwt 
  try {
  let  decodedToken = jwt.verify(resetToken, 'superSecretKey');
  let loginUser  = await  userDb.collection('user').findOne({email:decodedToken.email})
  if(loginUser.resetToken == resetToken) {
      let resetPassword = req.body.password;
      let  hashedPassword = bcrypt.hashSync(resetPassword,12)
      let  newPassword = {
          $set: {
              password:hashedPassword
          }
      }
     return  await userDb.collection('user').updateOne({email:decodedToken.email},newPassword)
  }
  else {
      const error = new Error('plese check  mail Token may get Expirey')
      throw  res.status(422).json({err:error})
     }
  }
  catch  (err) {
      throw err;
  }
};
