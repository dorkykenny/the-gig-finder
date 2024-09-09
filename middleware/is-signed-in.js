const isSignedIn = (req, res, next) => {
    if (req.session.user) {
        next()
    } else {
        res.redirect('/auth/sign-in?message=1')
    }
}

module.exports = isSignedIn
