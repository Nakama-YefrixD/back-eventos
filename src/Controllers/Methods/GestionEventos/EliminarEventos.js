const controller = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

controller.MetEliminarEvento = async (req, res) => {

    const {
        req_id
    } = req.body;

    try{

        // Borrar las fechas y los ponentes de un evento
        await prisma.fechaseventos.deleteMany({
            where: {
                idevento : parseInt(req_id)
            }
        })

        await prisma.ponenteseventos.deleteMany({
            where: {
                idevento : parseInt(req_id)
            }
        })

        await prisma.eventosusuarios.deleteMany({
            where: {
                idevento : parseInt(req_id)
            }
        })

        await prisma.asistenciaseventos.deleteMany({
            where: {
                idevento : parseInt(req_id)
            }
        })
        

        await prisma.eventos.delete({
            where: {
                id: parseInt(req_id)
            }
        })

        res.status(200)
        return res.json({
            message : 'El evento fue eliminado correctamente',
            respuesta : true
        })

    }catch(error){
        console.log(error)
        res.status(500)
        return res.json({
            message : 'Lo sentimos hubo un error al momento de eliminar el evento',
            devmsg  : error,
            respuesta : false
        })
    } finally {
        prisma.$disconnect();
    }
}


module.exports = controller