import { pool } from '../config/database.js';

export const getClientes = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM clientes');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getClienteById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM clientes WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createCliente = async (req, res) => {
  try {
    const { nombre, apellido, email, telefono } = req.body;
    if (!nombre || !apellido) {
      return res.status(400).json({ message: 'Nombre y apellido son obligatorios' });
    }
    const [result] = await pool.query(
      'INSERT INTO clientes (nombre, apellido, email, telefono) VALUES (?, ?, ?, ?)',
      [nombre, apellido, email, telefono]
    );
    res.status(201).json({
      id: result.insertId,
      nombre,
      apellido,
      email,
      telefono
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCliente = async (req, res) => {
  try {
    const { nombre, apellido, email, telefono } = req.body;
    const [result] = await pool.query(
      'UPDATE clientes SET nombre = ?, apellido = ?, email = ?, telefono = ? WHERE id = ?',
      [nombre, apellido, email, telefono, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.json({ message: 'Cliente actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCliente = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM clientes WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.json({ message: 'Cliente eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};