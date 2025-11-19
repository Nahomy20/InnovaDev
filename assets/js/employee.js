// Variables globales
let empleadoId = null;
let empleadoData = null;

// Cargar datos del empleado al iniciar
document.addEventListener('DOMContentLoaded', () => {
    // Mostrar mensaje de carga inicial
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <i class="fas fa-spinner fa-spin" style="font-size: 48px; color: #0066CC; margin-bottom: 20px;"></i>
                <p style="color: #666; font-size: 18px;">Cargando datos del empleado...</p>
            </div>
        `;
    }
    
    loadEmployeeData().then(() => {
        console.log('Datos del empleado cargados correctamente, ID:', empleadoId);
        setupNavigation();
        loadDashboardContent();
    }).catch(error => {
        console.error('Error inicializando:', error);
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.innerHTML = `
                <div class="alert alert-error">
                    <strong>Error al inicializar</strong><br>
                    ${error}<br>
                    <br>
                    <button class="neumorphic-button primary-button" onclick="window.location.reload()" style="margin-top: 10px;">
                        <i class="fas fa-refresh"></i> Recargar Página
                    </button>
                </div>
            `;
        }
    });
});

// Cargar datos del empleado desde la sesión
function loadEmployeeData() {
    return fetch('../controladores/get_session.php', {
        credentials: 'same-origin'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // Verificar que sea empleado
                if (data.rol !== 'empleado') {
                    console.error('No es empleado, redirigiendo...');
                    window.location.href = '../main_layout.html';
                    return Promise.reject('No es empleado');
                }
                
                empleadoId = data.id_empleado;
                empleadoData = data;
                const userNameEl = document.getElementById('userName');
                if (userNameEl) {
                    userNameEl.textContent = `Bienvenido, ${data.nombre || data.usuario}`;
                }
                return Promise.resolve(data);
            } else {
                console.error('No hay sesión activa:', data.message);
                window.location.href = '../index.html';
                return Promise.reject('No hay sesión activa');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            window.location.href = '../index.html';
            return Promise.reject(error);
        });
}

// Función para cargar Dashboard del empleado
function loadDashboardContent() {
    // Mostrar mensaje de carga
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.innerHTML = `
            <div style="text-align: center; padding: 30px;">
                <i class="fas fa-spinner fa-spin" style="font-size: 32px; color: #0066CC; margin-bottom: 15px;"></i>
                <p style="color: #666;">Cargando dashboard...</p>
            </div>
        `;
    }
    
    if (!empleadoId) {
        // Intentar obtener el ID de la sesión
        fetch('../controladores/get_session.php', {
            credentials: 'same-origin'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta del servidor');
                }
                return response.json();
            })
            .then(sessionData => {
                console.log('Datos de sesión obtenidos:', sessionData);
                if (sessionData.success && sessionData.id_empleado) {
                    empleadoId = sessionData.id_empleado;
                    loadDashboardContent();
                } else {
                    const mainContent = document.getElementById('main-content');
                    if (mainContent) {
                        mainContent.innerHTML = `
                            <div class="alert alert-error">
                                Error: No se pudo obtener el ID del empleado. ${sessionData.message || ''}<br>
                                <button class="neumorphic-button primary-button" onclick="loadDashboardContent()" style="margin-top: 10px;">
                                    <i class="fas fa-refresh"></i> Reintentar
                                </button>
                            </div>
                        `;
                    }
                }
            })
            .catch(error => {
                console.error('Error obteniendo sesión:', error);
                const mainContent = document.getElementById('main-content');
                if (mainContent) {
                    mainContent.innerHTML = `
                        <div class="alert alert-error">
                            Error de conexión al obtener datos de sesión<br>
                            <button class="neumorphic-button primary-button" onclick="loadDashboardContent()" style="margin-top: 10px;">
                                <i class="fas fa-refresh"></i> Reintentar
                            </button>
                        </div>
                    `;
                }
            });
        return;
    }
    
    console.log('Cargando dashboard para empleado ID:', empleadoId);
    fetch(`../controladores/get_employee_dashboard.php`, {
        credentials: 'same-origin'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos recibidos del dashboard:', data);
            if (!data.success) {
                const mainContent = document.getElementById('main-content');
                if (mainContent) {
                    mainContent.innerHTML = `
                        <div class="alert alert-error">
                            <strong>Error al cargar dashboard</strong><br>
                            ${data.message || 'Error desconocido'}<br>
                            <br>
                            <button class="neumorphic-button primary-button" onclick="loadDashboardContent()" style="margin-top: 10px;">
                                <i class="fas fa-refresh"></i> Reintentar
                            </button>
                        </div>
                    `;
                }
                return;
            }
            
            const content = `
                <div class="content-header">
                    <h2 class="module-title"><i class="fas fa-home"></i> Mi Dashboard</h2>
                </div>
                
                <div class="summary-cards">
                    <div class="report-card neumorphic-card elevated">
                        <div class="card-icon primary-icon"><i class="fas fa-user"></i></div>
                        <div class="card-content">
                            <p class="card-label">Mi Cargo</p>
                            <h3 class="card-value">${data.cargo || 'N/A'}</h3>
                        </div>
                    </div>
                    
                    <div class="report-card neumorphic-card elevated">
                        <div class="card-icon success-icon"><i class="fas fa-building"></i></div>
                        <div class="card-content">
                            <p class="card-label">Mi Área</p>
                            <h3 class="card-value">${data.area || 'N/A'}</h3>
                        </div>
                    </div>
                    
                    <div class="report-card neumorphic-card elevated">
                        <div class="card-icon primary-icon"><i class="fas fa-calendar-check"></i></div>
                        <div class="card-content">
                            <p class="card-label">Asistencias Este Mes</p>
                            <h3 class="card-value">${data.asistencias_mes || 0}</h3>
                        </div>
                    </div>
                    
                    <div class="report-card neumorphic-card elevated">
                        <div class="card-icon success-icon"><i class="fas fa-check-circle"></i></div>
                        <div class="card-content">
                            <p class="card-label">Permisos Activos</p>
                            <h3 class="card-value">${data.permisos_activos || 0}</h3>
                        </div>
                    </div>
                </div>
                
                <div class="neumorphic-card elevated" style="margin-top: 20px;">
                    <h4 class="chart-title"><i class="fas fa-clock"></i> Mi Horario</h4>
                    <div style="padding: 20px;">
                        <p><strong>Entrada:</strong> ${data.hora_entrada || 'No asignado'}</p>
                        <p><strong>Salida:</strong> ${data.hora_salida || 'No asignado'}</p>
                    </div>
                </div>
                
                <div class="neumorphic-card elevated" style="margin-top: 20px;">
                    <h4 class="chart-title"><i class="fas fa-list-alt"></i> Últimas Asistencias</h4>
                    <div class="table-responsive">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Entrada</th>
                                    <th>Salida</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody id="asistenciasTableBody">
                                ${data.ultimas_asistencias && data.ultimas_asistencias.length > 0 ? data.ultimas_asistencias.map(a => {
                                    const estadoClass = getEstadoClass(a.estado);
                                    const fecha = a.fecha || 'N/A';
                                    const entrada = a.hora_entrada || 'N/A';
                                    const salida = a.hora_salida || 'N/A';
                                    const estado = a.estado || 'N/A';
                                    return '<tr><td>' + fecha + '</td><td>' + entrada + '</td><td>' + salida + '</td><td><span class="status-badge ' + estadoClass + '">' + estado + '</span></td></tr>';
                                }).join('') : '<tr><td colspan="4">No hay asistencias registradas</td></tr>'}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.innerHTML = content;
            }
        })
        .catch(error => {
            console.error('Error cargando dashboard:', error);
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.innerHTML = `
                    <div class="alert alert-error">
                        <strong>Error de conexión</strong><br>
                        No se pudo cargar el dashboard. Verifique que:<br>
                        - El servidor XAMPP esté ejecutándose<br>
                        - Tiene una sesión activa de empleado<br>
                        - La base de datos esté configurada correctamente<br>
                        <br>
                        <button class="neumorphic-button primary-button" onclick="loadDashboardContent()" style="margin-top: 10px;">
                            <i class="fas fa-refresh"></i> Reintentar
                        </button>
                    </div>
                `;
            }
        });
}

