const authService = require('./auth.service')
const userService = require('../user/user.service')
const logger = require('../../services/logger.service')
const req = require('express/lib/request')

async function login(req, res) {
    const { password, username } = req.body
    try {
        const user = await authService.login(username, password)
        req.session.user = user
        res.json(user)
    } catch (err) {
        logger.error('Failed to Login ' + err)
        res.status(401).send({ err: 'Failed to Login' })
    }
}

async function loginGoogle(req, res) {
    try {
        const { username, password, fullname, color, initials } = req.body
        const usernameToCheck = new RegExp(username, 'i')
        const userUsername = await userService.getByUsername(usernameToCheck)
        if (!userUsername) {
            const account = await authService.signup(username, password, fullname, color, initials)
            logger.debug(`auth.route - new account created: ` + JSON.stringify(account))
        }
        const user = await authService.login(username, password)
        res.json(user)
    } catch (err) {
        logger.error('Failed to signup ' + err)
        res.status(500).send({ err: 'Failed to signup' })
    }

}

async function signup(req, res) {
    try {
        const { username, password, fullname, color, initials } = req.body
        const usernameToCheck = new RegExp(username, 'i')
        const userUsername = await userService.getByUsername(usernameToCheck)
        if (userUsername) res.json('username is already exist')
        else {
            const account = await authService.signup(username, password, fullname, color, initials)
            logger.debug(`auth.route - new account created: ` + JSON.stringify(account))
            const user = await authService.login(username, password)
            res.json(user)
        }
    } catch (err) {
        logger.error('Failed to signup ' + err)
        res.status(500).send({ err: 'Failed to signup' })
    }
}

async function logout(req, res) {
    try {
        req.session.destroy()
        console.log('Logged Out successfully');
        res.send({ msg: 'Logged out successfully' })
    } catch (err) {
        res.status(500).send({ err: 'Failed to logout' })
    }
}

module.exports = {
    login,
    loginGoogle,
    signup,
    logout
}