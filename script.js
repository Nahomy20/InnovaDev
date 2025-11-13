function loadDashboardContent() {
    return `
        <div class="content-header">
            <h2 class="module-title"><i class="fas fa-home"></i> Dashboard de Control</h2>
        </div>
        <div class="summary-cards">
            <div class="report-card neumorphic-card elevated">
                <div class="card-icon success-icon"><i class="fas fa-users"></i></div>
                <div class="card-content">
                    <p class="card-label">Empleados Activos</p>
                    <h3 class="card-value">125</h3>
                </div>
            </div>
            
            <div class="report-card neumorphic-card elevated">
                <div class="card-icon error-icon"><i class="fas fa-user-slash"></i></div>
                <div class="card-content">
                    <p class="card-label">Ausentes Hoy</p>
                    <h3 class="card-value">4</h3>
                </div>
            </div>
            
            <div class="report-card neumorphic-card elevated">
                <div class="card-icon primary-icon"><i class="fas fa-clock"></i></div>
                <div class="card-content">
                    <p class="card-label">Tasa de Puntualidad</p>
                    <h3 class="card-value">95%</h3>
                </div>
            </div>

            <div class="report-card neumorphic-card elevated">
                <div class="card-icon secondary-icon"><i class="fas fa-exclamation-triangle"></i></div>
                <div class="card-content">
                    <p class="card-label">Fichajes Pendientes</p>
                    <h3 class="card-value">12</h3>
                </div>
            </div>
        </div>
        <div class="chart-container neumorphic-card elevated" style="margin-top: 20px;">
            <h4 class="chart-title"><i class="fas fa-chart-bar"></i> Tendencia de Asistencia Semanal</h4>
            <canvas id="weeklyChart" height="100"></canvas>
            <p class="chart-placeholder">Gráfico simulado: Aquí se muestra la gráfica de asistencia/ausencia por día.</p>
        </div>
        <div class="table-area neumorphic-card elevated" style="margin-top: 20px;">
            <h4 class="chart-title"><i class="fas fa-list-alt"></i> Últimos Fichajes Registrados</h4>
            <div class="table-responsive">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Empleado</th>
                            <th>Entrada</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="odd-row"><td>10015</td><td>Ana López (Mantenimiento)</td><td>08:00 AM</td><td><span class="status-badge status-active">Puntual</span></td></tr>
                        <tr><td>10032</td><td>Luis Pérez (Ventas)</td><td>08:12 AM</td><td><span class="status-badge status-late">Tarde</span></td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function updateClock() {
    const clockElement = document.getElementById('currentTime');
    if (clockElement) {
        const now = new Date();
        const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
        const timeString = now.toLocaleTimeString('es-ES', options);
        clockElement.textContent = timeString;
    }
}

function loadEmployeesContent() {
    return `
        <div class="content-header">
            <h2 class="module-title"><i class="fas fa-users"></i> Gestión de Empleados</h2>
        </div>
        
        <div class="controls-bar neumorphic-card elevated">
            <input type="text" placeholder="Buscar por Nombre, ID o Cargo..." class="neumorphic-input" style="width: 300px;">
            <button class="neumorphic-button primary-button add-button">
                <i class="fas fa-plus"></i> Añadir Nuevo Empleado
            </button>
        </div>

        <div id="employeeFormArea" class="neumorphic-card elevated" style="margin-bottom: 20px; display: none;">
            <h4 class="chart-title">Añadir/Editar Empleado</h4>
            <form class="form-grid">
                <div class="input-group">
                    <label for="employeeName">Nombre Completo</label>
                    <input type="text" id="employeeName" class="neumorphic-input">
                </div>
                <div class="input-group">
                    <label for="employeeID">Carnet / ID</label>
                    <input type="text" id="employeeID" class="neumorphic-input">
                </div>
                <div class="input-group">
                    <label for="employeeRole">Cargo / Puesto</label>
                    <input type="text" id="employeeRole" class="neumorphic-input">
                </div>
                <div class="input-group">
                    <label for="employeeShift">Turno Asignado</label>
                    <select id="employeeShift" class="neumorphic-input">
                        <option>Matutino (8:00 - 17:00)</option>
                        <option>Vespertino (14:00 - 22:00)</option>
                    </select>
                </div>
                <div class="input-group">
                    <label for="employeePassword">Contraseña Inicial</label>
                    <input type="password" id="employeePassword" class="neumorphic-input">
                </div>
                <div style="grid-column: 1 / 3; text-align: right; margin-top: 10px;">
                    <button type="button" class="neumorphic-button secondary-button">Cancelar</button>
                    <button type="submit" class="neumorphic-button primary-button">Guardar Empleado</button>
                </div>
            </form>
        </div>

        <div class="table-area neumorphic-card elevated">
            <h4 class="chart-title"><i class="fas fa-list"></i> Lista de Empleados Registrados</h4>
            <div class="table-responsive">
                <table class="data-table">
                    <thead>
                        <tr><th>ID</th><th>Nombre</th><th>Cargo</th><th>Turno</th><th>Estado</th><th>Acciones</th></tr>
                    </thead>
                    <tbody>
                        <tr class="odd-row">
                            <td>10015</td>
                            <td>Ana López</td>
                            <td>Mantenimiento</td>
                            <td>Matutino</td>
                            <td><span class="status-badge status-active">Activo</span></td>
                            <td class="action-buttons">
                                <button class="btn-edit"><i class="fas fa-pen"></i></button>
                                <button class="btn-delete"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                        <tr>
                            <td>10032</td>
                            <td>Luis Pérez</td>
                            <td>Ventas</td>
                            <td>Matutino</td>
                            <td><span class="status-badge status-active">Activo</span></td>
                            <td class="action-buttons">
                                <button class="btn-edit"><i class="fas fa-pen"></i></button>
                                <button class="btn-delete"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                        <tr class="odd-row">
                            <td>10088</td>
                            <td>Maria Garcia</td>
                            <td>Recursos Humanos</td>
                            <td>Vespertino</td>
                            <td><span class="status-badge status-late" style="color:#dc3545; background-color: rgba(220, 53, 69, 0.2);">Inactivo</span></td>
                            <td class="action-buttons">
                                <button class="btn-edit"><i class="fas fa-pen"></i></button>
                                <button class="btn-delete"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('error-message');

    if (loginForm) {
        const carnetInput = document.getElementById('carnet');
        const passwordInput = document.getElementById('password');

        loginForm.addEventListener('submit', (event) => {
            event.preventDefault(); 
            errorMessage.style.display = 'none';
            
            const carnet = carnetInput.value.trim();
            const password = passwordInput.value.trim();

            if (carnet === 'admin' && password === '123') {
                window.location.href = 'main_layout.html'; 
            } else {
                errorMessage.textContent = 'Credenciales incorrectas.';
                errorMessage.style.display = 'block';
            }
        });
    }

    if (document.getElementById('main-content')) {
        document.getElementById('main-content').innerHTML = loadDashboardContent();
        
        const navLinks = document.querySelectorAll('.nav-item');
        const currentModuleTitle = document.querySelector('.current-module-title');

        navLinks.forEach(item => {
            item.addEventListener('click', (event) => {
                event.preventDefault(); 
                
              
                navLinks.forEach(i => i.classList.remove('active-nav'));
                item.classList.add('active-nav');
                
                const link = item.querySelector('a');
                const moduleName = item.querySelector('span').textContent;
                const newModuleKey = link.getAttribute('data-module');
                currentModuleTitle.textContent = moduleName;

                const contentArea = document.getElementById('main-content');
                let newContent = '';
                
if (newModuleKey === 'dashboard') {
    newContent = loadDashboardContent();

} else if (newModuleKey === 'attendance') {

    newContent = `
        <div class="content-header">
            <h2 class="module-title"><i class="fas fa-calendar-check"></i> Registro de Asistencia y Fichajes</h2>
        </div>
        <div class="fichaje-area">
            <div class="fichaje-card neumorphic-card elevated">
                <h3 class="fichaje-title">Registro Diario</h3>
                
                <div class="digital-clock" id="digitalClock">
                    <span id="currentTime">--:--:--</span>
                </div>
                
                <p class="status-message">Bienvenido, Admin. Estado actual: <span style="color:var(--color-success);">PENDIENTE DE ENTRADA</span></p>
                
                <button class="neumorphic-button primary-button fichaje-btn" id="fichajeButton">
                    <i class="fas fa-fingerprint"></i> FICHAJE DE ENTRADA
                </button>
                
                <p class="fichaje-info">El horario de entrada es 08:00 AM</p>
            </div>
        </div>
        <div class="table-area neumorphic-card elevated" style="margin-top: 20px;">
            <h4 class="chart-title"><i class="fas fa-history"></i> Mi Historial de Fichajes</h4>
            <div class="table-responsive">
                <table class="data-table">
                    <thead>
                        <tr><th>Día</th><th>Entrada</th><th>Salida</th><th>Horas</th><th>Estado</th></tr>
                    </thead>
                    <tbody>
                        <tr class="odd-row"><td>2025-11-12</td><td>08:00 AM</td><td>05:00 PM</td><td>8.0 hrs</td><td><span class="status-badge status-active">Puntual</span></td></tr>
                        <tr><td>2025-11-11</td><td>08:15 AM</td><td>05:00 PM</td><td>7.75 hrs</td><td><span class="status-badge status-late">Retardo</span></td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;

} else if (newModuleKey === 'employees') {
  
    newContent = loadEmployeesContent();
} else if (newModuleKey === 'reports') {
    
    newContent = `
        <div class="content-header">
            <h2 class="module-title"><i class="fas fa-chart-line"></i> Reportes</h2>
            <button class="neumorphic-button primary-button small-button">
                <i class="fas fa-file-export"></i> Exportar Datos
            </button>
        </div>

        <div class="filter-panel neumorphic-card elevated">
            <h4 class="chart-title">Selección de Filtros</h4>
            <div class="form-grid" style="grid-template-columns: 1fr 1fr 1fr 150px;">
                <div class="input-group">
                    <label for="date_start">Fecha de Inicio</label>
                    <input type="date" id="date_start" class="neumorphic-input">
                </div>
                
                <div class="input-group">
                    <label for="employee_filter">Empleado</label>
                    <select id="employee_filter" class="neumorphic-input">
                        <option value="">Todos los Empleados</option>
                        <option value="ana">Ana López</option>
                        <option value="luis">Luis Pérez</option>
                    </select>
                </div>
                
                <div class="input-group">
                    <label for="status_filter">Estado</label>
                    <select id="status_filter" class="neumorphic-input">
                        <option value="">Cualquiera</option>
                        <option value="late">Retardo</option>
                        <option value="absent">Ausencia</option>
                    </select>
                </div>
                
                <button class="neumorphic-button primary-button filter-btn" style="align-self: flex-end; margin-bottom: 5px;">
                    <i class="fas fa-search"></i> Generar
                </button>
            </div>
        </div>

        <div class="table-area neumorphic-card elevated" style="margin-top: 20px;">
            <h4 class="chart-title"><i class="fas fa-table"></i> Detalle de Asistencia Filtrada</h4>
            <div class="table-responsive">
                <table class="data-table">
                    <thead>
                        <tr><th>Fecha</th><th>Empleado</th><th>Entrada</th><th>Salida</th><th>Estado</th></tr>
                    </thead>
                    <tbody>
                        <tr class="odd-row"><td>2025-10-25</td><td>Ana López</td><td>08:00 AM</td><td>05:00 PM</td><td><span class="status-badge status-active">Puntual</span></td></tr>
                        <tr><td>2025-10-25</td><td>Luis Pérez</td><td>08:15 AM</td><td>05:00 PM</td><td><span class="status-badge status-late">Retardo</span></td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;

} else if (newModuleKey === 'grades') { 
    newContent = `
        <div class="content-header">
            <h2 class="module-title"><i class="fas fa-list-alt"></i> Calificaciones/Notas</h2>
        </div>
        <div class="neumorphic-card elevated">
            <h4 class="chart-title">Gestión de Calificaciones</h4>
            <p>Aquí iría el formulario o la tabla para registrar y ver las notas de los estudiantes/empleados.</p>
        </div>
    `;

} else if (newModuleKey === 'forms') { 
    newContent = `
        <div class="content-header">
            <h2 class="module-title"><i class="fas fa-wpforms"></i> Formularios de Control</h2>
        </div>
        
        <div class="config-tabs-nav">
            <button class="neumorphic-button secondary-button active-tab" onclick="loadFormContent('justification', this)">Justificación de Ausencias</button>
            <button class="neumorphic-button secondary-button" onclick="loadFormContent('vacation', this)">Solicitud de Vacaciones</button>
            <button class="neumorphic-button secondary-button" onclick="loadFormContent('incident', this)">Reporte de Incidencias</button>
        </div>

        <div id="forms-content-area" class="config-content neumorphic-card elevated" style="margin-top: 20px;">
            <h4 class="chart-title"><i class="fas fa-file-signature"></i> Justificación de Ausencias</h4>
            <div class="form-grid" style="grid-template-columns: 1fr 1fr;">
                <div class="input-group">
                    <label>Tipo de Ausencia</label>
                    <select class="neumorphic-input">
                        <option>Médica (Adjuntar certificado)</option>
                        <option>Personal (Permiso no remunerado)</option>
                        <option>Fuerza Mayor</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Fecha de Ausencia</label>
                    <input type="date" class="neumorphic-input">
                </div>
                <div class="input-group" style="grid-column: 1 / 3;">
                    <label>Motivo y Detalles</label>
                    <textarea class="neumorphic-input" rows="3" placeholder="Describa brevemente el motivo de la justificación..."></textarea>
                </div>
                <div class="input-group" style="grid-column: 1 / 3;">
                    <label>Adjuntar Documento (Opcional)</label>
                    <input type="file" class="neumorphic-input">
                </div>
            </div>
            <button class="neumorphic-button primary-button" style="margin-top: 15px;">Enviar Justificación</button>
        </div>
    `;
}

contentArea.innerHTML = newContent;
if (window.clockInterval) { clearInterval(window.clockInterval); }

if (newModuleKey === 'attendance') {
    updateClock();
    window.clockInterval = setInterval(updateClock, 1000);
}

            }); 
        }); 
    } 
}); 