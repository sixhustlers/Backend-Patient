const mongoose = require('mongoose');
const {detailsSchema} = require('../models/patientDetailsSchema');

const {fetchDoctorsCardDetails}=require('./doctorBackendRequests');
const { axios } = require('axios');

exports.bookAppointmentFromSymptoms=async(req,res)=>{
    try{
        const {patient_id,location,symptoms}=req.body;
        const patientDetails=mongoose.model('details',detailsSchema);
        
        await patientDetails.findOneAndUpdate({patient_id},{temporary_symptoms:symptoms});

        // to be implemented when ML Backend is ready
        // const doctors_ids=await axios.post('http://localhost:7000/api/predictDiseaseAndSendDoctorId',{
        //     symptoms,
        //     location
        // });

        const doctors_ids=[111111,111112,111113,111114,111115];
        fetchDoctorsCardDetails(doctors_ids); //to be implemented in doctorBackendRequests.js to fetch doctors card details        

    }

    catch(err){
        res.status(500).json({message:err.message});
    }
}

