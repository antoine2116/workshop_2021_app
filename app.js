const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const app = express()
const port = 3000
let session = require('express-session')
let bodyParser = require('body-parser');
const cors = require("cors");

let { login, signup, verifyAuth} = require('./controllers/AuthController.js');

app.use('/assets', express.static('assets'))

// set the view engine to ejs
app.use(expressLayouts)
app.use(session({
    secret: '1aqw2zsx3edc',
    name: 'SessionUser',
    resave: true,
    saveUninitialized: true,
    cookie:{
        maxAge: 31556952000
    }
}));
app.use(bodyParser.urlencoded({
    extended: true
}));


// CORS
let corsOptions = {
    origin: 'http://localhost:8080'
};
app.use(cors(corsOptions));

app.use(bodyParser.json());

app.set('layout', './layouts/layout')
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    verifyAuth(req,res)
    res.render('pages/index')
})

app.get('/services', (req, res) => {
    verifyAuth(req,res)
    res.render('pages/services')
})

app.get('/service/addService', (req, res) => {
    verifyAuth(req,res)
    res.render('pages/addService')
})


app.get('/updates', (req, res) => {
    verifyAuth(req,res)
    res.render('pages/updates')
})

app.get('/services/addService', (req, res) => {
    verifyAuth(req,res)
    res.render('pages/addService')
})

app.get('/services/editService', (req, res) => {
    verifyAuth(req,res)
    res.render('pages/editService')
})

//Auth
app.get('/login', (req, res) => {
    let sess = req.session
    if(sess.user == null || sess.user == ""){
        res.render('pages/login')
    }else{
        res.redirect('/')
    }
})
app.get('/signup', (req, res) => {
    let sess = req.session
    if(sess.user == null || sess.user == ""){
        res.render('pages/signup')
    }else{
        res.redirect('/')
    }
})

app.post('/login', (req, res) => {
    login(req, res)
})
app.post('/signup', async (req, res) => {
    signup(req, res)
})



// Database sequelize
const db = require('./sequelize');
// Sync database
db.sequelize.sync();

// reset datatable
 /*db.sequelize.sync({ force: true }).then(() => {
   console.log("Drop and re-sync db.");
 });*/

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
