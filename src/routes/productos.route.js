import { Router } from 'express';
import { create, getAll, getById, updateById, deleteById } from '../controllers/productos.controller.js';

export const productosRoutes = Router();

productosRoutes.post('/', create);
productosRoutes.get('/', getAll);
productosRoutes.get('/:id', getById);
productosRoutes.put('/:id', updateById);
productosRoutes.delete('/:id', deleteById);