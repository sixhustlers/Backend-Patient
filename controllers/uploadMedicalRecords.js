const mongoose = require('mongoose');
const {transaction_idsSchema,appointmentsSchema,prescriptionsSchema,medicationsSchema,lab_reportsSchema,generalRecordsSchema}=require('../models/medicalRecordsSchema');

//uploading the previous medical records

const patientUploadMedicalRecords=async(req,res)=>{
    try{
        const {
            //type of documents to be uploaded
            transaction_records,
            appointment_records,
            prescription_records,
            medication_records,
            lab_report_records,
            general_record_records,
        //disease details
        disease_id,
        disease_name,

        //hospital details
        hospital_id,
        hospital_name,

        appointment_date,
        patient_unique_id,

        doctor_id,
        doctor_name,
        
        //prescription details
        doctor_speciality,
        prescription_id,
        prescription_name,
        prescription_date,
        previous_prescription_details,
        prescribed_medicines_id,
        prescribed_medicines_name,
        prescribed_medicines_dose,
        prescribed_lab_test_name,
        prescribed_lab_test_id,
        other_details,
         
        //medication details
        medicine_id,
        medicine_name,
        medicine_dose,
        medicine_purchase_id,
        medicine_purchase_date,
        medical_shop_id,
        medical_shop_name,
        previous_medicines_file_details,
        
        //lab report details
        lab_id,
        lab_name,
        lab_test_id,
        lab_test_name,
        lab_test_date,
        previous_lab_test_file_details,
        
        //general record details
        general_record_id,
        general_record_name,
        general_record_date,
        previous_general_record_files,
        
    }=req.body;

    // medical records models
    const transactions=mongoose.model('transactions',transaction_idsSchema);
    const appointments=mongoose.model('appointments',appointmentsSchema);
    const prescriptions=mongoose.model('prescriptions',prescriptionsSchema);
    const medications=mongoose.model('medications',medicationsSchema);
    const lab_reports=mongoose.model('lab_reports',lab_reportsSchema);
    const general_records=mongoose.model('general_records',generalRecordsSchema);

    // uploading the past medical records of the user to the database ,to be uploaded by the user only

    const appointment_id=2222222222222222300; //to be changed later  
    const transaction_id=3333333333333333; //to be changed later
    // const disease_id=444444444444444; //to be changed later
    
                        
                            // uploading transaction details

    if(transaction_records){
        const alreadyExistingTransaction_id=await transactions.findOne({transaction_id});
        if(alreadyExistingTransaction_id){
            console.log(alreadyExistingTransaction_id.appointment_id);
            alreadyExistingTransaction_id.appointment_id.push(appointment_id);
            await alreadyExistingTransaction_id.save();
        }
        else
        {
            let newTransaction=new transactions({
            transaction_id,
            appointment_id,
            disease_id,
            patient_unique_id,
            disease_name,
        });
    
            await newTransaction.save();
        }

    }

                        // uploading the appointment details

    if(appointment_records)
    {
        const patientUploadedAappointment=new appointments({

        //important ids details
        appointment_id,
        transaction_id,
        disease_id,
        disease_name,
        
        //hospital details
        hospital_id,
        hospital_name,
        
        //doctor details
        doctor_id,
        doctor_name,

        appointment_date,
    });
    await patientUploadedAappointment.save();
    }

    // uploading the prescription details

    if(prescription_records)
    {
        const newPrescriptions=new prescriptions({
        //important ids details
        disease_id,
        disease_name,
        transaction_id,
        appointment_id,

        //prescription details
        prescription_id,
        prescription_name,
        prescription_date,
        previous_prescription_details,
        
         // prescription_json details
    
    prescription_json: {
        prescribed_medicines_id,
        prescribed_medicines_name,
        prescribed_medicines_dose,
        prescribed_lab_test_name,
        prescribed_lab_test_id,
        previous_prescription_details,
        other_details,
    },

    // doctor details
    doctor_id,
    doctor_name,
    doctor_speciality,

    // hospital details
    hospital_id,
    hospital_name,

    });
    await newPrescriptions.save();
    }

    // uploading the medication details

    if(medication_records)
    {
        const patientUploadedMedication=new medications({
        //important ids details
        appointment_id,
        transaction_id,
        disease_id,
        disease_name,

        //medicine details
        medicine_id,
        medicine_name,
        medicine_dose,
        medicine_purchase_id,
        medicine_purchase_date,
        medical_shop_id,
        medical_shop_name,
        previous_medicines_file_details,
        
    });
    await patientUploadedMedication.save();
    }

    // uploading the lab report details
    
    if(lab_report_records)
    {
        const patientUploadedLabReport=new lab_reports({
        //important ids details
        appointment_id,
        transaction_id,
        disease_id,
        disease_name,

        //lab details
        lab_id,
        lab_name,
        lab_test_id,
        lab_test_name,
        lab_test_date,
        previous_lab_test_file_details,
    })
    await patientUploadedLabReport.save();
    }

    // uploading the general record details
    
    if(general_record_records)
    {
        const patientUploadedGeneralRecord=new general_records({
        //important ids details
        appointment_id,
        transaction_id,
        disease_id,
        disease_name,

        //general record details
        general_record_id,
        general_record_name,
        general_record_date,
        previous_general_record_files,
    });
    await patientUploadedGeneralRecord.save();
}
    res.status(200).json(`message:successfully uploaded the medical records`);
    
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:err.message });
    }
}

module.exports = {patientUploadMedicalRecords};