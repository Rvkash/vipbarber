const express = require('express')
const nunjucks = require('nunjucks')
const routes = require('./routes')
const server = express()
server.use(routes)


server.use(express.urlencoded({ extended: true}))
server.use(express.static('public'))

server.set('view engine', 'html')

nunjucks.configure('src/views', {
  express: server,
  autoescape: false,
  noCache: true
})

server.listen(5001, function () {
    console.log('Server ta online')
  })