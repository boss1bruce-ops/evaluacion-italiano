# 📊 Evaluación de Italiano - Andiamo

## 🎯 Características Principales

- ✅ **Logo Andiamo integrado** en diseño minimalista
- ✅ Colores de marca (#D6A94A, #0F4C5C, #FAF9F6) + Tipografía Poppins
- ✅ **Encuesta demográfica OPCIONAL** - usuarios pueden saltarla
- ✅ 35 preguntas científicas (NVdB, CEFR, Krashen, Falsos Amigos)
- ✅ Algoritmo CEFR (A1→C1)
- ✅ **Panel admin privado** (solo tú)
- ✅ **Exportación Excel/CSV**

## 📁 Archivos

```
evaluacion-italiano/
├── index.html    # App estudiantes (público)
├── admin.html    # Panel admin (PRIVADO - no compartir)
├── styles.css
├── questions.js
├── app.js
├── logo.svg      # Logo Andiamo
└── README.md
```

## 🚀 Probar Localmente

**Estudiantes**: Abre `index.html`  
**Admin**: Abre `admin.html` (solo tú)

## 🆕 Mejoras Implementadas

### 1. Logo Andiamo
- Visible en landing page y panel admin
- 200px ancho, sombra sutil

### 2. Encuesta Opcional
Usuarios eligen:
- ✅ **Completar** → "Completar y Continuar"
- ✅ **Saltar** → "Saltar Encuesta e Iniciar Test"

Campo agregado: `surveyCompleted: true/false`

### 3. Panel Admin (`admin.html`)
**⚠️ NO COMPARTIR - SOLO TÚ**

Funciones:
- Estadísticas en tiempo real
- Tabla de resultados
- Exportar a CSV/Excel
- Abrir Google Sheet

### 4. Exportación de Datos

**Opción A**: Desde `admin.html` → Click "Exportar a Excel"  
**Opción B**: Google Sheets → Archivo → Descargar

Formato CSV con todos los campos + "Encuesta Completada"

## 📊 Configurar Google Sheets

### Paso 1: Crear Sheet
1. [Google Sheets](https://sheets.google.com) → Nuevo
2. Nombre: "Evaluaciones Andiamo"
3. **Compartir** → **Solo tú** (privado)

Encabezados:
```
Timestamp | Nombre | Email | Género | Edad | Idioma Nativo | Idiomas Previos | Tiempo Estudio | Motivación | Estudio Diario | Vocabulario | Gramática | Comprensión | Falsos Amigos | Nivel CEFR | Tiempo (min) | Encuesta Completada
```

### Paso 2: Apps Script
**Extensiones → Apps Script** → Pegar:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  
  sheet.appendRow([
    data.timestamp,
    data.name || 'Anónimo',
    data.email || 'No proporcionado',
    data.gender || 'N/A',
    data.age || 'N/A',
    data.nativeLanguage || 'N/A',
    data.previousLanguages || 'N/A',
    data.studyTime || 'N/A',
    data.motivation || 'N/A',
    data.dailyStudy || 'N/A',
    data.vocabulary || 0,
    data.grammar || 0,
    data.comprehension || 0,
    data.falseFriends || 0,
    data.cefrLevel || 'N/A',
    data.timeSpent || 0,
    data.surveyCompleted ? 'Sí' : 'No'
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({result: 'success'}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

**Implementar** → Aplicación web:
- Ejecutar como: **Yo**
- Acceso: **Cualquier persona**

Copia la URL generada.

### Paso 3: Conectar

**En `app.js` (línea 246)**:
```javascript
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/TU_URL/exec';
```

**En `admin.html` (línea 132)**:
```javascript
const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/TU_SHEET_ID/edit';
```

## 🔒 Privacidad (SOLO TÚ)

✅ Google Sheet: Restringido solo a tu email  
✅ `admin.html`: **NO SUBIR** a internet público  
✅ Mantener admin panel local o protegido con password

### Protección Opcional:
Agregar al inicio de `admin.html`:
```javascript
const PASSWORD = 'tu-password';
if (prompt('Password:') !== PASSWORD) location.href = 'index.html';
```

## 🌐 Publicar en GitHub Pages  

**⚠️ Solo subir archivos públicos**:

✅ Subir:
- `index.html`
- `styles.css`
- `questions.js`
- `app.js`
- `logo.svg`

❌ NO subir:
- `admin.html` ← Privado

Crear `.gitignore`:
```
admin.html
*.csv
```

**GitHub Desktop**:
1. New Repository → `evaluacion-italiano`
2. Publish → Public
3. GitHub.com → Settings → Pages → main branch

Link: `https://TU-USUARIO.github.io/evaluacion-italiano/`

## 📧 Compartir con Estudiantes

```
Descubre tu nivel de italiano 🇮🇹
https://tu-usuario.github.io/evaluacion-italiano/

✨ 15-20 minutos
📊 Resultados instantáneos
🗺️ Hoja de ruta personalizada

La encuesta es opcional - ¡puedes saltarla!
```

## 📊 Análisis de Datos

**Ejemplos**:

1. **Distribución**: ¿Mayoría es B1? → Crea curso B1→B2
2. **Debilidades**: ¿Falsos amigos 45%? → Curso específico
3. **Demografía**: ¿60% viajeros 25-34? → Marketing enfocado
4. **Tasa encuesta**: ¿65% completa? → Botón skip funciona

## 🛠️ Solución de Problemas

**No se envía a Sheets**: Verifica Apps Script implementado correctamente  
**CSV vacío**: Datos están en Google Sheets, exporta desde allí  
**Logo no aparece**: Verifica `logo.svg` en misma carpeta  
**Admin visible**: No compartas ese link, mantener local

## ✨ Resumen de Cambios

| Antes | Ahora |
|-------|-------|
| Sin logo | ✅ Logo Andiamo |
| Encuesta obligatoria | ✅ Opcional (botón saltar) |
| Solo Google Sheets | ✅ + CSV/Excel export |
| Sin panel admin | ✅ admin.html con stats |

---

**Andiamo - Italiano che ti porta**  
Colores: #D6A94A + #0F4C5C + #FAF9F6 | Poppins Font
