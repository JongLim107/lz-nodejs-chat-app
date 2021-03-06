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
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const atuoScroll = () => {
    // New message element
    const $newMessage = $messageArea.lastElementChild

    //Height of the new message
    const newMessageStyle = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyle.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messageArea.offsetHeight

    // Height of message container
    const containerHeight = $messageArea.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messageArea.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messageArea.scrollTop = $messageArea.scrollHeight
    }

    // console.log(visibleHeight, containerHeight, $messageArea.scrollTop, scrollOffset)
}

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        ...message,
        message: message.text
    })
    $messageArea.insertAdjacentHTML('beforeend', html)
    atuoScroll()
})

socket.on('locationMessage', (message) => {
    console.log(message)
    const html = Mustache.render(locationTemplate, {
        ...message,
        url: message.text
    })
    $messageArea.insertAdjacentHTML('beforeend', html)
    atuoScroll()
})

socket.on('roomData', (data) => {
    console.log(data.room, data.users)
    const html = Mustache.render(sidebarTemplate, data)
    document.querySelector('#sidebar').innerHTML = html
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