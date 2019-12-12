const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const app = express()

const cors = require('cors')
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const users = require('./Routes/Users')

app.use('/user/', users)

const db =
	'mongodb+srv://dareenattallah8:Dareen12345@infos-d6or9.mongodb.net/test?retryWrites=true&w=majority'

mongoose
	.connect(db, { useNewUrlParser: true })
	.then(() => console.log('Mongo connected 💃🏻💃🏻'))
	.catch(err => console.log(err))
// .then(() => mongoose.connection.db.dropDatabase())
// .then(() => console.log('Database Dropped'))

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server up and running on port ${port}.`))
