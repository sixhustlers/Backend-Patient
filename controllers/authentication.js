require('dotenv').config();
const mongoose = require('mongoose');
const {authSchema}=require('../models/patientDetailsSchema');
const encrypt=require("mongoose-encryption");
authSchema.plugin(encrypt, { secret:process.env.PASSWORD_ENCRYPTION_SECRET_KEY, encryptedFields: ['password'] });   //encrypt password field in database
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const unique_id_code=process.env.UNIQUE_ID_CODE;
const twilio_client = require('twilio')(twilioAccountSid, twilioAuthToken);
const speakeasy = require('speakeasy'); 

const register=async(req,res)=>{

  try{
     const {username,password,mobile_no,mail_id}=req.body;
     const auth=mongoose.model('auth',authSchema);
    
    // Details Validation
    
    const findExistingUsername=await(auth.findOne({username:username}));
    const findExistingEmail=await(auth.findOne({mail_id:mail_id}));
    if(findExistingUsername!=null)
    {
        return res.status(400).json({message:"username already exists , please try with another username"}); 
    }

    if(findExistingEmail!=null)
    {
        return res.status(400).json({message:"email already exists , please try with another email"}); 
    }
   //delete all the existing data of the user
   auth.deleteMany();
//    const patient_unique_id = 111111111111111
    const patient_id=username+"@UHS"; //  unique id for each patient
    const newAuth=new auth({
        username,
        password,
        mobile_no,
        mail_id,
        patient_id,
    });
    

    await newAuth.save();
    // createOTP(mobile_no,res);
    res.status(200).json({message:"Patient registered successfully",patient_id:patient_id});
   }
   catch(err){
    console.log(err);
    res.status(500).json({message:err.message });
   }
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

res.status(200).json({secret:secret.base32,patient_id:patient_id});

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

//login function
const login=async(req,res)=>{
    try{
        const {username,password}=req.body;
        const auth=mongoose.model('auth',authSchema);
        const user=await auth
        .findOne({username:username})
        // .select(username ,password ,patient_id);
        if(user==null)
        {
            return res.status(400).json({message:"Invalid credentials"});
        }
        if(user.password!=password)
        {
            return res.status(400).json({message:"Invalid credentials"});
        }

        res.status(200).json({message:"Login successful",patient_id:user.patient_id,username:user.username});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:err.message});
    }
}
module.exports={
    register,
    login,
    verifyOTP
};
