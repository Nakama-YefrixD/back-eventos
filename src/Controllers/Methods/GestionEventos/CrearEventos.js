const controller = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

controller.MetCrearEvento = async (req, res) => {

    const {
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
        req_estado,
        req_list_fechas,
        req_list_ponentes
    } = req.body;

    try{

        const nevento = await prisma.eventos.create({
            data: {
                carrera : parseInt(req_carrera),
                recurrente : req_recurrente,
                tipoensenanza : req_tipoensenanza,
                clasificacionevento : req_clasificacionevento,
                tipoevento : req_tipoevento,
                organizacion : req_organizacion,
                zoom : req_zoom,
                linkflyer : req_linkflyer,
                sede : req_sede,
                auditoria : req_auditoria,
                nombre : req_nombre,
                estado : req_estado
            }
        })

        for await (let reqfecha of req_list_fechas){
            const dateObj = new Date(reqfecha.fecha);
            const fecha_obtenida = dateObj.toISOString().slice(0, 10);
            const hora_obtenida = dateObj.toLocaleTimeString();

            await prisma.fechaseventos.create({
                data: {
                    idevento : nevento.id,
                    fechora  : reqfecha.fecha,
                    fecha    : fecha_obtenida,
                    hora     : hora_obtenida,
                }
            })
        }

        for await (let ponente of req_list_ponentes){
            await prisma.ponenteseventos.create({
                data: {
                    idevento : nevento.id,
                    ponente : ponente.value
                }
            })
        }

        res.status(200)
        return res.json({
            message : 'El evento fue creado correctamente',
            respuesta : true
        })

    }catch(error){
        console.log(error)
        res.status(500)
        return res.json({
            message : 'Lo sentimos hubo un error al momento de crear los eventos',
            devmsg  : error,
            respuesta : false
        })
    }
}


module.exports = controller