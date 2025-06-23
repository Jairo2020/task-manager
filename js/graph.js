
// Configuración inicial del gráfico
const ctx = document.getElementById('hoursChart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [
            {
                label: 'Horas pendientes',
                data: [],
                backgroundColor: 'rgba(0, 123, 255, 0.7)'
            },
            {
                label: 'Horas completadas',
                data: [],
                backgroundColor: 'rgba(40, 167, 69, 0.7)'
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    padding: 20,
                    boxWidth: 15
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.dataset.label || '';
                        const value = context.parsed.y || 0;
                        return `${label}: ${value} horas`;
                    },
                    afterLabel: function (context) {
                        const taskIndex = context.dataIndex;
                        const task = tasks[taskIndex];
                        if (task) {
                            return [
                                `Prioridad: ${task.priority || 'No especificada'}`,
                                `Estado: ${task.completed ? 'Completado' : 'Pendiente'}`
                            ];
                        }
                        return '';
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: { display: true, text: 'Horas' }
            },
            x: {
                title: { display: true, text: 'Tareas' }
            }
        }
    }
});

// Función para actualizar el gráfico con los datos actuales
function updateChart() {
    // Obtener nombres de tareas para las etiquetas
    chart.data.labels = tasks.map(t => t.name);

    // Preparar datos para el gráfico
    const pendingHours = tasks.map(t => t.completed ? 0 : t.hours);
    const completedHours = tasks.map(t => t.completed ? t.hours : 0);

    // Actualizar datasets
    chart.data.datasets[0].data = pendingHours;
    chart.data.datasets[1].data = completedHours;

    // Actualizar colores basados en prioridad
    chart.data.datasets[0].backgroundColor = tasks.map(t => {
        if (!t.completed) {
            switch (t.priority) {
                case 'alta': return 'rgba(220, 53, 69, 0.7)'; // Rojo para alta
                case 'media': return 'rgba(255, 193, 7, 0.7)'; // Amarillo para media
                default: return 'rgba(0, 123, 255, 0.7)'; // Azul para baja o no especificada
            }
        }
        return 'rgba(0, 0, 0, 0)'; // Transparente si está completada
    });

    // Actualizar el gráfico
    chart.update();

    // Mostrar estadísticas adicionales si existe el elemento
    const statsElement = document.getElementById('taskStats');
    if (statsElement) {
        updateTaskStats(statsElement);
    }
}

// Función para mostrar estadísticas de tareas
function updateTaskStats(element) {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const pendingTasks = totalTasks - completedTasks;

    const totalHours = tasks.reduce((sum, t) => sum + t.hours, 0);
    const completedHours = tasks.filter(t => t.completed).reduce((sum, t) => sum + t.hours, 0);
    const pendingHours = totalHours - completedHours;

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    let priorityDistribution = {
        alta: tasks.filter(t => t.priority === 'alta').length,
        media: tasks.filter(t => t.priority === 'media').length,
        baja: tasks.filter(t => t.priority === 'baja').length
    };

    element.innerHTML = `
        <div class="stats-grid">
            <div class="stat-item">
                <h4>Total de tareas</h4>
                <p>${totalTasks}</p>
            </div>
            <div class="stat-item">
                <h4>Tareas completadas</h4>
                <p>${completedTasks} (${completionRate}%)</p>
            </div>
            <div class="stat-item">
                <h4>Tareas pendientes</h4>
                <p>${pendingTasks}</p>
            </div>
            <div class="stat-item">
                <h4>Total de horas</h4>
                <p>${totalHours.toFixed(1)}</p>
            </div>
            <div class="stat-item">
                <h4>Horas completadas</h4>
                <p>${completedHours.toFixed(1)}</p>
            </div>
            <div class="stat-item">
                <h4>Horas pendientes</h4>
                <p>${pendingHours.toFixed(1)}</p>
            </div>
        </div>
        <div class="priority-stats">
            <h4>Distribución por prioridad</h4>
            <div class="priority-bars">
                <div class="priority-bar">
                    <span>Alta: ${priorityDistribution.alta}</span>
                    <div class="bar" style="width: ${priorityDistribution.alta / totalTasks * 100}%; background-color: rgba(220, 53, 69, 0.7);"></div>
                </div>
                <div class="priority-bar">
                    <span>Media: ${priorityDistribution.media}</span>
                    <div class="bar" style="width: ${priorityDistribution.media / totalTasks * 100}%; background-color: rgba(255, 193, 7, 0.7);"></div>
                </div>
                <div class="priority-bar">
                    <span>Baja: ${priorityDistribution.baja}</span>
                    <div class="bar" style="width: ${priorityDistribution.baja / totalTasks * 100}%; background-color: rgba(0, 123, 255, 0.7);"></div>
                </div>
            </div>
        </div>
    `;
}