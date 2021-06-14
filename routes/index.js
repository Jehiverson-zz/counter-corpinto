const express = require('express');
const router = express.Router();

//Models
const User = require('../models/User');

router.post("/counter", async(req, res) => {
    if (req.body.data.measurements) {
        
        console.log('---------PUTA SI LLEGO---------',req.body.data.measurements);

    } else {
        console.log("measurements vacio");
    }

    return res.status(200).json({ message: "Hello World!" });
});
module.exports = router;