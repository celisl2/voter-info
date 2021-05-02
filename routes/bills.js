const express = require('express');
const router = express.Router();
const US_STATES = require('../models/bills');

async function getBillsByState(req, res, next) { 
    console.log(`[INFO]: request is ${req.params.state_id}`);
    try {
        let bills = await US_STATES.findOne({"state": req.params.state_id});
        if(bills) {
            res.bills = bills;
        } else {
            console.log('[INFO]: Bills from request is empty');
            return res.status(404).json({
                message: 'State not found.'
            });
        }
    } catch (err) {
        console.error(`[ERROR]: Error retrieving state bills: ${err}`);
        return res.status(500).json({
            message: err.message
        });
    }
    next();
};

router.get('/', async (req, res) => {
    try {
        console.log('[INFO]: in GET for bills');
        const bills = await US_STATES.find({}, (err, docs) => {
            if(err) {
                console.error('[ERROR]: Error retrieving all bills: ' + err);
            }
            console.log('[INFO]: found all entries in document' + docs);
        });
        res.json(bills);
    } catch (err) {
        res.status(404)
            .json({
                message: err.message
            });
    }
});

router.get('/:state_id', getBillsByState ,(req, res) => {
    res.json(res.bills);
});

module.exports = router;