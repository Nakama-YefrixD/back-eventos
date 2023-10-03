const controller = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const XLSX = require('xlsx')

controller.MetCargarAsistencias = async (req, res) => {

    const {
        
    } = req.body;

    const {
        usutoken
    } = req.header

    const file = req.files.listado_carga

    try{ 

        const { exists_data, message, status, workbook } = await controller.ValExistsData(file)

        if(!exists_data){
            res.status(status)
            return res.json({
                message,
            })
        }

        const { messages_error, add_list_approvals, data } = await controller.ValCellsFile(workbook)

        const messages = messages_error.flatMap(mess => mess.notificaciones.map(notif=> notif.msg));

        if(!add_list_approvals){
            res.status(500)
            return res.json({
                response        : false,
                message         : 'Lo sentimos se encontraron algunas observaciones',
                notificaciones  : messages_error,
                messages_error  : messages

            })
        }

        // ************************************
        // CARGAR LA INFORMACIÓN EN LA BD
        // ************************************

        console.log(data);
        let idseventos = [];
        let idsusuarios = [];
        let idsfechaseventos = [];

        let usuarios_certificado = []

        for await(const dat of data){

            let evento_seleccionado = idseventos.find((idevento) => idevento.codigo == dat.codigo_evento)

            if(!evento_seleccionado){
                const evento = await prisma.eventos.findFirst({
                    where: {
                        codigo : dat.codigo_evento
                    }
                })
                if(evento){
                    idseventos.push(evento)
                    evento_seleccionado = evento
                }
            }

            let usuario_seleccionado = idsusuarios.find((idusuario) => idusuario.usucodigo_ucs == dat.codigo_estudiante)

            if(!usuario_seleccionado){
                const usuario = await prisma.usuusuarios.findFirst({
                    where: {
                        usucodigo_ucs : dat.codigo_estudiante
                    }
                })

                if(usuario){
                    idsusuarios.push(usuario)
                    usuario_seleccionado = usuario
                }
            }


            let fechaevento_seleccionado = idsfechaseventos.find(
                (idfechaevento) => idfechaevento.fecha == dat.fecha && idfechaevento.hora == dat.hora
            )

            if(!fechaevento_seleccionado){
                const fecha_evento = await prisma.fechaseventos.findFirst({
                    where: {
                        fecha : dat.fecha,
                        hora : dat.hora
                    }
                })

                if(fecha_evento){
                    idsfechaseventos.push(fecha_evento)
                    fechaevento_seleccionado = fecha_evento
                }
            }

            
            if(evento_seleccionado && usuario_seleccionado && fechaevento_seleccionado){
                
                console.log(fechaevento_seleccionado);
                // const millisecondsPerDay = 24 * 60 * 60 * 1000; // Milisegundos en un día
                // const baseDate = new Date(1899, 11, 30);  // La fecha base en Excel

                // const dateInMilliseconds = baseDate.getTime() + (dat.fecha * millisecondsPerDay);
                // const formattedDate = new Date(dateInMilliseconds);

                const asistencia_evento = await prisma.asistenciaseventos.findMany({
                    where : {
                        idevento : evento_seleccionado.id,
                        usuid : usuario_seleccionado.usuid,
                        codigoevento : dat.codigo_evento,
                        id_fec_event : fechaevento_seleccionado.id
                    },
                    take : 1
                })

                if(asistencia_evento.length > 0){

                    console.log("Existe el registro");
                    console.log(asistencia_evento);

                    await prisma.asistenciaseventos.update({
                        where: {
                            id : asistencia_evento[0]['id']
                        },
                        data: {
                            asistio : dat.asistio == "Si" ? true : false,
                        }
                    })

                }else{
                    await prisma.asistenciaseventos.create({
                        data: {
                            idevento : evento_seleccionado.id,
                            usuid : usuario_seleccionado.usuid,
                            fecha : fechaevento_seleccionado.fecha,
                            asistio : dat.asistio == "Si" ? true : false,
                            codigoestudiante : dat.codigo_estudiante,
                            codigoevento : dat.codigo_evento,
                            id_fec_event : fechaevento_seleccionado.id
                        }
                    })
                }

                // VALIDAR SI SE LE ASIGANARA UN CERTIFICADO
                const user_encontrado = usuarios_certificado.find((user_cert) => user_cert.id_event == evento_seleccionado.id && user_cert.usuid == usuario_seleccionado.usuid)
                if(!user_encontrado){
                    usuarios_certificado.push({
                        id_event : evento_seleccionado.id,
                        usuid : usuario_seleccionado.usuid,
                        certificado : dat.asistio == "Si" ? true : false
                    })
                }else{
                    if(user_encontrado.certificado == true){
                        if(dat.asistio != "Si"){
                            usuarios_certificado.map((user_cert, pos) => {
                                
                                if(user_cert.id_event == evento_seleccionado.id && user_cert.usuid == usuario_seleccionado.usuid){
                                    usuarios_certificado[pos]['certificado'] = false
                                }
    
                            })
                        }
                    }
                }
            }
        }


        for await(const user_cert of usuarios_certificado){
            await prisma.eventosusuarios.updateMany({
                where : {
                    idevento : user_cert.id_event,
                    usuid : user_cert.usuid
                },
                data: {
                    tiene_certificado : user_cert.certificado
                }
            })
        }
        

        console.log("usuarios_certificado");
        console.log(usuarios_certificado);

        res.status(200)
        return res.json({
            message : 'Las asistencias fueron cargadas correctamente',
            respuesta : true
        })

    }catch(error){
        console.log(error)
        res.status(500)
        return  res.json({
            message : 'Lo sentimos hubo un error al momento de cargar la data de estudiantes',
            devmsg  : error,
            respuesta : false
        })
    } finally {
        prisma.$disconnect();
    }
}


