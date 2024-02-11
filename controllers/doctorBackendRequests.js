const BACKEND_DOCTOR_HOST = process.env.BACKEND__DOCTOR_HOST;
const axios=require('axios');


exports.fetchDoctorsCardDetails=async(req,res)=>{
    try{
        const {doctors_ids}=req.body;
        const doctors_card_details=await axios.post(`${BACKEND_DOCTOR_HOST}/api/doctor/getDoctorCardDetails`,{doctors_ids});
        res.status(200).json({ doctors_card_details })
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
};

exports.fetchDoctorDetails=async(req,res)=>{
    try{
        const {doctor_id}=req.params;
        const doctor_details=await axios.post(`${BACKEND_DOCTOR_HOST}/api/doctor/getDoctorDetails`,{doctor_id});
        res.status(200).json({ doctor_details })
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
};

