// Función para cargar el contenido del dashboard
function loadDashboardContent() {
    fetch('controladores/get_admin_dashboard.php', {
        credentials: 'same-origin'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                document.getElementById('main-content').innerHTML = `
                    <div class="content-header">
                        <h2 class="module-title"><i class="fas fa-home"></i> Dashboard de Control</h2>
                    </div>
                    <div class="summary-cards">
                        <div class="report-card neumorphic-card elevated">
                            <div class="card-icon success-icon"><i class="fas fa-users"></i></div>
                            <div class="card-content">
                                <p class="card-label">Empleados Activos</p>
                                <h3 class="card-value">${data.empleados_activos}</h3>
                            </div>
                        </div>
                        
                        <div class="report-card neumorphic-card elevated">
                            <div class="card-icon error-icon"><i class="fas fa-user-slash"></i></div>
                            <div class="card-content">
                                <p class="card-label">Ausentes Hoy</p>
                                <h3 class="card-value">${data.ausentes_hoy}</h3>
                            </div>
                        </div>
                        
                        <div class="report-card neumorphic-card elevated">
                            <div class="card-icon primary-icon"><i class="fas fa-clock"></i></div>
                            <div class="card-content">
                                <p class="card-label">Tasa de Puntualidad</p>
                                <h3 class="card-value">${data.tasa_puntualidad}%</h3>
                            </div>
                        </div>
                    </div>
                    <div class="chart-container neumorphic-card elevated" style="margin-top: 20px; padding: 20px;">
                        <h4 class="chart-title"><i class="fas fa-chart-bar"></i> Tendencia de Asistencia Semanal</h4>
                        <div style="position: relative; height: 300px; margin-top: 20px;">
                            <canvas id="weeklyChart"></canvas>
                        </div>
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
                                    ${data.ultimos_fichajes.length > 0 ? 
                                        data.ultimos_fichajes.map((f, index) => `
                                            <tr class="${index % 2 === 0 ? 'odd-row' : ''}">
                                                <td>${f.id_empleado}</td>
                                                <td>${f.empleado_nombre}</td>
                                                <td>${f.hora_entrada || 'N/A'}</td>
                                                <td><span class="status-badge ${f.estado === 'presente' ? 'status-active' : 'status-late'}">${f.estado}</span></td>
                                            </tr>
                                        `).join('') : 
                                        '<tr><td colspan="4" style="text-align: center;">No hay fichajes registrados hoy</td></tr>'
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                `;
                
                // Cargar y mostrar el gráfico de asistencia semanal
                loadWeeklyChart();
            } else {
                document.getElementById('main-content').innerHTML = `
                    <div class="alert alert-error">Error al cargar el dashboard: ${data.message || 'Error desconocido'}</div>
                    <p style="color: #666; margin-top: 10px;">Si el problema persiste, verifique que el servidor esté funcionando y que tenga permisos de administrador.</p>
                `;
            }
        })
        .catch(error => {
            console.error('Error cargando dashboard:', error);
            document.getElementById('main-content').innerHTML = `
                <div class="alert alert-error">
                    <strong>Error de conexión</strong><br>
                    No se pudo conectar con el servidor. Verifique que:<br>
                    - El servidor XAMPP esté ejecutándose<br>
                    - La base de datos esté configurada correctamente<br>
                    - Tiene una sesión activa de administrador
                </div>
            `;
        });
}

