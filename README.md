# Omnisense

Aplicación web full-stack basada en el dossier técnico de **OmniSense AI Technologies S.L.**, una plataforma B2B de mantenimiento predictivo e inspección multimodal con razonamiento neuro-simbólico.

## Qué hace

- **Presenta el proyecto:** qué es, qué problema resuelve, sus componentes (percepción multimodal, razonamiento neuro-simbólico, explicabilidad XAI y estrategia de datos) y su propuesta de valor e impacto operativo.
- **CRUD completo** (listar, crear, ver, editar y eliminar) sobre tres entidades, sin usuarios ni login:
  - **Máquinas** (`machines`): nombre, tipo, ubicación y estado.
  - **Fallos** (`faults`): máquina asociada, descripción, gravedad, sensor que lo detectó y estado.
  - **Componentes** (`components`): componentes de la plataforma según el dossier, con categoría y descripción.
- La base de datos se crea con **datos de ejemplo**. Los 12 componentes provienen del dossier; las máquinas y los fallos son ejemplos ilustrativos inspirados en los escenarios que describe (motores, bombas, rodamientos; sobrecalentamiento, vibración, grietas), ya que el dossier no incluye casos concretos.

## Tecnologías

| Capa | Tecnología |
|---|---|
| Base de datos | MariaDB 11 |
| Backend | Node.js 20 + Express 4 + mysql2 |
| Frontend | React 18 + Next.js 14 (App Router) |
| Contenedores | Docker Compose |

### Por qué Next.js
Renderiza en servidor las páginas de lectura (inicio, listados, detalle), así que el contenido llega ya completo al navegador. Su enrutado por carpetas (`/[recurso]/nuevo`, `/[recurso]/[id]/editar`) permite construir las vistas del CRUD con muy poco código. Además, sus `rewrites` reenvían `/api/*` al backend, de modo que el navegador usa un único origen y no hace falta configurar CORS.

### Por qué Express
Es el framework estándar y más sencillo de Node.js para una API REST. Para un CRUD acotado basta con enrutado, `express.json()` y un manejador de errores, sin capas adicionales.

## Estructura

```
omnisense/
├── docker-compose.yml
├── .env.example
├── db/init.sql            # esquema + datos de ejemplo
├── backend/src/index.js   # API REST (CRUD genérico con validación)
└── frontend/app/          # páginas Next.js (inicio y CRUD)
```

## Despliegue con Docker Compose

Requisito único: tener **Docker** con **Docker Compose** (v2).

1. Entra en la carpeta del proyecto:
   ```bash
   cd omnisense
   ```
2. *(Opcional)* Si quieres cambiar contraseñas o puertos: `cp .env.example .env` y edita `.env`. Sin este paso se usan los valores por defecto.
3. Levanta todo con un único comando:
   ```bash
   docker compose up --build
   ```
   La primera vez construye las imágenes, instala las dependencias, crea la base de datos con sus datos de ejemplo y arranca los tres servicios.
4. Abre:
   - Web: <http://localhost:3000>
   - API: <http://localhost:4000/api/machines>

Para detener: `Ctrl + C` y `docker compose down`. Para reiniciar la base de datos desde cero (el `init.sql` solo se ejecuta con el volumen vacío): `docker compose down -v` y de nuevo `docker compose up --build`.

## API

| Método | Ruta | Acción |
|---|---|---|
| GET | `/api/{recurso}` | Listar |
| GET | `/api/{recurso}/{id}` | Ver |
| POST | `/api/{recurso}` | Crear |
| PUT | `/api/{recurso}/{id}` | Editar (registro completo) |
| DELETE | `/api/{recurso}/{id}` | Eliminar |

`{recurso}` es `machines`, `faults` o `components`. Errores: `400` (validación), `404` (no encontrado), `500` (interno). Al eliminar una máquina se eliminan también sus fallos.

## Herramientas de IA empleadas

- **Claude (Anthropic):** diseño de la arquitectura y generación del código, la configuración de Docker y esta documentación, a partir del dossier técnico del proyecto.
