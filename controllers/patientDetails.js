const mongoose = require('mongoose');
const {detailsSchema}=require('../models/patientDetailsSchema');
const patientDetails = async(req, res) => {
    
  try{
    const{name,dob,sex,bloodGroup,proffession,weight,height,profilePicture,patient_unique_id}=req.body;
    
    // connecting to the patient database
    
    const details=mongoose.model('details',detailsSchema);
    const newAuth=new details({
        name,
        dob,
        sex,
        bloodGroup,
        proffession,
        weight,
        height,
        profilePicture,
        patient_unique_id
    });
    
    await newAuth.save();
  }
  catch(err){
    console.log(err);
    res.status(500).json({message:err.message });
  }
};

module.exports = {patientDetails};