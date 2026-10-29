import Link from 'next/link';
import { notFound } from 'next/navigation';
import { RECURSOS, api, valor } from '../../lib';
import { BotonEliminar } from '../../componentes';

export const dynamic = 'force-dynamic';

// Ver
export default async function Ver({ params }) {
  const { recurso, id } = params;
  const cfg = RECURSOS[recurso];
  if (!cfg) notFound();
  const fila = await api(`${recurso}/${id}`);
  if (!fila) notFound();

  return (
    <>
      <div className="barra">
        <h1>{fila.name || fila.title}</h1>
        <div className="acciones">
          <Link className="btn sec" href={`/${recurso}`}>Volver al listado</Link>
          <Link className="btn" href={`/${recurso}/${id}/editar`}>Editar</Link>
          <BotonEliminar recurso={recurso} id={id} volver={`/${recurso}`} />
        </div>
      </div>
      <dl>
        {cfg.campos.map((c) => (
          <div key={c.n} className="fila"><dt>{c.l}</dt><dd>{valor(fila, c)}</dd></div>
        ))}
      </dl>
    </>
  );
}
