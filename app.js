
const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const logger = require('morgan');
const serveIndex = require('serve-index')
const cookieParser = require('cookie-parser');
const cors = require('cors');

const fileupload = require("express-fileupload");

process.env.AWS_ACCESS_KEY_ID     = process.env.BUCKETEER_AWS_ACCESS_KEY_ID;
process.env.AWS_SECRET_ACCESS_KEY = process.env.BUCKETEER_AWS_SECRET_ACCESS_KEY;
process.env.AWS_REGION            = 'us-east-1';
const bucket = process.env.BUCKETEER_BUCKET_NAME || 'bucketeer-3083ee67-78d6-4380-9db8-660a511fb8e3'

const AWS = require('aws-sdk');
const s3  = new AWS.S3();

app.use(fileupload());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

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
app.get('/download', function(req,res) { 

    var params={
        Key:    req.param("content"),
        Bucket: bucket,
    }
    s3.getObject(params, function(err, data) {
        if (err){
          return res.status(400).send({success:false,err:err});
        }
        else{
          return res.send(data.Body);
        }
      });
});

app.post('/upload', function(req,res) {
    var params={
        Key:    req.files.content.name,
        Bucket: bucket,
        Body:   req.files.content.data,
    }
    s3.putObject(params, function put(err, data) {
        if (err) {
          console.log(err, err.stack);
          res.send(err);
          return;
        } else {
          console.log(data);
          res.send();
        }
      });
})
module.exports = app;