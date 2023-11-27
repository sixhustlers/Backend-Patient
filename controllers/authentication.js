// Import necessary libraries and modules
require("dotenv").config(); // Load environment variables from a .env file
const patient_mongodb_url = process.env.PATIENT_MONGODB_URL; // Retrieve MongoDB URL from environment variables
const mongoose = require("mongoose"); // Import the mongoose library for MongoDB interactions
const { authSchema } = require("../models/patientSchema"); // Import the authSchema from a patientSchema file
const encrypt = require("mongoose-encryption"); // Import the mongoose-encryption library for field encryption
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID; // Retrieve Twilio account SID from environment variables
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN; // Retrieve Twilio authentication token from environment variables
const twilio_client = require("twilio")(twilioAccountSid, twilioAuthToken); // Create a Twilio client using credentials
const speakeasy = require("speakeasy"); // Import the speakeasy library for OTP generation and verification

// Define a function named "register" with asynchronous behavior
const register = async (req, res) => {
  mongoose.connection.close(); // Close any existing MongoDB connection

  // Destructure properties from the request body
  const { username, password, mobile_no } = req.body;

  console.log(patient_mongodb_url + username);

  // Connect to the patient database using the provided MongoDB URL
  await mongoose
    .connect(patient_mongodb_url + username)
    .then(() => {
      console.log("patient db Connection Successful");
    })
    .catch((err) => {
      console.log(err.message);
    });

  // Create a mongoose model for the 'auth' collection using the authSchema
  const auth = mongoose.model("auth", authSchema);

  // Create a new document using the auth model with provided data
  const newAuth = new auth({
    username,
    password,
    mobile_no,
  });

  // Save the new document to the 'auth' collection
  await newAuth.save();

  // Call the createOTP function with the mobile number and response object
  createOTP(mobile_no, res);
};

// Define a function named "createOTP" with asynchronous behavior
const createOTP = async (mobile_no, res) => {
  try {
    // Generate a secret key for OTP using speakeasy
    const secret = speakeasy.generateSecret({ length: 20 });

    // Generate a TOTP (Time-based One-Time Password) using the secret key
    const otp = speakeasy.totp({
      secret: secret.base32,
      encoding: "base32",
    });

    // Log the secret key and OTP to the console
    console.log("Secret: ", secret.base32);
    console.log("Created OTP: ", otp);

    // Send the OTP to the user's mobile number using Twilio
    await twilio_client.messages
      .create({
        body: `Your OTP is ${otp}`,
        from: "+12706067562", // Twilio phone number
        to: `+91${mobile_no}`, // User's mobile number
      })
      .then((message) => console.log("Message sent"))
      .catch((err) => console.log(err));

    // Send the secret key in the response object
    res.status(200).json({ secret: secret.base32 });
  } catch (err) {
    console.log(err);
  }
};

// Define a function named "verifyOTP" with asynchronous behavior
const verifyOTP = async (req, res) => {
  try {
    // Verify the received OTP using speakeasy
    const verified = speakeasy.totp.verify({
      secret: req.body.secret,
      encoding: "base32",
      token: req.body.otp,
      window: 6, // Allowing a time window of 6 intervals for OTP verification
    });

    // Log information and send response based on OTP verification result
    console.log(req.body.secret + " " + req.body.otp);
    console.log(verified);

    if (verified) res.status(200).json({ message: "OTP verified" });
    else res.status(400).json({ message: "OTP not verified" });
  } catch (err) {
    console.log(err);
  }
};

// Export the defined functions for use in other modules
module.exports = {
  register,
  verifyOTP,
};
