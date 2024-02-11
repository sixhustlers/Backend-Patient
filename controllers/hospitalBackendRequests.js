const axios=require('axios');
const mongoose = require('mongoose');
const {detailsSchema}=require('../models/patientDetailsSchema');
const {transaction_idsSchema}=require('../models/medicalRecordsSchema');
const BACKEND_HOSPITAL_HOST=process.env.BACKEND_HOSPITAL_HOST;

// to be executed when the patient confirms the booking with the time-slots
exports.confirmBooking = async (req, res) => {
  try {
    const { patient_id, doctor_id, time_slots } = req.body
    const patientDetails = mongoose.model('details', detailsSchema)

    const patient_details = await patientDetails.findOne({ patient_id })
    const { name, dob, sex, blood_group, weight, height, temporary_symptoms } =
      patient_details

    await axios.post(`${BACKEND_HOSPITAL_HOST}/api/confirmBooking`, {
      name,
      dob,
      sex,
      blood_group,
      weight,
      height,
      patient_id,
      doctor_id,
      time_slots,
      temporary_symptoms,
      doctor_id,
      patient_id,
      time_slots,
    })

    res.status(200).json({ message: 'Wait for the Confirmation from Doctor' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// to be executed when the Doctor/Receptionist(Hospital) either confirms or rejects the booking

exports.AppointmentBookingUpdate=async(req,res)=>{
    const {isBookingConfirmed,time_slots,appointment_id,patient_id}=req.body;
    const transaction=mongoose.model('transactions',transaction_idsSchema);
    try{

        if(!isBookingConfirmed){
            
            return res.status(200).json({message:"Booking Rejected",isBookingConfirmed:false});
        }
        else{
            const new_transaction=new transaction({
                appointment_ids_arr:appointment_id,
                patient_id
            });
            await new_transaction.save();
            res.status(200).json({message:"Booking Confirmed",isBookingConfirmed:true,time_slots});
        }

    }
    catch(err){
        res.status(500).json({message:err.message});
    }
}