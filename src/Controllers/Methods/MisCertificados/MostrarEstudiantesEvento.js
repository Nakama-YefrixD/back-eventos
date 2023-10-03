const controller = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

controller.MetMostrarEstudiantesEvento = async (req, res) => {

    const {
        req_evento
    } = req.body;

    try{

        let eventos_usuarios = await prisma.eventosusuarios.findMany({
            where : {
                idevento : req_evento.id
            }
        })

        res.status(200)
        return res.json({
            message : 'Usuarios del evento obtenidas correctamente',
            data    : eventos_usuarios,
            respuesta : true
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