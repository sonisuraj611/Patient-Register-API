
UPDATES:-

1) Completed the assignment of photo upload (using multer). Stored the image in "Images" folder and stored the filename on Database.
2) Used bcryptjs for hashing the password and saving hashed password on db for security


Dependencies and their use:- 

"dependencies": {
    "bcryptjs": "^2.4.3",
    "express": "^4.18.2",
    "express-async-errors": "^3.1.1",
    "http-status-codes": "^2.2.0",
    "multer": "^1.4.5-lts.1",
    "mysql": "^2.18.1"
  }

**
Updated
multer -> To parse the multipart/form-data (To upload the image)
bcryptjs -> To hash the password
**

express-async-errors -> To paas the thrown error from async functions to middleware without having to use try-catch block and 'next()'

http-status-codes -> To make code more readable

** Postman **
I shared the json file of postman collection which can be used by importing 

