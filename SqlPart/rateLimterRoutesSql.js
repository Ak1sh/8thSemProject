const express = require('express')

const router = express.Router()

const rateLimiterController = require('../controllers/rateLimiterSql')

router.get('/', rateLimiterController.welcome)
router.get('/lightEndPoint', rateLimiterController.lightEndPoint)

module.exports = router