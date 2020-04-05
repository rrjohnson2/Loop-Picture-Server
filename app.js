
const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const logger = require('morgan');
const serveIndex = require('serve-index')
const cookieParser = require('cookie-parser');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');



var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images')
    },
    filename: (req, file, cb) => {
        if(path.extname(file.originalname)==".png")
            cb(null, file.fieldname + '-'+file.originalname)
        else
            cb(new Error('Only png are allowed'));
    }
});

//will be using this for uplading
const upload = multer({ storage: storage }).single('avatar');



app.use(logger('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static('public'));
app.use('/ftp', express.static('public'), serveIndex('public', {'icons': true}));

app.get('/', function(req,res) {
    return res.send("hello from my app express server!")
})
app.get('/avatar', function(req,res) {
    var user = req.param("user");
    res.sendFile(path.join(`${__dirname}/public/images/avatar-${user}.png`));
})

app.post('/upload_profile_picture', function(req,res) {
    upload(req,res,(err)=> {
        
        res.send(err)});
})
module.exports = app;