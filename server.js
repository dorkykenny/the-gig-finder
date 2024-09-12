require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const morgan = require('morgan')
const session = require('express-session')
const MongoStore = require('connect-mongo')

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI })
}))

app.use(express.static('public'))

const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');
const authController = require('./controllers/auth.js')
const gigsController = require('./controllers/gigs.js')
const User = require('./models/User.js')
const Gig = require('./models/Gig.js')

mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
})

app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'ejs')
app.use(methodOverride('_method'))
app.use(morgan('dev'))


app.get('/', (req, res) => {
    res.render('index', {
        user: req.session.user,
    })
})


app.use(passUserToView)
app.use('/auth', authController)
app.use('/gigs', gigsController)


app.get('/profile', isSignedIn, async (req, res) => {
    const myGigs = await Gig.find({owner: req.session.user.id})
    const gigsIAmGoingTo = await Gig.find({gigAttendees: req.session.user.id})

    res.render('profile', {myGigs, gigsIAmGoingTo})
})


app.listen(process.env.PORT, () => {
    console.log(`Server listening on http://localhost:3000/`)
})