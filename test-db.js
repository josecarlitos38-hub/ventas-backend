import { pool } from './src/config/database.js';

try {
  const [rows] = await pool.query('SELECT 1 + 1 AS resultado');
  console.log('¡Conectado a MySQL!');
  console.log('Resultado de prueba:', rows[0].resultado);
  process.exit(0);
} catch (error) {
  console.error('Error de conexión:', error.message);
  process.exit(1);
}