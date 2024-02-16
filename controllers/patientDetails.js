const mongoose = require('mongoose');
const {detailsSchema}=require('../models/patientDetailsSchema');
const patientDetails = async(req, res) => {
  try{

    const {
      name,
      user_dob,
      sex,
      bloodGroup,
      proffession,
      weight,
      height,
      profilePicture,
      patient_id,
    } = req.body

    // Convert to ISO 8601 format (YYYY-MM-DD)
    const isoDate = user_dob.split('-').reverse().join('-')

    // console.log(isoDate) // Output: '2024-02-15'
    const dob = new Date(isoDate)
    // console.log(dob) // Output: Fri Feb 15 2024 00:00:00 GMT+0000 (Coordinated Universal Time)

    const details = mongoose.model('details', detailsSchema)
    const temporary_symptoms = ''
    const patient_details = new details({
      name,
      dob,
      sex,
      bloodGroup,
      proffession,
      weight,
      height,
      profilePicture,
      patient_id,
      temporary_symptoms,
    })

    await patient_details.save();
    res.status(200).json({ message: 'Patient details saved successfully' })
  }
  catch(err){
    console.log(err);
    res.status(500).json({message:err.message });
  }
};

module.exports = {patientDetails};