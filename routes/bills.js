const express = require('express');
const router = express.Router();
const US_STATES = require('../models/bills');
const axios = require('axios');


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
/**
 * 
 * https://v3.openstates.org/bills?jurisdiction=wy&session=2021&q=hb178&&include=sponsorships&include=abstracts&include=other_titles&include=other_identifiers&include=actions&include=sources&include=documents&include=versions&include=votes
 */

function getBillDetails(bills, currentState) {
    let openStatesUrl = process.env.OPEN_STATES_BASE_URL;
    let key = process.env.OPEN_STATES_KEY;
    let billInfo = new Map();

    const headers = {
        "X-API-KEY": key
    }

    //get bill names
    bills.suppression.forEach(bill => {
        //billNames.push(bill.bill_id);
        let billName = bill.bill_id.split(' ');
        billName.shift();
        let currName = billName.join('');
        console.log(currName);
        axios.get(openStatesUrl, {
            params: {
                jurisdiction: currentState,
                session: 2021,
                include: "sponsorships",
                include: "abstracts",
                include: "other_titles",
                include: "actions",
                include: "sources",
                include: "documents",
                include: "versions",
                include: "votes",
                q: currName
            }, headers
        }).then((data) => {
            billInfo.set(bill.bill_id, data);
            console.log(`[INFO] got data successfuly`)
        }).catch((err) => {
            console.error(`[ERROR]: Error retrieving data from openstates AIP: ${err}`);
        })

    });
    
}

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
    getBillDetails(res.bills, req.params.state_id);
    res.json(res.bills);
});

module.exports = router;