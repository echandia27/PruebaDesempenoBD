import {
  crearProveedor,
  obtenerProveedores,
  borrarProveedor,
} from '../services/proveedores.service.js';

export async function create(req, res, next) {
  try {
    const proveedor = await crearProveedor(req.body);
    res.status(201).json({ ok: true, data: proveedor });
  } catch (err) {
    next(err);
  }
}

export async function getAll(req, res, next) {
  try {
    const proveedores = await obtenerProveedores();
    res.status(200).json({ ok: true, data: proveedores });
  } catch (err) {
    next(err);
  }
}

export async function deleteById(req, res, next) {
  try {
    await borrarProveedor(req.params.id);
    res.status(200).json({ ok: true, message: 'proveedor eliminado' });
  } catch (err) {
    next(err);
  }
}