import { pool } from '../config/database.js';

export const getVentas = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT v.id, v.fecha, v.total,
             c.nombre AS cliente_nombre,
             c.apellido AS cliente_apellido
      FROM ventas v
      INNER JOIN clientes c ON v.cliente_id = c.id
      ORDER BY v.id DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getVentaById = async (req, res) => {
  try {
    const [venta] = await pool.query(`
      SELECT v.id, v.fecha, v.total, v.cliente_id,
             c.nombre AS cliente_nombre,
             c.apellido AS cliente_apellido
      FROM ventas v
      INNER JOIN clientes c ON v.cliente_id = c.id
      WHERE v.id = ?
    `, [req.params.id]);

    if (venta.length === 0) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }

    const [detalle] = await pool.query(`
      SELECT d.id, d.producto_id, d.cantidad, d.precio_unitario, d.subtotal,
             p.nombre AS producto_nombre
      FROM detalle_ventas d
      INNER JOIN productos p ON d.producto_id = p.id
      WHERE d.venta_id = ?
    `, [req.params.id]);

    res.json({ ...venta[0], detalle });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createVenta = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { cliente_id, fecha, items } = req.body;

    if (!cliente_id || !fecha || !items || !Array.isArray(items) || items.length === 0) {
      conn.release();
      return res.status(400).json({
        message: 'cliente_id, fecha e items (array no vacío) son obligatorios'
      });
    }

    await conn.beginTransaction();

    let total = 0;
    for (const item of items) {
      if (!item.producto_id || !item.cantidad || item.precio_unitario === undefined) {
        throw new Error('Cada item requiere producto_id, cantidad y precio_unitario');
      }
      total += item.cantidad * item.precio_unitario;
    }

    const [ventaResult] = await conn.query(
      'INSERT INTO ventas (cliente_id, fecha, total) VALUES (?, ?, ?)',
      [cliente_id, fecha, total]
    );


    for (const item of items) {
      const subtotal = item.cantidad * item.precio_unitario;
      await conn.query(
        'INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)',
        [ventaResult.insertId, item.producto_id, item.cantidad, item.precio_unitario, subtotal]
      );
    }

    await conn.commit();

    res.status(201).json({
      id: ventaResult.insertId,
      cliente_id,
      fecha,
      total,
      items: items.length
    });
  } catch (error) {
    await conn.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    conn.release();
  }
};

export const deleteVenta = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM ventas WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }
    res.json({ message: 'Venta eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};