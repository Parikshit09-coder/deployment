const mongoose = require('mongoose');

const patientInfoSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    patient_name: { type: String, required: true },
    date_of_birth: { type: String, required: true },
    gender: { type: String, required: true },
    contact_info: { type: String, required: true },
    medical_history: { type: String },
    current_medications: { type: String },
    allergies: { type: String },
    weight: { type: String },
    height: { type: String },
    blood_group: { type: String, required: true },
});

module.exports = mongoose.model("patientInfo", patientInfoSchema);
