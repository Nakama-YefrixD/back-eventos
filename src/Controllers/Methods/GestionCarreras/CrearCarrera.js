const controller = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

controller.MetCrearCarrera = async (req, res) => {

    const {
        req_nombre_carrera
    } = req.body;

    try{ 

        await prisma.carreras.create({
            data: {
                nombre : req_nombre_carrera
            }
        })

        res.status(200)
        res.json({
            message : 'La carrera fue creado correctamente',
            respuesta : true
        })

    }catch(error){
        console.log(error)
        res.status(500)
        res.json({
            message : 'Lo sentimos hubo un error al momento de crear la carrera',
            devmsg  : error,
            respuesta : false
        })
    }
}


module.exports = controller