controller.ValExistsData = async (file) => {

    let exists_data   = true
    let message       = ''
    let status        = 200

    if (!file) {
        exists_data = false
        message     = 'No se ha subido ningún archivo'
        status      = 500
    }

    const workbook = XLSX.read(file.data)
    if(!workbook.Sheets['data']){
        exists_data = false
        message     = 'Lo sentimos no se encontró la hoja con nombre "Data"'
        status      = 500
    }

    return { exists_data, message, status, workbook: workbook ? workbook : null }
}

controller.ValCellsFile = async (workbook) => {

    const rows      = XLSX.utils.sheet_to_json(workbook.Sheets['data'], {defval:""})
    let properties  = Object.keys(rows[0])

    let add_list_approvals = true
    let messages_error  = []
    const data          = []

    const columns = {
        ex_codigo_evento     : 'codigo_evento',
        ex_nombre_evento     : 'Nombre_Evento',
        ex_codigo_estudiante : 'codigo_estudiante',
        ex_estudiante        : 'Estudiante',
        ex_fecha             : 'fecha',
        ex_hora              : 'hora',
        ex_asistio           : 'asistio',
    }

    let num_row = 1
    console.log(rows);
    for await (const row of rows){

        if(!row[properties[0]]){
            // add_list_approvals = false
            let rows_error  = messages_error.findIndex(mes => mes.columna == columns.ex_tipo_documento)
            controller.ValAddMessageLog(rows_error, messages_error, columns.ex_tipo_documento, num_row, 'empty')
        }

        if(!row[properties[1]]){
            // add_list_approvals = false
            let rows_error  = messages_error.findIndex(mes => mes.columna == columns.ex_numero_documento)
            controller.ValAddMessageLog(rows_error, messages_error, columns.ex_numero_documento, num_row, 'empty')
        }

        if(!row[properties[2]]){
            // add_list_approvals = false
            let rows_error  = messages_error.findIndex(mes => mes.columna == columns.ex_nombre)
            controller.ValAddMessageLog(rows_error, messages_error, columns.ex_nombre, num_row, 'empty')
        }

        if(!row[properties[3]]){
            // add_list_approvals = false
            let rows_error  = messages_error.findIndex(mes => mes.columna ==  columns.ex_apellido_paterno)
            controller.ValAddMessageLog(rows_error, messages_error, columns.ex_apellido_paterno, num_row, 'empty')
        }

        data.push({
            codigo_evento     : row[properties[0]] ? row[properties[0]] : '',
            Nombre_Evento     : row[properties[1]] ? row[properties[1]] : '',
            codigo_estudiante : row[properties[2]] ? row[properties[2]] : '',
            Estudiante        : row[properties[3]] ? row[properties[3]] : '',
            fecha             : row[properties[4]] ? row[properties[4]] : '',
            hora              : row[properties[5]] ? row[properties[5]] : '',
            asistio           : row[properties[6]] ? row[properties[6]] : ''
        })

        num_row = num_row + 1
    }

    return { messages_error, add_list_approvals, data }
}

controller.ValAddMessageLog = (rows_error, messages_error, name_column, num_row, type, name_dts = null) => {

    let msg_log = ''

    switch (type) {
        case 'empty':
            msg_log = `Lo sentimos, algunos códigos de ${name_column} se encuentran vacios, recordar que este campo es obligatorio`
            break;
        case 'not number':
            msg_log = `Lo sentimos, algunos de los ${name_column} no son númericos`
            break;
        case 'format invalid':
            msg_log = `Lo sentimos, algunos de los ${name_column} no tienen el formato válido`
            break;
        case 'inconsistent data':
            msg_log = `Lo sentimos, algunos precios totales no cuadran con las cantidades y precios unitarios`
            break;
        case 'distributor not found':
            msg_log = `El código ${name_dts} no se encuentra en la maestra distribuidoras`
            break;
        default:
            msg_log = `Lo sentimos, el tipo de dato para ${name_column} es inválido`
    }

    if(rows_error == -1){
        messages_error.push({
            "columna"           : name_column,
            "notificaciones"    : [
                {
                    "msg"   : msg_log,
                    "rows" : [num_row+1],
                    "type" : type
                }
            ]
        })
    }else{
        let index_type_error
        if(type != 'distributor not found'){
            index_type_error = messages_error[rows_error]['notificaciones'].findIndex(typ => typ.type == type)   
        }else{
            index_type_error = messages_error[rows_error]['notificaciones'].findIndex( not => not.msg == msg_log)
        }

        if(index_type_error == -1){
            messages_error[rows_error]['notificaciones'].push({
                "msg"   : msg_log,
                "rows" : [num_row+1],
                "type" : type
            })
        }else{
            messages_error[rows_error]['notificaciones'][index_type_error]['rows'].push(num_row+1)
        }  
        
    }
}


module.exports = controller