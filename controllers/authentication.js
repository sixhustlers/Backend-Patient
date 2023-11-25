require('dotenv').config();
const patient_mongodb_url=process.env.PATIENT_MONGODB_URL;
const mongoose=require('mongoose');
const {authSchema}=require('../models/patientSchema');
const encrypt=require("mongoose-encryption");
authSchema.plugin(encrypt, { secret:process.env.PASSWORD_ENCRYPTION_SECRET_KEY, encryptedFields: ['password'] });   //encrypt password field in database
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilio_client = require('twilio')(twilioAccountSid, twilioAuthToken);
const speakeasy = require('speakeasy'); 

const register=async(req,res)=>{

    mongoose.connection.close();

    const {username,password,mobile_no}=req.body;
    
    console.log(patient_mongodb_url+username);

    // connecting to the patient database

    await(
         mongoose
    .connect(patient_mongodb_url+username)
    .then(() => {
      console.log('patient db Connetion Successfull')
    })
    .catch((err) => {
      console.log(err.message)
    })
    )

    const auth=mongoose.model('auth',authSchema);

    const newAuth=new auth({
        username,
        password,
        mobile_no
    });
    

    await newAuth.save();
    createOTP(mobile_no,res);
}

const createOTP=async(mobile_no,res)=>{

try{
  const secret = speakeasy.generateSecret({ length: 20 }); 
  
// Generate a TOTP code using the secret key 
const otp = speakeasy.totp({ 
  
    // Use the Base32 encoding of the secret key 
    secret: secret.base32, 
  
    // Tell Speakeasy to use the Base32  
    // encoding format for the secret key 
    encoding: 'base32'
}); 
  
// Log the secret key and TOTP code 
// to the console 
console.log('Secret: ', secret.base32); 
console.log('Created OTP: ', otp);

                // sending otp to the user
await twilio_client.messages
    .create({
        body: `Your OTP is ${otp}`,
        from: '+12706067562',
        to: `+91${mobile_no}`
    })
    .then(message => console.log("message sent"))
    .catch(err=>console.log(err));

res.status(200).json({secret:secret.base32});

}
catch(err){
  console.log(err);
}

}



const verifyOTP=async(req,res)=>{

try{
  var verified = speakeasy.totp.verify({
  secret:req.body.secret,
  encoding: 'base32',
  token: req.body.otp,
  window: 6
});
console.log(req.body.secret+" "+req.body.otp);
console.log(verified);
if(verified)
res.status(200).json({message:'OTP verified'})
else
res.status(400).json({message:'OTP not verified'});
}

catch(err){
  console.log(err);
}
}

module.exports={
    register,
    verifyOTP
};