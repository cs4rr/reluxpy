const express = require('express');
const { getDb, query, queryOne, run, lastInsertId } = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Obtener todas las categorías (público)
router.get('/', async (req, res) => {
  try {
    await getDb();
    const categories = query('SELECT * FROM categories ORDER BY name');
    res.json(categories);
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener categoría por slug (público)
router.get('/:slug', async (req, res) => {
  try {
    await getDb();
    const category = queryOne('SELECT * FROM categories WHERE slug = ?', [req.params.slug]);

    if (!category) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.json(category);
  } catch (error) {
    console.error('Error obteniendo categoría:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear categoría (admin)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'El nombre es requerido' });
    }

    const slug = name.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    await getDb();
    run(
      'INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)',
      [name, slug, description || null]
    );

    const id = lastInsertId();

    res.status(201).json({
      id,
      name,
      slug,
      description
    });
  } catch (error) {
    console.error('Error creando categoría:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar categoría (admin)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, description } = req.body;
    const { id } = req.params;

    await getDb();
    
    let slug;
    if (name) {
      slug = name.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    run(
      `UPDATE categories SET 
        name = COALESCE(?, name),
        slug = COALESCE(?, slug),
        description = COALESCE(?, description)
      WHERE id = ?`,
      [name, slug, description, id]
    );

    res.json({ message: 'Categoría actualizada' });
  } catch (error) {
    console.error('Error actualizando categoría:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar categoría (admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await getDb();
    run('DELETE FROM categories WHERE id = ?', [req.params.id]);
    res.json({ message: 'Categoría eliminada' });
  } catch (error) {
    console.error('Error eliminando categoría:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
