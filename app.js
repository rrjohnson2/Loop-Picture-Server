
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
            cb(null, file.fieldname + '-'+file.originalname)}
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
    res.sendFile(path.join(`${__dirname}/public/images/avatar-${user}.png`));
})
app.get('/test', function(req,res) {
    var user = req.param("user");
    res.sendFile(path.join(`${__dirname}/public/content/GjohsonFriMay082020162904GMT0400EasternDaylightTime.mp3`));
})

app.post('/upload_profile_picture', function(req,res) {
    profile_picture(req,res,(err)=> {
        res.send(err)});
})

app.post('/upload_content', function(req,res) {
    bit_content(req,res,(err)=> {
        res.send(err)});
})
module.exports = app;