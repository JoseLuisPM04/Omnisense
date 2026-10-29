-- Esquema inicial y datos de ejemplo de Omnisense
SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS machines (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  location VARCHAR(100),
  status VARCHAR(20) NOT NULL DEFAULT 'operativa'
);

-- Al borrar una máquina se borran sus fallos
CREATE TABLE IF NOT EXISTS faults (
  id INT AUTO_INCREMENT PRIMARY KEY,
  machine_id INT NOT NULL,
  title VARCHAR(120) NOT NULL,
  severity VARCHAR(20) NOT NULL,
  detected_by VARCHAR(20),
  status VARCHAR(20) NOT NULL DEFAULT 'abierto',
  FOREIGN KEY (machine_id) REFERENCES machines(id) ON DELETE CASCADE
);

-- Componentes de la plataforma OmniSense (según el dossier)
CREATE TABLE IF NOT EXISTS components (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(30) NOT NULL,
  description VARCHAR(255)
);

INSERT INTO machines (name, type, location, status) VALUES
 ('Motor eléctrico M-101', 'Motor', 'Línea 1', 'operativa'),
 ('Bomba centrífuga B-204', 'Bomba', 'Sala de bombeo', 'alerta'),
 ('Rodamiento principal R-310', 'Rodamiento', 'Línea 2', 'alerta'),
 ('Compresor C-402', 'Compresor', 'Planta de aire', 'operativa');

INSERT INTO faults (machine_id, title, severity, detected_by, status) VALUES
 (2, 'Sobrecalentamiento en el cierre del eje', 'alta', 'térmico', 'abierto'),
 (3, 'Vibración anómala en rodamiento', 'media', 'vibración', 'en revisión'),
 (1, 'Grieta superficial en la carcasa', 'crítica', 'visión', 'abierto'),
 (4, 'Ruido acústico fuera de rango', 'baja', 'acústico', 'resuelto');

INSERT INTO components (name, category, description) VALUES
 ('Visión óptica y térmica', 'percepción', 'Detecta grietas, desgaste superficial y mapas de temperatura con cámaras térmicas.'),
 ('Sensores IoT acústicos y de vibración', 'percepción', 'Captura frecuencias de sonido y series temporales de vibración en motores, bombas y rodamientos.'),
 ('Documentación y manuales técnicos', 'percepción', 'Analiza manuales de fabricante, especificaciones y registros históricos mediante PLN.'),
 ('Redes neuronales (Deep Learning y GNN)', 'razonamiento', 'Procesan a alta velocidad los patrones complejos de los flujos sensoriales continuos.'),
 ('Grafo de conocimiento empresarial', 'razonamiento', 'Estructura las leyes de la física, la topología de la planta y las reglas de ingeniería de cada máquina.'),
 ('Verificación lógica anti-alucinaciones', 'razonamiento', 'Contrasta cada anomalía detectada con la lógica física del sistema para eliminar falsos positivos.'),
 ('Mapas de calor Grad-CAM', 'explicabilidad', 'Colorean en tonos cálidos la zona exacta donde se origina el sobrecalentamiento o la grieta.'),
 ('Copiloto conversacional XAI', 'explicabilidad', 'Explica el diagnóstico en lenguaje natural combinando sensores y cláusulas del manual del fabricante.'),
 ('Bucle Human-in-the-Loop (HITL)', 'explicabilidad', 'El técnico supervisa y valida cada alerta antes de intervenir en planta.'),
 ('Gemelos digitales 3D', 'datos', 'Simulan plantas completas (Isaac Sim, MuJoCo) para generar datos sintéticos de fallos raros.'),
 ('Aprendizaje autosupervisado', 'datos', 'Preentrena los modelos con grandes volúmenes de datos sensoriales sin etiquetar.'),
 ('Data Flywheel', 'datos', 'Cada validación técnica de los usuarios reales retroalimenta y refina el modelo de forma continua.');
