import express from 'express';
import cors from 'cors';
import { productosRoutes } from './routes/productos.route.js';
import { categoriasRoutes } from './routes/categorias.route.js';
import { proveedoresRoutes } from './routes/proveedores.route.js';
import { migracionRoutes } from './routes/migracion.route.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/categorias', categoriasRoutes);
app.use('/proveedores', proveedoresRoutes);
app.use('/migracion', migracionRoutes);

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/productos', productosRoutes);

// middleware de errores (último)
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.statusCode || 500;
  res.status(status).json({
    ok: false,
    message: err.publicMessage || 'error interno del servidor',
  });
});

export default app;