// Función para cargar asistencias del empleado
function loadAsistenciasContent() {
    // Mostrar mensaje de carga
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.innerHTML = `
            <div style="text-align: center; padding: 30px;">
                <i class="fas fa-spinner fa-spin" style="font-size: 32px; color: #0066CC; margin-bottom: 15px;"></i>
                <p style="color: #666;">Cargando asistencias...</p>
            </div>
        `;
    }
    
    if (!empleadoId) {
        fetch('../controladores/get_session.php', {
            credentials: 'same-origin'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta del servidor');
                }
                return response.json();
            })
            .then(sessionData => {
                if (sessionData.success && sessionData.id_empleado) {
                    empleadoId = sessionData.id_empleado;
                    loadAsistenciasContent();
                } else {
                    const mainContent = document.getElementById('main-content');
                    if (mainContent) {
                        mainContent.innerHTML = `
                            <div class="alert alert-error">Error: No se pudo obtener el ID del empleado. ${sessionData.message || ''}</div>
                        `;
                    }
                }
            })
            .catch(error => {
                console.error('Error obteniendo sesión:', error);
                const mainContent = document.getElementById('main-content');
                if (mainContent) {
                    mainContent.innerHTML = `
                        <div class="alert alert-error">Error de conexión al obtener datos de sesión</div>
                    `;
                }
            });
        return;
    }
    
    fetch(`../controladores/get_employee_asistencias.php`, {
        credentials: 'same-origin'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos recibidos de asistencias:', data);
            if (!data.success) {
                const mainContent = document.getElementById('main-content');
                if (mainContent) {
                    mainContent.innerHTML = `
                        <div class="alert alert-error">Error: ${data.message || 'Error al cargar datos'}</div>
                        <button class="neumorphic-button primary-button" onclick="loadAsistenciasContent()" style="margin-top: 10px;">
                            <i class="fas fa-refresh"></i> Reintentar
                        </button>
                    `;
                }
                return;
            }
            
            const content = `
                <div class="content-header">
                    <h2 class="module-title"><i class="fas fa-calendar-check"></i> Mis Asistencias</h2>
                </div>
                
                <div class="neumorphic-card elevated">
                    <h4 class="chart-title"><i class="fas fa-list"></i> Historial de Asistencias</h4>
                    <div class="table-responsive">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Entrada</th>
                                    <th>Salida</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${data.asistencias && data.asistencias.length > 0 ? data.asistencias.map(a => `
                                    <tr>
                                        <td>${a.fecha}</td>
                                        <td>${a.hora_entrada || 'N/A'}</td>
                                        <td>${a.hora_salida || 'N/A'}</td>
                                        <td><span class="status-badge ${getEstadoClass(a.estado)}">${a.estado}</span></td>
                                    </tr>
                                `).join('') : '<tr><td colspan="4" style="text-align: center;">No hay asistencias registradas</td></tr>'}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.innerHTML = content;
            }
        })
        .catch(error => {
            console.error('Error cargando asistencias:', error);
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.innerHTML = `
                    <div class="alert alert-error">
                        <strong>Error de conexión</strong><br>
                        No se pudo cargar las asistencias. Verifique que:<br>
                        - El servidor XAMPP esté ejecutándose<br>
                        - Tiene una sesión activa de empleado<br>
                        - La base de datos esté configurada correctamente<br>
                        <br>
                        <button class="neumorphic-button primary-button" onclick="loadAsistenciasContent()" style="margin-top: 10px;">
                            <i class="fas fa-refresh"></i> Reintentar
                        </button>
                    </div>
                `;
            }
        });
}

// Función para cargar horarios del empleado
function loadHorariosContent() {
    // Mostrar mensaje de carga
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.innerHTML = `
            <div style="text-align: center; padding: 30px;">
                <i class="fas fa-spinner fa-spin" style="font-size: 32px; color: #0066CC; margin-bottom: 15px;"></i>
                <p style="color: #666;">Cargando horarios...</p>
            </div>
        `;
    }
    
    if (!empleadoId) {
        fetch('../controladores/get_session.php', {
            credentials: 'same-origin'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta del servidor');
                }
                return response.json();
            })
            .then(sessionData => {
                if (sessionData.success && sessionData.id_empleado) {
                    empleadoId = sessionData.id_empleado;
                    loadHorariosContent();
                } else {
                    const mainContent = document.getElementById('main-content');
                    if (mainContent) {
                        mainContent.innerHTML = `
                            <div class="alert alert-error">Error: No se pudo obtener el ID del empleado. ${sessionData.message || ''}</div>
                        `;
                    }
                }
            })
            .catch(error => {
                console.error('Error obteniendo sesión:', error);
                const mainContent = document.getElementById('main-content');
                if (mainContent) {
                    mainContent.innerHTML = `
                        <div class="alert alert-error">Error de conexión al obtener datos de sesión</div>
                    `;
                }
            });
        return;
    }
    
    fetch(`../controladores/get_employee_horarios.php`, {
        credentials: 'same-origin'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos recibidos de asistencias:', data);
            if (!data.success) {
                const mainContent = document.getElementById('main-content');
                if (mainContent) {
                    mainContent.innerHTML = `
                        <div class="alert alert-error">Error: ${data.message || 'Error al cargar datos'}</div>
                        <button class="neumorphic-button primary-button" onclick="loadAsistenciasContent()" style="margin-top: 10px;">
                            <i class="fas fa-refresh"></i> Reintentar
                        </button>
                    `;
                }
                return;
            }
            
            const content = `
                <div class="content-header">
                    <h2 class="module-title"><i class="fas fa-clock"></i> Mis Horarios</h2>
                </div>
                
                <div class="neumorphic-card elevated">
                    <h4 class="chart-title"><i class="fas fa-calendar"></i> Horario de Trabajo</h4>
                    <div style="padding: 20px;">
                        <p><strong>Hora de Entrada:</strong> ${data.hora_entrada || 'No asignado'}</p>
                        <p><strong>Hora de Salida:</strong> ${data.hora_salida || 'No asignado'}</p>
                    </div>
                </div>
            `;
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.innerHTML = content;
            }
        })
        .catch(error => {
            console.error('Error cargando horarios:', error);
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.innerHTML = `
                    <div class="alert alert-error">
                        <strong>Error de conexión</strong><br>
                        No se pudo cargar los horarios. Verifique que:<br>
                        - El servidor XAMPP esté ejecutándose<br>
                        - Tiene una sesión activa de empleado<br>
                        - La base de datos esté configurada correctamente<br>
                        <br>
                        <button class="neumorphic-button primary-button" onclick="loadHorariosContent()" style="margin-top: 10px;">
                            <i class="fas fa-refresh"></i> Reintentar
                        </button>
                    </div>
                `;
            }
        });
}

// Función para cargar permisos del empleado
function loadPermisosContent() {
    // Mostrar mensaje de carga
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.innerHTML = `
            <div style="text-align: center; padding: 30px;">
                <i class="fas fa-spinner fa-spin" style="font-size: 32px; color: #0066CC; margin-bottom: 15px;"></i>
                <p style="color: #666;">Cargando permisos...</p>
            </div>
        `;
    }
    
    if (!empleadoId) {
        fetch('../controladores/get_session.php', {
            credentials: 'same-origin'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta del servidor');
                }
                return response.json();
            })
            .then(sessionData => {
                if (sessionData.success && sessionData.id_empleado) {
                    empleadoId = sessionData.id_empleado;
                    loadPermisosContent();
                } else {
                    const mainContent = document.getElementById('main-content');
                    if (mainContent) {
                        mainContent.innerHTML = `
                            <div class="alert alert-error">Error: No se pudo obtener el ID del empleado. ${sessionData.message || ''}</div>
                        `;
                    }
                }
            })
            .catch(error => {
                console.error('Error obteniendo sesión:', error);
                const mainContent = document.getElementById('main-content');
                if (mainContent) {
                    mainContent.innerHTML = `
                        <div class="alert alert-error">Error de conexión al obtener datos de sesión</div>
                    `;
                }
            });
        return;
    }
    
    fetch(`../controladores/get_employee_permisos.php`, {
        credentials: 'same-origin'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos recibidos de asistencias:', data);
            if (!data.success) {
                const mainContent = document.getElementById('main-content');
                if (mainContent) {
                    mainContent.innerHTML = `
                        <div class="alert alert-error">Error: ${data.message || 'Error al cargar datos'}</div>
                        <button class="neumorphic-button primary-button" onclick="loadAsistenciasContent()" style="margin-top: 10px;">
                            <i class="fas fa-refresh"></i> Reintentar
                        </button>
                    `;
                }
                return;
            }
            
            const content = `
                <div class="content-header">
                    <h2 class="module-title"><i class="fas fa-file-alt"></i> Mis Permisos</h2>
                </div>
                
                <div class="neumorphic-card elevated">
                    <h4 class="chart-title"><i class="fas fa-list"></i> Historial de Permisos</h4>
                    <div class="table-responsive">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Tipo de Permiso</th>
                                    <th>Fecha Inicio</th>
                                    <th>Fecha Fin</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${data.permisos && data.permisos.length > 0 ? data.permisos.map(p => `
                                    <tr>
                                        <td>${p.tipo_permiso}</td>
                                        <td>${p.fecha_inicio}</td>
                                        <td>${p.fecha_fin}</td>
                                        <td><span class="status-badge ${getEstadoPermisoClass(p.estado)}">${p.estado}</span></td>
                                    </tr>
                                `).join('') : '<tr><td colspan="4" style="text-align: center;">No hay permisos registrados</td></tr>'}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.innerHTML = content;
            }
        })
        .catch(error => {
            console.error('Error cargando permisos:', error);
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.innerHTML = `
                    <div class="alert alert-error">
                        <strong>Error de conexión</strong><br>
                        No se pudo cargar los permisos. Verifique que:<br>
                        - El servidor XAMPP esté ejecutándose<br>
                        - Tiene una sesión activa de empleado<br>
                        - La base de datos esté configurada correctamente<br>
                        <br>
                        <button class="neumorphic-button primary-button" onclick="loadPermisosContent()" style="margin-top: 10px;">
                            <i class="fas fa-refresh"></i> Reintentar
                        </button>
                    </div>
                `;
            }
        });
}

