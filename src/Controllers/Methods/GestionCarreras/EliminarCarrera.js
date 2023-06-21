const controller = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

controller.MetEliminarCarrera = async (req, res) => {

    const {
        req_id_carrera
    } = req.body;

    try{ 

        await prisma.carreras.delete({
            where: {
                id : req_id_carrera
            }
        })

        res.status(200)
        res.json({
            message : 'La carrera fue eliminada correctamente',
            respuesta : true
        })

    }catch(error){
        console.log(error)
        res.status(500)
        res.json({
            message : 'Lo sentimos hubo un error al momento de eliminar la carrera',
            devmsg  : error,
            respuesta : false
        })
    }
}


module.exports = controller