const express = require('express');
const jwt = require('jsonwebtoken');
const Doctor = require('../Models/doctor'); 
const router = express.Router();
const QRcode   = require("qrcode");


router.post('/register/doctor', async (req, res) => {
    try {
        const { username, password, registration_no, year, council } = req.body;
        const url = `assign_permission/${username}`;
        QRcode.toDataURL(url,async (err,doctorUrl)=>{
            const Doctor1 = new Doctor({username,registration_no,council,year,password,doctorUrl});
            await Doctor1.save(); 
            res.status(201).send(`Doctor registered`);
        })

    } catch (err) {
        console.error('Error registering Doctor:', err); // Log the error for debugging
        res.status(500).send('Error registering Doctor');
    }
});


router.post('/login/doctor', async (req, res) => {
    try { const secret_key =  process.env.JWT_SECRET_KEY
        const { username, password } = req.body;
        const doctor = await Doctor.findOne({ username });
        if (!doctor || !await doctor.isValidPassword(password)) {
            return res.status(401).send('Invalid username or password');
        }
        const token = jwt.sign({ id: doctor._id }, secret_key, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (err) {
        console.error('Error in login:', err); // Log the error for debugging
        res.status(500).send('Error in login');
    }
});
router.get('/refresh-token/:username',async(req,res)=>{
    const secret_key =  process.env.JWT_SECRET_KEY
    const {username}= req.params;
        const user = await Doctor.findOne({username});
        const token = jwt.sign({id:user._id},secret_key,{expiresIn:'1h'});
        res.status(200).json({token,username});
})


module.exports = router;
