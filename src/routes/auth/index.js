const router = require('express-promise-router')()

router.use('/auth0', require('./auth0'));

module.exports = router;