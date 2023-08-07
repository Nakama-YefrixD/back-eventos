const controller = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

controller.MetEventosInscritos = async (req, res) => {

    const {
        req_usutoken
    } = req.body;

    try{

        let eventos_realizados = []
        let respuesta = true
        let mensaje = "Los eventos inscritos fueron obtenidos correctamente"

        const usuusuario = await prisma.usuusuarios.findFirst({
            where:{
                usutoken : req_usutoken
            }
        })

        if(usuusuario){
            const eventusuarios = await prisma.eventosusuarios.findMany({
                where: {
                    usuid : usuusuario.usuid
                },
                include: {
                    eventos: {
                        include:{
                            fechaseventos: true
                        }
                    },
                    
                }
            })

            eventusuarios.map(( evtusus ) => {
                evtusus.eventos.fechaseventos.map((fechas) => {
                    eventos_realizados.push({
                        title : evtusus.eventos.nombre,
                        start : fechas.fecha
                    })
                })
            })

            // eventos_realizados = eventusuarios

        }else{
            respuesta = true
            mensaje = "Lo sentimos el usuario no se encontro"
        }

        res.status(200)
        return res.json({
            message   : mensaje,
            data      : eventos_realizados,
            respuesta : respuesta
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