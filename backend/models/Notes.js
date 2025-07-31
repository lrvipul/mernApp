const mongoose = require("mongoose");

const noteSchema = new Schema({
    title: {
        type: String,
        require:true
    },
    description: {
        type: String,
        require:true,
    },
    tag: {
        type: String
    },
    date: { 
        type: Date, 
        default: Date.now 
    }
});

mongoose.exports = mongoose.model('notes',noteSchema)