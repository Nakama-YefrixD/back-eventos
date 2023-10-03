const controller = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

controller.MetMostrarAsistencias = async (req, res) => {

    const {
        req_evento,
        req_fecha_evento
    } = req.body;

    try{

        let asistencias_eventos = await prisma.asistenciaseventos.findMany({
            where: {
                id_fec_event : req_fecha_evento.id
            },
            include: {
                eventos : true,
                usuusuarios : true,
                fechaseventos : true
            }
        })

        asistencias_eventos.map((fevento, pos) => {
            asistencias_eventos[pos]['item'] = parseInt(pos)+1
        })        

        res.status(200)
        return res.json({
            message : 'Fechas obtenidas correctamente',
            data    : asistencias_eventos,
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