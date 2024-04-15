const controller = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const crypto = require('crypto')

controller.MetCrearEvento = async (req, res) => {

    let {
        req_carrera,
        req_recurrente,
        req_tipoensenanza,
        req_clasificacionevento,
        req_tipoevento,
        req_organizacion,
        req_zoom,
        req_linkEncuesta,
        req_linkflyer,
        req_sede,
        req_auditoria,
        req_nombre,
        req_estado,
        req_list_fechas,
        req_list_ponentes,
        req_cupos,
        req_hrsextra
    } = req.body;

    try{

        const codigoevento = crypto.randomBytes(10).toString('hex')

        let resultado_flyer = null
        let resultado_certificado = null
        
        if(req.files){

            const longtxt = await GenerateRandomString(5)

            if(req.files.archivo){
                // ALMACENAR EL ARCHIVO EN EL SERVIDOR
                let EDFile = req.files.archivo    
                const nombrearchivo = EDFile.name
                resultado_flyer = `${nombrearchivo.split(".")[0]}-${longtxt}.${nombrearchivo.split(".")[1]}`;
                const rutaexactaflyer = `src/public/eventos/flyer/${resultado_flyer}`

                EDFile.mv(rutaexactaflyer,err => {
                    if(err) return res.status(500).send({ message : err })
                })
            }

            if(req.files.fileCertificado){
                // ALMACENAR LA PLANTILLA DEL CERTIFICADO EN EL SERVIDOR
                let EDFileCertificado = req.files.fileCertificado
                const nombrearchivoCertificado = EDFileCertificado.name
                resultado_certificado = `${nombrearchivoCertificado.split(".")[0]}-${longtxt}.${nombrearchivoCertificado.split(".")[1]}`;
                const rutaexactaCertificado = `src/public/eventos/certificados/${resultado_certificado}`

                EDFileCertificado.mv(rutaexactaCertificado,err => {
                    if(err) return res.status(500).send({ message : err })
                })
            }
        }

        const coloreseventos = ["red", "blue", "black", "green", "orange", "gray", "#a0c4ff", "#abc4ff"]
        const indiceAleatorio = Math.floor(Math.random() * coloreseventos.length);

        const nevento = await prisma.eventos.create({
            data: {
                codigo  : codigoevento,
                carrera : parseInt(req_carrera),
                recurrente : req_recurrente == "false" ? false : true,
                tipoensenanza : req_tipoensenanza,
                clasificacionevento : req_clasificacionevento,
                tipoevento : req_tipoevento,
                organizacion : req_organizacion,
                zoom : req_zoom,
                color : coloreseventos[indiceAleatorio],
                linkencuesta : req_linkEncuesta,
                linkflyer : '/mostrar-flyter-evento/'+resultado_flyer,
                linkcertificado : '/mostrar-certificado-evento/'+resultado_certificado,
                sede : req_sede,
                auditoria : req_auditoria,
                nombre : req_nombre,
                estado : Boolean(req_estado),
                cupos : req_cupos ? parseInt(req_cupos) : null,
                hrsextracurriculares : req_hrsextra ? parseInt(req_hrsextra) : null
            }
        })

        req_list_fechas = JSON.parse(req_list_fechas)
        req_list_ponentes = JSON.parse(req_list_ponentes)

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
    } finally {
        prisma.$disconnect();
    }
}

const GenerateRandomString = async (longitud) => {
    
    let cadena = '';
    const caracteres = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const caracteresLength = caracteres.length;
  
    for (let i = 0; i < longitud; i++) {
      const indiceAleatorio = Math.floor(Math.random() * caracteresLength);
      const caracterAleatorio = caracteres.charAt(indiceAleatorio);
      cadena += caracterAleatorio;
    }
  
    return cadena;
}


module.exports = controller