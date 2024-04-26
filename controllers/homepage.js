const mongoose=require('mongoose');
const {detailsSchema}=require('../models/patientDetailsSchema');

const Home=async(req,res)=>{
    try{
        const patient_id=req.params.patient_id;
        const patient=mongoose.model('details',detailsSchema);
        const details=await(patient.findOne({patient_id:patient_id}));

        const {name,profilePicture,isRegisterFormCompleted,notifications,currentActivity}=details;
        // console.log(details.currentActivity.appointment_time);
        if(currentActivity.doctor_id_name==null){
            const appointment_time=currentActivity.appointment_time;
            // Using the Google Maps API to get the time taken to reach the hospital

            const timeToReach=30*(60+15); // time taken to reach the hospital+buffer time in seconds
            
            const leaveBy=new Date(appointment_time-timeToReach).getTime();
            currentActivity['leaveBy']=leaveBy;
        }
        res.status(200).json({name,profilePicture,isRegisterFormCompleted,notifications,currentActivity});

    }
    catch(err){
        console.log(err);
        res.status(500).json({message:err.message });
    }
}

module.exports={Home};