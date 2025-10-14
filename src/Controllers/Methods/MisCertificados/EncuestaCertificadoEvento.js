const controller = {};
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

controller.MetCrearEncuestaSatisfaccion = async (req, res) => {
  const { req_evento, req_usuario, req_preguntas } = req.body;

  try {
    let encuestasatisfaccion = await prisma.encuestassatisfaccion.create({
      data: {
        eventoId: req_evento.id,
        usuarioId: req_usuario.id,
      },
    });

    if (encuestasatisfaccion) {
      await req_preguntas.map(async (pregunta) => {
        await prisma.preguntasencuestas.create({
          data: {
            pregunta: pregunta.pregunta,
            respuesta: pregunta.respuesta,
            encuestasatisfaccionId: encuestasatisfaccion.id,
          }
        });
      });

      await prisma.eventos_usuarios.updateMany({
        where: {
          eventoId: req_evento.id,
          usuarioId: req_usuario.id,
        },
        data: {
          encuestaSatisfaccion: true,
        },
      });
    }

    res.status(200);
    return res.json({
      message: "Encuesta de satisfacción creada correctamente",
      respuesta: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500);
    return res.json({
      message: "Lo sentimos hubo un error al momento de crear la encuesta de satisfacción",
      devmsg: error,
      respuesta: false,
    });
  } finally {
    prisma.$disconnect();
  }
};

module.exports = controller;
