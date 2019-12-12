const jwt = require('jsonwebtoken')

module.exports = {
	token: async (req, res, next) => {
		try {
			const decoded = await jwt.verify(
				req.headers.authorization.split(' ')[1],
				'InfoS'
			)
			if (decoded) {
				req.token = {
					id: decoded._id,
					type: decoded.typeOfUser
				}
			}
			return next()
		} catch (exception) {
			return res.json({ msg: 'Please Log in' })
		}
	},
	tokenLecturerTa: async (req, res, next) => {
		try {
			const decoded = await jwt.verify(
				req.headers.authorization.split(' ')[1],
				'InfoS'
			)
			if (decoded) {
				req.token = {
					id: decoded._id,
					type: decoded.typeOfUser
				}
			}
			if (
				decoded.typeOfUser === 'Teaching Assistant' ||
				decoded.typeOfUser === 'Lecturer'
			)
				return next()
			else
				return res.json({ msg: 'You are not a Lecturer or Teaching Assistant' })
		} catch (exception) {
			return res.json({ msg: 'Please Log in' })
		}
	},
	tokenLecturer: async (req, res, next) => {
		try {
			const decoded = await jwt.verify(
				req.headers.authorization.split(' ')[1],
				'InfoS'
			)
			if (decoded) {
				req.token = {
					id: decoded._id,
					type: decoded.typeOfUser
				}
			}
			if (decoded.typeOfUser === 'Lecturer') return next()
			else return res.json({ msg: 'You are not a Lecturer' })
		} catch (exception) {
			return res.json({ msg: 'Please Log in' })
		}
	}
}
