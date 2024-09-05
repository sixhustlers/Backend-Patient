const mongoose = require('mongoose')
const axios = require('axios')

const { detailsSchema } = require('../models/patientDetailsSchema')
const { appointmentsSchema } = require('../models/medicalRecordsSchema')
const { Disease_Doctor_Type } = require('../models/Disease_Doctor_Type')
const { Hospital_Data } = require('../models/Hospital_Data')

const { fetchDoctorsCardDetails } = require('./doctorBackendRequests')
const { fetchHospitalsCardDetails } = require('./hospitalBackendRequests')

const {
  getDoctorIdsFromSymptoms,
  getDoctorIdsFromRecommenderSystem,
  getHospitalIdsFromRecommenderSystem,
} = require('./mlBackendRequests')

require('dotenv').config()

const BACKEND_HOSPITAL_HOST = process.env.BACKEND_HOSPITAL_HOST

//Flow -6
exports.bookAppointmentFromSymptoms = async (req, res) => {
  try {
    const { location, symptoms } = req.body
    const patient_id = req.params.patient_id

    const patientDetails = mongoose.model('details', detailsSchema)

    const patient = await patientDetails.findOne({ patient_id });
    
    const { dob, sex } = patient
    const age = new Date().getFullYear() - new Date(dob).getFullYear()

    // finding the info of the last appointment's like disease_id, doctor_type_id & appointment_date
    const appointments = mongoose.model('appointments', appointmentsSchema)
    const last_appointment = await appointments
      .find()
      .sort({ _id: -1 })
      .limit(1)
    
    console.log(last_appointment)

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
    const patient_info = [
      [
        patient_id,
        age,
        sex,
        last_visited_disease_id,
        last_visited_doctor_type_id,
        last_appointment_time_span,
      ],
    ]
    const constraints = [
      {
        location,
        visited_doctor_ids,
      },
    ]

    const {doctors_ids,disease_id_name} = getDoctorIdsFromSymptoms(
      // req goes to ML backend
      patient_info,
      text,
      constraints
    )

    const patient_details = mongoose.model('details', detailsSchema)
    await patient_details.findOneAndUpdate(
      { patient_id },
      {
        temporary_symptoms_disease_id_name: [
          symptoms,
          disease_id_name[0],
          disease_id_name[1],
        ],
      }
    )
    // const doctors_ids = ['111111', '111112', '111113', '111114', '111115']

    fetchDoctorsCardDetails(doctors_ids, res) //to be implemented in doctorBackendRequests.js to fetch doctors card details
  
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

//Flow-3

exports.bookAppointmentFromDoctorsList = async (req, res) => {
  try {
    const patient_id = req.params.patient_id
    const location = req.body.location

    const appointments = mongoose.model('appointments', appointmentsSchema)
    const patients = mongoose.model('patients', detailsSchema)

    const today = new Date(new Date().getTime() + 5.5 * 60 * 60 * 1000)
    const oneDay = 24 * 60 * 60 * 1000

    const patient_detail = await patients.findOne({ patient_id })
    const age = today.getFullYear() - patient_detail.dob.getFullYear()
    const gender = patient_detail.sex

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

    const last_appointment__day_difference = Math.round(
      Math.abs((today - last_appointment.appointment_date) / oneDay)
    )

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
    const patient_info = {
      last_visited_disease_id,
      last_visited_doctor_type_id,
      last_appointment__day_difference,
      patient_id,
      age,
      gender,
    }
    const constraints = {
      visited_doctor_ids,
      visited_doctor_names,
      location,
    }
    const recommended_doctors_ids = getDoctorIdsFromRecommenderSystem(
      patient_info,
      constraints
    ) // req goes to ML backend
    // the list of doctor_ids is received from the ML backend
    const default_doctors_ids = [
      '111111',
      '111112',
      '111113',
      '111114',
      '111115',
    ]

    fetchDoctorsCardDetails(recommended_doctors_ids || default_doctors_ids, res) //to be implemented in doctorBackendRequests.js to fetch doctors card details
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

//Flow-2
exports.bookAppointmentFromHospitalsList = async (req, res) => {
  try {
    const patient_id = req.params.patient_id
    const location = req.body.location

    const appointments = mongoose.model('appointments', appointmentsSchema)
    const patients = mongoose.model('details', detailsSchema)

    const today = new Date(new Date().getTime() + 5.5 * 60 * 60 * 1000)
    const oneDay = 24 * 60 * 60 * 1000

    const patient_detail = await patients.findOne({ patient_id })
    console.log(patient_detail)
    const age = today.getFullYear() - patient_detail.dob.getFullYear()
    const gender = patient_detail.sex

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

    const last_appointment__day_difference = Math.round(
      Math.abs((today - last_appointment.appointment_date) / oneDay)
    )
    const last_visited_disease_id = last_appointment.disease_id

    let last_visited_doctor_type_id = Hospital_Data.find((item) => {
      return item.Disease_ID === last_visited_disease_id
    })
    if (!last_visited_doctor_type_id) {
      last_visited_doctor_type_id = 1
    }
    // console.log(
    //   visited_doctor_ids,
    //   visited_doctor_names,
    //   last_visited_doctor_type_id
    // )

    // Sending all the above details to the ML backend to get recommended doctors
    const patient_info = {
      patient_id,
      age,
      gender,
      last_visited_disease_id,
      last_visited_doctor_type_id,
      last_appointment__day_difference,
    }
    const constraints = {
      visited_doctor_ids,
      visited_doctor_names,
      location,
    }

    const recommended_hospital_ids = []
    // const recommended_hospital_ids =
    //   getHospitalIdsFromRecommenderSystem(patient_info,constraints) // req goes to ML backend
    // the list of doctor_ids is received from the ML backend
    const default_hospital_ids = [
      '333331',
      '333332',
      '333333',
      '333334',
      '333335',
    ]

    fetchHospitalsCardDetails(
      recommended_hospital_ids.length > 0
        ? recommended_hospital_ids
        : default_hospital_ids,
      res
    )
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

//book appointment directly without selecting the doctor, the receptionist will provide with the list of doctors to book the appointment
// Flow-2-3b

exports.bookAppointmentFromHospitalDirectly = async (req, res) => {
  try {
    const patient_id = req.params.patient_id
    const { hospital_id, symptoms } = req.body

    const patientDetails = mongoose.model('details', detailsSchema)
    const patient_details = await patientDetails.findOne({ patient_id })
    var { name, dob, sex, blood_group, weight, height, temporary_symptoms_disease_id_name } =
      patient_details
    const age = new Date().getFullYear() - new Date(dob).getFullYear()
    var temporary_symptoms = temporary_symptoms_disease_id_name[0]
    // when the patient already knows the doctor to whom appointment is to be booked and then fills the symptom form just before booking (in Flow=2)
    temporary_symptoms = symptoms
    console.log(name)
    const doctor_id = null
    const doctor_name = null
    const time_slots = null
    console.log(BACKEND_HOSPITAL_HOST)
    const respones=await axios.post(`${BACKEND_HOSPITAL_HOST}/bookingRequest`, {
      name,
      age,
      sex,
      blood_group,
      weight,
      height,
      patient_id,
      doctor_id,
      doctor_name,
      time_slots,
      temporary_symptoms,
      hospital_id,
    })

    res.status(200).json({message:`${respones.data.message},Your request has been sent to hospital ${hospital_id}`})
  } catch (err) {
    console.log(err.message)
    res.status(500).json({ message: err.message })
  }
}
