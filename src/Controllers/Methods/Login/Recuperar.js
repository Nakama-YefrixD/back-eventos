const controller = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcryptjs = require('bcryptjs')
const crypto = require('crypto')

controller.MetCambiarContrasenia = async (req, res) => {

    const {
        req_token,
        req_nuevacontrasenia
    } = req.body;

    try{

        const user = await prisma.usuusuarios.findFirst({
            where: {
                usutoken : req_token
            }
        })
        
        if(!user){
            res.status(500)
            return res.json({
                respuesta: false,
                message: 'Lo sentimos, el token ha expirado'
            })
        }

        const token_user = crypto.randomBytes(30).toString('hex')

        await prisma.usuusuarios.update({
            where: {
                usuid : user.usuid
            },
            data: {
                // usutoken : token_user,
                usucontrasena : bcryptjs.hashSync(req_nuevacontrasenia, 8)
            }
        })

        return res.status(200).json({
            "respuesta" : true,
            "message" : "La contraseña se ha actualizado correctamente"
        })

    }catch(error){
        console.log(error)
        res.status(500)
        return res.json({
            message : 'Lo sentimos hubo un error al momento de recuperar tu usuario',
            devmsg  : error,
            respuesta : false
        })
    }
}


module.exports = controller