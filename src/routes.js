const {
    inicio,
    agendar,
    cadastro,
    saveClasses
} = require('./pages')

const express = require('express')
const routes = express.Router()

// Routes

routes.get('/', inicio)
routes.get('/agendar', agendar)
routes.get('/cadastro', cadastro)
routes.post('/save-classes', saveClasses)

module.exports = routes