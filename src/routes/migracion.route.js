import { Router } from 'express';
import multer from 'multer';
import { cargarCsv } from '../controllers/migracion.controller.js';

export const migracionRoutes = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10mb
});

migracionRoutes.post('/csv', upload.single('archivo'), cargarCsv);