const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { getDb, query, queryOne, run, lastInsertId } = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Configuración de multer para subir imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, webp)'));
    }
  }
});

// Obtener todos los productos (público)
router.get('/', async (req, res) => {
  try {
    const { category, active_only } = req.query;
    await getDb();

    let sql = `
      SELECT p.*, c.name as category_name, c.slug as category_slug 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id
    `;
    let conditions = [];
    let params = [];

    if (category) {
      conditions.push('c.slug = ?');
      params.push(category);
    }

    if (active_only === 'true') {
      conditions.push('p.is_active = 1');
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY p.created_at DESC';

    const products = query(sql, params);
    res.json(products);
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener producto por ID (público)
router.get('/:id', async (req, res) => {
  try {
    await getDb();
    const product = queryOne(`
      SELECT p.*, c.name as category_name, c.slug as category_slug 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `, [req.params.id]);

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error obteniendo producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear producto (admin)
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      wholesale_price,
      wholesale_min_quantity,
      stock,
      discount_percent,
      category_id
    } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: 'Nombre y precio son requeridos' });
    }

    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    await getDb();
    run(
      `INSERT INTO products 
        (name, description, price, wholesale_price, wholesale_min_quantity, stock, discount_percent, category_id, image_url) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        description || null,
        parseFloat(price),
        wholesale_price ? parseFloat(wholesale_price) : null,
        wholesale_min_quantity ? parseInt(wholesale_min_quantity) : 1,
        stock ? parseInt(stock) : 0,
        discount_percent ? parseInt(discount_percent) : 0,
        category_id ? parseInt(category_id) : null,
        image_url
      ]
    );

    const id = lastInsertId();

    res.status(201).json({
      message: 'Producto creado exitosamente',
      id,
      image_url
    });
  } catch (error) {
    console.error('Error creando producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar producto (admin)
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      wholesale_price,
      wholesale_min_quantity,
      stock,
      discount_percent,
      category_id,
      is_active
    } = req.body;

    await getDb();

    // Obtener imagen actual
    let image_url = null;
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
      
      // Eliminar imagen anterior si existe
      const oldProduct = queryOne('SELECT image_url FROM products WHERE id = ?', [id]);
      if (oldProduct && oldProduct.image_url) {
        const oldImage = path.join(__dirname, '..', oldProduct.image_url);
        if (fs.existsSync(oldImage)) {
          fs.unlinkSync(oldImage);
        }
      }
    }

    const updates = [];
    const params = [];

    if (name !== undefined) { updates.push('name = ?'); params.push(name); }
    if (description !== undefined) { updates.push('description = ?'); params.push(description); }
    if (price !== undefined) { updates.push('price = ?'); params.push(parseFloat(price)); }
    if (wholesale_price !== undefined) { updates.push('wholesale_price = ?'); params.push(wholesale_price ? parseFloat(wholesale_price) : null); }
    if (wholesale_min_quantity !== undefined) { updates.push('wholesale_min_quantity = ?'); params.push(parseInt(wholesale_min_quantity)); }
    if (stock !== undefined) { updates.push('stock = ?'); params.push(parseInt(stock)); }
    if (discount_percent !== undefined) { updates.push('discount_percent = ?'); params.push(parseInt(discount_percent)); }
    if (category_id !== undefined) { updates.push('category_id = ?'); params.push(category_id ? parseInt(category_id) : null); }
    if (is_active !== undefined) { updates.push('is_active = ?'); params.push(is_active === 'true' || is_active === true ? 1 : 0); }
    if (image_url) { updates.push('image_url = ?'); params.push(image_url); }

    updates.push('updated_at = CURRENT_TIMESTAMP');

    if (updates.length > 1) {
      params.push(id);
      run(`UPDATE products SET ${updates.join(', ')} WHERE id = ?`, params);
    }

    res.json({ message: 'Producto actualizado exitosamente', image_url });
  } catch (error) {
    console.error('Error actualizando producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar producto (admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await getDb();

    // Eliminar imagen si existe
    const product = queryOne('SELECT image_url FROM products WHERE id = ?', [req.params.id]);
    if (product && product.image_url) {
      const imagePath = path.join(__dirname, '..', product.image_url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    run('DELETE FROM products WHERE id = ?', [req.params.id]);

    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
