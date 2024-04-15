const controller = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

controller.MetMostrarFechasEventos = async (req, res) => {

    const {
        req_evento
    } = req.body;

    try{

        let fechas_eventos = await prisma.fechaseventos.findMany({
            where: {
                idevento : req_evento.idevento
            },
            include: {
                eventos : true
            }
        })
        
        fechas_eventos.map((fevento, pos) => {
            fechas_eventos[pos]['item'] = parseInt(pos)+1
        })

        res.status(200)
        return res.json({
            message : 'Fechas obtenidas correctamente',
            data    : fechas_eventos,
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