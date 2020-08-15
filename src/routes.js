const express = require('express')
const BarberController = require('./controllers/BarberController')

const routes = express.Router()

// Routes

routes.get('/', BarberController.inicio)
routes.get('/agendar', BarberController.agendar)
routes.get('/cadastro', BarberController.cadastro)

module.exports = routes