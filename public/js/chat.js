// Client side script, which is running on browser
// const io = require('socket.io')
const socket = io()

socket.on('broadcast', (message) => {
    console.log(message)
})

const typein = document.querySelector('input') // query by element type
const shareLocation = document.querySelector('#share-location') // query by id

document.querySelector('#message-form').addEventListener('submit', (e) => {
    console.log('Click on send', typein.value)
    e.preventDefault()
    socket.emit('message', e.target.elements.typein.value)
})

shareLocation.addEventListener('click', () => {
    console.log('Click on shareLocation')
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser!')
    }
    navigator.geolocation.getCurrentPosition((position) => {
        const coords = position.coords
        // console.log(position.coords)
        socket.emit('shareLocation', { lat: coords.latitude, log: coords.longitude })
    })
    // socket.emit('message', navigator.geolocation)
})
