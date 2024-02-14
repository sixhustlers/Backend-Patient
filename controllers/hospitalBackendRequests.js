const axios=require('axios');
const mongoose = require('mongoose');
const {detailsSchema}=require('../models/patientDetailsSchema');
const {transaction_idsSchema,appointmentsSchema}=require('../models/medicalRecordsSchema');
const BACKEND_HOSPITAL_HOST=process.env.BACKEND_HOSPITAL_HOST;

// to be executed when the patient confirms the booking with the time-slots
exports.confirmBooking = async (req, res) => {
  try {
    const {doctor_id, time_slots,hospital_id} = req.body
    const patient_id = req.params;
    const patientDetails = mongoose.model('details', detailsSchema)

    const patient_details = await patientDetails.findOne({ patient_id })
    const { name, dob, sex, blood_group, weight, height, temporary_symptoms } =
      patient_details
    const age=new Date().getFullYear()-new Date(dob).getFullYear();
    await axios.post(`${BACKEND_HOSPITAL_HOST}/bookingRequest`, {
      name,
      age,
      sex,
      blood_group,
      weight,
      height,
      patient_id,
      doctor_id,
      time_slots,
      temporary_symptoms,
      hospital_id,
    })

    res.status(200).json({ message: 'Wait for the Confirmation from Doctor' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// to be executed when the Doctor/Receptionist(Hospital) either confirms or rejects the booking

exports.AppointmentBookingUpdate=async(req,res)=>{
    const {bookingStatus,message}=req.body;
    const transaction=mongoose.model('transactions',transaction_idsSchema);
    const appointment=mongoose.model('appointments',appointmentsSchema);
    try{

        if(!bookingStatus){
            console.log(message);
            return res.status(200).json({message:`${message}`,bookingStatus:`${bookingStatus}`});
        }
        else{
            const{
                appointment_id,
                patient_id,
                doctor_id,
                hospital_id,
                doctor_name,
                hospital_name,
                time_slots
            }=req.body;

            const new_transaction=new transaction({
                appointment_ids_arr:appointment_id,
                patient_id
            });
            const new_transation=await new_transaction.save();
            const new_appointment=new appointment({
                appointment_id,
                transaction_id:new_transation.transaction_id,
                patient_id,
                doctor_id,
                hospital_id,
                doctor_name,
                hospital_name,
            });
            await new_appointment.save();
            res.status(200).json({message:`${message}`,bookingStatus:`${bookingStatus}`,time_slots});
        }
      }
    catch(err){
        res.status(500).json({message:err.message});
    }
}