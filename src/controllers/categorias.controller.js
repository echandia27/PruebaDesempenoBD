import {
  crearCategoria,
  obtenerCategorias,
  borrarCategoria,
} from '../services/categorias.service.js';

export async function create(req, res, next) {
  try {
    const categoria = await crearCategoria(req.body.nombre);
    res.status(201).json({ ok: true, data: categoria });
  } catch (err) {
    next(err);
  }
}

export async function getAll(req, res, next) {
  try {
    const categorias = await obtenerCategorias();
    res.status(200).json({ ok: true, data: categorias });
  } catch (err) {
    next(err);
  }
}

export async function deleteById(req, res, next) {
  try {
    await borrarCategoria(req.params.id);
    res.status(200).json({ ok: true, message: 'categoria eliminada' });
  } catch (err) {
    next(err);
  }
}