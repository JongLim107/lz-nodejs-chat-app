// Client side script, which is running on browser
// const io = require('socket.io-client');
const socket = io()
socket.on('broadcast', (message) => {
    console.log('Receive', message)
})

const $messageForm = document.querySelector('#message-form')
const $input = document.querySelector('input') // query by element type
const $sendButton = document.querySelector('#send-button') // query by id
const $shareLocation = document.querySelector('#share-location') // query by id

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const msg = $input.value// e.target.elements['message-input'].value
    $sendButton.setAttribute('disabled', 'disabled')
    socket.emit('message', msg, (error) => {
        $sendButton.removeAttribute('disabled')
        $input.value = ''
        $input.focus()
        if (error) {
            return console.log('Callback', error)
        }
        console.log('Message deliveried')
    })
})

$shareLocation.addEventListener('click', () => {
    $shareLocation.setAttribute('disabled', 'disabled')
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser!')
    }
    navigator.geolocation.getCurrentPosition((position) => {
        const coords = position.coords
        $shareLocation.removeAttribute('disabled')
        socket.emit('shareLocation', { lat: coords.latitude, log: coords.longitude })
    })
    // socket.emit('message', navigator.geolocation)
})
