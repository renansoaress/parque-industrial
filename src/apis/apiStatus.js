const express = require('express');
const router = express.Router();

const Status = require('../models/Status');

router.get('/', async (req, res) => {
    try {
        const status = await Status.find();
        res.json(status);
    } catch (err) {
        return res.status(400).send({ error: 'Error list status'})
    }
});

router.get('/:id', async (req, res) => {
    try {
        const status = await Status.findById(req.params.id);
        res.json(status);
    } catch (err) {
        return res.status(400).send({ error: 'Does not exist'})
    }
});

router.post('/', async (req, res) => {
    try {
        const status = new Status(req.body);
        await status.save();
        res.json({
            status: 'Status Saved'
        });
    } catch (err) {
        return res.status(400).send({ error: 'Error creating new status'})
    }
});

router.put('/:id', async (req, res) => {
    try {
        await Status.findByIdAndUpdate(req.params.id, req.body);
        res.json({
            status: 'Status Updated'
        });
    } catch (err) {
        return res.status(400).send({ error: 'Error updating status'})
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Status.findByIdAndRemove(req.params.id);
        res.json({
            status: 'Status Deleted'
        })
    } catch (err) {
        return res.status(400).send({ error: 'Error deleting status'})
    }
});

module.exports = router;