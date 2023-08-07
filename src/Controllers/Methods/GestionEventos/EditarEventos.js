const controller = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

controller.MetEditarEvento = async (req, res) => {

    const {
        req_id,
        req_carrera,
        req_recurrente,
        req_tipoensenanza,
        req_clasificacionevento,
        req_tipoevento,
        req_organizacion,
        req_zoom,
        req_linkflyer,
        req_sede,
        req_auditoria,
        req_nombre,
        req_fecha,
        req_fechahora,
        req_estado,
        req_ponente
    } = req.body;

    try{
        
        const [fecha, hora] = req_fechahora.split(" ");
        const [anio, mes, dia] = fecha.split("-");
        let [hora24, minuto, segundo] = hora.split(":");
        hora24 = hora24 - 5

        const fechaHoraFormateada = `${anio}/${mes}/${dia} ${hora24}:${minuto}`;

        await prisma.eventos.update({
            where: {
                id : req_id,
            },
            data: {
                carrera         : req_carrera,
                recurrente      : req_recurrente,
                tipoensenanza   : req_tipoensenanza,
                clasificacionevento : req_clasificacionevento,
                tipoevento      : req_tipoevento,
                organizacion    : req_organizacion,
                zoom            : req_zoom,
                linkflyer       : req_linkflyer,
                sede            : req_sede,
                auditoria       : req_auditoria,
                nombre          : req_nombre,
                fecha           : req_fecha,
                fechahora       : new Date(fechaHoraFormateada),
                estado          : req_estado,
                ponente         : req_ponente
            }
        })

        res.status(200)
        return res.json({
            message : 'El evento fue editado correctamente',
            respuesta : true
        })

    }catch(error){
        console.log(error)
        res.status(500)
        return res.json({
            message : 'Lo sentimos hubo un error al momento de editar los eventos',
            devmsg  : error,
            respuesta : false
        })
    } finally {
        prisma.$disconnect();
    }
}


module.exports = controller