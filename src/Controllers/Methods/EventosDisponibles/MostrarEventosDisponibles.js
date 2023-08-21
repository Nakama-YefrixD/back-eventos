const controller = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

controller.MetMostrarEventosDisponibles = async (req, res) => {

    const {
        req_usutoken
    } = req.body;

    try{

        let eventos = []

        const usuusuario = await prisma.usuusuarios.findFirst({
            where:{
                usutoken : req_usutoken
            }
        })

        if(usuusuario){
            eventos = await prisma.eventos.findMany({
                include: {
                    eventosusuarios: {
                        where: {
                            usuid: usuusuario.usuid,
                        }
                    }
                },
                where:{
                    estado : true
                },
                orderBy: {
                    created_at: 'desc'
                },
            });
        }

        res.status(200)
        return res.json({
            message   : 'Eventos obtenidos correctamente',
            data      : eventos, 
            usuari    : usuusuario,
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