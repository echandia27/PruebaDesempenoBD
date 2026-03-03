import { Router } from 'express';
import { create, getAll, deleteById } from '../controllers/categorias.controller.js';

export const categoriasRoutes = Router();

categoriasRoutes.post('/', create);
categoriasRoutes.get('/', getAll);
categoriasRoutes.delete('/:id', deleteById);