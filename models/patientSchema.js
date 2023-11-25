const mongoose=require('mongoose');

const authSchema=mongoose.Schema({
    username:{
        type:String
    },
    password:{
        type:String,
        required:true,
    },
    mobile_no:{
        type:String,
        required:true,
    },
})

const detailsSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    dob:{
        type:Date,
        required:true,
    },
    sex:{
        type:String,
        required:true,
    },
    bloodGroup:{
        type:String,
    },
    proffession:{
        type:String,
        
    },
    weight:{
        type:Number,
    },
    height:{
        type:Number,
    },
    profilePicture:{
        type:String,
    },
})

const prescriptionsSchema=mongoose.Schema({
    disease_id:{
        type:String,
        required:true,
    },
    track_id:{
        type:String,
        required:true,
    },
    prescription_id:{
        type:String,
        required:true,
    },
    prescription_date:{
        type:Date,
        required:true,
    },
    previous_prescription_img:{
        type:String,
    },
    prescription_json:{
        medicines_name:{
            type:Array,
            required:true,
            default:[],
        },
        medicines_dose:{
            type:Array,
            required:true,
            default:[],
        },
        medicines_frequency:{
            type:Array,
            required:true,
            default:[],
        },
        other_details:{
            type:String,
        },
    },
    
    lab_test_json:{
        lab_test_name:{
            type:Array,
            required:true,
            default:[],
        },
        lab_test_id:{
            type:Array,
            required:true,
            default:[],
        }
    },

    doctor_id:{
        type:String,
        required:true,
    },
    doctor_name:{
        type:String,
        required:true,
    },
    doctor_speciality:{
        type:String,
    },

    hospital_id:{
        type:String,
        required:true,
    },
    hospital_name:{
        type:String,
        required:true,
    },
})

const tests_reportSchema=mongoose.Schema({

    disease_id:{
        type:String,
        required:true,
    },
    track_id:{
        type:String,
        required:true,
    },
    prescription_id:{
        type:String,
    },

    test_id:{
        type:String,
        required:true,
    },
    test_name:{
        type:String,
        required:true,
    },
    test_date:{
        type:Date,
        required:true,
    },
    previous_test_img:{
        type:String,
    },
    
    test_file_details:{
        type:String,
    },

    lab_id:{
        type:String,
        required:true,
    },
    lab_name:{
        type:String,
        required:true,
    },

    doctor_report:{
        type:String,
    },

})

const locationSchema=mongoose.Schema({

    longitude:{
        type:Number,
        required:true,
    },
    latitude:{
        type:Number,
        required:true,
    },
    city_name:{
        type:String,
        required:true,
    },
    pincode:{
        type:Number,
        required:true,
    },
    address_id:{
        type:String,
        required:true,
    },

})

const schemesSchema=mongoose.Schema({

    scheme_id:{
        type:String,
        required:true,
    },
    scheme_user_id:{
        type:String,
        required:true,
    },
    scheme_name:{
        type:String,
        required:true,
    },


})

const chatsSchema=mongoose.Schema({

    chat_id:{
        type:String,
        required:true,
    },
    
    appointment_id:{
        type:String,
        required:true,
    },
    user_msg:{
        type:String,
        required:true,
    },
    chatbot_msg:{
        type:String,
        required:true,
    },
})

const familyMembersSchema=mongoose.Schema({
    patient_id:{
        type:String,
        required:true,
        firstTimeAuth:{
            type:Boolean,
            required:true,
            default:false,
        },
    },
})

module.exports={
    authSchema,
    detailsSchema,
    prescriptionsSchema,
    tests_reportSchema,
    locationSchema,
    schemesSchema,
    chatsSchema,
    familyMembersSchema,
};