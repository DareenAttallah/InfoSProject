const BaseJoi = require('joi')
const Extension = require('joi-date-extensions')
const Joi = BaseJoi.extend(Extension)

module.exports = {
	createValidation: request => {
		const createGrade = {
			nameOfSubject: Joi.string().required(),
			percentage: Joi.alternatives()
				.try([
					Joi.number()
						.empty('')
						.allow(null),
					Joi.string().regex(/\d{1,2}[\,\.]{1}/)
				])
				.required(),
			student: Joi.string().required()
		}
		return Joi.validate(request, createGrade)
	},
	updateValidation: request => {
		const updateGrade = {
			nameOfSubject: Joi.string().required(),
			percentage: Joi.alternatives()
				.try([
					Joi.number()
						.empty('')
						.allow(null),
					Joi.string().regex(/\d{1,2}[\,\.]{1}/)
				])
				.required(),
			grade: Joi.string().required()
		}
		return Joi.validate(request, updateGrade)
	}
}