// Función para cargar gestión de empleados
function loadEmployeesContent() {
    fetch('controladores/empleados_crud.php?action=read', {
        credentials: 'same-origin'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                document.getElementById('main-content').innerHTML = `
                    <div class="content-header">
                        <h2 class="module-title"><i class="fas fa-users"></i> Gestión de Empleados</h2>
                    </div>
                    
                    <div class="controls-bar neumorphic-card elevated">
                        <input type="text" id="searchEmployee" placeholder="Buscar por ID, Nombre, Cargo o Área..." class="neumorphic-input" style="width: 300px;">
                        <a href="vistas/formulario_empleados.html" class="neumorphic-button primary-button add-button" style="text-decoration: none; display: inline-block;">
                            <i class="fas fa-plus"></i> Añadir Nuevo Empleado
                        </a>
                    </div>

                    <div class="table-area neumorphic-card elevated">
                        <h4 class="chart-title"><i class="fas fa-list"></i> Lista de Empleados Registrados</h4>
                        <div class="table-responsive">
                            <table class="data-table" id="employeesTable">
                                <thead>
                                    <tr><th>ID</th><th>Nombre</th><th>Cargo</th><th>Área</th><th>Estado</th><th>Acciones</th></tr>
                                </thead>
                                <tbody>
                                    ${data.empleados.length > 0 ? 
                                        data.empleados.map((emp, index) => `
                                            <tr class="${index % 2 === 0 ? 'odd-row' : ''}">
                                                <td>${emp.id}</td>
                                                <td>${emp.nombre}</td>
                                                <td>${emp.cargo}</td>
                                                <td>${emp.area}</td>
                                                <td><span class="status-badge ${emp.estado === 'activo' ? 'status-active' : ''}" style="${emp.estado === 'inactivo' ? 'color:#dc3545; background-color: rgba(220, 53, 69, 0.2);' : ''}">${emp.estado}</span></td>
                                                <td class="action-buttons">
                                                    <a href="vistas/formulario_empleados.html?id=${emp.id}" class="btn-edit" title="Editar"><i class="fas fa-pen"></i></a>
                                                </td>
                                            </tr>
                                        `).join('') : 
                                        '<tr><td colspan="6" style="text-align: center;">No hay empleados registrados</td></tr>'
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                `;
                
                // Agregar funcionalidad de búsqueda
                const searchInput = document.getElementById('searchEmployee');
                if (searchInput) {
                    searchInput.addEventListener('input', (e) => {
                        const term = e.target.value;
                        if (term.length > 2 || term.length === 0) {
                            fetch(`controladores/empleados_crud.php?action=read&search=${encodeURIComponent(term)}`)
                                .then(response => response.json())
                                .then(searchData => {
                                    if (searchData.success) {
                                        const tbody = document.querySelector('#employeesTable tbody');
                                        tbody.innerHTML = searchData.empleados.length > 0 ? 
                                            searchData.empleados.map((emp, index) => `
                                                <tr class="${index % 2 === 0 ? 'odd-row' : ''}">
                                                    <td>${emp.id}</td>
                                                    <td>${emp.nombre}</td>
                                                    <td>${emp.cargo}</td>
                                                    <td>${emp.area}</td>
                                                    <td><span class="status-badge ${emp.estado === 'activo' ? 'status-active' : ''}" style="${emp.estado === 'inactivo' ? 'color:#dc3545; background-color: rgba(220, 53, 69, 0.2);' : ''}">${emp.estado}</span></td>
                                                    <td class="action-buttons">
                                                        <a href="vistas/formulario_empleados.html?id=${emp.id}" class="btn-edit" title="Editar"><i class="fas fa-pen"></i></a>
                                                    </td>
                                                </tr>
                                            `).join('') : 
                                            '<tr><td colspan="6" style="text-align: center;">No se encontraron empleados</td></tr>';
                                    }
                                });
                        }
                    });
                }
            } else {
                document.getElementById('main-content').innerHTML = `
                    <div class="alert alert-error">Error al cargar empleados: ${data.message || 'Error desconocido'}</div>
                `;
            }
        })
        .catch(error => {
            console.error('Error cargando empleados:', error);
            document.getElementById('main-content').innerHTML = `
                <div class="alert alert-error">
                    <strong>Error de conexión</strong><br>
                    No se pudieron cargar los empleados. Verifique la conexión con el servidor.
                </div>
            `;
        });
}

