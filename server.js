require('dotenv').config();
const express = require("express");
const app = express();
const cors = require('cors');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authRoutes = require('./routes/auth');
const authRoutesd = require('./routes/authd');
const patient_info = require('./routes/patientInfo');
const firebase_api = require('./routes/firebase-api.js');
const authentication = require('./middleware/authentication.js')
const docRoutes = require('./routes/authd-other.js')



const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_ATLAS_URL;
app.use(cors({
    origin: 'http://localhost:5173', // Explicitly allow frontend
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());
app.use('/api/authd',authRoutesd);
app.use('/api/authOthers',authentication,docRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/patients',authentication,patient_info);
app.use('/api/store_op',authentication,firebase_api);

mongoose.connect(MONGO_URL, { useUnifiedTopology: true })
    .then(() => { console.log("Connected to database"); })
    .catch((err) => {
        console.error("Error in connecting to database:", err);
    });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
