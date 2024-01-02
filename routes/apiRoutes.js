const router=require('express').Router();
const {register,verifyOTP}=require('../controllers/authentication');
const {patientDetails}=require('../controllers/patientDetails');
const {patientUploadMedicalRecords}=require('../controllers/uploadMedicalRecords');
const {fetchAppointments,fetchAllOtherRecords}=require('../controllers/fetchMedicalRecords');
router.route('/register').post(register);
router.route('/verifyOTP').post(verifyOTP);

router.route('/patientDetails').post(patientDetails);

router.route('/uploadMedicalRecords').post(patientUploadMedicalRecords);
router.route('/fetchAppointments').get(fetchAppointments);
router.route('/fetchAllOtherRecords').get(fetchAllOtherRecords);


module.exports=router;