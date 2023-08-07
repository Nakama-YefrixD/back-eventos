const controller = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcryptjs = require('bcryptjs')
const crypto = require('crypto')

controller.MetCrearUsuario = async (req, res) => {

    const {
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
        req_contrasenia
    } = req.body;

    try{
        
        const token_user = crypto.randomBytes(30).toString('hex')

        const usu = await prisma.usuusuarios.findFirst({
            where: {
                usuusuario : req_correo
            }
        })

        if(usu){
            res.status(500)
            return res.json({
                message : 'Lo sentimos, el correo digitado ya existe.',
                respuesta : false
            })
        }

        await prisma.usuusuarios.create({
            data: {
                tpuid : parseInt(req_tpuid),
                usutipo_documento_identidad : req_tipo_documento_identididad,
                usunumero_dni : req_numero_dni,
                usucodigo_ucs : req_codigo_ucs,
                usuusuario : req_correo,
                usunombre : req_nombre,
                usufecha_nacimiento : req_fecha_nacimiento,
                usuapell_paterno : req_apell_paterno,
                usucelular : req_celular,
                usuapell_materno : req_apell_materno,
                usurol : req_rol,
                usutoken : token_user,
                usucontrasena : bcryptjs.hashSync(req_contrasenia, 8),
            }
        })

        res.status(200)
        return res.json({
            message : 'El usuario fue creado correctamente',
            respuesta : true
        })

    }catch(error){
        console.log(error)
        res.status(500)
        return res.json({
            message : 'Lo sentimos hubo un error al momento de crear los usuarios',
            devmsg  : error,
            respuesta : false
        })
    } finally {
        prisma.$disconnect();
    }
}


module.exports = controller