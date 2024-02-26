const mongoose = require('mongoose')
const { axios } = require('axios')

const { detailsSchema } = require('../models/patientDetailsSchema')
const { appointmentsSchema } = require('../models/medicalRecordsSchema')
const { Disease_Doctor_Type } = require('../models/Disease_Doctor_Type')

const {
  fetchDoctorsCardDetails,
  fetchRecommendedDoctorsList,
} = require('./doctorBackendRequests')

const {getDoctorIdsFromSymptoms}=require('./mlBackendRequests')

require('dotenv').config()

//Flow -6
exports.bookAppointmentFromSymptoms = async (req, res) => {
  try {
    const { location, symptoms } = req.body
    const patient_id = req.params.patient_id

    const patientDetails = mongoose.model('details', detailsSchema)

    const patient = await patientDetails.findOneAndUpdate(
      { patient_id },
      { temporary_symptoms: symptoms }
    )

    const { dob, sex } = patient
    const age = new Date().getFullYear() - new Date(dob).getFullYear()

    // finding the info of the last appointment's like disease_id, doctor_type_id & appointment_date
    const last_appointment = await appointments
      .find()
      .sort({ _id: -1 })
      .limit(1)

    const last_visited_disease_id = last_appointment.disease_id
    const last_appointment_time_span =
      new Date() - last_appointment.appointment_date

    let last_visited_doctor_type_id = Disease_Doctor_Type.find((item) => {
      return item.Disease_ID === last_visited_disease_id
    })
    if (!last_visited_doctor_type_id) {
      last_visited_doctor_type_id = 1
    }

    // finding the list of doctors visited by the patient
    const visited_doctor_ids = await appointments.distinct('doctor_id', {
      patient_id,
    })

    // to be in ML Backend 

    // infos to be sent for the symptoms analyzer and Doctor Recommender System and get the doctor ids
    const text = [symptoms]
    const patient_info = [[
      patient_id,
      age,
      sex,
      last_visited_disease_id,
      last_visited_doctor_type_id,
      last_appointment_time_span,
    ]]
    const constraints= [{
      location,
      visited_doctor_ids,
    }]

    const doctors_ids = getDoctorIdsFromSymptoms(  // req goes to ML backend
      patient_info,
      text,
      constraints
    )
    // const doctors_ids = ['111111', '111112', '111113', '111114', '111115']

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
