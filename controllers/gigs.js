const express = require('express')
const router = express.Router()

const User = require('../models/User.js')
const Gig = require('../models/Gig.js')

const isSignedIn = require('../middleware/is-signed-in.js');

// CRUD ROUTES:

// C1:
router.get('/new', isSignedIn, (req, res) => {
    res.render('gigs/new')
})

// C2:
router.post('/', isSignedIn, async (req, res) => {
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

        const userIsGoing = gig.gigAttendees.some((user) => user.equals(req.session.user.id))

        res.render('gigs/show', { gig, userIsGoing })
    }

    catch (error) {
        console.log(error)
        res.redirect('/gigs')
    }
})

// U1:
router.get('/:id/edit', isSignedIn, async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.id)

        if (gig.owner != req.session.user.id) {
            res.status(403).render('error-403')
            return
        }

        res.render('gigs/edit', { gig })
    }

    catch (error) {
        console.log(error)
        res.redirect(`/gigs/${req.params.id}`)
    }
})

// U2:
router.put('/:id', isSignedIn, async (req, res) => {
    try {
        const gigToUpdate = await Gig.findById(req.params.id)

        if (gigToUpdate.owner != req.session.user.id) {
            res.status(403).render('error-403')
            return
        }

        const updatedGig = await Gig.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                date: req.body.date,
                type: req.body.type,
                price: req.body.price,
                description: req.body.description
            },
            { new: true }
        )

        res.redirect(`/gigs/${req.params.id}`)
    }

    catch (error) {
        console.log(error)
        res.redirect(`/gigs/${req.params.id}`)
    }
})

// D:
router.delete('/:id', isSignedIn, async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.id)

        if (gig.owner != req.session.user.id) {
            res.status(403).render('error-403')
            return
        }

        await Gig.findByIdAndDelete(req.params.id)
        res.redirect('/gigs')
    }

    catch (error) {
        console.log(error)
        res.redirect('/gigs')
    }
})


// GOING or NOT GOING

router.post('/:id/going', async (req, res) => {

    await Gig.findByIdAndUpdate(
        req.params.id,
        {
            $push: {gigAttendees: req.session.user.id}
        })

        res.redirect(`/gigs/${req.params.id}`)
})

router.delete('/:id/going', async (req, res) => {

    await Gig.findByIdAndUpdate(
        req.params.id,
        {
            $pull: {gigAttendees: req.session.user.id}
        })

        res.redirect(`/gigs/${req.params.id}`)
})

module.exports = router