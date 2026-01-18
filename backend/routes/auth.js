const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb, queryOne } = require('../config/database');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'relux_secret_key';

// Login de administrador
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    await getDb(); // Asegurar que la DB está inicializada
    
    const admin = queryOne('SELECT * FROM admins WHERE email = ?', [email]);

    if (!admin) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const isValidPassword = bcrypt.compareSync(password, admin.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login exitoso',
      token,
      admin: { id: admin.id, email: admin.email }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Verificar token
router.get('/verify', async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ valid: false });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ valid: true, admin: decoded });
  } catch (error) {
    res.status(401).json({ valid: false });
  }
});

module.exports = router;
