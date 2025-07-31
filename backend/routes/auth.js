const express = require('express');
const User = require("../models/User")
const router = express.Router();


// Create a User using : POST "/api/auth/". Does not require auth
router.post('/', function (req, res) {
    /* obj = {
        a : "first App",
        version: '1.0.0'
    }
    res.json(obj) */
    const user = User(req.body);
    user.save();
    console.log(req.body)
    res.send(req.body)
})



module.exports = router