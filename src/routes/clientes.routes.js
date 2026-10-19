import { Router } from 'express';
import {
  getClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente
} from '../controllers/clientes.controller.js';

const router = Router();

router.get('/', getClientes);           // GET /api/clientes
router.get('/:id', getClienteById);    // GET /api/clientes/:id
router.post('/', createCliente);        // POST /api/clientes
router.put('/:id', updateCliente);      // PUT /api/clientes/:id
router.delete('/:id', deleteCliente);   // DELETE /api/clientes/:id

export default router;