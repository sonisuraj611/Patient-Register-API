Dependencies and their use:- 

"dependencies": {
    "express": "^4.18.2",
    "express-async-errors": "^3.1.1",
    "http-status-codes": "^2.2.0",
    "mysql": "^2.18.1"
}


express-async-errors -> To paas the thrown error from async functions to middleware without having to use try-catch block and 'next()'

http-status-codes -> To make code more readable

** Postman **
I shared the json file of postman collection which can be used by importing 


Some important things:-
1) The express-async-error is not working in some cases when trying to fetch the hospital details(Some type problems with package in node modules).
2) I used VARCHAR type in photo attribute in mysql which can be changed to Medium Blob to store photo