// Función para cargar formularios de control
function loadFormsContent() {
    document.getElementById('main-content').innerHTML = `
        <div class="content-header">
            <h2 class="module-title"><i class="fas fa-wpforms"></i> Formularios de Control</h2>
        </div>
        
        <div class="info-section">
            <h3><i class="fas fa-info-circle"></i> Seleccione el Formulario</h3>
            <p>Elija el formulario que desea utilizar para realizar el control correspondiente.</p>
        </div>
        
        <div class="form-buttons-grid">
            <div class="form-button-card" onclick="navigateToForm('vistas/formulario_empleados.html')">
                <i class="fas fa-user-plus"></i>
                <h3>Registro de Empleados</h3>
                <p>Gestionar información de empleados</p>
            </div>
            <div class="form-button-card" onclick="navigateToForm('vistas/formulario_asistencias.html')">
                <i class="fas fa-calendar-check"></i>
                <h3>Asistencias</h3>
                <p>Registrar y gestionar asistencias</p>
            </div>
            <div class="form-button-card" onclick="navigateToForm('vistas/formulario_permisos.html')">
                <i class="fas fa-file-alt"></i>
                <h3>Permisos</h3>
                <p>Gestionar permisos y justificaciones</p>
            </div>
            <div class="form-button-card" onclick="navigateToForm('vistas/formulario_usuarios.html')">
                <i class="fas fa-user-cog"></i>
                <h3>Usuarios</h3>
                <p>Gestionar usuarios del sistema</p>
            </div>
            <div class="form-button-card" onclick="navigateToForm('vistas/formulario_horarios.html')">
                <i class="fas fa-clock"></i>
                <h3>Horarios</h3>
                <p>Configurar horarios de trabajo</p>
            </div>
        </div>
    `;
}

// Función para navegar a formularios y reportes (maneja rutas correctamente)
// Disponible globalmente
window.navigateToForm = function(url) {
    // Obtener la ruta base del proyecto
    const currentPath = window.location.pathname;
    
    // Extraer la ruta base del proyecto (hasta /sistem_empleados/)
    let basePath = '';
    if (currentPath.includes('/sistem_empleados/')) {
        basePath = currentPath.substring(0, currentPath.indexOf('/sistem_empleados/') + '/sistem_empleados/'.length);
    } else if (currentPath.includes('main_layout.html')) {
        // Si estamos en main_layout.html, obtener la ruta hasta ese archivo
        basePath = currentPath.replace('main_layout.html', '');
    } else {
        // Si no encontramos el patrón, usar la ruta actual sin el archivo
        const lastSlash = currentPath.lastIndexOf('/');
        basePath = currentPath.substring(0, lastSlash + 1);
    }
    
    // Construir la URL completa
    const targetUrl = basePath + url;
    
    console.log('Navegando desde:', currentPath);
    console.log('Ruta base:', basePath);
    console.log('URL destino:', targetUrl);
    
    // Navegar usando location.href con la ruta absoluta correcta
    window.location.href = targetUrl;
};

// También disponible como función normal para compatibilidad
function navigateToForm(url) {
    window.navigateToForm(url);
}

