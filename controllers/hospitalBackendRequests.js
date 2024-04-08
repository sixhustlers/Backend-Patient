const axios = require('axios')
const mongoose = require('mongoose')
const { detailsSchema } = require('../models/patientDetailsSchema')
const {
  transaction_idsSchema,
  appointmentsSchema,
} = require('../models/medicalRecordsSchema')

require('dotenv').config()
const BACKEND_HOSPITAL_HOST = process.env.BACKEND_HOSPITAL_HOST

// to be executed when the patient confirms the booking with the time-slots
exports.confirmBooking = async (req, res) => {
  try {
    const { doctor_id, time_slots, hospital_id, doctor_name, symptoms } =
      req.body
    const patient_id = req.params.patient_id

    const patientDetails = mongoose.model('details', detailsSchema)
    const patient_details = await patientDetails.findOne({ patient_id })
    var { name, dob, sex, blood_group, weight, height, temporary_symptoms } =
      patient_details
    const age = new Date().getFullYear() - new Date(dob).getFullYear()

    // when the patient already knows the doctor to whom appointment is to be booked and then fills the symptom form just before booking (in Flow=2)
    if (symptoms.length != 0) temporary_symptoms = symptoms
    console.log(temporary_symptoms)

    const response = await axios.post(
      `${process.env.BACKEND_HOSPITAL_HOST}/bookingRequest`,
      {
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
      }
    )
    res.status(200).json({ message: response.data.message })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// to be executed when the Doctor/Receptionist(Hospital) either confirms or rejects the booking

exports.AppointmentBookingUpdate = async (req, res) => {
  const bookingStatus = req.body.bookingStatus
  const transaction = mongoose.model('transactions', transaction_idsSchema)
  const appointment = mongoose.model('appointments', appointmentsSchema)
  try {
    if (bookingStatus) {
      const {
        appointment_id,
        doctor_id,
        hospital_id,
        doctor_name,
        hospital_name,
        time_slots,
      } = req.body.details
      const patient_id = req.params.patient_id
      console.log(
        req.params.patient_id,
        appointment_id,
        doctor_id,
        hospital_id,
        time_slots
      )

      const new_transaction = new transaction({
        appointment_ids_arr: appointment_id,
        patient_id,
      })
      const new_transation = await new_transaction.save()

      const new_appointment = new appointment({
        _id: appointment_id,
        transaction_id: new_transation._id,
        patient_id,
        doctor_id,
        doctor_name,
        hospital_id,
        hospital_name,
      })
      await new_appointment.save()

      console.log(
        'Your Booking is Confirmed at',
        time_slots,
        'with',
        doctor_name,
        'at',
        hospital_name
      )
      // send this response to the patient frontened
    }

    if (!bookingStatus) {
      console.log(req.body.bookingStatus)

      const { reason, doctor_id, hospital_id } = req.body.details

      console.log(reason, doctor_id, hospital_id)
      const response = {
        bookingStatus: `${bookingStatus}`,
        reason,
        message: 'Booking rejected',
      }

      // send this response to the patient frontened
      console.log(response.message)
    }

    res.status(200).json({ message: 'Booking Updated' })
  } catch (err) {
    res.status(500).json({ message: err.message, hii: 'hii' })
  }
}

// to be implemented to fetch the card details of the hospital
exports.fetchHospitalsCardDetails = async (hospital_ids, res) => {
  try {
    // console.log(hospital_ids)
    const response = await axios.post(
      `${BACKEND_HOSPITAL_HOST}/fetchHospitalsCardDetails`,
      { hospital_ids }
    )
    if (response.status != 200) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    const hospitals_card_details = response.data.hospitals_card_details
    console.log(hospitals_card_details)
    res.status(200).json({ hospitals_card_details })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: error.message })
  }
}

exports.fetchHospitalDetails = async (req, res) => {
  try {
    const hospital_id = req.params.hospital_id

    const response = await axios.post(
      `${BACKEND_HOSPITAL_HOST}/fetchHospitalDetails/${hospital_id}`
    )
    // console.log(response)
    if (response.status != 200) {
      throw new Error(`HTTP error status:${response.status}`)
    }

    const hospital_details = response.data.response
    // console.log(hospital_details)
    res.status(200).json({ hospital_details })
  } catch (err) {
    console.log(err.message)
    res.status(500).json({ message: err.message })
  }
}
