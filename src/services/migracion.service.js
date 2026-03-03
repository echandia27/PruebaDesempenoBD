import { pool } from '../config/postgres.js';
import { parse } from 'csv-parse/sync';

import {
  upsertCliente,
  upsertDireccion,
  upsertProveedor,
  upsertCategoria,
  upsertProducto,
  upsertTransaccion,
  upsertDetalleTransaccion,
} from '../repositories/migracion.repository.js';

function httpError(statusCode, publicMessage) {
  const err = new Error(publicMessage);
  err.statusCode = statusCode;
  err.publicMessage = publicMessage;
  return err;
}

// normaliza headers del csv a llaves "estables"
function normalizarFila(raw) {
  // soporta headers típicos del enunciado (pueden variar)
  const get = (...keys) => {
    for (const k of keys) {
      if (raw[k] !== undefined) return raw[k];
    }
    return undefined;
  };

  const codigo_transaccion = get('id transacción', 'id transaccion', 'transaction_id', 'id_transaccion', 'codigo_transaccion', 'id transacción ');
  const fecha = get('fecha', 'date');
  const cliente_nombre = get('nombre cliente', 'customer_name', 'nombre_cliente');
  const cliente_email = get('email cliente', 'customer_email', 'email_cliente');
  const direccion = get('dirección', 'direccion', 'address', 'customer_address');
  const categoria_nombre = get('categoría producto', 'categoria producto', 'product_category', 'categoria');
  const sku = get('sku', 'product_sku');
  const producto_nombre = get('nombre producto', 'product_name', 'nombre_producto');
  const precio_unitario = get('precio unitario', 'unit_price', 'precio_unitario');
  const cantidad = get('cantidad', 'quantity');
  const proveedor_nombre = get('nombre proveedor', 'supplier_name', 'proveedor');
  const proveedor_email = get('contacto proveedor', 'supplier_email', 'email_proveedor', 'contacto');

  return {
    codigo_transaccion: String(codigo_transaccion || '').trim(),
    fecha: String(fecha || '').trim(),
    cliente_nombre: String(cliente_nombre || '').trim(),
    cliente_email: String(cliente_email || '').trim().toLowerCase(),
    direccion: String(direccion || '').trim(),
    categoria_nombre: String(categoria_nombre || '').trim(),
    sku: String(sku || '').trim(),
    producto_nombre: String(producto_nombre || '').trim(),
    precio_unitario: String(precio_unitario || '').trim(),
    cantidad: String(cantidad || '').trim(),
    proveedor_nombre: String(proveedor_nombre || '').trim(),
    proveedor_email: String(proveedor_email || '').trim().toLowerCase(),
  };
}

function parseFechaISO(fechaStr) {
  // asumimos 'yyyy-mm-dd' (como en el ejemplo del excel)
  // si viene vacío o inválido, se rechaza
  if (!fechaStr) return null;
  // validación simple
  const m = /^\d{4}-\d{2}-\d{2}$/.test(fechaStr);
  if (!m) return null;
  return fechaStr;
}

function parseNumero(val) {
  if (val === null || val === undefined) return null;
  const n = Number(String(val).replace(',', '.'));
  if (Number.isNaN(n)) return null;
  return n;
}

export async function migrarCsvBuffer(buffer) {
  // 1) parse CSV a registros
  const csvText = buffer.toString('utf-8');

  const rawRows = parse(csvText, {
    columns: true,              // usa header
    skip_empty_lines: true,
    trim: true,
  });

  if (!Array.isArray(rawRows) || rawRows.length === 0) {
    throw httpError(400, 'el csv no tiene filas o no se pudo leer');
  }

  // 2) transacción
  const client = await pool.connect();
  let procesadas = 0;
  let errores = 0;

  try {
    await client.query('begin');

    for (let i = 0; i < rawRows.length; i++) {
      const row = normalizarFila(rawRows[i]);

      // validaciones mínimas por fila
      if (!row.codigo_transaccion || !row.cliente_email || !row.sku) {
        errores++;
        continue; // saltamos fila incompleta
      }

      const fecha = parseFechaISO(row.fecha);
      if (!fecha) {
        errores++;
        continue;
      }

      const precio = parseNumero(row.precio_unitario);
      const cant = parseNumero(row.cantidad);

      if (precio === null || cant === null || cant <= 0 || precio < 0) {
        errores++;
        continue;
      }

      const total_linea = Number((precio * cant).toFixed(2));

      // 3) upserts idempotentes
      const cliente_id = await upsertCliente(client, {
        nombre: row.cliente_nombre || 'sin nombre',
        email: row.cliente_email,
        telefono: null,
      });

      if (row.direccion) {
        await upsertDireccion(client, { cliente_id, direccion_texto: row.direccion });
      }

      const proveedor_id = await upsertProveedor(client, {
        nombre: row.proveedor_nombre || 'sin proveedor',
        email: row.proveedor_email || `sin-email-${row.sku}@local`,
      });

      const categoria_id = await upsertCategoria(client, {
        nombre: row.categoria_nombre || 'sin categoria',
      });

      const producto_id = await upsertProducto(client, {
        sku: row.sku,
        nombre: row.producto_nombre || 'sin nombre',
        categoria_id,
        proveedor_id,
      });

      const transaccion_id = await upsertTransaccion(client, {
        codigo_transaccion: row.codigo_transaccion,
        fecha,
        cliente_id,
      });

      await upsertDetalleTransaccion(client, {
        transaccion_id,
        producto_id,
        precio_unitario: precio,
        cantidad: Math.trunc(cant),
        total_linea,
      });

      procesadas++;
    }

    await client.query('commit');

    return {
      filas_total: rawRows.length,
      filas_procesadas: procesadas,
      filas_con_error: errores,
    };
  } catch (e) {
    await client.query('rollback');
    throw e;
  } finally {
    client.release();
  }
}