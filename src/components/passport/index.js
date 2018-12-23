const config = require('config')
const passport = require('passport')
const Auth0Strategy = require('passport-auth0');
const identityService = require('../../db/identity');

const auth0 = new Auth0Strategy(
    {
        domain: config.get('auth.Auth0.domain'),
        clientID: config.get('auth.Auth0.clientId'),
        clientSecret: config.get('auth.Auth0.clientSecret'),
        callbackURL: config.get('auth.Auth0.callbackUrl'),
        state: false
    },
    async function (accessToken, refreshToken, extraParams, profile, done) {
        // accessToken is the token to call Auth0 API (not needed in the most cases)
        // extraParams.id_token has the JSON Web Token
        // profile has all the information from the user

        try {
            console.log("Looking up existing identity")
            let identity = await identityService.lookupIdentityByExternalId(profile.id)
            if(!identity) {
                console.log("Creating new identity")
                identity = await identityService.createIdentityByExternalId(profile.id)
                return done(null, identity);
            }
            return done(null, identity);
        } catch (e) {
            console.log("Error managing identity", e)
            return done(e, false);

        }
    }
);

passport.use(require('./jwt'));
passport.use(auth0);


module.exports = passport