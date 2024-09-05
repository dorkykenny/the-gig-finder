const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')

const User = require('../models/User.js')



router.get('/sign-up', (req, res) => {
    res.render('auth/sign-up')
})

router.post('/sign-up', async (req, res) => {
    try {
        const userInDatabase = await User.findOne({ email: req.body.email })
        if(userInDatabase !== null) {
            res.render('auth/sign-up', {
                errorMessage: 'Your email address is already taken.',
                email: req.body.email 
            })
            return 
        } 

        if(req.body.password !== req.body.confirmPassword) {
            res.render('auth/sign-up', {
                errorMessage: `Your passwords do not match. Please try again.`,
                email: req.body.email 
            })
            return
        }

        const hashedPassword = bcrypt.hashSync(req.body.password, 10)

        await User.create({
            email: req.body.email,
            password: hashedPassword
        })

        res.redirect('/')
    } catch(error) {
        console.log(error)
        res.redirect('/')
    }
})





router.get('/sign-in', (req, res) => {
    res.render('auth/sign-in')
})

router.post('/sign-in', async (req, res) => {
    const userInDatabase = await User.findOne({email: req.body.email})

    if(userInDatabase === null) {
        res.render('auth/sign-in', {
            errorMessage: 'No account with this email address',
            email: req.body.email
        })
        return
    }

    if(bcrypt.compareSync(req.body.password, userInDatabase.password) === false) {
        res.render('auth/sign-in', {
            errorMessage: 'Incorrect password. Please try again.',
            email: req.body.email
        })
        return
    }

    req.session.user = {
        email: userInDatabase.email,
        id: userInDatabase.id
    }

    req.session.save(() => {
        res.redirect('/')
    })
})



router.get('/sign-out', (req, res) => {
    req.session.destroy()
    res.redirect('/')
})



module.exports = router