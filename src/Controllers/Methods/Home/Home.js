const controller = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

controller.MetEventosHome = async (req, res) => {

    const {
        req_usutoken
    } = req.body;

    try{

        const usuusuario = await prisma.usuusuarios.findFirst({
            where:{
                usutoken : req_usutoken
            }
        })

        let list_eventos = []

        if(usuusuario){
            list_eventos = await prisma.eventos.findMany({
                include: {
                    eventosusuarios: {
                        where: {
                            usuid: usuusuario.usuid,
                        }
                    },
                    carreras : true
                },
                orderBy: {
                    created_at: 'desc'
                },
                where: {
                    estado: true
                }
            })
        }

        let posEvento = 0
        for await(const evento of list_eventos){

            const ponentesEventos = await prisma.ponenteseventos.findMany({
                where:{
                    idevento : evento.id 
                },
            })

            list_eventos[posEvento]['ponentes'] = ponentesEventos
            list_eventos[posEvento]['ponente'] = ponentesEventos ?ponentesEventos[0] : {}
            posEvento++;
        }

        res.status(200)
        return res.json({
            message : 'Los eventos fueron obtenidos correctamente',
            respuesta : true,
            data: list_eventos
        })

    }catch(error){
        console.log(error)
        res.status(500)
        return res.json({
            message : 'Lo sentimos hubo un error al momento de obtener los eventos del home',
            devmsg  : error,
            respuesta : false
        })
    } finally {
        prisma.$disconnect();
    }
}


module.exports = controller