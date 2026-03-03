import {
  insertarCategoria,
  listarCategorias,
  obtenerCategoriaPorNombre,
  eliminarCategoria,
} from '../repositories/categorias.repository.js';

function httpError(status, message) {
  const err = new Error(message);
  err.statusCode = status;
  err.publicMessage = message;
  return err;
}

export async function crearCategoria(nombre) {
  if (!nombre) throw httpError(400, 'nombre requerido');

  const existe = await obtenerCategoriaPorNombre(nombre);
  if (existe) throw httpError(400, 'la categoria ya existe');

  return insertarCategoria(nombre);
}

export async function obtenerCategorias() {
  return listarCategorias();
}

export async function borrarCategoria(id) {
  const deleted = await eliminarCategoria(id);
  if (!deleted) throw httpError(404, 'categoria no encontrada');
  return deleted;
}