const express = require('express');
const UserController = require('../controllers/UserController');
const validarUsuarios = require('../middleware/validations/usuarios');

const router = express.Router();

router.post('/usuarios', validarUsuarios, UserController.create);
router.post('/login', UserController.login);
router.get('/usuarios', UserController.getAll);

module.exports = router;