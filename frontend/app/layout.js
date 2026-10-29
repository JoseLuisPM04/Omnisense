import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: 'Omnisense · Mantenimiento predictivo multimodal',
  description: 'Mantenimiento predictivo e inspección multimodal con razonamiento neuro-simbólico.',
};

export default function Layout({ children }) {
  return (
    <html lang="es">
      <body>
        <header>
          <Link href="/" className="logo">OmniSense</Link>
          <nav>
            <Link href="/machines">Máquinas</Link>
            <Link href="/faults">Fallos</Link>
            <Link href="/components">Componentes</Link>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
