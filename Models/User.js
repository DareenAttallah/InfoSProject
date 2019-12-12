const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
	username: {
		type: String,
		unique: true
	},
	password: {
		type: String
	},
	fullName: {
		type: String
	},
	typeOfUser: {
		type: String
	},
	grades: [
		{
			nameOfSubject: {
				type: String
			},
			percentage: {
				type: String
			}
		}
	]
})

module.exports = User = mongoose.model('users', userSchema)
