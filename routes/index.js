const express = require('express');
const router = express.Router();

//Models
const Counter = require('../models/CounterPeople');

router.post("/counter", async(req, res) => {
    //console.log("LLego",req.body);
    //console.log("++++++++++++++++++++++++++++++++++++++");
    
    if (req.body.data.measurements) {
        console.log("Paso",req.body.data);
   
        const createCounter = {
            to: "",
            from: "",
            in: 0,
            out: 0,
            store: ""
        };
        createCounter.store = req.body.sensor.name;
        req.body.data.measurements.map(async(measurement) =>{
            console.log("measurement1:",measurement.items);
            createCounter.to = req.body.data.to;
            createCounter.from = req.body.data.from;
            measurement.items.map(async(item) =>{
                if(item.direction === 'in'){
                    createCounter.in = item.count;
                }else{
                    createCounter.out = item.count;
                }
                console.log("items:",item.direction,"-",item.count);
                createCounter.from = req.body.data.from;
                console.log("--------------------------------------");
            });

            console.log("Datos:", createCounter);

            const insertData = Counter(createCounter);
            await insertData.save();

        });


         
/* 
        
        
        return res.status(200).json({ error: 0, message: "Subsidiaria Creada" }); 
         */
    } else {
        console.log("measurements vacio");
    }

    return res.status(200).json({ message: "Hello World!" });
});
module.exports = router;