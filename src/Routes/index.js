const express = require('express')
const router = express.Router()

const CrearUsuario    = require('../Controllers/Methods/GestionUsuarios/CrearUsuarios')
const EditarUsuario   = require('../Controllers/Methods/GestionUsuarios/EditarUsuarios')
const EliminarUsuario = require('../Controllers/Methods/GestionUsuarios/EliminarUsuarios')
const MostrarUsuario  = require('../Controllers/Methods/GestionUsuarios/MostrarUsuarios')

const authMiddleware = require('../Middleware/authMiddleware')
const permissionMiddleware = require('../Middleware/permissionMiddleware')

const protectedRoutes = express.Router();
// protectedRoutes.use(authMiddleware);

protectedRoutes.post('/administrador/crear-usuario', CrearUsuario.MetCrearUsuario)
protectedRoutes.post('/administrador/editar-usuario', EditarUsuario.MetEditarUsuarios)
protectedRoutes.post('/administrador/eliminar-usuario', EliminarUsuario.MetEliminarUsuarios)
protectedRoutes.post('/administrador/mostrar-usuario', MostrarUsuario.MetMostrarUsuarios)

router.use('/protected', protectedRoutes);

module.exports = router