// Función para cargar perfil del empleado
function loadPerfilContent() {
    // Mostrar mensaje de carga
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.innerHTML = `
            <div style="text-align: center; padding: 30px;">
                <i class="fas fa-spinner fa-spin" style="font-size: 32px; color: #0066CC; margin-bottom: 15px;"></i>
                <p style="color: #666;">Cargando perfil...</p>
            </div>
        `;
    }
    
    // Cargar datos actualizados desde la sesión
    fetch('../controladores/get_session.php', {
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
                // Si tenemos id_empleado, obtener datos completos del empleado
                if (data.id_empleado) {
                    fetch(`../controladores/empleados_crud.php?action=read&id=${data.id_empleado}`, {
                        credentials: 'same-origin'
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`HTTP error! status: ${response.status}`);
                            }
                            return response.json();
                        })
                        .then(empData => {
                            const empleado = empData.success && empData.empleado ? empData.empleado : null;
                            
                            const content = `
                                <div class="content-header">
                                    <h2 class="module-title"><i class="fas fa-user"></i> Mi Perfil</h2>
                                </div>
                                
                                <div class="neumorphic-card elevated">
                                    <h4 class="chart-title"><i class="fas fa-info-circle"></i> Información Personal</h4>
                                    <div style="padding: 20px;">
                                        <p><strong>ID:</strong> ${empleado ? empleado.id : (data.id_empleado || 'N/A')}</p>
                                        <p><strong>Nombre:</strong> ${empleado ? empleado.nombre : (data.nombre || 'N/A')}</p>
                                        <p><strong>Cargo:</strong> ${empleado ? empleado.cargo : (data.cargo || 'N/A')}</p>
                                        <p><strong>Área:</strong> ${empleado ? empleado.area : (data.area || 'N/A')}</p>
                                        <p><strong>Usuario:</strong> ${data.usuario || 'N/A'}</p>
                                        <p><strong>Rol:</strong> ${data.rol || 'N/A'}</p>
                                    </div>
                                </div>
                            `;
                            const mainContent = document.getElementById('main-content');
                            if (mainContent) {
                                mainContent.innerHTML = content;
                            }
                        })
                        .catch(error => {
                            console.error('Error cargando datos del empleado:', error);
                            // Mostrar con datos de sesión si falla
                            const content = `
                                <div class="content-header">
                                    <h2 class="module-title"><i class="fas fa-user"></i> Mi Perfil</h2>
                                </div>
                                
                                <div class="neumorphic-card elevated">
                                    <h4 class="chart-title"><i class="fas fa-info-circle"></i> Información Personal</h4>
                                    <div style="padding: 20px;">
                                        <p><strong>ID:</strong> ${data.id_empleado || 'N/A'}</p>
                                        <p><strong>Nombre:</strong> ${data.nombre || 'N/A'}</p>
                                        <p><strong>Cargo:</strong> ${data.cargo || 'N/A'}</p>
                                        <p><strong>Área:</strong> ${data.area || 'N/A'}</p>
                                        <p><strong>Usuario:</strong> ${data.usuario || 'N/A'}</p>
                                        <p><strong>Rol:</strong> ${data.rol || 'N/A'}</p>
                                    </div>
                                </div>
                            `;
                            const mainContent = document.getElementById('main-content');
                            if (mainContent) {
                                mainContent.innerHTML = content;
                            }
                        });
                } else {
                    // Si no hay id_empleado, mostrar solo datos de sesión
                    const content = `
                        <div class="content-header">
                            <h2 class="module-title"><i class="fas fa-user"></i> Mi Perfil</h2>
                        </div>
                        
                        <div class="neumorphic-card elevated">
                            <h4 class="chart-title"><i class="fas fa-info-circle"></i> Información Personal</h4>
                            <div style="padding: 20px;">
                                <p><strong>ID:</strong> ${data.id_empleado || 'N/A'}</p>
                                <p><strong>Nombre:</strong> ${data.nombre || 'N/A'}</p>
                                <p><strong>Cargo:</strong> ${data.cargo || 'N/A'}</p>
                                <p><strong>Área:</strong> ${data.area || 'N/A'}</p>
                                <p><strong>Usuario:</strong> ${data.usuario || 'N/A'}</p>
                                <p><strong>Rol:</strong> ${data.rol || 'N/A'}</p>
                            </div>
                        </div>
                    `;
                    const mainContent = document.getElementById('main-content');
                    if (mainContent) {
                        mainContent.innerHTML = content;
                    }
                }
            } else {
                const mainContent = document.getElementById('main-content');
                if (mainContent) {
                    mainContent.innerHTML = `
                        <div class="alert alert-error">Error al cargar perfil: ${data.message || 'Error desconocido'}</div>
                    `;
                }
            }
        })
        .catch(error => {
            console.error('Error cargando perfil:', error);
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.innerHTML = `
                    <div class="alert alert-error">
                        <strong>Error de conexión</strong><br>
                        No se pudo cargar el perfil. Verifique que:<br>
                        - El servidor XAMPP esté ejecutándose<br>
                        - Tiene una sesión activa de empleado<br>
                        - La base de datos esté configurada correctamente<br>
                        <br>
                        <button class="neumorphic-button primary-button" onclick="loadPerfilContent()" style="margin-top: 10px;">
                            <i class="fas fa-refresh"></i> Reintentar
                        </button>
                    </div>
                `;
            }
        });
}

