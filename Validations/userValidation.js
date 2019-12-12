const BaseJoi = require('joi')
const Extension = require('joi-date-extensions')
const Joi = BaseJoi.extend(Extension)

module.exports = {
	createValidation: request => {
		const createUser = {
			username: Joi.string()
				.min(3)
				.max(20)
				.required(),
			password: Joi.string()
				.min(3)
				.max(100)
				.required(),
			fullName: Joi.string()
				.min(3)
				.max(200)
				.required(),
			typeOfUser: Joi.string()
				.valid(['Lecturer', 'Student', 'TeacherAssistant'])
				.required()
		}
		return Joi.validate(request, createUser)
	},
	updateValidation: request => {
		const updateUser = {
			email: Joi.string().email(),
			password: Joi.string()
				.min(3)
				.max(100),
			fullName: Joi.string()
				.min(3)
				.max(200),
			typeOfUser: Joi.string().valid(['Lecturer', 'Student', 'TeacherAssistant'])
		}
		return Joi.validate(request, updateUser)
	},
	userLoginValidation: request => {
		const loginUser = {
			username: Joi.string()
				.min(3)
				.max(20)
				.required(),
			password: Joi.string()
				.min(3)
				.max(100)
		}
		return Joi.validate(request, loginUser)
	}
}
