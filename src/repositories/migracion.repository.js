const schema = 'juan_echandia';

// helper: ejecuta queries con el client de la transacción
async function q(client, text, values) {
  return client.query(text, values);
}

export async function upsertCliente(client, { nombre, email, telefono }) {
  const sql = `
    insert into ${schema}.clientes (nombre, email, telefono)
    values ($1, $2, $3)
    on conflict (email)
    do update set
      nombre = excluded.nombre,
      telefono = coalesce(excluded.telefono, ${schema}.clientes.telefono)
    returning id
  `;
  const r = await q(client, sql, [nombre, email, telefono || null]);
  return r.rows[0].id;
}

export async function upsertDireccion(client, { cliente_id, direccion_texto }) {
  const sql = `
    insert into ${schema}.direcciones (cliente_id, direccion_texto)
    values ($1::uuid, $2)
    on conflict (cliente_id, direccion_texto)
    do nothing
    returning id
  `;
  const r = await q(client, sql, [cliente_id, direccion_texto]);
  // si ya existía, no retorna rows; no necesitamos id estrictamente
  return r.rows[0]?.id || null;
}

export async function upsertProveedor(client, { nombre, email }) {
  const sql = `
    insert into ${schema}.proveedores (nombre, email)
    values ($1, $2)
    on conflict (email)
    do update set
      nombre = excluded.nombre
    returning id
  `;
  const r = await q(client, sql, [nombre, email]);
  return r.rows[0].id;
}

export async function upsertCategoria(client, { nombre }) {
  const sql = `
    insert into ${schema}.categorias (nombre)
    values ($1)
    on conflict (nombre)
    do update set nombre = excluded.nombre
    returning id
  `;
  const r = await q(client, sql, [nombre]);
  return r.rows[0].id;
}

export async function upsertProducto(client, { sku, nombre, categoria_id, proveedor_id }) {
  const sql = `
    insert into ${schema}.productos (sku, nombre, categoria_id, proveedor_id)
    values ($1, $2, $3::uuid, $4::uuid)
    on conflict (sku)
    do update set
      nombre = excluded.nombre,
      categoria_id = excluded.categoria_id,
      proveedor_id = excluded.proveedor_id
    returning id
  `;
  const r = await q(client, sql, [sku, nombre, categoria_id, proveedor_id]);
  return r.rows[0].id;
}

export async function upsertTransaccion(client, { codigo_transaccion, fecha, cliente_id }) {
  const sql = `
    insert into ${schema}.transacciones (codigo_transaccion, fecha, cliente_id)
    values ($1, $2::date, $3::uuid)
    on conflict (codigo_transaccion)
    do update set
      fecha = excluded.fecha,
      cliente_id = excluded.cliente_id
    returning id
  `;
  const r = await q(client, sql, [codigo_transaccion, fecha, cliente_id]);
  return r.rows[0].id;
}

export async function upsertDetalleTransaccion(client, {
  transaccion_id,
  producto_id,
  precio_unitario,
  cantidad,
  total_linea,
}) {
  const sql = `
    insert into ${schema}.detalle_transaccion
      (transaccion_id, producto_id, precio_unitario, cantidad, total_linea)
    values
      ($1::uuid, $2::uuid, $3::numeric, $4::int, $5::numeric)
    on conflict (transaccion_id, producto_id)
    do update set
      precio_unitario = excluded.precio_unitario,
      cantidad = excluded.cantidad,
      total_linea = excluded.total_linea
    returning id
  `;
  const r = await q(client, sql, [transaccion_id, producto_id, precio_unitario, cantidad, total_linea]);
  return r.rows[0].id;
}