'use client';
// Componentes interactivos del CRUD: formulario (crear/editar) y botón de eliminar.
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RECURSOS } from './lib';

export function Formulario({ recurso, inicial }) {
  const cfg = RECURSOS[recurso];
  const router = useRouter();
  const [datos, setDatos] = useState(inicial || {});
  const [listas, setListas] = useState({});
  const [error, setError] = useState('');

  // Carga las opciones de los campos relacionados (p. ej. máquinas para un fallo)
  useEffect(() => {
    cfg.campos.filter((c) => c.t === 'ref').forEach((c) =>
      fetch(`/api/${c.ref}`).then((r) => r.json()).then((l) => setListas((p) => ({ ...p, [c.n]: l })))
    );
  }, [recurso]);

  const cambiar = (n) => (e) => setDatos({ ...datos, [n]: e.target.value });

  async function enviar(e) {
    e.preventDefault();
    setError('');
    const res = await fetch(inicial ? `/api/${recurso}/${inicial.id}` : `/api/${recurso}`, {
      method: inicial ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return setError((json.detalles || [json.error || 'Error inesperado']).join('. '));
    router.push(`/${recurso}/${json.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={enviar}>
      {cfg.campos.map((c) => (
        <label key={c.n}>
          {c.l}
          {c.t === 'textarea' ? (
            <textarea rows={4} maxLength={255} value={datos[c.n] ?? ''} onChange={cambiar(c.n)} />
          ) : c.t === 'select' || c.t === 'ref' ? (
            <select required={!c.opcional} value={datos[c.n] ?? ''} onChange={cambiar(c.n)}>
              <option value="">Selecciona una opción</option>
              {c.t === 'select'
                ? c.op.map((o) => <option key={o} value={o}>{o}</option>)
                : (listas[c.n] || []).map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
          ) : (
            <input required={!c.opcional} maxLength={120} value={datos[c.n] ?? ''} onChange={cambiar(c.n)} />
          )}
        </label>
      ))}
      {error && <p className="error">{error}</p>}
      <div className="acciones">
        <button className="btn" type="submit">{inicial ? 'Guardar cambios' : 'Crear'}</button>
        <button className="btn sec" type="button" onClick={() => router.back()}>Cancelar</button>
      </div>
    </form>
  );
}

export function BotonEliminar({ recurso, id, volver }) {
  const router = useRouter();
  async function borrar() {
    if (!confirm('¿Eliminar este registro? Esta acción no se puede deshacer.')) return;
    const res = await fetch(`/api/${recurso}/${id}`, { method: 'DELETE' });
    if (!res.ok) return alert('No se pudo eliminar el registro.');
    router.push(volver);
    router.refresh();
  }
  return <button className="btn peligro" onClick={borrar}>Eliminar</button>;
}
