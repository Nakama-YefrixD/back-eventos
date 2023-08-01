const controller = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

controller.MetMostrarEventosDisponibles = async (req, res) => {

    const {
        
    } = req.body;

    try{

        let eventos = []
        eventos = await prisma.eventos.findMany({
            where: {
                estado : true
            }
        })

        res.status(200)
        return res.json({
            message : 'Eventos obtenidos correctamente',
            data    : eventos,
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
    }
}


module.exports = controller