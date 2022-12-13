const express = require('express')
const router = express.Router();

const { register, getHospital } = require('../controllers/main')

router.post('/register', register)
router.get('/:id', getHospital)

module.exports = router;