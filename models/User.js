const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    myGigs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gig'
    }]

})

const User = mongoose.model('User', userSchema)

module.exports = User