import { Router } from 'express';
import { create, getAll, deleteById } from '../controllers/proveedores.controller.js';

export const proveedoresRoutes = Router();

proveedoresRoutes.post('/', create);
proveedoresRoutes.get('/', getAll);
proveedoresRoutes.delete('/:id', deleteById);