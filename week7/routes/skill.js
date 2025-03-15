const express = require('express')

const router = express.Router()
const skill = require('../controllers/skill')

router.post('/', skill.post)

router.get('/', skill.getAll)

router.delete('/:skillId', skill.deletePackage)

module.exports = router
