const express = require('express');
const moment = require('moment')
const router = express.Router();

//Models
const Counter = require('../models/CounterPeople');
const CounterUnion = require('../models/CounterUnion');

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
        console.log(req.body);
        console.log(req.body.sensor.name,": Tienda que llego");
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
            console.log(createCounter);
            const insertData = Counter(createCounter);
            if(createCounter.in > 0 || createCounter.out > 0){
                await insertData.save();
                console.log("Se guardo");
            }else{
                console.log("No se guardo");
            }
        });

        return res.status(200).json({ message: "Exito" });

    } else {
        console.log("measurements vacio");
        return res.status(400).json({ message: "Error Vacio" });
    }

    
});

router.get("/data-counter", async(req, res) => {
    
    let showDataCounter = await Counter.find({ $or:[{'in':{$gt: 0}}, {'out':{$gt: 0}}]},{to: 1, from: 1, in: 1, out: 1, store: 1 });
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

    console.log(counterPush.length);
    return res.status(200).json(counterPush);
});

router.get("/data-counter/:dateInit/:dateEnd", async(req, res) => {
    const { dateInit, dateEnd } = req.params;
    if(moment(dateInit, 'YYYY-MM-DD',true).isValid() && moment(dateEnd, 'YYYY-MM-DD',true).isValid()){
    if(new Date(dateInit) <= new Date(dateEnd)){
    let showDataCounter = await Counter.find({ 
            $or:[{'in':{$gt: 0}}, {'out':{$gt: 0}}], 
            from: { $gte: `${dateInit}T08:00:00.000Z`, $lt: `${dateEnd}T23:59:59.000Z` }
        },{to: 1, from: 1, in: 1, out: 1, store: 1 })
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

    console.log(counterPush.length);
    return res.status(200).json(counterPush);

    }else{
        return res.status(400).json({ message: "Error, fecha mal ingresada" });
    }
    }else{
        return res.status(400).json({ message: "Error, fechas en formato incorrecto" });
    }
});

router.get("/dataGroup", async(req, res) => {
    let today = new Date();
    let todayGuatemala = new Date();
    todayGuatemala.toLocaleString('es-US', { timeZone: 'America/Guatemala' });
    let todayFormat = moment(today).format('YYYY-MM-DD')
    let showDataCounter = await Counter.find({
        $or:[{'in':{$gt: 0}}, {'out':{$gt: 0}}],
        from: { $gte: `${todayFormat}T08:00:00.000Z`, $lt: `${todayFormat}T23:59:59.000Z` }
    },{to: 1, in: 1, out:1, store: 1 });
    let tiendasEntradas =[];
    let tiendasPasadas = [];
    await showDataCounter.map((counters) => {
        if(tiendasPasadas.includes(counters.store) ==  false){
            tiendasEntradas[counters.store] =  {store:'', in:0, out:0, date:''};
            tiendasPasadas.push(counters.store);
        }
        tiendasEntradas[counters.store].store = counters.store;
        tiendasEntradas[counters.store].date = todayGuatemala;
        tiendasEntradas[counters.store].in = tiendasEntradas[counters.store].in + counters.in;  
        tiendasEntradas[counters.store].out = tiendasEntradas[counters.store].out + counters.out;
    });
   
    tiendasPasadas.map(async(tiendas, position) =>{
        const showCounter = {
            date:tiendasEntradas[tiendas].date,
            in: tiendasEntradas[tiendas].in,
            out: tiendasEntradas[tiendas].out,
            store: tiendasEntradas[tiendas].store
        };
        const insertData = CounterUnion(showCounter);
        await insertData.save();
    });
    
    return res.status(200).json({"Message":"Datos Ingresados"});
});

module.exports = router;