// Función para cargar reportes
function loadReportsContent() {
    document.getElementById('main-content').innerHTML = `
        <div class="content-header">
            <h2 class="module-title"><i class="fas fa-chart-line"></i> Reportes</h2>
        </div>
        
        <div class="info-section">
            <h3><i class="fas fa-info-circle"></i> Seleccione el Reporte</h3>
            <p>Elija el reporte que desea visualizar para obtener información detallada.</p>
        </div>
        
        <div class="report-buttons-grid">
            <div class="report-button-card" onclick="navigateToForm('vistas/reporte_empleados.html')">
                <i class="fas fa-users"></i>
                <h3>Reporte de Empleados</h3>
                <p>Ver información de empleados</p>
            </div>
            <div class="report-button-card" onclick="navigateToForm('vistas/reporte_asistencias.html')">
                <i class="fas fa-calendar-check"></i>
                <h3>Reporte de Asistencias</h3>
                <p>Ver registro de asistencias</p>
            </div>
            <div class="report-button-card" onclick="navigateToForm('vistas/reporte_horarios.html')">
                <i class="fas fa-clock"></i>
                <h3>Reporte de Horarios</h3>
                <p>Ver horarios de entrada y salida</p>
            </div>
            <div class="report-button-card" onclick="navigateToForm('vistas/reporte_permisos.html')">
                <i class="fas fa-file-alt"></i>
                <h3>Reporte de Permisos</h3>
                <p>Ver permisos y justificaciones</p>
            </div>
            <div class="report-button-card" onclick="navigateToForm('vistas/reporte_usuarios.html')">
                <i class="fas fa-user-cog"></i>
                <h3>Reporte de Usuarios</h3>
                <p>Ver usuarios del sistema</p>
            </div>
        </div>
    `;
}

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    // Verificar sesión
    fetch('controladores/get_session.php', {
        credentials: 'same-origin'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            if (!data.success) {
                console.error('No hay sesión activa:', data.message);
                window.location.href = 'index.html';
                return;
            }
            
            // Verificar que sea admin
            if (data.rol !== 'admin') {
                console.error('No es administrador, redirigiendo...');
                window.location.href = 'vistas/employee_layout.html';
                return;
            }
            
            // Actualizar nombre de usuario en el header
            const userInfo = document.querySelector('.user-info span');
            if (userInfo) {
                userInfo.textContent = `Bienvenido, ${data.nombre || data.usuario}`;
            }
            
            // Cargar dashboard por defecto solo si hay sesión válida
            if (document.getElementById('main-content')) {
                loadDashboardContent();
            }
        })
        .catch(error => {
            console.error('Error verificando sesión:', error);
            window.location.href = 'index.html';
        });
    
    // Configurar navegación
    const navLinks = document.querySelectorAll('.nav-item a');
    const currentModuleTitle = document.querySelector('.current-module-title');
    
    console.log('Configurando navegación, encontrados', navLinks.length, 'enlaces');
    
    navLinks.forEach((item, index) => {
        const moduleKey = item.getAttribute('data-module');
        console.log(`Enlace ${index}: data-module="${moduleKey}"`);
        
        item.addEventListener('click', (event) => {
            event.preventDefault();
            console.log('Click en enlace, data-module:', moduleKey);
            
            // Remover clase activa de todos
            navLinks.forEach(i => i.closest('.nav-item').classList.remove('active-nav'));
            item.closest('.nav-item').classList.add('active-nav');
            
            const moduleName = item.querySelector('span')?.textContent || '';
            const newModuleKey = item.getAttribute('data-module');
            
            console.log('Módulo seleccionado:', newModuleKey, 'Nombre:', moduleName);
            
            if (currentModuleTitle) {
                currentModuleTitle.textContent = moduleName;
            }
            
            const contentArea = document.getElementById('main-content');
            if (!contentArea) {
                console.error('No se encontró el área de contenido main-content');
                return;
            }
            
            // Cargar contenido según el módulo
            if (newModuleKey === 'dashboard') {
                console.log('Cargando dashboard...');
                loadDashboardContent();
            } else if (newModuleKey === 'employees') {
                console.log('Cargando empleados...');
                loadEmployeesContent();
            } else if (newModuleKey === 'forms') {
                console.log('Cargando formularios...');
                loadFormsContent();
            } else if (newModuleKey === 'reports') {
                console.log('Cargando reportes...');
                loadReportsContent();
            } else if (newModuleKey === 'backup') {
                console.log('Cargando respaldo y restauración...');
                if (typeof loadBackupContent === 'function') {
                    loadBackupContent();
                } else {
                    console.error('loadBackupContent no está definida');
                }
            } else {
                console.warn('Módulo desconocido:', newModuleKey);
            }
        });
    });
    
    // Configurar botón de logout
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('¿Está seguro que desea cerrar sesión?')) {
                fetch('controladores/logout.php')
                    .then(() => {
                        window.location.href = 'index.html';
                    })
                    .catch(() => {
                        window.location.href = 'index.html';
                    });
            }
        });
    }
});

