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
    
    // Send data to client
    socket.emit('broadcast', 'Welcome!')
    
    socket.broadcast.emit('broadcast', 'A new user has joined!')
    
    socket.on('message', (message) => {
        // socket.emit('message', message) // to specific client
        io.emit('broadcast', message) // to every client
    })
    
    socket.on('shareLocation', (coord) => {
        io.emit('broadcast', `http://google.com/maps?q=${coord.lat},${coord.log}`)
    })

    socket.on('disconnect', (socket) => {
        io.emit('broadcast', 'A user has left!')
    })
})

server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
