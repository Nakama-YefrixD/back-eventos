const controller = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

controller.MetEditarEvento = async (req, res) => {

    let {
        req_id,
        req_carrera,
        req_recurrente,
        req_tipoensenanza,
        req_clasificacionevento,
        req_tipoevento,
        req_organizacion,
        req_zoom,
        // req_linkflyer,
        req_sede,
        req_auditoria,
        req_nombre,
        req_estado,
        req_list_fechas,
        req_list_ponentes,
        req_cupos,
        req_hrsextra,
        req_linkEncuesta

    } = req.body;

    try{
        

        await prisma.eventos.update({
            where: {
                id : parseInt(req_id),
            },
            data: {
                carrera : parseInt(req_carrera),
                recurrente : req_recurrente == "false" ? false : true,
                tipoensenanza : req_tipoensenanza,
                clasificacionevento : req_clasificacionevento,
                tipoevento : req_tipoevento,
                organizacion : req_organizacion,
                zoom : req_zoom,
                linkencuesta : req_linkEncuesta,
                // linkflyer : '/mostrar-flyter-evento/'+resultado_flyer,
                // linkcertificado : '/mostrar-certificado-evento/'+resultado_certificado,
                sede : req_sede,
                auditoria : req_auditoria,
                nombre : req_nombre,
                estado : req_estado == "false" ? false : true,
                cupos : req_cupos ? parseInt(req_cupos) : null,
                hrsextracurriculares : req_hrsextra ? parseInt(req_hrsextra) : null
            }
        })

        // Borrar las fechas y los ponentes de un evento
        await prisma.fechaseventos.deleteMany({
            where: {
                idevento : parseInt(req_id)
            }
        })

        await prisma.ponenteseventos.deleteMany({
            where: {
                idevento : parseInt(req_id)
            }
        })

        req_list_fechas = JSON.parse(req_list_fechas)
        req_list_ponentes = JSON.parse(req_list_ponentes)

        for await (let reqfecha of req_list_fechas){

            const dateObj = new Date(reqfecha.fechora);
            const fecha_obtenida = dateObj.toISOString().slice(0, 10);
            const hora_obtenida = dateObj.toLocaleTimeString();

            await prisma.fechaseventos.create({
                data: {
                    idevento : parseInt(req_id),
                    fechora  : reqfecha.fechora,
                    fecha    : fecha_obtenida,
                    hora     : hora_obtenida,
                }
            })
        }

        for await (let ponente of req_list_ponentes){
            await prisma.ponenteseventos.create({
                data: {
                    idevento : parseInt(req_id),
                    ponente : ponente.value
                }
            })
        }

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