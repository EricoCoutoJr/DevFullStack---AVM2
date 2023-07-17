const { createOneUser, loginUser, updateUser, updateUserState, changePassword, listUser } = require('../controllers/users.controller')
const { Router } = require('express')
const { auth } = require('../middleware/auth')

class UserRouter{
    routesFromUser () {
        const userRoutes  = Router()
        userRoutes.post('/usuarios', createOneUser)
        userRoutes.post('/usuarios/login', loginUser)
        userRoutes.patch('/usuarios/:id', auth, updateUser )
        userRoutes.patch('/usuarios/:id/status', auth, updateUserState)
        userRoutes.patch('/usuarios/:id/password', auth, changePassword)
        userRoutes.get('/usuarios/:id', auth, listUser)
        return userRoutes
    }
}

module.exports = new UserRouter()