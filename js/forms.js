// Variables globales
let isEditMode = false;
let editingTaskId = null;

// Inicializar el formulario
document.addEventListener('DOMContentLoaded', function () {
    const taskForm = document.getElementById('taskForm');
    const cancelBtn = document.getElementById('cancelBtn');
    const submitBtn = document.getElementById('submitBtn');

    // Comprobamos si estamos en modo edición (verificando parámetros URL)
    const urlParams = new URLSearchParams(window.location.search);
    const taskId = urlParams.get('id');

    if (taskId) {
        // Estamos en modo edición
        isEditMode = true;
        editingTaskId = parseInt(taskId);
        document.getElementById('formTitle').textContent = 'Editar Tarea';
        submitBtn.textContent = 'Guardar Cambios';

        // Cargar los datos de la tarea desde localStorage
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const taskToEdit = tasks.find(task => task.id === editingTaskId);

        if (taskToEdit) {
            // Llenar el formulario con los datos de la tarea
            document.getElementById('taskId').value = taskToEdit.id;
            document.getElementById('titulo').value = taskToEdit.name;
            document.getElementById('descripcion').value = taskToEdit.description || '';
            document.getElementById('fecha').value = taskToEdit.dueDate || '';
            document.getElementById('horas').value = taskToEdit.hours || 1;
            document.getElementById('prioridad').value = taskToEdit.priority || 'media';
            document.getElementById('completado').value = taskToEdit.completed ? 'true' : 'false';
        } else {
            // Si no se encuentra la tarea, redirigir a la página principal
            window.location.href = '../index.html';
        }
    } else {
        // Estamos en modo creación
        document.getElementById('completadoGroup').style.display = 'none'; // Ocultar campo de completado en creación
    }

    // Manejar envío del formulario
    taskForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Recoger datos del formulario
        const taskData = {
            id: isEditMode ? editingTaskId : Date.now(), // Usar ID existente o generar nuevo
            name: document.getElementById('titulo').value,
            description: document.getElementById('descripcion').value,
            dueDate: document.getElementById('fecha').value,
            hours: parseFloat(document.getElementById('horas').value),
            priority: document.getElementById('prioridad').value,
            completed: document.getElementById('completado').value === 'true'
        };

        // Guardar en localStorage
        saveTask(taskData);

        // Redirigir a la página principal
        window.location.href = '../index.html';
    });

    // Manejar cancelación
    cancelBtn.addEventListener('click', function () {
        window.location.href = '../index.html';
    });
});

// Función para guardar tarea
function saveTask(taskData) {
    // Obtener tareas existentes
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    if (isEditMode) {
        // Actualizar tarea existente
        const index = tasks.findIndex(task => task.id === taskData.id);
        if (index !== -1) {
            tasks[index] = taskData;
        }
    } else {
        // Agregar nueva tarea
        tasks.push(taskData);
    }

    // Guardar en localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
