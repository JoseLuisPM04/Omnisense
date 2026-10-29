import Link from 'next/link';
import { notFound } from 'next/navigation';
import { RECURSOS, api, valor } from '../lib';
import { BotonEliminar } from '../componentes';

export const dynamic = 'force-dynamic';

// Listar
export default async function Lista({ params }) {
  const { recurso } = params;
  const cfg = RECURSOS[recurso];
  if (!cfg) notFound();
  const filas = (await api(recurso)) || [];

  return (
    <>
      <div className="barra">
        <h1>{cfg.titulo}</h1>
        <Link className="btn" href={`/${recurso}/nuevo`}>{cfg.nuevo}</Link>
      </div>
      {filas.length === 0 ? (
        <p className="suave">Todavía no hay registros. Crea el primero con el botón de arriba.</p>
      ) : (
        <div className="scroll">
          <table>
            <thead>
              <tr>{cfg.campos.map((c) => <th key={c.n}>{c.l}</th>)}<th>Acciones</th></tr>
            </thead>
            <tbody>
              {filas.map((f) => (
                <tr key={f.id}>
                  {cfg.campos.map((c) => <td key={c.n}>{valor(f, c)}</td>)}
                  <td>
                    <div className="acciones">
                      <Link className="btn sec" href={`/${recurso}/${f.id}`}>Ver</Link>
                      <Link className="btn sec" href={`/${recurso}/${f.id}/editar`}>Editar</Link>
                      <BotonEliminar recurso={recurso} id={f.id} volver={`/${recurso}`} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
