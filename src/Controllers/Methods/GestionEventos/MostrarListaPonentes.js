const controller = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

controller.MetMostrarListaPonentes = async (req, res) => {

    const {
        
    } = req.body;

    try{

        let usuarios_ponentes = await prisma.usuusuarios.findMany({
            where : {
                usurol : 'Ponente'
            }
        })

        usuarios_ponentes.map((usu, pos) => {
            usuarios_ponentes[pos]['value'] = usu.usunombre+" "+usu.usuapell_paterno+" "+usu.usuapell_materno;
            usuarios_ponentes[pos]['label'] = usu.usunombre+" "+usu.usuapell_paterno+" "+usu.usuapell_materno;
        })

        res.status(200)
        return res.json({
            message : 'Ponentes obtenidas correctamente',
            data    : usuarios_ponentes,
            respuesta : true
        })

    }catch(error){
        console.log(error)
        res.status(500)
        return res.json({
            message : 'Lo sentimos hubo un error al momento de mostrar los Ponentes',
            devmsg  : error,
            respuesta : false
        })
    } finally {
        prisma.$disconnect();
    }
}


module.exports = controller