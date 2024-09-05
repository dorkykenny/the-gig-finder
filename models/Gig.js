const mongoose = require('mongoose')

const gigSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    date: {
        type: String,
        required: true
    },

    type: {
        type: String
    },

    price: {
        type: Number
    },

    description: {
        type: String,
        required: true
    }
})