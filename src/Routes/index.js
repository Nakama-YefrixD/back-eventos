const express = require('express')
const router = express.Router()
const multer = require('multer');
const path = require('path');

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

// // // // // // // // // //
// EVENTOS DISPONIBLES // //
// // // // // // // // // //
const MostrarEventosDisponibles  = require('../Controllers/Methods/EventosDisponibles/MostrarEventosDisponibles')
const InscribirmeEvento  = require('../Controllers/Methods/EventosDisponibles/InscribirEventoDisponible')

// // // // // // // // // //
// MIS CERTIFICADOS // //
// // // // // // // // // //
const MisCertificados = require('../Controllers/Methods/MisCertificados/MisCertificados')

// // // // // // // // // //
// EVENTOS REALIZADOS // //
// // // // // // // // // //
const EventosRealizados = require('../Controllers/Methods/EventosRealizados/EventosRealizados')

// // // // // // // // // //
// EVENTOS INSCRITOS // //
// // // // // // // // // //
const EventosInscritos = require('../Controllers/Methods/EventosInscritos/EventosInscritos')

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

// // // // // 
// LOGIN // // 
// // // // // 
const Login = require('../Controllers/Methods/Login/Login')

// // // // // // // // //
// RECUPERAR CONTRASEÑA //
// // // // // // // // //
const RecuperarContrasenia = require('../Controllers/Methods/Login/EnviarRecuperar')


// // // // // //
// HOME EVENTOS //
// // // // // // 
const Home = require('../Controllers/Methods/Home/Home')

const authMiddleware = require('../Middleware/authMiddleware')
const permissionMiddleware = require('../Middleware/permissionMiddleware')
const CambiarContrasenia = require('../Controllers/Methods/Login/Recuperar')

const protectedRoutes = express.Router();
const publicRoutes = express.Router();
// protectedRoutes.use(authMiddleware);

protectedRoutes.post('/administrador/crear-usuario', CrearUsuario.MetCrearUsuario)
protectedRoutes.post('/administrador/editar-usuario', EditarUsuario.MetEditarUsuarios)
protectedRoutes.post('/administrador/eliminar-usuario', EliminarUsuario.MetEliminarUsuarios)
protectedRoutes.post('/administrador/mostrar-usuario', MostrarUsuario.MetMostrarUsuarios)


// // // // // // //  //  
// GESTION DE EVENTOS // 
// // // // // // //  // 

protectedRoutes.post('/administrador/editar-evento', EditarEvento.MetEditarEvento )
protectedRoutes.post('/administrador/eliminar-evento', EliminarEvento.MetEliminarEvento )
protectedRoutes.post('/administrador/mostrar-eventos', MostrarEvento.MetMostrarEventos )
protectedRoutes.post('/administrador/mostrar-fechas-eventos', MostrarFechasEventos.MetMostrarFechasEventos )
protectedRoutes.post('/administrador/mostrar-ponentes-eventos', MostrarPonentesEventos.MetMostrarPonentesEvento )


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Aquí especificas la carpeta donde deseas almacenar los archivos dentro de la API
        const destinationFolder = path.join(__dirname, 'carpeta_especifica');
        cb(null, destinationFolder);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

protectedRoutes.post('/administrador/crear-evento', (req, res) => {
    return CrearEvento.MetCrearEvento(req, res)
})



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


// // // // // 
// LOGIN // // 
// // // // // 
protectedRoutes.post('/login', Login.MetLogin )


// // // // // // // // //
// RECUPERAR CONTRASEÑA //
// // // // // // // // //
protectedRoutes.post('/recuperar-contrasenia', RecuperarContrasenia.MetRecuperar ) // Envia el correo
protectedRoutes.post('/cambiar-contrasenia', CambiarContrasenia.MetCambiarContrasenia ) // Cambia la contraseña

// // // // // //
// HOME EVENTOS //
// // // // // // 
protectedRoutes.post('/home-eventos', Home.MetEventosHome )


// // // // // // // // // //
// EVENTOS DISPONIBLES // //
// // // // // // // // // //
protectedRoutes.post('/mostrar-eventos-disponibles', MostrarEventosDisponibles.MetMostrarEventosDisponibles )
protectedRoutes.post('/inscribir-usuario-evento', InscribirmeEvento.MetInscribirEvento )

// // // // // // // // // //
// MIS CERTIFICADOS // //
// // // // // // // // // //
protectedRoutes.post('/mostrar-mis-certificados', MisCertificados.MetMostrarMisCertificados )

// // // // // // // // // //
// EVENTOS REALIZADOS // //
// // // // // // // // // //
protectedRoutes.post('/mostrar-eventos-realizados', EventosRealizados.MetEventosRealizados )

// // // // // // // // // //
// EVENTOS INSCRITOS // //
// // // // // // // // // //
protectedRoutes.post('/mostrar-eventos-inscritos', EventosInscritos.MetEventosInscritos )


// // // // // // // // // //
// MOSTRAR ARCHIVOS // //
// // // // // // // // // //
publicRoutes.get('/mostrar-flyter-evento/:file', (req, res) => {
    const {
        file
    } = req.params

    const filePath = path.join(__dirname, '../public/eventos/flyer/'+file);
    res.sendFile(filePath);
});

router.use('/public', publicRoutes);
router.use('/protected', protectedRoutes);

module.exports = router