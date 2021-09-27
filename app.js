const express = require('express')
const app = express()
const port = 3000

app.use('/assets', express.static('assets'))

// set the view engine to ejs
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('pages/index')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})