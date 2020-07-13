process.env.AWS_ACCESS_KEY_ID     = process.env.BUCKETEER_AWS_ACCESS_KEY_ID || "AKIAX7CRDYXPX2XWPYE2";
process.env.AWS_SECRET_ACCESS_KEY = process.env.BUCKETEER_AWS_SECRET_ACCESS_KEY || "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";
process.env.AWS_REGION            = 'us-east-1';

const AWS = require('aws-sdk');
const s3  = new AWS.S3({
    accessKeyId: process.env.BUCKETEER_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.BUCKETEER_AWS_SECRET_ACCESS_KEY,
    region: 'us-east-1',
  });

const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const logger = require('morgan');
const serveIndex = require('serve-index')
const cookieParser = require('cookie-parser');
const cors = require('cors');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
 


var profile_picture_storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images')
    },
    filename: (req, file, cb) => {
        if(path.extname(file.originalname)==".png"){ 
            cb(null,file.originalname)}
        else
           { 
               cb(new Error('Only png are allowed'));
            }
    }
});

var bit_storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/content')
    },
    filename: (req, file, cb) => {
        console.log(file);
        if(path.extname(file.originalname)==".mp3"||
          path.extname(file.originalname)==".png" ||
          path.extname(file.originalname)==".jpg" ||
          path.extname(file.originalname)==".mp4"
          ){
            console.log("here"); 
            cb(null,file.originalname)}
        else
           { 
               cb(new Error('Only audio video and images are allowed'));
            }
    }
});

//will be using this for uplading
const profile_picture = multer({ storage: profile_picture_storage }).single('avatar');
const bit_content = multer({ storage: bit_storage }).single('content');



app.use(logger('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
//app.use(express.static('public'));
app.use('/ftp', express.static('public'), serveIndex('public', {'icons': true}));

app.get('/', function(req,res) {
    return res.send("hello from my app express server!")
})
app.get('/avatar', function(req,res) {
    var user = req.param("user");
    res.sendFile(path.join(`${__dirname}/public/images/${user}`));
})
app.get('/content', function(req,res) {
    var content = req.param("content");
    res.sendFile(path.join(`${__dirname}/public/content/${content}`));
})

app.post('/upload_profile_picture', function(req,res) {
    profile_picture(req,res,(err)=> {
        res.send(err)});
})

app.post('/upload_content', function(req,res) {
    bit_content(req,res,(err)=> {
        res.send(err)});
})


var params = {
    Key:    'hello',
    Bucket: process.env.BUCKETEER_BUCKET_NAME,
    Body:   new Buffer('Hello, node.js'),
  };
  
  s3.putObject(params, function put(err, data) {
    if (err) {
      console.log(err, err.stack);
      return;
    } else {
      console.log(data);
    }
  
    delete params.Body;
    s3.getObject(params, function put(err, data) {
      if (err) console.log(err, err.stack);
      else     console.log(data);
  
      console.log(data.Body.toString());
    });
  });
module.exports = app;