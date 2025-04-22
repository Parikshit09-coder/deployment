const express = require('express');
const patientInfo = require('../Models/patient_info');
const router = express.Router();

router.get("/patient_get_info/:username",async(req,res)=>{
    try{
    const {username} = req.params;
     const info = await patientInfo.findOne({username:username});
        
    res.status(200).json(info); }
    catch(e){
        res.status(500).json("Can't process request");
    }

})

router.put("/updateProfile/:username", async (req, res) => {
    try {
        const { username } = req.params;
        const updateData = req.body;

        const updatedPatient = await patientInfo.findOneAndUpdate(
            { username: username },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedPatient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        res.status(200).json({
            message: "Profile updated successfully",
            patient: updatedPatient
        });
    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({
            message: "Error updating profile",
            error: error.message
        });
    }
});
module.exports = router;
