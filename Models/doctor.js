const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const doctorSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    registration_no: { type: String, required: true },
    council: { type: String, required: true },
    year: { type: String, required: true },
    password: { type: String, required: true },
    doctorUrl:{type:String,required: true}
});

doctorSchema.pre("save", async function (next) {
    const doctor = this;
    if (doctor.isNew || doctor.isModified("password")) {
        const hash = await bcrypt.hash(doctor.password, 10);
        doctor.password = hash;
    }
    next();
});

doctorSchema.methods.isValidPassword = async function (password) {
    const doctor = this;
    return await bcrypt.compare(password, doctor.password);
};

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;
