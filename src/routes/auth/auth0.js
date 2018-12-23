var express = require('express');
var router = express.Router();
var passport = require('passport');
const jwt = require('../../components/jwt');
const config = require('config');

// Perform the login, after login Auth0 will redirect to callback
router.get('/login', passport.authenticate('auth0', {
    scope: 'openid'
}), function (req, res) {
    res.redirect('/');
});

router.get('/callback', function (req, res, next) {
    passport.authenticate('auth0', async function (err, identity, info) {
        if (err) { return next(err); }
        if (!identity) { return res.redirect('/login'); }

        console.log(identity)

        let userJwt = await jwt.encode({
            id: identity.id
        });
        res.cookie('jwt', userJwt, {
            secure: config.get('services.secure'),
            domain: config.get('services.domain')
        });
        res.json(userJwt)

    })(req, res, next);
});

// Perform session logout and redirect to homepage
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;