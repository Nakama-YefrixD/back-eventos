const controller = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

controller.MetMostrarHorasExtracurriculares = async (req, res) => {

    const {
        req_usutoken
    } = req.body;

    try{

        let hrs_extracurriculares = []
        let cntd_hrs_extracurriculares = 0
        let respuesta = true
        let mensaje = "Las horas fueron obtenidos correctamente"

        const usuusuario = await prisma.usuusuarios.findFirst({
            where:{
                usutoken : req_usutoken
            }
        })

        if(usuusuario){
            hrs_extracurriculares = await prisma.eventosusuarios.findMany({
                where: {
                    usuid : usuusuario.usuid
                },
                include: {
                    eventos: true
                }
            })

            hrs_extracurriculares.map((hr)=>cntd_hrs_extracurriculares+=hr.eventos.hrsextracurriculares)
            


        }else{
            respuesta = true
            mensaje = "Lo sentimos el usuario no se encontro"
        }

        res.status(200)
        return res.json({
            message   : mensaje,
            data      : hrs_extracurriculares,
            cntd      : cntd_hrs_extracurriculares,
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