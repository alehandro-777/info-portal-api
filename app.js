const fs = require('fs')
process.env.RSA_PUBLIC_KEY = fs.readFileSync('./keys/public.key');
process.env.RSA_PRIVATE_KEY = fs.readFileSync('./keys/private.key');
process.env.JWT_EXP_DAYS = 7;
process.env.SELECT_LIMIT = 100;

const express = require('express')
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const cors = require('cors');
const errorHandler = require('./error-handler')
const app = express()
const router = require('./app_api/routes')

require('./app_api/models/db')  //init mongoose

const port = process.env.PORT || 3000;

//temp
app.use(function (req, res, next) {
    //console.log(req.headers);
    next();
  });

//middleware
//app.use(cors());  //Cookies doesn't work with "*" wildcards 

//for cookies  only !!!
app.use(function(req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
 next();
});

app.use(bodyParser.json());
app.use(cookieParser());
app.use('/api', router);
app.use(errorHandler);  // global error handler


//TODO send the information to crash reporting system
process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', reason.stack || reason)
})

//TODO send the information to crash reporting system
process.on('uncaughtException', function (err) {
  console.error(err);
  console.log("Node app should be restarted !");
  throw new Error("Crash application");
});

console.log(`Server started at port: ${port}`)
app.listen(port)