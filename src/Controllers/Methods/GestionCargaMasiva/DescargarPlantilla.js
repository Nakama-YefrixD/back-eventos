const controller = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const ExcelJS = require('exceljs');

controller.MetDescargarPlantilla = async (req, res) => {

    const {
        req_idevento
    } = req.body;
 

    try{ 

        const usuarios_eventos = await prisma.eventosusuarios.findMany({
            where : {
                idevento : req_idevento
            },
            include: {
                eventos : {
                    include: {
                        fechaseventos : true
                    }
                },
                usuusuarios : true
            }
        })

        console.log(usuarios_eventos);

        // Crear un nuevo libro de Excel
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('data');

        // Agregar datos a la hoja de cálculo (ejemplo con tres registros)
        worksheet.addRow(['codigo_evento', 'Nombre_Evento', 'codigo_estudiante', 'Estudiante', 'fecha', 'hora', 'asistio']);
        // worksheet.addRow(['Nombre', 'Edad']);

        
        // await usuarios_eventos.map(async (usu_eve) => {
        for await(const usu_eve of usuarios_eventos){
            // console.log(usu_eve.eventos.fechaseventos);

            for await(const fec_eve of usu_eve.eventos.fechaseventos){
                const asis_event_usuario = await prisma.asistenciaseventos.findMany({
                    where: {
                        usuid : usu_eve.usuid,
                        idevento : usu_eve.idevento,
                        codigoestudiante : usu_eve.usuusuarios.usucodigo_ucs,
                        codigoevento : usu_eve.eventos.codigo,
                        fecha : fec_eve.fecha
                    },
                    take: 1
                })

                let asitio = "Si"

                if(asis_event_usuario.length > 0){
                    asitio = asis_event_usuario[0]['asistio'] ? "Si" : "No"
                }

                console.log(fec_eve);

                worksheet.addRow([ 
                    usu_eve.eventos.codigo, usu_eve.eventos.nombre, 
                    usu_eve.usuusuarios.usucodigo_ucs, usu_eve.usuusuarios.usunombre+" "+usu_eve.usuusuarios.usuapell_paterno+" "+usu_eve.usuusuarios.usuapell_materno,
                    fec_eve.fecha, fec_eve.hora, asitio
                ]);
            }
        }

        // worksheet.addRow(['Juan', 30, 20, 10, 22, 77, 88]);
        // worksheet.addRow(['Dario', 30, 20, 10, 22, 77, 88]);
        // worksheet.addRow(['Rosmar', 30, 20, 10, 22, 77, 88]);
        // worksheet.addRow(['María', 25]);
        // worksheet.addRow(['Pedro', 35]);

        // Otras operaciones, como dar formato a las celdas, también son posibles aquí.

        // Configurar la respuesta HTTP para descargar el archivo Excel
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=miArchivo.xlsx');

        // Enviar el archivo Excel como respuesta
        workbook.xlsx.write(res)
        .then(function() {
            console.log('Archivo Excel enviado con éxito');
            res.end();
        })
        .catch(function(error) {
            console.log('Error al enviar el archivo Excel:', error);
            res.status(500).send('Error al generar el archivo Excel');
        });


        // res.status(200)
        // return res.json({
        //     message : '',
        //     respuesta : true
        // })

    }catch(error){
        console.log(error)
        res.status(500)
        return res.json({
            message : 'Lo sentimos hubo un error al momento de cargar la data de estudiantes',
            devmsg  : error,
            respuesta : false
        })
    } finally {
        prisma.$disconnect();
    }
}

module.exports = controller