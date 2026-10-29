import Link from 'next/link';
import { api } from './lib';

export const dynamic = 'force-dynamic';

// Indicadores del dossier (sección 6)
const KPIS = [
  ['Zero Harm', 'Previene fallos catastróficos y explosiones con alertas tempranas.'],
  ['−20 % de consumo energético', 'Optimiza la alineación de motores y reduce la sobrecarga operacional.'],
  ['+35 % de tiempo de actividad', 'Minimiza las paradas no programadas con mantenimiento predictivo.'],
  ['EU AI Act compliant', 'Auditorías éticas, trazabilidad y explicabilidad exigidas por la UE.'],
];

const GRUPOS = [
  ['percepción', 'Percepción multimodal', 'Fusión temprana de sensores en un espacio latente común.'],
  ['razonamiento', 'Razonamiento neuro-simbólico', 'Redes neuronales para detectar, lógica de ingeniería para verificar.'],
  ['explicabilidad', 'Explicabilidad y humano en el bucle', 'El técnico siempre entiende el porqué y decide.'],
  ['datos', 'Estrategia de datos', 'Simulación y aprendizaje continuo ante la escasez de fallos reales.'],
];

export default async function Inicio() {
  const componentes = (await api('components')) || [];
  return (
    <>
      <section className="hero">
        <div className="hero-texto">
          <h1>Detecta el fallo antes de que pare la planta</h1>
          <p>
            OmniSense unifica IA multimodal y razonamiento neuro-simbólico para ofrecer diagnósticos
            en tiempo real, sin alucinaciones y explicados al operador.
          </p>
          <Link className="btn claro" href="/machines">Ver máquinas monitorizadas</Link>
        </div>
      </section>

      <section className="dos">
        <div>
          <h2>El problema</h2>
          <p>
            Los modelos puramente estadísticos o la visión por computador aislada no correlacionan datos
            heterogéneos y son propensos a alucinaciones. Analizar cada sensor por separado no basta para
            entender la salud de una planta industrial.
          </p>
        </div>
        <div>
          <h2>La propuesta</h2>
          <p>
            Sensores físicos (térmicos, acústicos, vibratorios) y documentación técnica, combinados con
            lógica explícita de ingeniería. Cada alerta neuronal se verifica contra la física del sistema
            antes de llegar al técnico.
          </p>
        </div>
      </section>

      <section>
        <h2>Componentes de la plataforma</h2>
        {GRUPOS.map(([clave, titulo, resumen]) => (
          <div key={clave} className="grupo">
            <h3>{titulo}</h3>
            <p className="suave">{resumen}</p>
            <div className="rejilla">
              {componentes.filter((c) => c.category === clave).map((c) => (
                <Link key={c.id} href={`/components/${c.id}`} className="tarjeta">
                  <h4>{c.name}</h4>
                  <p>{c.description}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}
        {componentes.length === 0 && <p className="error">No se pudo cargar el catálogo desde la API.</p>}
      </section>

      <section>
        <h2>Impacto operativo</h2>
        <div className="rejilla">
          {KPIS.map(([t, d]) => (
            <div key={t} className="tarjeta kpi"><h4>{t}</h4><p>{d}</p></div>
          ))}
        </div>
      </section>

      <section>
        <h2>Gestiona los registros</h2>
        <div className="acciones">
          <Link className="btn" href="/machines">Máquinas</Link>
          <Link className="btn" href="/faults">Fallos</Link>
          <Link className="btn" href="/components">Componentes</Link>
        </div>
      </section>
    </>
  );
}
