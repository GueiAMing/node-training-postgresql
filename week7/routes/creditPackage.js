const express = require('express')

const router = express.Router()
const config = require('../config/index')
const { dataSource } = require('../db/data-source')
const logger = require('../utils/logger')('CreditPackage')
const creditPackage = require('../controllers/creditPackage')
const auth = require('../middlewares/auth')({
  secret: config.get('secret').jwtSecret,
  userRepository: dataSource.getRepository('User'),
  logger
})

router.post('/', creditPackage.post)

router.get('/', creditPackage.getAll)

router.delete('/:creditPackageId', creditPackage.deletePackage)

router.post('/:creditPackageId', auth, creditPackage.postUserBuy)


module.exports = router
