const controller = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

controller.MetInscribirEvento = async (req, res) => {

    const {
        req_usutoken,
        req_eventoid
    } = req.body;

    try{

        let mensaje = "Lo sentimos, ya te encuentras inscrito en este evento"
        let respuesta = false

        const usuario = await prisma.usuusuarios.findFirst({
            where:{
                usutoken : req_usutoken
            }
        })

        if(usuario){
            const eventousuario = await prisma.eventosusuarios.findFirst({
                where: {
                    usuid: usuario.usuid,
                    idevento: req_eventoid,
                },
            })
    
            if(!eventousuario){
    
                await prisma.eventosusuarios.create({
                    data: {
                        usuid: usuario.usuid,
                        idevento: req_eventoid,
                    },
                });
    
                mensaje = 'Te inscribiste correctamente al evento'
                respuesta = true
            }
        }else{
            mensaje = "Lo sentimos el usuario no exist"
            respuesta = false
        }

        res.status(200)
        return res.json({
            message : mensaje,
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