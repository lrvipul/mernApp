const mongoose = require("mongoose");

const userSchema = new Schema({
    name: {
        type: String,
        require:true
    },
    email: {
        type: String,
        require:true,
        unique:true
    },
    password: {
        type: Number,
        require:true,
        unique:true
    },
    date: { 
        type: Date, 
        default: Date.now 
    }
});

mongoose.exports = mongoose.model('user',userSchema)