const express = require('express')
const bcrypt = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')
const router = express.Router()
const User = require('../Models/User')
const userValidation = require('../Validations/userValidation')
const gradeValidation = require('../Validations/gradeValidation')

const { token, tokenLecturer, tokenLecturerTa } = require('../Middleware/auth')

router.post('/register', async (req, res) => {
	try {
		const validation = userValidation.createValidation(req.body)
		if (validation.error) {
			return res.json({
				msg: 'validation error',
				error: validation.error.message
			})
		}
		req.body.password = await bcrypt.hash(req.body.password, 10)
		const newUser = await User.create(req.body)
		delete newUser.password
		return res.json({ msg: 'Registration successfully', newUser })
	} catch (error) {
		console.log(error)
		return res.json({ msg: 'User could not be created', error: error })
	}
})

router.post('/login', async (req, res) => {
	try {
		const { username, password } = req.body
		const validation = userValidation.userLoginValidation(req.body)
		if (validation.error)
			return res.json({
				msg: 'Validation Faild',
				error: validation.error.message
			})
		const find = await User.findOne({ username: username })
		if (find) {
			const decrptedPassword = await bcrypt.compare(password, find.password)
			if (decrptedPassword) {
				const { _id, typeOfUser } = find
				const tokenExpireIn = Math.floor(Date.now() / 1000) + 1800
				const webToken = jsonwebtoken.sign({ _id, typeOfUser, exp: tokenExpireIn }, 'InfoS')
				return res.json({
					msg: 'Successful Login',
					data: {
						webToken
					}
				})
			} else {
				return res.json({ msg: 'Invalid Credentials', error: error })
			}
		} else {
			return res.json({ msg: 'Invalid Credentials', error: error })
		}
	} catch (error) {
		return res.json({ msg: 'Unkown Error', error: error })
	}
})

router.post('/viewAllUsers', async (req, res) => {
	try {
		const allUsers = await User.find().select('username fullName typeOfUser grades')
		return res.json({ msg: 'Users Found', data: allUsers })
	} catch (error) {
		return res.status(500).send({ error: 'No users found' })
	}
})

router.post('/viewUserById', tokenLecturerTa, async (req, res) => {
	try {
		const id = req.body.id
		const user = await User.findById(id).select('username fullName typeOfUser')
		return res.json({ msg: 'User Found', data: user })
	} catch (error) {
		return res.status(500).send({ error: 'User not found' })
	}
})

router.post('/viewMyProfile', token, async (req, res) => {
	try {
		const id = req.token.id
		const user = await User.findById(id).select('username fullName typeOfUser grades')
		return res.json({ msg: 'Your Profile', data: user })
	} catch (error) {
		return res.status(500).send({ error: 'User not found' })
	}
})

router.post('/deleteUser', tokenLecturerTa, async (req, res) => {
	try {
		const id = req.body.id
		await User.findByIdAndDelete(id)
		return res.json({ msg: 'Deleted successfully' })
	} catch (error) {
		return res.status(500).send({ error: 'No users with such Id found' })
	}
})

router.post('/viewStudents', tokenLecturerTa, async (req, res) => {
	try {
		const allStudents = await User.find({ typeOfUser: 'Student' }).select('username fullName typeOfUser')
		return res.json({ msg: 'Students Found', data: allStudents })
	} catch (error) {
		return res.status(500).send({ error: 'No students found' })
	}
})

router.post('/viewLecturers', token, async (req, res) => {
	try {
		const allLecturers = await User.find({ typeOfUser: 'Lecturer' }).select('username fullName typeOfUser grades')
		return res.json({ msg: 'Students Found', data: allLecturers })
	} catch (error) {
		return res.status(500).send({ error: 'No lecturers found' })
	}
})

router.post('/viewTeacherAssistants', token, async (req, res) => {
	try {
		const allTeacherAssistants = await User.find({
			typeOfUser: 'Teacher Assistant'
		}).select('username fullName typeOfUser')
		return res.json({
			msg: 'Teaching Assistans Found',
			data: allTeacherAssistants
		})
	} catch (error) {
		return res.status(500).send({ error: 'No Teacher Assistants found' })
	}
})

router.post('/addGrade', tokenLecturer, async (req, res) => {
	try {
		const validation = gradeValidation.createValidation(req.body)
		if (validation.error) {
			return res.json({
				msg: 'validation error',
				error: validation.error.message
			})
		}
		await User.updateOne(
			{ _id: req.body.student },
			{
				$push: {
					grades: {
						percentage: req.body.percentage,
						nameOfSubject: req.body.nameOfSubject
					}
				}
			}
		)
		const user = await User.findById(req.body.student).select('_id username fullName typeOfUser grades')
		return res.json({ msg: 'Grade Added Sucessfully', data: user })
	} catch (error) {
		return res.json({ error: error })
	}
})

router.post('/updateGrade', tokenLecturer, async (req, res) => {
	try {
		const validation = gradeValidation.updateValidation(req.body)
		if (validation.error) {
			return res.json({
				msg: 'validation error',
				error: validation.error.message
			})
		}
		await User.update(
			{ 'grades._id': req.body.grade },
			{
				$set: {
					'grades.$.percentage': req.body.percentage,
					'grades.$.nameOfSubject': req.body.nameOfSubject
				}
			}
		)
		const user = await User.find({ 'grades._id': req.body.grade }).select('_id username fullName typeOfUser grades')
		return res.json({ msg: 'Grade Updated Sucessfully', data: user })
	} catch (error) {
		return res.json({ error: error })
	}
})

router.post('/findByNameGrade', tokenLecturerTa, async (req, res) => {
	try {
		const user = await User.find({
			'grades.nameOfSubject': req.body.nameOfSubject
		}).select('_id username fullName typeOfUser grades')
		return res.json({ msg: 'Grades Found Sucessfully', data: user })
	} catch (error) {
		return res.json({ error: error })
	}
})
router.post('/findByIdGrade', tokenLecturerTa, async (req, res) => {
	try {
		const user = await User.find({
			'grades._id': req.body.grade
		}).select('_id username fullName typeOfUser grades')
		return res.json({ msg: 'Grade Found Sucessfully', data: user })
	} catch (error) {
		return res.json({ error: error })
	}
})
router.post('/findAllGrades', tokenLecturerTa, async (req, res) => {
	try {
		const user = await User.find({
			typeOfUser: 'Student'
		}).select('_id username fullName typeOfUser grades')
		return res.json({ msg: 'All Grades Found Sucessfully', data: user })
	} catch (error) {
		return res.json({ error: error })
	}
})
module.exports = router
