import { pool } from '../config/postgres.js';

const schema = 'juan_echandia';

export async function insertarProducto({ sku, nombre, categoria_id, proveedor_id }) {
  const q = `
    insert into ${schema}.productos (sku, nombre, categoria_id, proveedor_id)
    values ($1, $2, $3::uuid, $4::uuid)
    returning id, sku, nombre, categoria_id, proveedor_id
  `;
  const r = await pool.query(q, [sku, nombre, categoria_id, proveedor_id]);
  return r.rows[0];
}

export async function listarProductos() {
  const q = `
    select p.id, p.sku, p.nombre,
           p.categoria_id, c.nombre as categoria_nombre,
           p.proveedor_id, pr.nombre as proveedor_nombre
    from ${schema}.productos p
    join ${schema}.categorias c on c.id = p.categoria_id
    join ${schema}.proveedores pr on pr.id = p.proveedor_id
    order by p.nombre asc
    limit 500
  `;
  const r = await pool.query(q);
  return r.rows;
}

export async function obtenerProductoPorId(id) {
  const q = `
    select p.id, p.sku, p.nombre,
           p.categoria_id, c.nombre as categoria_nombre,
           p.proveedor_id, pr.nombre as proveedor_nombre
    from ${schema}.productos p
    join ${schema}.categorias c on c.id = p.categoria_id
    join ${schema}.proveedores pr on pr.id = p.proveedor_id
    where p.id = $1::uuid
  `;
  const r = await pool.query(q, [id]);
  return r.rows[0] || null;
}

export async function obtenerProductoPorSku(sku) {
  const q = `select id, sku, nombre, categoria_id, proveedor_id from ${schema}.productos where sku = $1`;
  const r = await pool.query(q, [sku]);
  return r.rows[0] || null;
}

export async function actualizarProducto(id, { sku, nombre, categoria_id, proveedor_id }) {
  const q = `
    update ${schema}.productos
    set sku = $2,
        nombre = $3,
        categoria_id = $4::uuid,
        proveedor_id = $5::uuid
    where id = $1::uuid
    returning id, sku, nombre, categoria_id, proveedor_id
  `;
  const r = await pool.query(q, [id, sku, nombre, categoria_id, proveedor_id]);
  return r.rows[0] || null;
}

export async function eliminarProducto(id) {
  const q = `
    delete from ${schema}.productos
    where id = $1::uuid
    returning id, sku, nombre, categoria_id, proveedor_id
  `;
  const r = await pool.query(q, [id]);
  return r.rows[0] || null; // snapshot borrado si existía
}

// helpers: validar FK exista
export async function existeCategoria(id) {
  const q = `select 1 from ${schema}.categorias where id = $1::uuid`;
  const r = await pool.query(q, [id]);
  return r.rowCount > 0;
}

export async function existeProveedor(id) {
  const q = `select 1 from ${schema}.proveedores where id = $1::uuid`;
  const r = await pool.query(q, [id]);
  return r.rowCount > 0;
}