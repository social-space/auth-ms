const router = require('express-promise-router')()

router.use('/auth', require('./auth'));

module.exports = router;