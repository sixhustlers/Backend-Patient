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
    },
    mail_id:{
        type:String,
        required:true,
    },
    patient_unique_id:{
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
    patient_unique_id:{
        type:String,
        required:true,
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
    patient_unique_id:{
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

    patient_unique_id:{
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
    patient_unique_id:{
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
    patient_unique_id:{
        type:String,
        required:true,
    },
})

module.exports={
    authSchema,
    detailsSchema,
    locationSchema,
    schemesSchema,
    chatsSchema,
    familyMembersSchema,
};