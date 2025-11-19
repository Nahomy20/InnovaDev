# Sistema de Gestión de Empleados y Asistencias

Sistema completo para la gestión de empleados, asistencias, permisos, usuarios y horarios desarrollado con HTML, CSS y JavaScript.

## 📁 Estructura del Proyecto

```
sistem_empleados/
├── assets/
│   ├── css/
│   │   └── styles.css          # Estilos principales del sistema
│   ├── js/
│   │   └── main.js              # Lógica principal de JavaScript
│   └── img/                      # Imágenes del sistema
├── vistas/
│   ├── formulario_empleados.html
│   ├── formulario_asistencias.html
│   ├── formulario_permisos.html
│   ├── formulario_usuarios.html
│   ├── formulario_horarios.html
│   ├── reporte_empleados.html
│   ├── reporte_asistencias.html
│   ├── reporte_horarios.html
│   ├── reporte_permisos.html
│   └── reporte_usuarios.html
├── componentes/                 # Componentes reutilizables (futuro)
├── controladores/               # Controladores PHP (futuro)
├── modelos/                     # Modelos de datos (futuro)
├── base_datos/
│   └── empleados_asistencias_db.sql  # Script SQL de la base de datos
├── index.html                   # Página de login
└── main_layout.html             # Panel principal del administrador
```

## 🚀 Características

### Módulos Principales

1. **Dashboard**
   - Empleados activos
   - Ausentes del día
   - Tasa de puntualidad
   - Tendencia de asistencia semanal
   - Últimos fichajes registrados

2. **Gestión de Empleados**
   - Búsqueda por ID, nombre o cargo
   - Visualización de lista de empleados
   - Edición y eliminación

3. **Formularios de Control**
   - Registro de Empleados
   - Asistencias
   - Permisos (con justificación)
   - Usuarios
   - Horarios

4. **Reportes**
   - Reporte de Empleados
   - Reporte de Asistencias
   - Reporte de Horarios
   - Reporte de Permisos
   - Reporte de Usuarios

## 🎨 Diseño

- **Estilo Neumórfico**: Interfaz moderna con efectos neumórficos
- **Bootstrap 5**: Para componentes y estilos adicionales
- **Font Awesome**: Iconos vectoriales
- **Gradientes**: Fondos degradados para mejor estética
- **Responsive**: Diseño adaptable a diferentes tamaños de pantalla

## 🗄️ Base de Datos

La base de datos incluye las siguientes tablas:

- `empleados`: Información de empleados
- `usuarios`: Credenciales de acceso
- `asistencias`: Registros de asistencia
- `permisos`: Solicitudes de permisos
- `horarios`: Horarios de trabajo

El script SQL se encuentra en `base_datos/empleados_asistencias_db.sql`

## 📝 Uso

1. **Login**: 
   - Usuario: `oscar`
   - Contraseña: `osc4r23`

2. **Navegación**:
   - Dashboard: Vista general del sistema
   - Gestión de Empleados: Buscar y gestionar empleados
   - Formularios de Control: Acceso a los 5 formularios
   - Reportes: Visualización de reportes del sistema

## 🔧 Tecnologías Utilizadas

- HTML5
- CSS3 (con variables CSS y efectos neumórficos)
- JavaScript (ES6+)
- Bootstrap 5.3.0
- Font Awesome 6.0.0
- MySQL (para base de datos futura)

## 📋 Funcionalidades por Formulario

### Formulario de Empleados
- Registro de nuevos empleados
- Búsqueda y filtrado
- Edición y eliminación

### Formulario de Asistencias
- Registro de asistencias diarias
- Control de entrada y salida
- Estados: presente, tarde, ausente, permiso

### Formulario de Permisos
- Solicitud de permisos con justificación
- Tipos: médico, personal, fuerza mayor, vacaciones
- Estados: pendiente, aprobado, rechazado

### Formulario de Usuarios
- Creación de usuarios para empleados
- Asignación de roles (admin/empleado)
- Gestión de credenciales

### Formulario de Horarios
- Configuración de horarios de trabajo
- Horas de entrada y salida
- Asignación por empleado

## 🔐 Seguridad

- Validación de formularios en frontend
- Preparado para integración con backend
- Estructura lista para autenticación

## 📦 Próximas Mejoras

- Integración con base de datos MySQL
- Sistema de respaldo y restauración
- Autenticación completa
- Exportación de reportes a PDF/Excel
- Notificaciones en tiempo real

## 👨‍💻 Desarrollo

Sistema desarrollado para gestión completa de empleados y sus asistencias, con interfaz moderna y funcionalidades completas de CRUD.

---

**Versión**: 1.0.0  
**Estado**: Frontend Completo - Pendiente Integración Backend






