const controller = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

controller.MetMostrarInscritos = async (req, res) => {

  const {
    req_evento
  } = req.body;

  try {

    let inscritos_eventos = await prisma.eventosusuarios.findMany({
      where: {
        idevento: req_evento.id
      },
      select: {
        usuusuarios: true
      }
    })


    inscritos_eventos.map((pevento, pos) => {
      const nombre = inscritos_eventos[pos]['usuusuarios']['usunombre'];
      const apellidos = inscritos_eventos[pos]['usuusuarios']['usuapell_paterno'] + " " + inscritos_eventos[pos]['usuusuarios']['usuapell_materno'];

      inscritos_eventos[pos]['item'] = parseInt(pos) + 1
      inscritos_eventos[pos]['value'] = nombre + apellidos
      inscritos_eventos[pos]['label'] = nombre + apellidos
    })

    res.status(200)
    return res.json({
      message: 'Inscritos obtenidos correctamente',
      data: inscritos_eventos,
      respuesta: true
    })

  } catch (error) {
    console.log(error)
    res.status(500)
    return res.json({
      message: 'Lo sentimos hubo un error al momento de mostrar los eventos',
      devmsg: error,
      respuesta: false
    })
  } finally {
    prisma.$disconnect();
  }
}


module.exports = controller