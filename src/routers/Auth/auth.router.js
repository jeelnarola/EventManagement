const {Router} = require('express')
const {Register, Login, Logout} = require('../../controllers/Auth/auth.controller')

const AuthRouter = Router()

AuthRouter.post('/register',Register)
AuthRouter.post('/login',Login)
AuthRouter.post('/logout',Logout)
module.exports = AuthRouter