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

const authController = require('./controllers/auth.js')
const gigsController = require('./controllers/gigs.js')

mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
})

app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(methodOverride('_method'))
app.use(morgan('dev'))



app.use((req, res, next) => {
    res.locals.user = req.session.user ? req.session.user : null
    next()
})


app.get('/', (req, res) => {
    res.render('index', {
        user: req.session.user,
    });
});


app.listen(process.env.PORT, () => {
    console.log(`Server listening on http://localhost:3000/`)
})