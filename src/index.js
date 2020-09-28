const path = require('path')
const express = require('express')

const app = express()
const port = process.env.PORT || 3000

// Created server outside of the Express library we're creating it ourself
const http = require('http')
const server = http.createServer(app)

// Create a new instance of socket.io to configure web sockets to work with our server.
const socketio = require('socket.io')
const io = socketio(server)

// To serve static files such as images, CSS files, and JavaScript files
// const publicDirectoryPath = path.join(__dirname, '../public')
// app.use(express.static(publicDirectoryPath))
app.use(express.static('public'))

io.on('connection', (socket) => {
    console.log('New WebSicket connection')
})

server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
