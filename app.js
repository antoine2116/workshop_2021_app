const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const app = express()
const port = 3000

app.use('/assets', express.static('assets'))

// set the view engine to ejs
app.use(expressLayouts)
app.set('layout', './layouts/layout')
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('pages/index')
})

app.get('/services', (req, res) => {
    res.render('pages/services')
})

app.get('/service/addService', (req, res) => {
    res.render('pages/addService')
})


app.get('/updates', (req, res) => {
    res.render('pages/updates')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})