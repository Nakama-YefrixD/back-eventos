const controller = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

controller.MetEliminarUsuarios = async (req, res) => {

    const {
        req_usuid
    } = req.body;

    try{

        await prisma.usuusuarios.delete({
            where: {
                usuid: parseInt(req_usuid)
            }
        })

        res.status(200)
        res.json({
            message : 'El usuarios fue eliminado correctamente',
            respuesta : true
        })

    }catch(error){
        console.log(error)
        res.status(500)
        res.json({
            message : 'Lo sentimos hubo un error al momento de eliminar el usuario',
            devmsg  : error,
            respuesta : false
        })
    } finally {
        prisma.$disconnect();
    }
}


module.exports = controller