const express = require('express')
const router = express.Router()

const CrearUsuario    = require('../Controllers/Methods/GestionUsuarios/CrearUsuarios')
const EditarUsuario   = require('../Controllers/Methods/GestionUsuarios/EditarUsuarios')
const EliminarUsuario = require('../Controllers/Methods/GestionUsuarios/EliminarUsuarios')
const MostrarUsuario  = require('../Controllers/Methods/GestionUsuarios/MostrarUsuarios')

// // // // // // //  //  
// GESTION DE EVENTOS // 
// // // // // // //  // 

const CrearEvento    = require('../Controllers/Methods/GestionEventos/CrearEventos')
const EditarEvento   = require('../Controllers/Methods/GestionEventos/EditarEventos')
const EliminarEvento = require('../Controllers/Methods/GestionEventos/EliminarEventos')
const MostrarEvento  = require('../Controllers/Methods/GestionEventos/MostrarEventos')
const MostrarFechasEventos  = require('../Controllers/Methods/GestionEventos/MostrarFechas')
const MostrarPonentesEventos  = require('../Controllers/Methods/GestionEventos/MostrarPonentes')

// // // // // // //  //  
// GESTION DE CARRERAS // 
// // // // // // //  // 

const MostrarCarreras  = require('../Controllers/Methods/GestionCarreras/MostrarCarreras')
const CrearCarrera  = require('../Controllers/Methods/GestionCarreras/CrearCarrera')
const EditarCarrera  = require('../Controllers/Methods/GestionCarreras/EditarCarrera')
const EliminarCarrera  = require('../Controllers/Methods/GestionCarreras/EliminarCarrera')

// // // // // // //
// CARGA MASIVA     
// // // // // // //
const CargaMasiva  = require('../Controllers/Methods/GestionCargaMasiva/CargaMasivaEstudiantes')


const authMiddleware = require('../Middleware/authMiddleware')
const permissionMiddleware = require('../Middleware/permissionMiddleware')

const protectedRoutes = express.Router();
// protectedRoutes.use(authMiddleware);

protectedRoutes.post('/administrador/crear-usuario', CrearUsuario.MetCrearUsuario)
protectedRoutes.post('/administrador/editar-usuario', EditarUsuario.MetEditarUsuarios)
protectedRoutes.post('/administrador/eliminar-usuario', EliminarUsuario.MetEliminarUsuarios)
protectedRoutes.post('/administrador/mostrar-usuario', MostrarUsuario.MetMostrarUsuarios)


// // // // // // //  //  
// GESTION DE EVENTOS // 
// // // // // // //  // 

protectedRoutes.post('/administrador/crear-evento', CrearEvento.MetCrearEvento )
protectedRoutes.post('/administrador/editar-evento', EditarEvento.MetEditarEvento )
protectedRoutes.post('/administrador/eliminar-evento', EliminarEvento.MetEliminarEvento )
protectedRoutes.post('/administrador/mostrar-eventos', MostrarEvento.MetMostrarEventos )
protectedRoutes.post('/administrador/mostrar-fechas-eventos', MostrarFechasEventos.MetMostrarFechasEventos )
protectedRoutes.post('/administrador/mostrar-ponentes-eventos', MostrarPonentesEventos.MetMostrarPonentesEvento )

// // // // // // //  //  
// GESTION DE CARRERAS // 
// // // // // // //  // 
protectedRoutes.post('/administrador/mostrar-carreras', MostrarCarreras.MetMostrarCarreras )
protectedRoutes.post('/administrador/editar-carrera', EditarCarrera.MetEditarCarrera )
protectedRoutes.post('/administrador/eliminar-carrera', EliminarCarrera.MetEliminarCarrera )
protectedRoutes.post('/administrador/crear-carrera', CrearCarrera.MetCrearCarrera )


// // // // // // //
// CARGA MASIVA     
// // // // // // //
protectedRoutes.post('/carga-masiva/usuarios-estudiantes', CargaMasiva.MetCargaMasivaEstudiantes )



router.use('/protected', protectedRoutes);

module.exports = router