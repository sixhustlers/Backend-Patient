const express=require('express')
const app=express();
const routes=require('./routes/apiRoutes');
require('dotenv').config();
const port=process.env.PORT || 5000;
// const uri=process.env.MONGO_URL;

// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use('/api/',routes);
// app.use('/api/msg',messageRoutes);

app.listen(port,async()=>{   
    console.log(`Server is running on port: ${port}`);
});
