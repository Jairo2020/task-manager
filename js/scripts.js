// Variables globales
let tasks = [];
let activeFilters = {
    status: 'all',
    priority: 'all'
};

// Cargar tareas al iniciar
document.addEventListener('DOMContentLoaded', function () {
    loadTasks();
    renderTasks();
    updateChart();

    // Configuración de filtros
    const filterButton = document.getElementById('filterButton');
    const filterPanel = document.getElementById('filterOptions');
    const applyFiltersBtn = document.getElementById('applyFilters');
    const resetFiltersBtn = document.getElementById('resetFilters');

    // Mostrar/ocultar panel de filtros
    filterButton.addEventListener('click', function () {
        filterPanel.style.display = filterPanel.style.display === 'block' ? 'none' : 'block';
    });

    // Aplicar filtros
    applyFiltersBtn.addEventListener('click', function () {
        activeFilters.status = document.getElementById('filterStatus').value;
        activeFilters.priority = document.getElementById('filterPriority').value;

        filterTasks();
        filterPanel.style.display = 'none';
    });

    // Restablecer filtros
    resetFiltersBtn.addEventListener('click', function () {
        document.getElementById('filterStatus').value = 'all';
        document.getElementById('filterPriority').value = 'all';

        activeFilters.status = 'all';
        activeFilters.priority = 'all';

        filterTasks();
        filterPanel.style.display = 'none';
    });

    // Asegurarse de que el panel de filtros está oculto al iniciar
    if (filterPanel) {
        filterPanel.style.display = 'none';
    }

    // Inicializar selectores de filtro con los valores actuales
    if (document.getElementById('filterStatus')) {
        document.getElementById('filterStatus').value = activeFilters.status;
    }

    if (document.getElementById('filterPriority')) {
        document.getElementById('filterPriority').value = activeFilters.priority;
    }
});

// Función para cargar tareas desde localStorage
function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');

    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    } else {
        // Datos iniciales si no hay tareas guardadas
        tasks = [
            { id: 1, name: 'Tarea 1', hours: 2, priority: 'alta', completed: false, dueDate: '2025-06-30', description: 'Descripción de la tarea 1' },
            { id: 2, name: 'Tarea 2', hours: 3, priority: 'media', completed: false, dueDate: '2025-07-05', description: 'Descripción de la tarea 2' },
            { id: 3, name: 'Tarea 3', hours: 1.5, priority: 'baja', completed: true, dueDate: '2025-06-25', description: 'Descripción de la tarea 3' }
        ];
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

// Función para mostrar las tareas en la lista
function renderTasks() {
    // Mostrar todas las tareas al renderizar inicialmente
    renderFilteredTasks(tasks);

    // Actualizar estadísticas
    const statsElement = document.getElementById('taskStats');
    if (statsElement) {
        updateTaskStats(statsElement);
    }
}

// Función para cambiar el estado de la tarea (completada/pendiente)
function toggleTaskStatus(taskId) {
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex !== -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
        updateChart();
    }
}

// Función para editar una tarea
function editTask(taskId) {
    window.location.href = `pages/forms.html?id=${taskId}`;
}

// Función para eliminar una tarea
function deleteTask(taskId) {
    if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
        tasks = tasks.filter(task => task.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
        updateChart();
    }
}

// Función para filtrar las tareas según los criterios seleccionados
function filterTasks() {
    console.log("Aplicando filtros:", activeFilters); // Debug para verificar los filtros
    const filteredTasks = tasks.filter(task => {
        // Filtro por estado
        if (activeFilters.status !== 'all') {
            if (activeFilters.status === 'completed' && !task.completed) {
                return false;
            } else if (activeFilters.status === 'pending' && task.completed) {
                return false;
            }
        }

        // Filtro por prioridad
        if (activeFilters.priority !== 'all' && task.priority !== activeFilters.priority) {
            return false;
        }

        return true;
    });

    console.log("Tareas filtradas:", filteredTasks.length); // Debug para verificar el resultado

    // Renderizar solo las tareas filtradas
    renderFilteredTasks(filteredTasks);

    // También actualizar el gráfico con las tareas filtradas
    updateChartWithFiltered(filteredTasks);
}

