const express = require('express');
const router = express.Router();

//Models
const Counter = require('../models/CounterPeople');

router.post("/counter", async(req, res) => {
    if (req.body.data.measurements) {
        
       /*  const createCounter = Counter({
            name: req.body.name,
            status: req.body.status,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        await creatSubsidiaria.save();
        return res.status(200).json({ error: 0, message: "Subsidiaria Creada" }); */

    } else {
        console.log("measurements vacio");
    }

    return res.status(200).json({ message: "Hello World!" });
});
module.exports = router;