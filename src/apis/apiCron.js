const express = require('express');
const router = express.Router();
const fs = require('fs');

const Machine = require('../models/Machine');
const Status = require('../models/Status');

const cron = require("node-cron");

let cronConfig = fs.readFileSync('src/cron.config', 'utf8')+""
cronConfig = cronConfig.split(":")
let seconds = cronConfig[1] === "00" ? '' : "/"+cronConfig[1]
let minutes = cronConfig[0] === "00" ? '' : "/"+cronConfig[0]

let timeCron = new cron.schedule("*"+seconds+" *"+minutes+" * * * *", async () => {
    const machines = await Machine.find();
    const status = await Status.find();
    if (status.length > 0 && machines.length > 0){
        machines.forEach(async (machine) => {
            let newStatus = status[Math.floor((Math.random() * status.length) + 0)]._id
            while(machine.status === newStatus){
                newStatus = status[Math.floor((Math.random() * status.length) + 0)]._id
            }
            await Machine.findByIdAndUpdate(machine._id, {"status": newStatus});
        })
    }
    console.log("*"+seconds+" *"+minutes+" * * * *");
}, null, true, 'America/Sao_Paulo')

router.get('/', async (req, res) => {
    try {
        await fs.readFile('src/cron.config', 'utf8', function(err, data) {  
            if (err) throw err;
            res.json({"tempo":data});
        });
    } catch (err) {
        return res.status(400).send({ error: "Error get cron"})
    }
});

router.put('/', async (req, res) => {
    try {
        timeCron.stop()
        await fs.writeFile('src/cron.config', req.body.tempo, function(err) {
            if(err){
                throw err
            }
        })
        // updateTimeCron();
        cronConfig = req.body.tempo.split(":")
        seconds = cronConfig[1] === "00" ? '' : "/"+cronConfig[1]
        minutes = cronConfig[0] === "00" ? '' : "/"+cronConfig[0]
        timeCron = new cron.schedule("*"+seconds+" *"+minutes+" * * * *", async () => {
            const machines = await Machine.find();
            const status = await Status.find();
            if (status.length > 0 && machines.length > 0){
                machines.forEach(async (machine) => {
                    let newStatus = status[Math.floor((Math.random() * status.length) + 0)]._id
                    while(machine.status === newStatus){
                        newStatus = status[Math.floor((Math.random() * status.length) + 0)]._id
                    }
                    await Machine.findByIdAndUpdate(machine._id, {"status": newStatus});
                })
            }
            console.log("*"+seconds+" *"+minutes+" * * * *");
        }, null, true, 'America/Sao_Paulo')
        res.json({
            status: 'Cron Saved'
        });
    } catch (err) {
        return res.status(400).send({ error: 'Error set time event'})
    }
});

module.exports = router;