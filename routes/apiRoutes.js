const router=require('express').Router();
const {register,verifyOTP}=require('../controllers/authentication');
const {patientDetails}=require('../controllers/patientDetails');
const {patientUploadMedicalRecords}=require('../controllers/uploadMedicalRecords');
const {fetchAppointments,fetchAppointmentRecords}=require('../controllers/fetchMedicalRecords');
const {bookAppointmentFromSymptoms} = require('../controllers/bookAppointment')
const {fetchDoctorDetails}=require('../controllers/doctorBackendRequests');
const {
  confirmBooking,
  AppointmentBookingUpdate,
} = require('../controllers/hospitalBackendRequests')

  
router.route('/register').post(register);
router.route('/verifyOTP').post(verifyOTP);

router.route('/patientDetails').post(patientDetails);

router.route('/uploadMedicalRecords').post(patientUploadMedicalRecords);
router.route('/fetchAppointments').get(fetchAppointments);
router.route('/fetchAllOtherRecords').get(fetchAppointmentRecords);

router.route('/bookAppointment/symptoms/:patient_id').post(bookAppointmentFromSymptoms);

router.route('/appointmentBookingUpdate').post(AppointmentBookingUpdate);
router.route('/confirmBooking/:patient_id').post(confirmBooking);

router.route('/fetchDoctorDetails/:doctor_id').get(fetchDoctorDetails);




module.exports=router;