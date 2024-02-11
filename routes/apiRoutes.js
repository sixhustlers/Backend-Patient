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

router.route('/bookAppointment/symptoms').post(bookAppointmentFromSymptoms);

router.route('/AppointmentBookingUpdate').post(AppointmentBookingUpdate);
router.route('/confirmBooking').post(confirmBooking);

router.route('/fetchDoctorDetails').get(fetchDoctorDetails);




module.exports=router;