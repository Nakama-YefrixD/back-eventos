const controller = {};
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const ExcelJS = require("exceljs");

controller.MetMostrarHorasExtracurriculares = async (req, res) => {
  const { req_usutoken } = req.body;

  try {
    let hrs_extracurriculares = [];
    let cntd_hrs_extracurriculares = 0;
    let respuesta = true;
    let mensaje = "Las horas fueron obtenidos correctamente";

    const usuusuario = await prisma.usuusuarios.findFirst({
      where: {
        usutoken: req_usutoken,
      },
    });

    if (usuusuario) {
      hrs_extracurriculares = await prisma.eventosusuarios.findMany({
        where: {
          usuid: usuusuario.usuid,
          tiene_certificado: true,
        },
        include: {
          eventos: true,
        },
      });

      hrs_extracurriculares.map(
        (hr) => (cntd_hrs_extracurriculares += hr.eventos.hrsextracurriculares)
      );
    } else {
      respuesta = true;
      mensaje = "Lo sentimos el usuario no se encontro";
    }

    res.status(200);
    return res.json({
      message: mensaje,
      data: hrs_extracurriculares,
      cntd: cntd_hrs_extracurriculares,
      respuesta: respuesta,
    });
  } catch (error) {
    console.log(error);
    res.status(500);
    return res.json({
      message: "Lo sentimos hubo un error al momento de mostrar los eventos",
      devmsg: error,
      respuesta: false,
    });
  } finally {
    prisma.$disconnect();
  }
};

controller.MetDescargarHorasExtracurriculares = async (req, res) => {
    const { req_usutoken } = req.body;

  try {
    const usuario = await prisma.usuusuarios.findFirst({
      where: { usutoken: req_usutoken },
    });

    if (!usuario) {
      return res.status(404).json({
        message: "El usuario no fue encontrado",
        respuesta: false,
      });
    }

    const hrs_extracurriculares = await prisma.eventosusuarios.findMany({
      where: {
        usuid: usuario.usuid,
        tiene_certificado: true,
      },
      include: { eventos: true },
    });

    // Calcular totales
    let totalHoras = hrs_extracurriculares.reduce(
      (sum, e) => sum + e.eventos.hrsextracurriculares,
      0
    );

    // Crear Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Horas Extracurriculares");

    // Ajustes generales
    worksheet.properties.defaultRowHeight = 22;

    // ======== HEADER SUPERIOR (TÍTULO) ========
    worksheet.mergeCells("A1:E1");
    const titleCell = worksheet.getCell("A1");
    titleCell.value = "REPORTE DE HORAS EXTRACURRICULARES";
    titleCell.font = {
      name: "Calibri",
      size: 14,
      bold: true,
      color: { argb: "FFFFFF" },
    };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    titleCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "4472C4" }, // Azul elegante
    };

    worksheet.addRow([]);

    // ======== ENCABEZADOS DE TABLA ========
    worksheet.columns = [
      { header: "ITEM", key: "item", width: 10 },
      { header: "EVENTO", key: "evento", width: 50 },
      { header: "¿REALIZÓ ENCUESTA?", key: "encuesta", width: 25 },
      { header: "ESTADO", key: "estado", width: 20 },
      { header: "HRS EXTRACURRICULARES", key: "horas", width: 25 },
    ];

    const headerRow = worksheet.addRow({
      item: "ITEM",
      evento: "EVENTO",
      encuesta: "¿REALIZÓ ENCUESTA?",
      estado: "ESTADO",
      horas: "HRS EXTRACURRICULARES",
    });

    headerRow.eachCell((cell) => {
      cell.font = {
        bold: true,
        name: "Calibri",
        size: 11,
        color: { argb: "333333" },
      };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "E9EFFA" }, // Azul suave moderno
      };
      cell.border = {
        top: { style: "thin", color: { argb: "CCCCCC" } },
        left: { style: "thin", color: { argb: "CCCCCC" } },
        bottom: { style: "thin", color: { argb: "CCCCCC" } },
        right: { style: "thin", color: { argb: "CCCCCC" } },
      };
    });

    // ======== FILAS DE DATOS ========
    let item = 1;

    hrs_extracurriculares.forEach((reg, index) => {
      const row = worksheet.addRow({
        item,
        evento: reg.eventos.nombre,
        encuesta: reg.encuestado ? "Sí" : "No",
        estado: "Completado",
        horas: reg.eventos.hrsextracurriculares,
      });

      // Zebra striping
      if (index % 2 === 0) {
        row.eachCell((cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "F7F9FC" }, // gris clarísimo moderno
          };
        });
      }

      // Estilo general de celdas
      row.eachCell((cell) => {
        cell.font = { name: "Calibri", size: 11 };
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.border = {
          top: { style: "thin", color: { argb: "E0E0E0" } },
          left: { style: "thin", color: { argb: "E0E0E0" } },
          bottom: { style: "thin", color: { argb: "E0E0E0" } },
          right: { style: "thin", color: { argb: "E0E0E0" } },
        };
      });

      item++;
    });

    // ======== SEPARACIÓN ANTES DE TOTALES ========
    worksheet.addRow([]);
    worksheet.addRow([]);

    // ======== TOTALES ========
    const totalRow = worksheet.addRow([
      "",
      "",
      "TOTAL DE EVENTOS:",
      hrs_extracurriculares.length,
      totalHoras,
    ]);

    totalRow.eachCell((cell) => {
      cell.font = { bold: true, name: "Calibri", size: 11 };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF2CC" }, // Amarillo suave profesional
      };
      cell.border = {
        top: { style: "thin", color: { argb: "B7B7B7" } },
        left: { style: "thin", color: { argb: "B7B7B7" } },
        bottom: { style: "thin", color: { argb: "B7B7B7" } },
        right: { style: "thin", color: { argb: "B7B7B7" } },
      };
    });

    // ======== DESCARGA ========
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=horas_extracurriculares.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error al generar el Excel",
      devmsg: error,
      respuesta: false,
    });
  } finally {
    prisma.$disconnect();
  }
};

module.exports = controller;
