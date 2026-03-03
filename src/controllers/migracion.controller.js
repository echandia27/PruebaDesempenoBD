import { migrarCsvBuffer } from '../services/migracion.service.js';

export async function cargarCsv(req, res, next) {
  try {
    if (!req.file?.buffer) {
      return res.status(400).json({ ok: false, message: "debes enviar un archivo csv en el campo 'archivo'" });
    }

    const resultado = await migrarCsvBuffer(req.file.buffer);

    res.status(200).json({
      ok: true,
      message: 'migracion ejecutada',
      ...resultado,
    });
  } catch (err) {
    next(err);
  }
}