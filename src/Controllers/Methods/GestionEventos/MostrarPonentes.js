const controller = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

controller.MetMostrarPonentesEvento = async (req, res) => {

    const {
        req_evento
    } = req.body;

    try{

        let ponentes_evento = await prisma.ponenteseventos.findMany({
            where: {
                idevento : req_evento.id
            }
        })
        
        ponentes_evento.map((pevento, pos) => {
            ponentes_evento[pos]['item'] = parseInt(pos)+1
        })

        res.status(200)
        return res.json({
            message : 'Fechas obtenidas correctamente',
            data    : ponentes_evento,
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