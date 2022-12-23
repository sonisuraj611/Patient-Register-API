const express = require('express')
const router = express.Router();
const patientValidation = require('../middlewares/patientValidation')
const upload = require('../middlewares/multer')

const { register, getHospital } = require('../controllers/main')

router.post('/register', [upload.single('pic'), patientValidation], register)
router.get('/:id', getHospital)

module.exports = router;