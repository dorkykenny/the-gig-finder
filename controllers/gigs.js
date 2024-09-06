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
    }

    catch (error) {
        console.log(error)
        res.redirect('/gigs')
    }

})

// R1:
router.get('/', async (req, res) => {
    const gigs = await Gig.find()
    res.render('gigs/index', { gigs })
})

// R2:
router.get('/:id', async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.id).populate('owner')
        res.render('gigs/show', { gig })
    }

    catch (error) {
        console.log(error)
        res.redirect('/gigs')
    }
})

// U1:
router.get('/:id/edit', async (req, res) => {

    const gig = await Gig.findById(req.params.id)

    if(gig.owner != req.session.user.id) {
        res.status(403).render('error-403')
        return
    }

    res.render('gigs/edit', {gig})
})

// U2:

// D:
router.delete('/:id', async (req, res) => {
    
    const gig = await Gig.findById(req.params.id)

    if(gig.owner != req.session.user.id) {
        res.status(403).render('error-403')
        return
    }

    await Gig.findByIdAndDelete(req.params.id)
    res.redirect('/gigs')
})


module.exports = router