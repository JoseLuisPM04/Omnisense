// API REST de Omnisense (Express + MariaDB).
// Un único CRUD genérico, configurado por recurso (máquinas, fallos, componentes).
const express = require('express');
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset: 'utf8mb4',
  waitForConnections: true,
  connectionLimit: 10,
});

// Cada recurso define su tabla, la consulta base (alias "t") y las reglas de validación.
// req = obligatorio, max = longitud máxima (255 por defecto),
// opciones = valores permitidos, entero = número entero positivo.
const RECURSOS = {
  machines: {
    tabla: 'machines',
    select: 'SELECT t.* FROM machines t',
    campos: {
      name: { req: true, max: 100 },
      type: { req: true, max: 50 },
      location: { max: 100 },
      status: { req: true, opciones: ['operativa', 'alerta', 'parada'] },
    },
  },
  faults: {
    tabla: 'faults',
    select: 'SELECT t.*, m.name AS machine_name FROM faults t LEFT JOIN machines m ON m.id = t.machine_id',
    campos: {
      machine_id: { req: true, entero: true },
      title: { req: true, max: 120 },
      severity: { req: true, opciones: ['baja', 'media', 'alta', 'crítica'] },
      detected_by: { opciones: ['térmico', 'acústico', 'vibración', 'visión', 'documental'] },
      status: { req: true, opciones: ['abierto', 'en revisión', 'resuelto'] },
    },
  },
  components: {
    tabla: 'components',
    select: 'SELECT t.* FROM components t',
    campos: {
      name: { req: true, max: 100 },
      category: { req: true, opciones: ['percepción', 'razonamiento', 'explicabilidad', 'datos'] },
      description: {},
    },
  },
};

// Valida el cuerpo de la petición: devuelve los datos limpios y la lista de errores.
function validar(cfg, body) {
  const datos = {};
  const errores = [];
  for (const [campo, r] of Object.entries(cfg.campos)) {
    let v = body ? body[campo] : undefined;
    if (typeof v === 'string') v = v.trim();
    if (v === undefined || v === null || v === '') {
      if (r.req) errores.push(`El campo "${campo}" es obligatorio`);
      datos[campo] = null;
      continue;
    }
    if (r.entero) {
      v = Number(v);
      if (!Number.isInteger(v) || v < 1) errores.push(`El campo "${campo}" debe ser un entero positivo`);
    } else if (typeof v !== 'string') {
      errores.push(`El campo "${campo}" debe ser texto`);
    } else if (r.opciones && !r.opciones.includes(v)) {
      errores.push(`El campo "${campo}" debe ser uno de: ${r.opciones.join(', ')}`);
    } else if (v.length > (r.max || 255)) {
      errores.push(`El campo "${campo}" no puede superar ${r.max || 255} caracteres`);
    }
    datos[campo] = v;
  }
  return { datos, errores };
}

const app = express();
app.use(express.json());

// Envuelve handlers async para que sus errores lleguen al manejador de errores
const a = (fn) => (req, res, next) => fn(req, res).catch(next);

app.get('/api/health', (req, res) => res.json({ ok: true }));

// Resuelve el recurso de la URL (/api/machines, /api/faults, /api/components)
app.use('/api/:recurso', (req, res, next) => {
  const cfg = RECURSOS[req.params.recurso];
  if (!cfg) return res.status(404).json({ error: 'Recurso no encontrado' });
  req.cfg = cfg;
  next();
});

// Lee un registro por id (o null si no existe)
async function leer(cfg, id) {
  const [filas] = await pool.query(`${cfg.select} WHERE t.id = ?`, [id]);
  return filas[0] || null;
}

// Valida el id de la URL; responde 400 si no es válido
function idValido(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: 'Identificador no válido' });
    return null;
  }
  return id;
}

// Listar
app.get('/api/:recurso', a(async (req, res) => {
  const [filas] = await pool.query(`${req.cfg.select} ORDER BY t.id`);
  res.json(filas);
}));

// Ver
app.get('/api/:recurso/:id', a(async (req, res) => {
  const id = idValido(req, res);
  if (!id) return;
  const fila = await leer(req.cfg, id);
  if (!fila) return res.status(404).json({ error: 'Registro no encontrado' });
  res.json(fila);
}));

// Crear
app.post('/api/:recurso', a(async (req, res) => {
  const { datos, errores } = validar(req.cfg, req.body);
  if (errores.length) return res.status(400).json({ error: 'Datos no válidos', detalles: errores });
  const [r] = await pool.query('INSERT INTO ?? SET ?', [req.cfg.tabla, datos]);
  res.status(201).json(await leer(req.cfg, r.insertId));
}));

// Editar (se envía el registro completo)
app.put('/api/:recurso/:id', a(async (req, res) => {
  const id = idValido(req, res);
  if (!id) return;
  const { datos, errores } = validar(req.cfg, req.body);
  if (errores.length) return res.status(400).json({ error: 'Datos no válidos', detalles: errores });
  const [r] = await pool.query('UPDATE ?? SET ? WHERE id = ?', [req.cfg.tabla, datos, id]);
  if (r.affectedRows === 0) return res.status(404).json({ error: 'Registro no encontrado' });
  res.json(await leer(req.cfg, id));
}));

// Eliminar
app.delete('/api/:recurso/:id', a(async (req, res) => {
  const id = idValido(req, res);
  if (!id) return;
  const [r] = await pool.query('DELETE FROM ?? WHERE id = ?', [req.cfg.tabla, id]);
  if (r.affectedRows === 0) return res.status(404).json({ error: 'Registro no encontrado' });
  res.status(204).end();
}));

// Manejo de errores
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'JSON no válido' });
  if (err.code === 'ER_NO_REFERENCED_ROW_2') return res.status(400).json({ error: 'La máquina indicada no existe' });
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const puerto = process.env.PORT || 4000;
app.listen(puerto, () => console.log(`API Omnisense escuchando en el puerto ${puerto}`));
