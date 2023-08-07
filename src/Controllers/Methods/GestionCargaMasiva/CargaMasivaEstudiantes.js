const controller = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const XLSX = require('xlsx')
const crypto = require('crypto')
const bcryptjs = require('bcryptjs')

controller.MetCargaMasivaEstudiantes = async (req, res) => {

    const {
        
    } = req.body;

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
        
        for await(const dat of data){

            const token_user = crypto.randomBytes(30).toString('hex')

            await prisma.usuusuarios.create({
                data: {
                    tpuid : 2,
                    usutipo_documento_identidad : dat.tipo_documento,
                    usunumero_dni : dat.numero_documento.toString(),
                    usucodigo_ucs : dat.codigo_ucs,
                    usuusuario : dat.correo,
                    usunombre : dat.nombre,
                    usufecha_nacimiento : dat.fecha_nacimiento.toString(),
                    usuapell_paterno : dat.apellido_paterno,
                    usucelular : dat.celular.toString(),
                    usuapell_materno : dat.apellido_materno,
                    usurol : "Estudiante",
                    usutoken : token_user,
                    usucontrasena : bcryptjs.hashSync(dat.contrasenia.toString(), 8),
                }
            })
        }

        res.status(200)
        res.json({
            message : '',
            respuesta : true
        })

    }catch(error){
        console.log(error)
        res.status(500)
        res.json({
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

    const columns_name = [
        { value   : 0, name    : 'tipo_documento' },
        { value   : 1, name    : 'numero_documento' },
        { value   : 2, name    : 'nombre' },
        { value   : 3, name    : 'apellido_paterno' },
        { value   : 4, name    : 'apellido_materno' },
        { value   : 5, name    : 'contrasenia' },
        { value   : 6, name    : 'codigo_ucs' },
        { value   : 7, name    : 'correo' },
        { value   : 8, name    : 'fecha_nacimiento' },
        { value   : 9, name    : 'celular' },
        { value   : 10, name    : 'rol' },
        { value   : 11, name    : 'tipo_usuario' }
    ]

    const columns = {
        ex_tipo_documento     : 'tipo_documento',
        ex_numero_documento   : 'numero_documento',
        ex_nombre             : 'nombre',
        ex_apellido_paterno   : 'apellido_paterno',
        ex_apellido_materno   : 'apellido_materno',
        ex_contrasenia        : 'contrasenia',
        ex_codigo_ucs         : 'codigo_ucs',
        ex_correo             : 'correo',
        ex_fecha_nacimiento   : 'fecha_nacimiento',
        ex_celular            : 'celular',
        ex_rol                : 'rol',
        ex_tipo_usuario       : 'tipo_usuario'
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

        if(!row[properties[4]]){
            // add_list_approvals = false
            let rows_error  = messages_error.findIndex(mes => mes.columna == columns.ex_apellido_materno)
            controller.ValAddMessageLog(rows_error, messages_error, columns.ex_apellido_materno, num_row, 'empty')
        }

        if(!row[properties[5]]){
            // add_list_approvals = false
            let rows_error  = messages_error.findIndex(mes => mes.columna == columns.ex_contrasenia)
            controller.ValAddMessageLog(rows_error, messages_error, columns.ex_contrasenia, num_row, 'empty')
        }

        if(!row[properties[6]]){
            // add_list_approvals = false
            let rows_error  = messages_error.findIndex(mes => mes.columna ==  columns.ex_codigo_ucs)
            controller.ValAddMessageLog(rows_error, messages_error, columns.ex_codigo_ucs, num_row, 'empty')
        }
        if(!row[properties[7]]){
            // add_list_approvals = false
            let rows_error  = messages_error.findIndex(mes => mes.columna == columns.ex_correo)
            controller.ValAddMessageLog(rows_error, messages_error, columns.ex_correo, num_row, 'empty')
        }

        if(!row[properties[8]]){
            // add_list_approvals = false
            let rows_error  = messages_error.findIndex(mes => mes.columna == columns.ex_fecha_nacimiento)
            controller.ValAddMessageLog(rows_error, messages_error, columns.ex_fecha_nacimiento, num_row, 'empty')
        }

        if(!row[properties[9]]){
            // add_list_approvals = false
            let rows_error  = messages_error.findIndex(mes => mes.columna == columns.ex_celular)
            controller.ValAddMessageLog(rows_error, messages_error, columns.ex_celular, num_row, 'empty')
        }

        if(!row[properties[10]]){
            // add_list_approvals = false
            let rows_error  = messages_error.findIndex(mes => mes.columna == columns.ex_rol)
            controller.ValAddMessageLog(rows_error, messages_error, columns.ex_rol, num_row, 'empty')
        }

        if(!row[properties[11]]){
            // add_list_approvals = false
            let rows_error  = messages_error.findIndex(mes => mes.columna == columns.ex_tipo_usuario)
            controller.ValAddMessageLog(rows_error, messages_error, columns.ex_tipo_usuario, num_row, 'empty')
        }


        data.push({
            tipo_documento      : row[properties[0]] ? row[properties[0]] : '',
            numero_documento    : row[properties[1]] ? row[properties[1]] : '',
            nombre              : row[properties[2]] ? row[properties[2]] : '',
            apellido_paterno    : row[properties[3]] ? row[properties[3]] : '',
            apellido_materno    : row[properties[4]] ? row[properties[4]] : '',
            contrasenia         : row[properties[5]] ? row[properties[5]] : '',
            codigo_ucs          : row[properties[6]] ? row[properties[6]] : '',
            correo              : row[properties[7]] ? row[properties[7]] : '',
            fecha_nacimiento    : row[properties[8]] ? row[properties[8]] : '',
            celular             : row[properties[9]] ? row[properties[9]] : '',
            rol                 : row[properties[10]] ? row[properties[10]] : '',
            tipo_usuario        : row[properties[11]] ? row[properties[11]] : '',
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