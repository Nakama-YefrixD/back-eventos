const controller = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcryptjs = require('bcryptjs')

controller.MetLogin = async (req, res) => {

    const {
        req_usucorreo,
        req_usucontrasenia
    } = req.body;

    try{

        const user = await prisma.usuusuarios.findFirst({
            where: {
                usuusuario : req_usucorreo
            },
        });

        if(!user){
            res.status(500)
            return res.json({
                respuesta: false,
                message: 'Usuario no encontrado'
            })
        }else{

            const checkPassword = bcryptjs.compareSync(req_usucontrasenia, user.usucontrasena)

            if(checkPassword){
                
                let nombreCompleto = user.usunombre+" "+user.usuapell_paterno+" "+user.usuapell_materno

                res.status(200)
                return res.json({
                    respuesta:true,
                    message: 'Usuario logeado con éxito',
                    user : user,
                    nombre: nombreCompleto
                })
            }else{
                return res.json({
                    respuesta: false,
                    message: 'Usuario o Contraseña Incorrecta'
                })
            }
        }

    }catch(error){
        console.log(error)
        res.status(500)
        return res.json({
            message : 'Lo sentimos hubo un error al momento de logear el usuario',
            devmsg  : error,
            respuesta : false
        })
    } finally {
        prisma.$disconnect();
    }
}


module.exports = controller