// Función para cargar y mostrar el gráfico de asistencia semanal
function loadWeeklyChart() {
    fetch('controladores/get_weekly_attendance.php', {
        credentials: 'same-origin'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success && data.datos) {
                const ctx = document.getElementById('weeklyChart');
                if (!ctx) return;
                
                // Destruir gráfico anterior si existe
                if (window.weeklyChartInstance) {
                    window.weeklyChartInstance.destroy();
                }
                
                const dias = data.datos.map(d => d.dia);
                const asistencias = data.datos.map(d => d.asistencias);
                const ausencias = data.datos.map(d => d.ausencias);
                
                window.weeklyChartInstance = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: dias,
                        datasets: [
                            {
                                label: 'Asistencias',
                                data: asistencias,
                                backgroundColor: 'rgba(40, 167, 69, 0.7)',
                                borderColor: 'rgba(40, 167, 69, 1)',
                                borderWidth: 2,
                                borderRadius: 5
                            },
                            {
                                label: 'Ausencias',
                                data: ausencias,
                                backgroundColor: 'rgba(220, 53, 69, 0.7)',
                                borderColor: 'rgba(220, 53, 69, 1)',
                                borderWidth: 2,
                                borderRadius: 5
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: true,
                                position: 'top',
                                labels: {
                                    usePointStyle: true,
                                    padding: 15,
                                    font: {
                                        size: 12,
                                        family: "'Roboto', sans-serif"
                                    }
                                }
                            },
                            tooltip: {
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                padding: 12,
                                titleFont: {
                                    size: 14,
                                    family: "'Roboto', sans-serif"
                                },
                                bodyFont: {
                                    size: 12,
                                    family: "'Roboto', sans-serif"
                                },
                                callbacks: {
                                    label: function(context) {
                                        let label = context.dataset.label || '';
                                        if (label) {
                                            label += ': ';
                                        }
                                        label += context.parsed.y;
                                        return label;
                                    }
                                }
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    stepSize: 1,
                                    font: {
                                        size: 11,
                                        family: "'Roboto', sans-serif"
                                    },
                                    color: '#666'
                                },
                                grid: {
                                    color: 'rgba(0, 0, 0, 0.05)'
                                }
                            },
                            x: {
                                ticks: {
                                    font: {
                                        size: 11,
                                        family: "'Roboto', sans-serif"
                                    },
                                    color: '#666'
                                },
                                grid: {
                                    display: false
                                }
                            }
                        }
                    }
                });
            } else {
                console.error('Error al cargar datos del gráfico:', data.message);
            }
        })
        .catch(error => {
            console.error('Error cargando gráfico semanal:', error);
        });
}

// Función para cargar el contenido de respaldo y restauración
function loadBackupContent() {
    console.log('loadBackupContent llamada');
    const contentArea = document.getElementById('main-content');
    if (!contentArea) {
        console.error('No se encontró main-content en loadBackupContent');
        return;
    }
    
    console.log('Cargando contenido de respaldo...');
    contentArea.innerHTML = `
        <div class="content-header">
            <h2 class="module-title"><i class="fas fa-database"></i> Respaldo y Restauración</h2>
        </div>
        
        <div id="alert-container-backup"></div>
        
        <div class="neumorphic-card elevated">
            <h3 class="chart-title"><i class="fas fa-download"></i> Crear Respaldo</h3>
            <p style="margin-bottom: 20px;">Cree un respaldo completo de la base de datos. El archivo se guardará en la carpeta de respaldos.</p>
            <button class="neumorphic-button primary-button" id="btn-crear-respaldo">
                <i class="fas fa-database"></i> Crear Respaldo Ahora
            </button>
        </div>
        
        <div class="neumorphic-card elevated" style="margin-top: 20px;">
            <h3 class="chart-title"><i class="fas fa-upload"></i> Restaurar desde Respaldo</h3>
            <p style="margin-bottom: 20px;">Seleccione un archivo de respaldo para restaurar la base de datos. <strong>Advertencia:</strong> Esta acción sobrescribirá todos los datos actuales.</p>
            
            <div class="table-responsive" style="margin-top: 15px;">
                <table class="data-table" id="backupsTable">
                    <thead>
                        <tr>
                            <th>Nombre del Archivo</th>
                            <th>Fecha</th>
                            <th>Tamaño</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colspan="4" style="text-align: center;">Cargando respaldos...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    // Asegurar que las funciones estén disponibles globalmente
    window.restaurarRespaldo = restaurarRespaldo;
    window.crearRespaldo = crearRespaldo;
    
    // Configurar eventos después de cargar el contenido (con pequeño delay para asegurar que el DOM esté listo)
    console.log('Configurando eventos de respaldo...');
    setTimeout(() => {
        setupBackupEvents();
    }, 100);
    
    // Cargar lista de respaldos
    console.log('Cargando lista de respaldos...');
    cargarRespaldos();
    
    console.log('Contenido de respaldo cargado correctamente');
}

// Función para configurar eventos de respaldo y restauración
function setupBackupEvents() {
    console.log('setupBackupEvents llamada');
    const btnCrearRespaldo = document.getElementById('btn-crear-respaldo');
    if (btnCrearRespaldo) {
        console.log('Botón de crear respaldo encontrado, agregando evento click');
        btnCrearRespaldo.addEventListener('click', function(e) {
            console.log('Click en botón crear respaldo');
            e.preventDefault();
            crearRespaldo();
        });
    } else {
        console.error('No se encontró el botón btn-crear-respaldo');
    }
}

// Función para mostrar alertas en el módulo de respaldo
function mostrarAlertaBackup(mensaje, tipo = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${tipo === 'error' ? 'error' : 'success'}`;
    alertDiv.textContent = mensaje;
    alertDiv.style.display = 'block';
    
    const container = document.getElementById('alert-container-backup');
    if (container) {
        container.innerHTML = '';
        container.appendChild(alertDiv);
        
        setTimeout(() => {
            alertDiv.style.opacity = '0';
            setTimeout(() => alertDiv.remove(), 300);
        }, 3000);
    }
}

