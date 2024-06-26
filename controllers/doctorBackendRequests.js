const BACKEND_DOCTOR_HOST = process.env.BACKEND_DOCTOR_HOST
const axios = require('axios')

exports.fetchDoctorsCardDetails = async (doctors_ids, res) => {
  try {
    const response = await axios.post(
      `${BACKEND_DOCTOR_HOST}/fetchDoctorsCardDetails`,
      { doctors_ids }
    )

    // let options = {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(doctors_ids),
    // }

    // const response = await fetch(
    //   `${process.env.BACKEND_DOCTOR_HOST}/fetchDoctorsCardDetails`,
    //   options
    // )
    //const doctors_card_details = await response.json();

    if (response.status != 200) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const doctors_card_details = await response.data.doctors_card_details

    console.log(doctors_card_details)
    res.status(200).json({ doctors_card_details })
  } catch (err) {
    console.log(err.message)
    res.status(500).json({ message: err.message })
  }
}

exports.fetchDoctorDetails = async (req, res) => {
  try {
    const { doctor_id } = req.params
    const response = await axios.post(
      `${BACKEND_DOCTOR_HOST}/fetchDoctorDetails`,
      { doctor_id }
      )

    if (response.status != 200) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    const doctor_details = response.data.doctor_details
    const time_slots = response.data.time_slots
  
    res.status(200).json({ doctor_details, time_slots})
  } catch (err) {
    res.status(500).json({ message: err.message})
  }
}
