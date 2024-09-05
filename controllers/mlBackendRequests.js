require('dotenv').config()
const BACKEND_ML_HOST = process.env.BACKEND_ML_HOST
const axios = require('axios')

exports.getDoctorIdsFromSymptoms = async (patient_info, text, constraints) => {
  try {
    const response = await axios.post(`${BACKEND_ML_HOST}/disease`, {
      patient_info,
      text,
      constraints,
      next_req:[1]
    })
    console.log(response);

    if (response.status != 200) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const doctors_ids = response.data.doctors_ids
    const disease_id_name = response.data.disease_id_name

    return {doctors_ids, disease_id_name}
  } catch (err) {
    throw new Error(err.message)
  }
}

exports.getDoctorIdsFromRecommenderSystem = async (patient_info) => {
  try {
    const response = await axios.post(`${BACKEND_ML_HOST}/bestdocs`, {
      patient_info,
    })

    if (response.status != 200) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const doctor_ids = response.data.doctors_ids

    return doctor_ids
  } catch (error) {
    throw new Error(error.message)
  }
}

exports.getHospitalIdsFromRecommenderSystem = async (patient_info) => {
  try{
    const response = await axios.post(`${BACKEND_ML_HOST}/besthos`, {
      patient_info,
    })

    if (response.status != 200) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const hospital_ids = response.data.doctors_ids

    return hospital_ids
  }
  catch(err){
    throw new Error(err.message)
  }
}