// Función para crear respaldo
function crearRespaldo() {
    console.log('crearRespaldo llamada');
    if (!confirm('¿Está seguro que desea crear un respaldo de la base de datos?')) {
        console.log('Usuario canceló la creación del respaldo');
        return;
    }
    
    console.log('Iniciando creación de respaldo...');
    
    const btnCrear = document.getElementById('btn-crear-respaldo');
    if (btnCrear) {
        btnCrear.disabled = true;
        btnCrear.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creando respaldo...';
    }
    
    fetch('controladores/backup_restore.php?action=backup', {
        method: 'GET',
        credentials: 'same-origin'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            mostrarAlertaBackup('Respaldo creado correctamente: ' + data.filename, 'success');
            cargarRespaldos();
        } else {
            mostrarAlertaBackup('Error al crear respaldo: ' + data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarAlertaBackup('Error de conexión. Verifique que el servidor esté funcionando.', 'error');
    })
    .finally(() => {
        const btnCrear = document.getElementById('btn-crear-respaldo');
        if (btnCrear) {
            btnCrear.disabled = false;
            btnCrear.innerHTML = '<i class="fas fa-database"></i> Crear Respaldo Ahora';
        }
    });
}

// Función para restaurar respaldo (disponible globalmente)
function restaurarRespaldo(filename) {
    console.log('restaurarRespaldo llamada con archivo:', filename);
    if (!confirm('¿Está seguro que desea restaurar este respaldo? Esta acción sobrescribirá todos los datos actuales.')) {
        console.log('Usuario canceló la restauración');
        return;
    }
    
    console.log('Iniciando restauración de respaldo...');
    
    const formData = new FormData();
    formData.append('action', 'restore');
    formData.append('filename', filename);
    
    fetch('controladores/backup_restore.php', {
        method: 'POST',
        body: formData,
        credentials: 'same-origin'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            mostrarAlertaBackup('Base de datos restaurada correctamente', 'success');
        } else {
            mostrarAlertaBackup('Error al restaurar: ' + data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarAlertaBackup('Error de conexión. Verifique que el servidor esté funcionando.', 'error');
    });
}

// Función para cargar lista de respaldos
function cargarRespaldos() {
    fetch('controladores/backup_restore.php?action=list', {
        credentials: 'same-origin'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const tbody = document.querySelector('#backupsTable tbody');
        if (!tbody) return;
        
        if (data.success && data.backups) {
            if (data.backups.length > 0) {
                tbody.innerHTML = data.backups.map(backup => `
                    <tr>
                        <td>${backup.filename}</td>
                        <td>${backup.date}</td>
                        <td>${(backup.size / 1024).toFixed(2)} KB</td>
                        <td class="action-buttons">
                            <button class="btn-edit" onclick="window.restaurarRespaldo('${backup.filename.replace(/'/g, "\\'")}')" title="Restaurar">
                                <i class="fas fa-upload"></i> Restaurar
                            </button>
                        </td>
                    </tr>
                `).join('');
            } else {
                tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No hay respaldos disponibles</td></tr>';
            }
        } else {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">Error al cargar respaldos</td></tr>';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        const tbody = document.querySelector('#backupsTable tbody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">Error al cargar respaldos. Verifique la conexión.</td></tr>';
        }
    });
}

