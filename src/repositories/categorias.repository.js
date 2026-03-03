import { pool } from '../config/postgres.js';

const schema = 'juan_echandia';

export async function insertarCategoria(nombre) {
  const q = `
    insert into ${schema}.categorias (nombre)
    values ($1)
    returning id, nombre
  `;
  const r = await pool.query(q, [nombre]);
  return r.rows[0];
}

export async function listarCategorias() {
  const q = `select id, nombre from ${schema}.categorias order by nombre asc`;
  const r = await pool.query(q);
  return r.rows;
}

export async function obtenerCategoriaPorNombre(nombre) {
  const q = `select id, nombre from ${schema}.categorias where nombre = $1`;
  const r = await pool.query(q, [nombre]);
  return r.rows[0] || null;
}

export async function eliminarCategoria(id) {
  const q = `
    delete from ${schema}.categorias
    where id = $1::uuid
    returning id, nombre
  `;
  const r = await pool.query(q, [id]);
  return r.rows[0] || null;
}