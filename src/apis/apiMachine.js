const express = require('express');
const router = express.Router();

const Machine = require('../models/Machine');

router.get('/', async (req, res) => {
    try {
        const machines = await Machine.find().populate('status');
        res.json(machines);
    } catch (err) {
        return res.status(400).send({ error: 'Error list machines'})
    }
});

router.get('/:id', async (req, res) => {
    try {
        const machine = await Machine.findById(req.params.id);
        res.json(machine);
    } catch (err) {
        return res.status(400).send({ error: 'Does not exist'})
    }
});

router.post('/', async (req, res) => {
    try {
        const machine = new Machine(req.body);
        await machine.save();
        res.json({
            status: 'Machine Saved'
        });
    } catch (err) {
        return res.status(400).send({ error: 'Error creating new machine'})
    }
});

router.put('/:id', async (req, res) => {
    try {
        await Machine.findByIdAndUpdate(req.params.id, req.body);
        res.json({
            status: 'Machine Updated'
        });
    } catch (err) {
        return res.status(400).send({ error: 'Error updating machine'})
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Machine.findByIdAndRemove(req.params.id);
        res.json({
            status: 'Machine Deleted'
        })
    } catch (err) {
        return res.status(400).send({ error: 'Error updating machine'})
    }
});

module.exports = router;