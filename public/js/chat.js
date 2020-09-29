// Client side script, which is running on browser
// const io = require('socket.io-client');
const socket = io()

const $messageForm = document.querySelector('#message-form')
const $input = document.querySelector('input') // query by element type
const $sendButton = document.querySelector('#send-button') // query by id
const $shareLocation = document.querySelector('#share-location') // query by id
const $messageArea = document.querySelector('#message-area')

const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML

socket.on('broadcast', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        time: moment(message.createAt).format('h:mm A')
    })
    $messageArea.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (message) => {
    const html = Mustache.render(locationTemplate, {
        url: message.text,
        time: moment(message.createAt).format('h:mm A')
    })
    $messageArea.insertAdjacentHTML('beforeend', html)
})

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
        socket.emit('shareLocation', {
            lat: coords.latitude,
            log: coords.longitude
        }, (error) => {
            $shareLocation.removeAttribute('disabled')
            if (error) {
                return console.log('Callback', error)
            }
        })
    })
    // socket.emit('message', navigator.geolocation)
})
