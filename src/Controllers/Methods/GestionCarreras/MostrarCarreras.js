const controller = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

controller.MetMostrarCarreras = async (req, res) => {

    const {
        
    } = req.body;

    try{

        let carreras = []

        carreras = await prisma.carreras.findMany({})

        carreras.map((carrera, pos) => {
            carreras[pos]['item'] = parseInt(pos) + 1
        })

        res.status(200)
        return res.json({
            message : 'Carreras obtenidos correctamente',
            data    : carreras,
            respuesta : true
        })

    }catch(error){
        console.log(error)
        res.status(500)
        return res.json({
            message : 'Lo sentimos hubo un error al momento de mostrar las carreras',
            devmsg  : error,
            respuesta : false
        })
    }
}


module.exports = controller