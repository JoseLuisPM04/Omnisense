// Configuración compartida de los recursos del CRUD y utilidades de acceso a la API.
// Cada campo: n = nombre en la API, l = etiqueta, t = tipo (text | textarea | select | ref),
// op = opciones del select, opcional = no obligatorio, ref/mostrar = relación con otro recurso.
export const RECURSOS = {
  machines: {
    titulo: 'Máquinas',
    nuevo: 'Nueva máquina',
    campos: [
      { n: 'name', l: 'Nombre', t: 'text' },
      { n: 'type', l: 'Tipo', t: 'text' },
      { n: 'location', l: 'Ubicación', t: 'text', opcional: true },
      { n: 'status', l: 'Estado', t: 'select', op: ['operativa', 'alerta', 'parada'] },
    ],
  },
  faults: {
    titulo: 'Fallos',
    nuevo: 'Nuevo fallo',
    campos: [
      { n: 'machine_id', l: 'Máquina', t: 'ref', ref: 'machines', mostrar: 'machine_name' },
      { n: 'title', l: 'Descripción', t: 'text' },
      { n: 'severity', l: 'Gravedad', t: 'select', op: ['baja', 'media', 'alta', 'crítica'] },
      { n: 'detected_by', l: 'Detectado por', t: 'select', op: ['térmico', 'acústico', 'vibración', 'visión', 'documental'], opcional: true },
      { n: 'status', l: 'Estado', t: 'select', op: ['abierto', 'en revisión', 'resuelto'] },
    ],
  },
  components: {
    titulo: 'Componentes',
    nuevo: 'Nuevo componente',
    campos: [
      { n: 'name', l: 'Nombre', t: 'text' },
      { n: 'category', l: 'Categoría', t: 'select', op: ['percepción', 'razonamiento', 'explicabilidad', 'datos'] },
      { n: 'description', l: 'Descripción', t: 'textarea', opcional: true },
    ],
  },
};

// Valor a mostrar de un campo (usa el nombre legible si es una relación)
export const valor = (fila, c) => fila[c.mostrar || c.n] ?? '—';

// Llamada a la API desde el servidor de Next (dentro de la red de Docker)
export async function api(ruta) {
  const base = process.env.API_URL || 'http://backend:4000';
  try {
    const r = await fetch(`${base}/api/${ruta}`, { cache: 'no-store' });
    return r.ok ? await r.json() : null;
  } catch {
    return null;
  }
}
