import { notFound } from 'next/navigation';
import { RECURSOS } from '../../lib';
import { Formulario } from '../../componentes';

// Crear
export default function Nuevo({ params }) {
  const cfg = RECURSOS[params.recurso];
  if (!cfg) notFound();
  return (
    <>
      <h1>{cfg.nuevo}</h1>
      <Formulario recurso={params.recurso} />
    </>
  );
}
