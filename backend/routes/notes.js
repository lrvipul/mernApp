const express = require('express');
const router = express.Router();


router.get('/', function (req, res) {
    obj = {
        a : "first App Notes",
        version: '1.0.0'
    }
    res.json(obj)
})



module.exports = router