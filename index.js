const express=require('express')
const app=express();
const routes=require('./routes/apiRoutes');
require('dotenv').config();
const cors = require('cors')
const patient_mongodb_url=process.env.PATIENT_MONGODB_URL;
const mongoose=require('mongoose');
const port=process.env.PORT || 5000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use('/api/patient/',routes);

app.listen(port,async()=>{ 

    // connecting to the patient database
    await(
         mongoose
    .connect(patient_mongodb_url) 
    .then(() => {
      console.log('patient db Connetion Successfull')
    })
    .catch((err) => {
      console.log(err.message);
    })
    );

    console.log(`Server is running on port: ${port}`);
});