// Configurar navegación
function setupNavigation() {
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
            
            switch(newModuleKey) {
                case 'dashboard':
                    loadDashboardContent();
                    break;
                case 'asistencias':
                    loadAsistenciasContent();
                    break;
                case 'horarios':
                    loadHorariosContent();
                    break;
                case 'permisos':
                    loadPermisosContent();
                    break;
                case 'companeros':
                    loadCompanerosContent();
                    break;
                case 'perfil':
                    loadPerfilContent();
                    break;
            }
        });
    });
}

// Función para cargar compañeros
function loadCompanerosContent() {
    // Mostrar mensaje de carga
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.innerHTML = `
            <div style="text-align: center; padding: 30px;">
                <i class="fas fa-spinner fa-spin" style="font-size: 32px; color: #0066CC; margin-bottom: 15px;"></i>
                <p style="color: #666;">Cargando lista de compañeros...</p>
            </div>
        `;
    }
    
    fetch('../controladores/empleados_crud.php?action=read', {
        credentials: 'same-origin'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos recibidos de compañeros:', data);
            if (data.success) {
                const content = `
                    <div class="content-header">
                        <h2 class="module-title"><i class="fas fa-users"></i> Mis Compañeros</h2>
                    </div>
                    
                    <div class="neumorphic-card elevated">
                        <h4 class="chart-title"><i class="fas fa-list"></i> Lista de Empleados</h4>
                        <div class="table-responsive">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre</th>
                                        <th>Cargo</th>
                                        <th>Área</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${data.empleados && data.empleados.length > 0 ? data.empleados.map((emp, index) => `
                                        <tr class="${index % 2 === 0 ? 'odd-row' : ''}">
                                            <td>${emp.id}</td>
                                            <td>${emp.nombre}</td>
                                            <td>${emp.cargo}</td>
                                            <td>${emp.area}</td>
                                            <td><span class="status-badge ${emp.estado === 'activo' ? 'status-active' : ''}" style="${emp.estado === 'inactivo' ? 'color:#dc3545; background-color: rgba(220, 53, 69, 0.2);' : ''}">${emp.estado}</span></td>
                                        </tr>
                                    `).join('') : '<tr><td colspan="5" style="text-align: center;">No hay empleados registrados</td></tr>'}
                                </tbody>
                            </table>
                        </div>
                    </div>
                `;
                const mainContent = document.getElementById('main-content');
                if (mainContent) {
                    mainContent.innerHTML = content;
                }
            } else {
                const mainContent = document.getElementById('main-content');
                if (mainContent) {
                    mainContent.innerHTML = `
                        <div class="alert alert-error">Error: ${data.message || 'Error al cargar datos'}</div>
                        <button class="neumorphic-button primary-button" onclick="loadCompanerosContent()" style="margin-top: 10px;">
                            <i class="fas fa-refresh"></i> Reintentar
                        </button>
                    `;
                }
            }
        })
        .catch(error => {
            console.error('Error cargando compañeros:', error);
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.innerHTML = `
                    <div class="alert alert-error">
                        <strong>Error de conexión</strong><br>
                        No se pudo cargar la lista de compañeros. Verifique que:<br>
                        - El servidor XAMPP esté ejecutándose<br>
                        - Tiene una sesión activa de empleado<br>
                        - La base de datos esté configurada correctamente<br>
                        <br>
                        <button class="neumorphic-button primary-button" onclick="loadCompanerosContent()" style="margin-top: 10px;">
                            <i class="fas fa-refresh"></i> Reintentar
                        </button>
                    </div>
                `;
            }
        });
}

// Funciones auxiliares
function getEstadoClass(estado) {
    const estados = {
        'presente': 'status-active',
        'tarde': 'status-late',
        'ausente': 'status-late',
        'permiso': 'status-active'
    };
    return estados[estado] || 'status-active';
}

function getEstadoPermisoClass(estado) {
    const estados = {
        'aprobado': 'status-active',
        'pendiente': 'status-late',
        'rechazado': 'status-late'
    };
    return estados[estado] || 'status-late';
}

function logout() {
    if (confirm('¿Está seguro que desea cerrar sesión?')) {
        fetch('../controladores/logout.php', {
            method: 'POST',
            credentials: 'same-origin'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al cerrar sesión');
                }
                return response.json();
            })
            .then(data => {
                window.location.href = '../index.html';
            })
            .catch(error => {
                console.error('Error al cerrar sesión:', error);
                // Redirigir de todas formas
                window.location.href = '../index.html';
            });
    }
}




