
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

async function authMiddleware (req, res, next) {
    // Lógica del middleware
    const usu = await prisma.usuusuarios.findFirst({
        where: {
            usutoken : req.headers.usutoken
        }
    })

    if(!usu){
        res.status(401)
        res.json({message : 'Lo sentimos tu sessión ha expirado.', response : false})
    }else{

        req.headers.middle_usuario = usu
        return next()
    }
}
  
module.exports = authMiddleware;  