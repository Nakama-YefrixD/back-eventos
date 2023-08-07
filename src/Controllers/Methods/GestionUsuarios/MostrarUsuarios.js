const controller = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

controller.MetMostrarUsuarios = async (req, res) => {

    const {
        req_estado,
        req_tipo_usuario
    } = req.body;

    try{

        let usuarios = []

        if(req_estado && req_tipo_usuario){
            usuarios = await prisma.usuusuarios.findMany({
                where: {
                    usuestado : req_estado == 'false' ? false : true,
                    usurol : req_tipo_usuario
                }
            })
        }else if(req_estado){
            usuarios = await prisma.usuusuarios.findMany({
                where: {
                    usuestado : req_estado == 'false' ? false : true
                }
            })
        }else if(req_tipo_usuario){
            usuarios = await prisma.usuusuarios.findMany({
                where: {
                    usurol : req_tipo_usuario
                }
            })
        }else{
            usuarios = await prisma.usuusuarios.findMany({})
        }

        res.status(200)
        return res.json({
            message : 'Usuarios obtenidos correctamente',
            data    : usuarios,
            respuesta : true,
            estado : Boolean(req_estado)
        })

    }catch(error){
        console.log(error)
        res.status(500)
        return res.json({
            message : 'Lo sentimos hubo un error al momento de mostrar los usuarios',
            devmsg  : error,
            respuesta : false
        })
    } finally {
        prisma.$disconnect();
    }
}


module.exports = controller