import { pool } from '../config/postgres.js';

const schema = 'juan_echandia';

export async function insertarProveedor({ nombre, email }) {
  const q = `
    insert into ${schema}.proveedores (nombre, email)
    values ($1, $2)
    returning id, nombre, email
  `;
  const r = await pool.query(q, [nombre, email]);
  return r.rows[0];
}

export async function listarProveedores() {
  const q = `select id, nombre, email from ${schema}.proveedores order by nombre asc`;
  const r = await pool.query(q);
  return r.rows;
}

export async function obtenerProveedorPorEmail(email) {
  const q = `select id from ${schema}.proveedores where email = $1`;
  const r = await pool.query(q, [email]);
  return r.rows[0] || null;
}

export async function eliminarProveedor(id) {
  const q = `
    delete from ${schema}.proveedores
    where id = $1::uuid
    returning id, nombre, email
  `;
  const r = await pool.query(q, [id]);
  return r.rows[0] || null;
}