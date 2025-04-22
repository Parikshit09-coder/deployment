const express = require("express");
const router = express.Router();
 const Doctor = require('../Models/doctor'); 

router.get('/getQr/:username',async(req,res)=>{
    try{
            const {username} = req.params;
            const info = await Doctor.findOne({username});

        res.status(200).json(info);
    }catch(err){
            res.status(500).json("some error while genrating qr")
    }
})
module.exports = router;