const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const app = express()
const port = 3000
let session = require('express-session')
let bodyParser = require('body-parser');
const cors = require("cors");

var fs = require('fs');
const https = require('https');
const http = require('http');

let { login, signup, verifyAuth, disconnect, modifyAccount} = require('./controllers/AuthController.js');

let { getListeServices, createService, getServiceById, deleteService } = require('./controllers/ServicesController.js');

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
    let services = await getListeServices(req.session.user.id);
    let privacyPolicy = req.session.user.privacyPolicy
    res.render('pages/index', {services : services, privacyPolicy})
})

app.get('/services', async (req, res) => {
    await verifyAuth(req,res)
    let services = await getListeServices(req.session.user.id);
    let privacyPolicy = req.session.user.privacyPolicy
    res.render('pages/services', {services : services, privacyPolicy})
})

app.get('/service/addService', async (req, res) => {
    await verifyAuth(req,res)
    let privacyPolicy = req.session.user.privacyPolicy
    let userid = req.session.user.id;
    res.render('pages/addService', {privacyPolicy, userid })
})


app.get('/updates', async (req, res) => {
    await verifyAuth(req,res)
    let privacyPolicy = req.session.user.privacyPolicy
    let services = await getListeServices(req.session.user.id)
    res.render('pages/updates', {services : services, privacyPolicy})
})






app.get('/services/addService', async (req, res) => {
    await verifyAuth(req,res)
    let privacyPolicy = req.session.user.privacyPolicy;
    res.render('pages/services', {privacyPolicy})
})







app.get('/services/editService', async (req, res) => {
    await verifyAuth(req,res)
    let service = await getServiceById(req.query.id);
    let privacyPolicy = req.session.user.privacyPolicy
    res.render('pages/editService', {service : service, privacyPolicy})
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

app.get('/getServiceById', async (req, res) => {
    let service = await getServiceById(req.query.id);
    res.send(service);
});

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

app.post('/createService', async (req, res) => {
    await verifyAuth(req,res)
    let service = await createService(req.body);
    let privacyPolicy = req.session.user.privacyPolicy
    res.render('pages/editService', {service: service, privacyPolicy})
});

app.post('/disconnect', async (req, res) => {
    disconnect(req, res)
})
app.post('/privacy', (req, res) => {
    req.session.user.privacyPolicy = true;
    res.send({
        "code":200
    });
});

app.get('/deleteService', async (req, res) => {
    let id = req.query.id;
    await deleteService(id);
    setTimeout(function() { return 0 }, 350)
    res.redirect('/services');
});



// Database sequelize
const db = require('./sequelize');
// Sync database
db.sequelize.sync();

// reset datatable
// db.sequelize.sync({ force: true }).then(() => {
//    console.log("Drop and re-sync db.");
//  });

// // HTTPS
var privateKey  = fs.readFileSync('/cert/key.key', 'utf8');
var certificate = fs.readFileSync('/cert/cert.cert', 'utf8');
var credentials = {key: privateKey, cert: certificate};

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpsServer.listen(443, () => {
    console.log('HTTPS Server running on port 443');
});

// DEV
// app.listen(port, () => {
//     console.log(`Example app listening at http://localhost:${port}`)
// })