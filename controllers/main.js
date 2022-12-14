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

    let parsedData = JSON.parse(req.body.data);
    const { Name, Address, Email, Phone } = parsedData;
    const Photo = req.file;
    const ImageName = Photo.path.slice(7);
    const Password = req.hashedPassword;

    const responseObj = {
        Name, Address, Email, Phone, Password, ImageName
    }

    let r = (Math.random() * 21) + 1; // random number of psychiatrists (1-21)
    let random = Math.floor(r);

    let sql = `INSERT INTO patients (sno, Name, PsychiatristID, Email, Phone, Password, Photo, Address) VALUES (NULL, '${Name}', '${random}', '${Email}', '${Phone}', '${Password}', '${ImageName}', '${Address}')`

    db.query(sql, (err, result) => {
        if (err) {
            throw new Error('Sql query error')
        }
        let sql2 = `Select * from psychiatrists where Id= '${random}'`;
        db.query(sql2, (err2, result2) => {
            if (err2) {
                throw new Error('Sql query error of random psychiatrist');
            }
            let patientCount = result2[0].PatientCount;
            let Id = result2[0].Id;
            let sql3 = `UPDATE psychiatrists SET PatientCount = '${patientCount + 1}' WHERE psychiatrists.Id = ${Id}`
            db.query(sql3, (err3, result3) => {
                if (err3) {
                    throw new Error('Sql query error of update')
                }
                return res.status(StatusCodes.OK).json({ msg: 'Successfully Registered', body: responseObj })

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
            throw new Error('Sql query error')
        }
        if (!result.length >= 1) {
            return res.status(404).json({ errMsg: `No hospital with id ${hospitalId}` })
        }
        let HospitalName = result[0].Name
        let sql2 = `Select * from psychiatrists where HospitalName = '${HospitalName}'`
        db.query(sql2, (err2, result2) => {
            if (err2) {
                throw new Error('Sql query error')
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