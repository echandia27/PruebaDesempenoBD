import {
  insertarProveedor,
  listarProveedores,
  obtenerProveedorPorEmail,
  eliminarProveedor,
} from '../repositories/proveedores.repository.js';

function httpError(status, message) {
  const err = new Error(message);
  err.statusCode = status;
  err.publicMessage = message;
  return err;
}

export async function crearProveedor(data) {
  const { nombre, email } = data;

  if (!nombre || !email)
    throw httpError(400, 'nombre y email requeridos');

  const existe = await obtenerProveedorPorEmail(email);
  if (existe) throw httpError(400, 'ya existe proveedor con ese email');

  return insertarProveedor({ nombre, email });
}

export async function obtenerProveedores() {
  return listarProveedores();
}

export async function borrarProveedor(id) {
  const deleted = await eliminarProveedor(id);
  if (!deleted) throw httpError(404, 'proveedor no encontrado');
  return deleted;
}