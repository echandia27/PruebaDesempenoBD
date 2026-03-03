import {
  insertarProducto,
  listarProductos,
  obtenerProductoPorId,
  obtenerProductoPorSku,
  actualizarProducto,
  eliminarProducto,
  existeCategoria,
  existeProveedor,
} from '../repositories/productos.repository.js';

function httpError(statusCode, publicMessage) {
  const err = new Error(publicMessage);
  err.statusCode = statusCode;
  err.publicMessage = publicMessage;
  return err;
}

export async function crearProducto(data) {
  const { sku, nombre, categoria_id, proveedor_id } = data;

  if (!sku || !nombre || !categoria_id || !proveedor_id) {
    throw httpError(400, 'faltan campos requeridos: sku, nombre, categoria_id, proveedor_id');
  }

  const skuExists = await obtenerProductoPorSku(sku);
  if (skuExists) throw httpError(400, 'ya existe un producto con ese sku');

  const catOk = await existeCategoria(categoria_id);
  if (!catOk) throw httpError(404, 'categoria no encontrada');

  const provOk = await existeProveedor(proveedor_id);
  if (!provOk) throw httpError(404, 'proveedor no encontrado');

  return insertarProducto({ sku, nombre, categoria_id, proveedor_id });
}

export async function obtenerProductos() {
  return listarProductos();
}

export async function obtenerProducto(id) {
  if (!id) throw httpError(400, 'id requerido');
  const p = await obtenerProductoPorId(id);
  if (!p) throw httpError(404, 'producto no encontrado');
  return p;
}

export async function editarProducto(id, data) {
  const { sku, nombre, categoria_id, proveedor_id } = data;

  if (!sku || !nombre || !categoria_id || !proveedor_id) {
    throw httpError(400, 'faltan campos requeridos: sku, nombre, categoria_id, proveedor_id');
  }

  const actual = await obtenerProductoPorId(id);
  if (!actual) throw httpError(404, 'producto no encontrado');

  // si cambió el sku, validar unique
  if (sku !== actual.sku) {
    const other = await obtenerProductoPorSku(sku);
    if (other) throw httpError(400, 'ya existe un producto con ese sku');
  }

  const catOk = await existeCategoria(categoria_id);
  if (!catOk) throw httpError(404, 'categoria no encontrada');

  const provOk = await existeProveedor(proveedor_id);
  if (!provOk) throw httpError(404, 'proveedor no encontrado');

  const updated = await actualizarProducto(id, { sku, nombre, categoria_id, proveedor_id });
  if (!updated) throw httpError(500, 'no se pudo actualizar el producto');

  return updated;
}

export async function borrarProducto(id) {
  if (!id) throw httpError(400, 'id requerido');
  const deletedSnapshot = await eliminarProducto(id);
  if (!deletedSnapshot) throw httpError(404, 'producto no encontrado');
  return deletedSnapshot; // snapshot para auditoría
}