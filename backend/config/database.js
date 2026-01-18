const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, '..', 'relux.db');

let db = null;
let SQL = null;

async function getDb() {
  if (db) return db;

  SQL = await initSqlJs();
  
  // Cargar DB existente o crear nueva
  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
    initializeTables();
  }

  return db;
}

function saveDb() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
  }
}

// Helper para ejecutar queries con parámetros y obtener resultados
function query(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  
  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

// Helper para ejecutar INSERT/UPDATE/DELETE
function run(sql, params = []) {
  db.run(sql, params);
  saveDb();
}

// Helper para obtener una sola fila
function queryOne(sql, params = []) {
  const results = query(sql, params);
  return results.length > 0 ? results[0] : null;
}

// Helper para obtener el último ID insertado
function lastInsertId() {
  const result = db.exec('SELECT last_insert_rowid() as id');
  return result[0].values[0][0];
}

function initializeTables() {
  // Tabla de administradores
  db.run(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabla de categorías
  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabla de productos
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      wholesale_price REAL,
      wholesale_min_quantity INTEGER DEFAULT 1,
      stock INTEGER DEFAULT 0,
      discount_percent INTEGER DEFAULT 0,
      category_id INTEGER,
      image_url TEXT,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )
  `);

  // Insertar categorías por defecto
  const categories = [
    { name: 'Billeteras con Tarjetero', slug: 'billeteras-tarjetero', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400' },
    { name: 'Tarjeteros', slug: 'tarjeteros', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400' },
    { name: 'Relojes', slug: 'relojes', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400' },
    { name: 'Grabados', slug: 'grabados', image: 'https://images.unsplash.com/photo-1603189343302-e603f7add05a?w=400' }
  ];

  categories.forEach(cat => {
    db.run(
      'INSERT OR IGNORE INTO categories (name, slug, image_url) VALUES (?, ?, ?)',
      [cat.name, cat.slug, cat.image]
    );
  });

  // Crear admin por defecto
  const hashedPassword = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10);
  db.run(
    'INSERT OR IGNORE INTO admins (email, password) VALUES (?, ?)',
    [process.env.ADMIN_EMAIL || 'admin@relux.com', hashedPassword]
  );

  saveDb();
  console.log('✅ Base de datos inicializada con categorías y admin');
}

module.exports = { getDb, saveDb, query, queryOne, run, lastInsertId };
