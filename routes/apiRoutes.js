const router = require('express').Router()

const { register, verifyOTP } = require('../controllers/authentication')
const { patientDetails } = require('../controllers/patientDetails')
const {
  patientUploadMedicalRecords,
} = require('../controllers/uploadMedicalRecords')
const {
  fetchAppointments,
  fetchAppointmentRecords,
} = require('../controllers/fetchMedicalRecords')
const {
  bookAppointmentFromSymptoms,
  bookAppointmentFromDoctorsList,
  bookAppointmentFromHospitalsList,
  bookAppointmentFromHospitalDirectly,
} = require('../controllers/bookAppointment')
const { fetchDoctorDetails } = require('../controllers/doctorBackendRequests')
const {
  confirmBooking,
  AppointmentBookingUpdate,
  fetchHospitalDetails,
} = require('../controllers/hospitalBackendRequests')
const {Home}=require('../controllers/homepage');

router.route('/register').post(register)
router.route('/verifyOTP').post(verifyOTP)

router.route('/patientDetails').post(patientDetails)

router.route('/home/:patient_id').get(Home)

router.route('/uploadMedicalRecords').post(patientUploadMedicalRecords)
router.route('/fetchAppointments/:patient_id').get(fetchAppointments)
router.route('/fetchAllOtherRecords').get(fetchAppointmentRecords)

router
  .route('/bookAppointment/symptoms/:patient_id')
  .post(bookAppointmentFromSymptoms)
router
  .route('/fetchRecommendedDoctors/:patient_id')
  .post(bookAppointmentFromDoctorsList)
router
  .route('/fetchRecommendedHospitals/:patient_id')
  .post(bookAppointmentFromHospitalsList)
router
  .route('/suggestDoctors/:patient_id')
  .post(bookAppointmentFromHospitalDirectly);

router
  .route('/appointmentBookingUpdate/:patient_id')
  .post(AppointmentBookingUpdate)
router.route('/confirmBooking/:patient_id').post(confirmBooking)
router.route('/fetchHospitalDetails/:hospital_id').get(fetchHospitalDetails)

router.route('/fetchDoctorDetails/:doctor_id').get(fetchDoctorDetails)

module.exports = router
