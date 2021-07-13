const express = require('express');
const router = express.Router();

//Models
const Counter = require('../models/CounterPeople');

router.post("/counter", async(req, res) => {
    
    if (req.body.data.measurements) {
        const createCounter = {
            to: "",
            from: "",
            in: 0,
            out: 0,
            store: ""
        };
        
        createCounter.store = req.body.sensor.name;
        req.body.data.measurements.map(async(measurement) =>{
    
            var toConvert = new Date(req.body.data.to);
            createCounter.to = toConvert.toLocaleString('en-US', { timeZone: 'America/Guatemala' });

            var fromConvert = new Date(req.body.data.from);
            createCounter.from = fromConvert.toLocaleString('en-US', { timeZone: 'America/Guatemala' });

            measurement.items.map(async(item) =>{
                if(item.direction === 'in'){
                    createCounter.in = item.count;
                }else{
                    createCounter.out = item.count;
                }
               
            });
            const insertData = Counter(createCounter);
            await insertData.save();

        });
    } else {
        console.log("measurements vacio");
    }

    return res.status(200).json({ message: "Hello World!" });
});

router.get("/data-counter", async(req, res) => {
    
    let showDataCounter = await Counter.find({},{to: 1, from: 1, in: 1, out: 1, store: 1 });
    const counterPush = [];
    showDataCounter.map(counters => {

        const showCounter = {
            horaInicio: "",
            horaFinal: "",
            entrada: 0,
            salida: 0,
            tienda: ""
        };

        var fromConvert = new Date(counters.from);
        showCounter.horaInicio = fromConvert.toLocaleString('es-US', { timeZone: 'America/Guatemala' });

        var toConvert = new Date(counters.to);
        showCounter.horaFinal = toConvert.toLocaleString('es-US', { timeZone: 'America/Guatemala' });

        showCounter.entrada = counters.in;
        showCounter.salida = counters.out;
        showCounter.tienda = counters.store;

        counterPush.push(showCounter);
    });

    return res.status(200).json(counterPush);
});
module.exports = router;