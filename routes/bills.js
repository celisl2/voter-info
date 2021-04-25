const express = require('express');
const router = express.Router();
const Bills = require('../models/bills');
/**
 * routes needed:
 * /getBillsBystate
 * /getAllBills
 */



router.get('/', async (req, res) => {
    try {
        const bills = await Bills.find();
        res.json(bills);
    } catch (err) {
        res.status(404)
            .json({
                message: err.message
            });
    }
});

router.get('/:state_id', (req, res) => {

});

module.exports = router;