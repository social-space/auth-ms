const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('../jwt');
const identityService = require('../../db/identity')

let opts = {};
opts.algorithms = [jwt.algorithm]
opts.jwtFromRequest = ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(),
    function(req) {
        let token = null;
        if (req && req.cookies) {
            token = req.cookies['jwt'];
        }
        return token;
    }
]);
opts.secretOrKey = jwt.publicKey;

module.exports = new JwtStrategy(opts, async function(jwt_payload, done) {
    let identity;
    const db = await require('../../db').connect();

    try {
        identity = await identityService.lookupIdentityById(jwt_payload.id)
    } catch (e) {
        done(e, false);
        return;
    }
    if(!identity) {
        return done(null, false);
    }
    return done(null, identity);
});