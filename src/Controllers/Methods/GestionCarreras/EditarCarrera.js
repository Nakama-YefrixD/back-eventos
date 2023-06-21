const controller = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

controller.MetEditarCarrera = async (req, res) => {

    const {
        req_id_carrera,
        req_nombre_carrera
    } = req.body;

    try{ 

        await prisma.carreras.update({
            where: {
                id : req_id_carrera
            },
            data: {
                nombre : req_nombre_carrera
            }
        })

        res.status(200)
        res.json({
            message : 'La carrera fue editada correctamente',
            respuesta : true
        })

    }catch(error){
        console.log(error)
        res.status(500)
        res.json({
            message : 'Lo sentimos hubo un error al momento de editar la carrera',
            devmsg  : error,
            respuesta : false
        })
    }
}


module.exports = controller