const express = require('express')
const router = express.Router()

const User = require('../models/User.js')
const Gig = require('../models/Gig.js')

// C1:
router.get('/new', (req, res) => {
    res.render('gigs/new')
})

// C2:

// R1:
router.get('/', async (req, res) => {
    res.render('gigs/index')
})

// R2:

// U1:

// U2:

// D:


module.exports = router