const path = require('path')
const express = require('express')

const app = express()
const port = process.env.PORT || 3000

// To serve static files such as images, CSS files, and JavaScript files
// const publicDirectoryPath = path.join(__dirname, '../public')
// app.use(express.static(publicDirectoryPath))
app.use(express.static('public'))

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
