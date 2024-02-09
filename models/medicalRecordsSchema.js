const mongoose =require('mongoose');

const transaction_idsSchema=mongoose.Schema({

    transaction_id:{
        type:String,
        required:true,
    },
    appointment_ids:{
        type:Array,
        default:[],
        date:{
            type:Date,
            default:Date.now,  
        }
    },
    disease_id:{
        type:String,
        required:true,
    },
    patient_id:{
        type:String,
        required:true,
    },
})
const appointmentsSchema=mongoose.Schema({
    appointment_id:{
        type:String,
        required:true,
    },
    appointment_date:{
        type:Date,
        default:Date.now,
    },
    transaction_id:{
        type:String,
        required:true,
    },
    disease_id:{
        type:String,
    },
    disease_name:{
        type:String,
    },

    // patient_id:{
    //     type:String,
    //     required:true,
    // },
    doctor_id:{
        type:String,
    },
    doctor_name:{
        type:String,
    },
    hospital_id:{
        type:String,
    },
    hospital_name:{
        type:String,
    },
});

const prescriptionsSchema=mongoose.Schema({
    disease_id:{
        type:String,
    },
    disease_name:{
        type:String,
    },
    appointment_id:{
        type:String,
        required:true,
    },
    transaction_id:{
        type:String,
        required:true,
    },


    prescription_id:{
        type:String,
    },
    prescription_name:{
        type:String,
    },
    prescription_date:{
        type:Date,
        default:Date.now,
    },
    previous_prescription_details:{
        type:Array,
    },

    prescription_json:{
        prescribed_medicine_id:{
            type:Array,
            required:true,
            default:[],
        },
        prescribed_medicines_name:{
            type:Array,
            required:true,
            default:[],
        },
        prescribed_medicines_dose:{
            type:Array,
            required:true,
            default:[],
        },
        prescribed_lab_test_name:{
                type:Array,
                required:true,
                default:[],
        },
        prescribed_lab_test_id:{
                type:Array,
                required:true,
                default:[],
        },
        other_details:{
            type:String,
        },
    },


    doctor_id:{
        type:String,
    },
    doctor_name:{
        type:String,
    },
    doctor_speciality:{
        type:String,
    },

    hospital_id:{
        type:String,
    },
    hospital_name:{
        type:String,
    },
});

const medicationsSchema=mongoose.Schema({
    transaction_id:{
        type:String,
        required:true,
    },
    appointment_id:{
        type:String,
        required:true,
    },
    disease_id:{
        type:String,
        required:true,
    },
    disease_name:{
        type:String,
    },
    medicine_id:{
        type:Array,
        default:[],
    },
    medicine_name:{
        type:Array,
        default:[],
    },
    medicine_dose:{
        type:Array,
        default:[],
    },

    medicine_purchase_id:{
        type:String,
    },
    medicine_purchase_date:{
        type:Date,
    },
    previous_medicines_file_details:{
        type:Array,
        default:[],
    },
    medical_shop_id:{
        type:String,
    },
    medical_shop_name:{
        type:String,
    },
    // medicine_dose:{
    //     type:Array,
    //     required:true,
    // },
    // medicine_time:{
    //     type:Array,
    //     required:true,
    // },
    // medicine_duration:{
    //     type:Array,
    //     required:true,
    // },
    // medicine_start_date:{
    //     type:Array,
    //     required:true,
    // },
    // medicine_end_date:{
    //     type:Array,
    //     required:true,
    // },
    // medicine_frequency:{
    //     type:Array,
    //     required:true,
    // },
    // medicine_type:{
    //     type:Array,
    //     required:true,
    // },
    // medicine_reminder:{
    //     type:Array,
    //     required:true,
    // },

    
});

const lab_reportsSchema=mongoose.Schema({

    disease_id:{
        type:String,
        required:true,
    },
    disease_name:{
        type:String,
    },
    transaction_id:{
        type:String,
        required:true,
    },
    appointment_id:{
        type:String,
        required:true,
    },
    lab_id:{
        type:String,
    },
    lab_name:{
        type:String,
    },

    lab_test_id:{
        type:Array,
        default:[],
    },
    lab_test_name:{
        type:Array,
        default:[],
    },
    lab_test_date:{
        type:Date,
        default:Date.now,
    },
    previous_lab_test_file_details:{
        type:Array,
        default:[],
    },


});

const generalRecordsSchema=mongoose.Schema({
    disease_id:{
        type:String,
        required:true,
    },
    disease_name:{
        type:String,
    },
    transaction_id:{
        type:String,
        required:true,
    },
    appointment_id:{
        type:String,
        required:true,
    },
    general_record_id:{
        type:Array,
        default:[],
    },
    general_record_name:{
        type:Array,
        default:[],
    },
    general_record_date:{
        type:Array,
        default:[],
    },
    previous_general_record_file_details:{
        type:Array,
        default:[],
    },
});

module.exports={
    transaction_idsSchema,
    appointmentsSchema,
    prescriptionsSchema,
    medicationsSchema,
    lab_reportsSchema,
    generalRecordsSchema
};