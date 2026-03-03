import {
  crearProducto,
  obtenerProductos,
  obtenerProducto,
  editarProducto,
  borrarProducto,
} from '../services/productos.service.js';

import { logDeleteProducto } from '../services/auditoria.service.js';

export async function create(req, res, next) {
  try {
    const producto = await crearProducto(req.body);
    res.status(201).json({ ok: true, data: producto });
  } catch (err) {
    next(err);
  }
}

export async function getAll(req, res, next) {
  try {
    const productos = await obtenerProductos();
    res.status(200).json({ ok: true, data: productos });
  } catch (err) {
    next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const producto = await obtenerProducto(req.params.id);
    res.status(200).json({ ok: true, data: producto });
  } catch (err) {
    next(err);
  }
}

export async function updateById(req, res, next) {
  try {
    const producto = await editarProducto(req.params.id, req.body);
    res.status(200).json({ ok: true, data: producto });
  } catch (err) {
    next(err);
  }
}

export async function deleteById(req, res, next) {
  try {
    const snapshot = await borrarProducto(req.params.id);

    // auditoría en mongo
    await logDeleteProducto({ productoSnapshot: snapshot, req });

    res.status(200).json({ ok: true, message: 'producto eliminado correctamente' });
  } catch (err) {
    next(err);
  }
}