const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../Models/user');
const router = express.Router();
const patientInfo = require('../Models/patient_info');

router.post("/patient_info/:username", async (req, res) => {
    const { username } = req.params;
    const data = req.body; 

    try { 
        if (data.username !== username) {
            return res.status(400).json({ error: "Username in body does not match the route parameter." });
        }

        if (!data.patient_name || !data.date_of_birth || !data.gender || !data.contact_info || !data.blood_group) {
            return res.status(400).json({ error: "Missing required fields. Please provide all necessary information." });
        }

        const newPatientInfo = new patientInfo(data);
        const savedInfo = await newPatientInfo.save();

       
        res.status(201).json({
            message: "Patient information saved successfully.",
            data: savedInfo,
        });
    } catch (error) {

        res.status(500).json({ error: "An error occurred while saving the patient information.", details: error.message });
    }
});

router.post('/register/patient',async (req,res)=>{
try{
    const {username,password} = req.body;
    const user = new User({username,password});
    await user.save();
 
    res.status(201).send('User registered');

}catch(err){
    res.status(500).send('Error registering user');
}
});
router.post('/login/patient',async (req,res)=>{
    try{  const secret_key =  process.env.JWT_SECRET_KEY
        const {username,password}= req.body;
        const user = await User.findOne({username});
        if(!user || !await user.isValidPassword(password)){
           return res.status(401).send('Invalid username or password')
        }
        const token = jwt.sign({id:user._id},secret_key,{expiresIn:'1h'});
    
        res.status(200).json({token,username});
        

    }
    catch(err){
        res.status(500).send('Error in login')
    }
});
router.get('/refresh-token/:username',async(req,res)=>{
    const secret_key =  process.env.JWT_SECRET_KEY
    const {username}= req.params;
        const user = await User.findOne({username});
        const token = jwt.sign({id:user._id},secret_key,{expiresIn:'1h'});
        res.status(200).json({token,username});

})

module.exports = router;

