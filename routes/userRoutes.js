const express = require('express')

const router = express.Router()

const userController = require('../controllers/userController')
const authController = require('../controllers/authController')

const { route } = require('./tourRoutes')

router.post('/signup',authController.signup)
router.post('/login',authController.login)

router
  .route('/')
  .get(authController.protect,userController.getAllUsers)
  .post(userController.createUser)


router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUSer)

module.exports = router