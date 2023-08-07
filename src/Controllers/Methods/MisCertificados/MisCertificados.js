const controller = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

controller.MetMostrarMisCertificados = async (req, res) => {

    const {
        req_usutoken
    } = req.body;

    try{

        let certificados_usuarios = []
        let respuesta = true
        let mensaje = "Los certificados fueron obtenidos correctamente"

        const usuusuario = await prisma.usuusuarios.findFirst({
            where:{
                usutoken : req_usutoken
            }
        })

        if(usuusuario){
            certificados_usuarios = await prisma.eventosusuarios.findMany({
                where: {
                    usuid : usuusuario.usuid
                },
                include: {
                    eventos: true
                }
            })
        }else{
            respuesta = true
            mensaje = "Lo sentimos el usuario no se encontro"
        }

        res.status(200)
        return res.json({
            message   : mensaje,
            data      : certificados_usuarios,
            respuesta : respuesta
        })

    }catch(error){
        console.log(error)
        res.status(500)
        return res.json({
            message : 'Lo sentimos hubo un error al momento de mostrar los eventos',
            devmsg  : error,
            respuesta : false
        })
    } finally {
        prisma.$disconnect();
    }
}


module.exports = controller