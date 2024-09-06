const express = require('express')
const router = express.Router()

const User = require('../models/User.js')
const Gig = require('../models/Gig.js')

// C1:
router.get('/new', (req, res) => {
    res.render('gigs/new')
})

// C2:
router.post('/', async (req, res) => {
    try {
        const createdGig = await Gig.create({
            name: req.body.name,
            date: req.body.date,
            type: req.body.type,
            price: req.body.price,
            description: req.body.description,
            owner: req.session.user.id
        })
    
        const user = await User.findById(req.session.user.id)
    
        user.myGigs.push(createdGig.id)
        await user.save()
    
        res.redirect('/gigs')
    } catch (error) {
        console.log(error)
        res.redirect('/gigs')
    }

})

// R1:
router.get('/', async (req, res) => {
    res.render('gigs/index')
})

// R2:

// U1:

// U2:

// D:


module.exports = router