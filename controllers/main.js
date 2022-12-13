const { NotFoundError, BadRequestError } = require('../errors');
const { StatusCodes } = require('http-status-codes');
const db = require('../db/connect');
db.connect((error) => {
    if (error) {
        console.log('Sql connection failed..');
        throw error;
    }
    console.log('MySql Connected..');
});

const register = async (req, res) => {
    const { Name, Address, Email, Phone, Password, Photo } = req.body;
    if (!Name || !Address || !Email || !Password || !Photo) {
        throw new BadRequestError('Every field except phone number is required');
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

    let r = (Math.random() * 21) + 1; // random number of psychiatrists (1-21)
    let random = Math.floor(r);

    let sql = `INSERT INTO patients (sno, Name, PsychiatristID, Email, Phone, Password, Photo, Address) VALUES (NULL, '${Name}', '${random}', '${Email}', '${Phone}', '${Password}', '${Photo}', '${Address}')`

    db.query(sql, (err, result) => {
        if (err) {
            throw new BadRequestError('Sql query error')
        }
        let sql2 = `Select * from psychiatrists where Id= '${random}'`;
        db.query(sql2, (err2, result2) => {
            if (err2) {
                throw new BadRequestError('Sql query error of random psychiatrist');
            }
            let patientCount = result2[0].PatientCount;
            let Id = result2[0].Id;
            console.log(Id);
            console.log(patientCount);
            let sql3 = `UPDATE psychiatrists SET PatientCount = '${patientCount + 1}' WHERE psychiatrists.Id = ${Id}`
            db.query(sql3, (err3, result3) => {
                if (err3) {
                    throw new BadRequestError('Sql query error of update')
                }
                return res.status(StatusCodes.OK).json({ msg: 'Successfully Registered', body: req.body })

            })
        })
    })
}

const getHospital = async (req, res) => {

    let hospitalId = req.params.id
    if (isNaN(hospitalId)) {
        throw new BadRequestError(`No hospital with id ${hospitalId}`)
    }

    let sql = `Select * from hospitals where sno= '${hospitalId}'`;
    db.query(sql, (err, result) => {
        if (err) {
            throw new BadRequestError('Sql query error')
        }
        if (!result.length >= 1) {
            console.log('No nothing');
            throw new NotFoundError(`No Hospital with id ${hospitalId}`)
        }
        let HospitalName = result[0].Name
        let sql2 = `Select * from psychiatrists where HospitalName = '${HospitalName}'`
        db.query(sql2, (err2, result2) => {
            if (err2) {
                throw new BadRequestError('Sql query gadbad')
            }
            Psychiatrist_Details = [];
            patientsCount = 0;
            result2.forEach(item => {
                itemObj = {
                    Id: item.Id,
                    Name: item.Name,
                    Patients_Count: item.PatientCount
                }
                Psychiatrist_Details.push(itemObj);
                patientsCount += item.PatientCount;
            })
            let responseObj = {
                HospitalName,
                Total_Pyschiatrist_Count: result2.length,
                Total_Patient_Count: patientsCount,
                Psychiatrist_Details
            };
            return res.status(StatusCodes.OK).json(responseObj);
        })
    })


}

module.exports = { register, getHospital };