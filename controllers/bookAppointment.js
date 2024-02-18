const mongoose = require('mongoose')
const { detailsSchema } = require('../models/patientDetailsSchema')
const { appointmentsSchema } = require('../models/medicalRecordsSchema')
const { Disease_Doctor_Type } = require('../models/Disease_Doctor_Type')

const {
  fetchDoctorsCardDetails,
  fetchRecommendedDoctorsList,
} = require('./doctorBackendRequests')
const { axios } = require('axios')

require('dotenv').config()
const BACKEND_DOCTOR_HOST = process.env.BACKEND_DOCTOR_HOST

//Flow -6
exports.bookAppointmentFromSymptoms = async (req, res) => {
  try {
    const { location, symptoms } = req.body
    const patient_id = req.params.patient_id
    const patientDetails = mongoose.model('details', detailsSchema)

    await patientDetails.findOneAndUpdate(
      { patient_id },
      { temporary_symptoms: symptoms }
    )

     const last_appointment = await appointments
       .find()
       .sort({ _id: -1 })
       .limit(1)
     const last_visited_disease_id = last_appointment.disease_id;

     let last_visited_doctor_type_id = Disease_Doctor_Type.find((item) => {
       return item.Disease_ID === last_visited_disease_id
     })
     if (!last_visited_doctor_type_id) {
       last_visited_doctor_type_id = 1
     }

    // to be implemented when ML Backend is ready
    // const doctors_ids=await axios.post('http://localhost:7000/api/predictDiseaseAndSendDoctorId',{
    //     symptoms,
    //     location,
    //     patient_id
    //     last_visited_doctor_type_id
    // });

    const doctors_ids = ['111111', '111112', '111113', '111114', '111115']

    fetchDoctorsCardDetails(doctors_ids, res) //to be implemented in doctorBackendRequests.js to fetch doctors card details

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

//Flow-3

exports.bookAppointmentFromDoctorList = async (req, res) => {
  try {
    const patient_id = req.params.patient_id
    const location = req.body.location

    const appointments = mongoose.model('appointments', appointmentsSchema)

    const visited_doctor_ids = await appointments.distinct('doctor_id', {
      patient_id,
    })
    const visited_doctor_names = await appointments.distinct('doctor_name', {
      patient_id,
    })
    const last_appointment = await appointments
      .find()
      .sort({ _id: -1 })
      .limit(1)
    const last_visited_disease_id = last_appointment.disease_id

    let last_visited_doctor_type_id = Disease_Doctor_Type.find((item) => {
      return item.Disease_ID === last_visited_disease_id
    })
    if (!last_visited_doctor_type_id) {
      last_visited_doctor_type_id = 1
    }
    console.log(
      visited_doctor_ids,
      visited_doctor_names,
      last_visited_doctor_type_id
    )

    // Sending all the above details to the ML backend to get recommended doctors
    // const recommended_doctors = await axios.post(
    //   'http://localhost:7000/api/recommendDoctor',
    //   {
    //     visited_doctor_ids,
    //     visited_doctor_names,
    //     last_visited_doctor_type_id,
    //     location,
    //     patient_id,
    //   }

    // the list of doctor_ids is received from the ML backend
    const doctors_ids = ['111111', '111112', '111113', '111114', '111115']

    fetchDoctorsCardDetails(doctors_ids, res) //to be implemented in doctorBackendRequests.js to fetch doctors card details
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
