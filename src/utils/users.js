
const users = []

function addUser({ id, username, room }) {
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if (!username || !room)
        return { error: 'Username and room are required!' }

    const existUser = users.find(user => user.username === username && user.room === room)
    if (existUser) return { error: 'Username is in use!' }

    const user = { id, username, room }
    users.push(user)
    return { user }
}

function removeUser(id) {
    const idx = users.findIndex(it => it.id === id)
    if (idx != -1) {
        return users.splice(idx, 1)[0]
    }
}

function getUser(id) {
    return users.find(it => it.id === id)
}

function getUsersInRoom(room) {
    return users.filter(user => { user.room === room })
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}