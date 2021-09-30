const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const app = express()
const port = 3000
let session = require('express-session')
let bodyParser = require('body-parser');
const cors = require("cors");
const https = require('https');
const http = require('http');

let { login, signup, verifyAuth, disconnect, modifyAccount} = require('./controllers/AuthController.js');

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
app.set("layout pages/login", false);
app.set("layout pages/signup", false);
app.set('view engine', 'ejs')

app.get('/', async (req, res) => {
    await verifyAuth(req,res)
    let privacyPolicy = req.session.user.privacyPolicy
    res.render('pages/index', {privacyPolicy})
})

app.get('/services', async (req, res) => {
    await verifyAuth(req,res)
    let privacyPolicy = req.session.user.privacyPolicy
    res.render('pages/services', {privacyPolicy})
})

app.get('/service/addService', async (req, res) => {
    await verifyAuth(req,res)
    let privacyPolicy = req.session.user.privacyPolicy
    res.render('pages/addService', {privacyPolicy})
})


app.get('/updates', async (req, res) => {
    await verifyAuth(req,res)
    let privacyPolicy = req.session.user.privacyPolicy
    res.render('pages/updates', {privacyPolicy})
})

app.get('/services/addService', async (req, res) => {
    await verifyAuth(req,res)
    let privacyPolicy = req.session.user.privacyPolicy
    res.render('pages/addService', {privacyPolicy})

})

app.get('/services/editService', async (req, res) => {
    await verifyAuth(req,res)
    let privacyPolicy = req.session.user.privacyPolicy
    res.render('pages/editService', {privacyPolicy})
})

app.get('/account', async (req, res) => {
    await verifyAuth(req,res)
    let privacyPolicy = req.session.user.privacyPolicy
    res.render('pages/profile', {confirm: false, user:req.session.user, info: null, privacyPolicy})
})
app.post('/account', async (req, res) => {
    await verifyAuth(req,res)
    modifyAccount(req, res)

})

//Auth
app.get('/login', async (req, res) => {
    let sess = req.session
    if(sess.user == null || sess.user == ""){
        res.render('pages/login', {layout: 'pages/login'})
    }else{
        res.redirect('/')
    }
})
app.get('/signup', async (req, res) => {
    let sess = req.session
    if(sess.user == null || sess.user == ""){
        res.render('pages/signup', {layout: 'pages/signup'})
    }else{
        res.redirect('/')
    }
})

app.post('/login', async (req, res) => {
    login(req, res)
})
app.post('/signup', async (req, res) => {
    signup(req, res)
})

app.post('/disconnect', async (req, res) => {
    disconnect(req, res)
})
app.post('/privacy', (req, res) => {
    req.session.user.privacyPolicy = true;
    res.send({
        "code":200
    });
});



// Database sequelize
const db = require('./sequelize');
// Sync database
db.sequelize.sync();

// reset datatable
 /*db.sequelize.sync({ force: true }).then(() => {
   console.log("Drop and re-sync db.");
 });*/

/*app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})*/

const httpServer = http.createServer(app);
const httpsServer = https.createServer({
    key: fs.readFileSync('/cert/key.pem'),
    cert: fs.readFileSync('/cert/cert.pem'),
}, app);

httpServer.listen(80, () => {
    console.log('HTTP Server running on port 80');
});

httpsServer.listen(443, () => {
    console.log('HTTPS Server running on port 443');
});

