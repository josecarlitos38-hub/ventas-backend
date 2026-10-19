import { Router } from 'express';
import {
  getVentas,
  getVentaById,
  createVenta,
  deleteVenta
} from '../controllers/ventas.controller.js';

const router = Router();

router.get('/', getVentas);
router.get('/:id', getVentaById);
router.post('/', createVenta);
router.delete('/:id', deleteVenta);

export default router;