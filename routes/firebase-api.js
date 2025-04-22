const express = require("express");
const router = express.Router();
const multer = require("multer");
const admin = require("firebase-admin");
const serviceAccount = require("../firebase-service-account.json");
const { getFirestore } = require("firebase-admin/firestore");

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "medpass-try.firebasestorage.app",
  databaseURL: "https://medpass-try-default-rtdb.firebaseio.com", // Ensure correct bucket name format
});

const bucket = admin.storage().bucket();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/patient", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).send("No file uploaded");
        if (!req.body.username) return res.status(400).send("Username is required");

        const file = bucket.file(`${req.body.username}/${req.file.originalname}`);
        const stream = file.createWriteStream({
            metadata: { contentType: req.file.mimetype }
        });

        stream.end(req.file.buffer);
        stream.on("finish", async () => {
            try {
                await file.makePublic(); // Ensure the file is publicly accessible

                const db = getFirestore();
                await db.collection(req.body.username).doc(req.file.originalname).set({
                    doctorName: req.body.doctorName,
                    description: req.body.description,
                    illness: req.body.illness,
                    fileName: req.file.originalname,
                    fileURL: file.publicUrl(),
                    issuedOn: req.body.issuedDate,
                    fileType: req.body.fileType
                });

                res.send(`Done uploaded: ${file.publicUrl()}`);
            } catch (error) {
                res.status(500).send(`Error storing file metadata: ${error.message}`);
            }
        });

        stream.on("error", (err) => {
            res.status(500).send(`Upload failed: ${err.message}`);
        });

    } catch (error) {
        res.status(500).send(`Error: ${error.message}`);
    }
});
router.get("/view-doc-p/:username",async (req, res) => {
    try {
        const {username}=req.params;

            const db = getFirestore();
            const snapshot = await db.collection(username).get();
            const docs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
           
            return res.status(200).json(docs);
     
    }catch(error){
        res.status(500).send(`Error: ${error.message}`);
    }

})
router.get("/summary/:username",async (req, res) => {
    try {
        const {username}=req.params;

            const db = getFirestore();
            const snapshot = await db.collection(username).get();
            const docs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
           
            return res.status(200).json(docs);
     
    }catch(error){
        res.status(500).send(`Error: ${error.message}`);
    }



})

router.post("/set_permission/:username",async(req,res)=>{
    try{
        const db = getFirestore();
       
                await db.collection(req.params.username).doc(req.body.username).set({
                    name:req.body.name,
                    username:req.body.username,
                    expiresAt: req.body.expiresAt,
                });

                res.status(200).send("PermissionGranted")
    }
    catch(error){
        res.status(500).send("Some error in Permission Granting")
    }
    }
)
router.get("/view-doc-d/:username",async (req, res) => {
    try {
        const {username}=req.params;

            const db = getFirestore();
            const snapshot = await db.collection(username).get();
            const docs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
           
            return res.status(200).json(docs);
     
    }catch(error){
        res.status(500).send(`Error: ${error.message}`);
    }

})
router.get("/get-signed-url/:documentId/:username", async (req, res) => {
    try {
        const bucket = admin.storage().bucket();
        const file = bucket.file(`${req.params.username}/${req.params.documentId}`);

        // Generate signed URL valid for 10 minutes
        const [url] = await file.getSignedUrl({
            action: "read",
            expires: Date.now() + 10 * 60 * 1000 // 10 minutes expiration
        });

        res.json({ signedUrl: url });
    } catch (error) {
        console.error("Error generating signed URL:", error);
        res.status(500).json({ error: "Failed to generate secure document link" });
    }
});
router.post("/remove_doc/:documentId/:username", async (req, res) => {
    try {
        const bucket = admin.storage().bucket();
        const file = bucket.file(`${req.params.username}/${req.params.documentId}`);

       
        const [exists] = await file.exists();
        if (!exists) {
            return res.status(404).json({ error: "File does not exist" });
        }

        // Delete file from Firebase Storage
        await file.delete();

        const db = admin.firestore();
        await db.collection(req.params.username).doc(req.params.documentId).delete();
        res.json({ message: "Deleted successfully from both Storage and Firestore" });

    } catch (error) {
        console.error("Error deleting document:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});


      
module.exports = router;
