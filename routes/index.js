const express = require('express');
const router = express.Router();

//Models
const User = require('../models/User');

router.post("/counter", async(req, res) => {
    if (req.body.data.measurements) {
        const { from, to, items } = req.body.data.measurements[0];
        const { name } = req.body.sensor;

        const datosImport = {
            from: from,
            to: to,
            in: items[0].count,
            adultIn: items[0].adults,
            out: items[1].count,
            adultOut: items[1].adults,
            store: name,
        };
        
        let docName = datosImport.store+''+datosImport.to;
        console.log('------------------',datosImport);
        
    } else {
        console.log("measurements vacio");
    }

    return res.status(200).json({ message: "Hello World!" });
});
module.exports = router;