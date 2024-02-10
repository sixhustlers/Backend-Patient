const mongoose = require('mongoose')
const {
  transaction_idsSchema,
  appointmentsSchema,
  prescriptionsSchema,
  medicationsSchema,
  lab_reportsSchema,
  generalRecordsSchema,
} = require('../models/medicalRecordsSchema');
const { log } = require('console');

//uploading the previous medical records

const patientUploadMedicalRecords = async (req, res) => {
  try {
    const patient_id = req.body.patient_id;
    const transaction_records = req.body.transaction_records;
    const disease_id = req.body.disease_id;
    const disease_name = req.body.disease_name;
    
    // medical records models
    const transactions = mongoose.model('transactions', transaction_idsSchema)
    const appointments = mongoose.model('appointments', appointmentsSchema)
    const prescriptions = mongoose.model('prescriptions', prescriptionsSchema)
    const medications = mongoose.model('medications', medicationsSchema)
    const lab_reports = mongoose.model('lab_reports', lab_reportsSchema)
    const general_records = mongoose.model(
      'general_records',
      generalRecordsSchema
    )

    // uploading the past medical records of the user to the database ,to be uploaded by the user only

    var appointment_ids_arr=[]; 
    var transaction_id ; 
    // const disease_id=444444444444444; //to be changed later

      let newTransaction = new transactions({
        appointment_ids_arr,
        disease_id,
        patient_id,
        disease_name,
      })

      let transaction=await newTransaction.save();
      transaction_id=transaction._id;

      for (const appointment of transaction_records) {
        appointment_ids_arr.push(await addAppointmentRecords(appointment,transaction_id,disease_id,disease_name,patient_id));
      }
      
      // console.log(appointment_ids_arr,transaction_id);

      await transactions.findOneAndUpdate(transaction_id,{appointment_ids_arr});
      res.status(200).json(`message:successfully uploaded the medical records`);
      
      async function addAppointmentRecords(appointment, transaction_id, disease_id, disease_name, patient_id) {
        // uploading the appointment details
        let default_appointment_id;
        if (appointment.appointment_records) {
          const patientUploadedAappointment = new appointments({
            //important ids details
            transaction_id,
            patient_id,
            disease_id,
            disease_name,
            //hospital details
            hospital_id: appointment.hospital_id,
            hospital_name: appointment.hospital_name,

            //doctor details
            doctor_id: appointment.doctor_id,
            doctor_name: appointment.doctor_name,

            appointment_date:appointment.appointment_date,
          })
          let result=await patientUploadedAappointment.save();
          default_appointment_id=result._id;
        }

        // uploading the prescription details

        if (appointment.prescription_records) {
          const newPrescriptions = new prescriptions({
            //important ids details
            disease_id,
            disease_name,
            transaction_id,
            appointment_id: default_appointment_id,
            patient_id,

            //prescription details
            prescription_id: appointment.prescription_id,
            prescription_name: appointment.prescription_name,
            prescription_date: appointment.prescription_date,
            previous_prescription_details:appointment.previous_prescription_details,

            // prescription_json details

            prescription_json: {
              prescribed_medicines_id: appointment.prescribed_medicines_id,
              prescribed_medicines_name: appointment.prescribed_medicines_name,
              prescribed_medicines_dose: appointment.prescribed_medicines_dose,
              prescribed_lab_test_name: appointment.prescribed_lab_test_name,
              prescribed_lab_test_id: appointment.prescribed_lab_test_id,
              previous_prescription_details:
                appointment.previous_prescription_details,
              other_details: appointment.other_details,
            },

            // doctor details
            doctor_id: appointment.doctor_id,
            doctor_name: appointment.doctor_name,
            doctor_speciality: appointment.doctor_speciality,

            // hospital details
            hospital_id: appointment.hospital_id,
            hospital_name: appointment.hospital_name,
          })
          await newPrescriptions.save()
        }

        // uploading the medication details

        if (appointment.medication_records) {
          const patientUploadedMedication = new medications({
            //important ids details
            appointment_id: default_appointment_id,
            transaction_id,
            disease_id,
            disease_name,
            patient_id,

            //medicine details
            medicine_id: appointment.medicine_id,
            medicine_name: appointment.medicine_name,
            medicine_dose: appointment.medicine_dose,
            medicine_purchase_id: appointment.medicine_purchase_id,
            medicine_purchase_date: appointment.medicine_purchase_date,
            medical_shop_id: appointment.medical_shop_id,
            medical_shop_name: appointment.medical_shop_name,
            previous_medicines_file_details:
              appointment.previous_medicines_file_details,
          })
          await patientUploadedMedication.save()
        }

        // uploading the lab report details

        if (appointment.lab_report_records) {
          const patientUploadedLabReport = new lab_reports({
            //important ids details
            appointment_id: default_appointment_id,
            transaction_id,
            disease_id,
            disease_name,
            patient_id,

            //lab details
            lab_id: appointment.lab_id,
            lab_name: appointment.lab_name,
            lab_test_id: appointment.lab_test_id,
            lab_test_name: appointment.lab_test_name,
            lab_test_date: appointment.lab_test_date,
            previous_lab_test_file_details:
              appointment.previous_lab_test_file_details,
          })
          await patientUploadedLabReport.save()
        }

        // uploading the general record details

        if (appointment.general_record_records) {
          const patientUploadedGeneralRecord = new general_records({
            //important ids details
            appointment_id: default_appointment_id,
            transaction_id,
            disease_id,
            disease_name,
            patient_id,

            //general record details
            general_record_id: appointment.general_record_id,
            general_record_name: appointment.general_record_name,
            general_record_date: appointment.general_record_date,
            previous_general_record_files:
              appointment.previous_general_record_files,
          })
          await patientUploadedGeneralRecord.save()
        }
        return default_appointment_id
      }

  } 
  
  catch (err) {
    console.log(err+"hoo")
    res.status(500).json({ message: err.message })
  }
}

module.exports = { patientUploadMedicalRecords }