// Función para mostrar las tareas filtradas
function renderFilteredTasks(filteredTasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    if (filteredTasks.length === 0) {
        taskList.innerHTML = '<p class="empty-list">No hay tareas que coincidan con los filtros seleccionados</p>';
        return;
    }

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = task.completed ? 'task-item completed' : 'task-item';

        // Crear contenedor para información de la tarea
        const taskInfo = document.createElement('div');
        taskInfo.className = 'task-info';

        // Crear título con prioridad
        const title = document.createElement('h3');
        title.textContent = task.name;
        title.className = `task-title priority-${task.priority}`;
        taskInfo.appendChild(title);

        // Agregar descripción
        if (task.description) {
            const desc = document.createElement('p');
            desc.className = 'task-description';
            desc.textContent = task.description;
            taskInfo.appendChild(desc);
        }

        // Crear contenedor para metadatos
        const metaData = document.createElement('div');
        metaData.className = 'task-metadata';

        // Agregar fecha de vencimiento
        if (task.dueDate) {
            const date = document.createElement('span');
            date.className = 'task-date';
            const formattedDate = new Date(task.dueDate).toLocaleDateString();
            date.innerHTML = `<strong>Fecha:</strong> ${formattedDate}`;
            metaData.appendChild(date);
        }

        // Agregar horas
        const hours = document.createElement('span');
        hours.className = 'task-hours';
        hours.innerHTML = `<strong>Horas:</strong> ${task.hours}`;
        metaData.appendChild(hours);

        // Agregar estado
        const status = document.createElement('span');
        status.className = 'task-status';
        status.innerHTML = `<strong>Estado:</strong> ${task.completed ? 'Completado' : 'Pendiente'}`;
        metaData.appendChild(status);

        taskInfo.appendChild(metaData);
        li.appendChild(taskInfo);

        // Crear contenedor para botones
        const actions = document.createElement('div');
        actions.className = 'task-actions';

        // Botón para marcar como completado/pendiente
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'toggle-btn';
        toggleBtn.innerHTML = task.completed ? '↩️' : '✓';
        toggleBtn.title = task.completed ? 'Marcar como pendiente' : 'Marcar como completado';
        toggleBtn.addEventListener('click', () => toggleTaskStatus(task.id));
        actions.appendChild(toggleBtn);

        // Botón para editar
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.innerHTML = '✏️';
        editBtn.title = 'Editar tarea';
        editBtn.addEventListener('click', () => editTask(task.id));
        actions.appendChild(editBtn);

        // Botón para eliminar
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.title = 'Eliminar tarea';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
        actions.appendChild(deleteBtn);

        li.appendChild(actions);
        taskList.appendChild(li);
    });
}

// Función para actualizar el gráfico con tareas filtradas
function updateChartWithFiltered(filteredTasks) {
    // Si hay una función updateChart en el ámbito global, significa que está en otro archivo
    if (typeof updateChart === 'function') {
        // Guardamos las tareas originales
        const originalTasks = [...tasks];

        // Temporalmente reemplazamos tasks con las tareas filtradas
        window.tasks = filteredTasks;

        // Actualizamos el gráfico
        updateChart();

        // Restauramos las tareas originales
        window.tasks = originalTasks;

        // También actualizamos las estadísticas
        const statsElement = document.getElementById('taskStats');
        if (statsElement && typeof updateTaskStats === 'function') {
            // Guardamos las tareas originales nuevamente
            const originalTasks = [...tasks];

            // Temporalmente reemplazamos tasks con las tareas filtradas
            window.tasks = filteredTasks;

            // Actualizamos las estadísticas
            updateTaskStats(statsElement);

            // Restauramos las tareas originales
            window.tasks = originalTasks;
        }
    }
}
