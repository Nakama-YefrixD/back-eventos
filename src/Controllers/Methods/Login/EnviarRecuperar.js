const controller = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const SendMail = require('../../Reprocesos/SendMail')

controller.MetRecuperar = async (req, res) => {

    const {
        req_correo
    } = req.body;

    try{

        const user = await prisma.usuusuarios.findFirst({
            where: {
                usuusuario : req_correo
            },
            select: {
                usunombre : true,
                usuapell_paterno : true,
                usuapell_materno : true,
                usutoken : true
            }
        })
        
        if(!user){
            res.status(500)
            return res.json({
                respuesta: false,
                message: 'Lo sentimos, el usuario no existe'
            })
        }



        const success_mail_html    = "src/Controllers/Methods/Login/Mails/CorreoRecuperar.html"
        const from_mail_data       = ""
        const to_mail_data         = [req_correo]
        const subject_mail_success = "Recuperar Contraseña"

        const data_mail = {
            nombrecompleto : user.usunombre+" "+user.usuapell_paterno+" "+user.usuapell_materno,
            link : "http://localhost:3000/#/auth/recuperar/"+user.usutoken
        }

        await SendMail.MetSendMail(success_mail_html, from_mail_data, to_mail_data, subject_mail_success, data_mail)

        return res.status(200).json({
            "respuesta" : true
        })

    }catch(error){
        console.log(error)
        res.status(500)
        return res.json({
            message : 'Lo sentimos hubo un error al momento de recuperar tu usuario',
            devmsg  : error,
            respuesta : false
        })
    } finally {
        prisma.$disconnect();
    }
}


module.exports = controller