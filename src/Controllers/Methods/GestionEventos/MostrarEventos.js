const controller = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

controller.MetMostrarEventos = async (req, res) => {

    const {
        req_estado,
        req_fecha,
        req_txtbuscar
    } = req.body;

    try{

        let eventos = []

        if(req_estado && req_fecha){
            eventos = await prisma.eventos.findMany({
                where: {
                    estado : req_estado == 'false' ? false : true,
                    fechahora : {
                        contains : req_fecha
                    }
                },
                orderBy: {
                    created_at: 'desc'
                },
            })
        }else if(req_estado){
            eventos = await prisma.eventos.findMany({
                where: {
                    estado : req_estado == 'false' ? false : true
                },
                orderBy: {
                    created_at: 'desc'
                },
            })
        }else if(req_fecha){
            eventos = await prisma.eventos.findMany({
                where: {
                    fechahora : {
                        contains : req_fecha
                    }
                },
                orderBy: {
                    created_at: 'desc'
                },
            })
        }else{
            eventos = await prisma.eventos.findMany({
                orderBy: {
                    created_at: 'desc'
                },
            })
        }

        res.status(200)
        return res.json({
            message : 'Eventos obtenidos correctamente',
            data    : eventos,
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