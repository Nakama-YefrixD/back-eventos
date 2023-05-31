const controller = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcryptjs = require('bcryptjs')

controller.MetEditarUsuarios = async (req, res) => {

    const {
        req_usuid,
        req_tpuid,
        req_tipo_documento_identididad,
        req_numero_dni,
        req_codigo_ucs,
        req_correo,
        req_fecha_nacimiento,
        req_celular,
        req_rol,
        req_nombre,
        req_apell_paterno,
        req_apell_materno,
        req_estado,
        req_contrasenia
    } = req.body;

    try{

        const usu = await prisma.usuusuarios.findFirst({
            where: {
                usuid : req_usuid
            }
        })

        if(!usu){
            res.status(500)
            return res.json({
                message : 'Lo sentimos, el usuario seleccionado no existe.',
                response : false
            })
        }
        
        await prisma.usuusuarios.update({
            where: {
                usuid : req_usuid,
            },
            data: {
                tpuid : parseInt(req_tpuid),
                usutipo_documento_identidad : req_tipo_documento_identididad,
                usunumero_dni : req_numero_dni,
                usucodigo_ucs : req_codigo_ucs,
                usuusuario : req_correo,
                usunombre  : req_nombre,
                usufecha_nacimiento : req_fecha_nacimiento,
                usuapell_paterno : req_apell_paterno,
                usucelular : req_celular,
                usuapell_materno : req_apell_materno,
                usurol    : req_rol,
                usuestado : req_estado,
                usucontrasena : req_contrasenia == "***********" ?usu.usucontrasena :bcryptjs.hashSync(req_contrasenia, 8),
            }
        })

        res.status(200)
        res.json({
            message : 'El usuarios fue editado correctamente',
            respuesta : true
        })

    }catch(error){
        console.log(error)
        res.status(500)
        res.json({
            message : 'Lo sentimos hubo un error al momento de editar los usuarios',
            devmsg  : error,
            respuesta : false
        })
    }
}


module.exports = controller