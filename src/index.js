const path = require('path')
const express = require('express')
const Filter = require('bad-words')
const { generateMessage } = require('./utils/message')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

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

function onJoiningRoom(socket) {
    socket.on('join', (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options })

        if (error) return callback(error)

        socket.join(user.room)
        socket.emit('message', generateMessage('Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined!`))
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) })
        // socket.emit, io.emit, socket.broadcast.emit
        // io.to.emit, socket.broadcast.to.emit
    })
}

function onSendMessage(socket) {
    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()
        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }

        const user = getUser(socket.id)
        io.to(user.room).emit('message', generateMessage(message, user.username))
        callback()
    })
}

function onSendLocation(socket) {
    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`, user.username))
        callback()
    })
}

function onDisconnect(socket) {
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('message', generateMessage(`${user.username} has left!`))
            io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) })
        }
    })
}

io.on('connection', (socket) => {
    console.log('New connection', socket.id)
    onJoiningRoom(socket)
    onSendMessage(socket)
    onSendLocation(socket)
    onDisconnect(socket)
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})