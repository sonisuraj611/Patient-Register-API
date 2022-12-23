const { BadRequestError } = require('../errors')
const bcrypt = require('bcryptjs')

const patientValidation = async (req, res, next) => {
    let parsedData = JSON.parse(req.body.data);
    const { Name, Address, Email, Phone, Password } = parsedData;

    if (!Name || !Address || !Email || !Password) {
        throw new BadRequestError('Every field except phone number is required');
    }
    if (Name.length > 20) {
        throw new BadRequestError('Length of Name should be less than 20');
    }
    if (Email.length > 30) {
        throw new BadRequestError('Length of Email should be less than 30');
    }
    if (Address.length < 10) {
        throw new BadRequestError('Address should be of atleast 10 characters');
    }

    let emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (!Email.match(emailFormat)) {
        throw new BadRequestError('Please provide correct email');
    }

    // let phoneFormat = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
    let phoneFormat = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{5,6}$/im;
    if (!Phone.match(phoneFormat) || !Phone.startsWith('+')) {
        throw new BadRequestError('Please provide correct phone number');
    }

    // let passwordFormat =  /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/
    let passwordFormat = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}$/
    if (!Password.match(passwordFormat)) {
        throw new BadRequestError('Please provide correct password with (Max length 15 and min length 8), atlest one upperCase, one lowerCase and one number');

    }

    const salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(Password, salt)
    req.hashedPassword = hashedPassword;
    next();
}

module.exports = patientValidation;