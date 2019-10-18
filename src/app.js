const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express(path.join(__dirname, '../public'))

// Define paths for Express config
const publicpath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicpath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Eric Lee'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Eric Lee'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpmessage: 'HAAALLLPPPP!!!!',
        title: 'Help',
        name: 'Eric Lee'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({ error: 'You must provide an address!'})
    }
    geocode(req.query.address, (error, { latitude, longitude, location} = {}) => {
        if (error) {
            return res.send({ error })
        }
        forecast(latitude, longitude, (error, forecastdata) => {
            if (error) {
                return res.send({ error })
            }
            res.send({ location, forecast: forecastdata, address: req.query.address })
        })
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Eric Lee',
        errorMessage: 'Help article not found.'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Eric Lee',
        errorMessage: 'Page not found.'
    })
})

app.listen(3000, () => {
    console.log('Server is up on port 3000')
})