import { notFound } from 'next/navigation';
import { RECURSOS, api } from '../../../lib';
import { Formulario } from '../../../componentes';

export const dynamic = 'force-dynamic';

// Editar
export default async function Editar({ params }) {
  const { recurso, id } = params;
  if (!RECURSOS[recurso]) notFound();
  const fila = await api(`${recurso}/${id}`);
  if (!fila) notFound();
  return (
    <>
      <h1>Editar registro</h1>
      <Formulario recurso={recurso} inicial={fila} />
    </>
  );
}
