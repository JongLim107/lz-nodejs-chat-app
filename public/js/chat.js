// Client side script, which is running on browser
// const io = require('socket.io-client');
const socket = io()

// Elements
const $messageForm = document.querySelector('#message-form')
const $input = $messageForm.querySelector('input') // query by element type
const $sendButton = $messageForm.querySelector('button') // query by element type
const $shareLocation = document.querySelector('#share-location') // query by id
const $messageArea = document.querySelector('#messages-area')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createAt: moment(message.createdAt).format('h:mm a')
    })
    $messageArea.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (message) => {
    console.log(message)
    const html = Mustache.render(locationTemplate, {
        url: message.text,
        createAt: moment(message.createdAt).format('h:mm a')
    })
    $messageArea.insertAdjacentHTML('beforeend', html)
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $sendButton.setAttribute('disabled', 'disabled')

    // const message = e.target.elements.message.value
    const message = $input.value

    socket.emit('sendMessage', message, (error) => {
        $sendButton.removeAttribute('disabled')
        $input.value = ''
        $input.focus()

        if (error) {
            return console.log(error)
        }
    })
})

$shareLocation.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    $shareLocation.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $shareLocation.removeAttribute('disabled')
            console.log('Location shared!')
        })
    })
})

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})