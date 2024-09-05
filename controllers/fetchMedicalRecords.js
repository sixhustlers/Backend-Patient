const mongoose = require('mongoose')
const {
  transaction_idsSchema,
  appointmentsSchema,
  prescriptionsSchema,
  medicationsSchema,
  lab_reportsSchema,
  generalRecordsSchema,
} = require('../models/medicalRecordsSchema')

const fetchAppointments = async (req, res) => {
  try {
    const { patient_id } = req.params

    const transaction = mongoose.model('transaction', transaction_idsSchema)
    const appointment = mongoose.model('appointment', appointmentsSchema)
    const transactions = await transaction.find({ patient_id })
  
    const appointment_details_arr = []

    // Taking the patient_unique_id and searching all the transaction of that id
    //and then sending the info of all the appointments contained in each transaction
    
    for (const transaction of transactions) {
      let appointment_details_arr1 = []
      //   console.log(transaction.appointment_ids_arr)
      // Using for...of loop to handle asynchronous operations

      for (const appointment_id of transaction.appointment_ids_arr) {
        let appointment_detail = await appointment.findOne({
          _id: appointment_id,
        })
        // fetching the disease name from the disease id
        appointment_details_arr1.push(appointment_detail)
      }

      // take disease name as noname if disease name is not present in DB
      const disease = appointment_details_arr1[0]?.disease_name || 'No Name'
      const appointment_obj = {
        disease: disease,
        appointment_details: appointment_details_arr1,
      }
      appointment_details_arr.push(appointment_obj)
      
    }

    res.status(200).send(appointment_details_arr)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const fetchAppointmentRecords = async (req, res) => {
  try {
    const appointment_id = req.body //no need of patient id as the appointment ids will be unique

    const prescriptions = mongoose.model('prescription', prescriptionsSchema)
    const medications = mongoose.model('medication', medicationsSchema)
    const lab_reports = mongoose.model('lab_report', lab_reportsSchema)
    const general_records = mongoose.model(
      'general_record',
      generalRecordsSchema
    )

    //     In the code, i trued to directly send multiple Mongoose query results in the response JSON.
    //Those query results might contain circular references due to the nature of MongoDB and Mongoose objects.
    // To resolve this issue, i converted the Mongoose query results to plain JavaScript objects before sending them in the response.
    // One way to achieve this is by using the lean() function in Mongoose, which returns plain JavaScript objects instead of Mongoose documents.

    const prescriptions_details = await prescriptions
      .find(appointment_id)
      .lean()
    const medications_details = await medications.find(appointment_id).lean()
    const lab_reports_details = await lab_reports.find(appointment_id).lean()
    const general_record_details = await general_records
      .find(appointment_id)
      .lean()

    res.status(200).json({
      prescriptions_details,
      medications_details,
      lab_reports_details,
      general_record_details,
    })
  } catch (err) {
    console.log(err.message)
    res.status(500).json({ message: err.message })
  }
}
module.exports = { fetchAppointments, fetchAppointmentRecords }
