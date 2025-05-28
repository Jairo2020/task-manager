var tasks = [
    { name: 'Tarea 1', hours: 2 },
    { name: 'Tarea 2', hours: 3 },
    { name: 'Tarea 3', hours: 1.5 }
];

// Inicializar la lista de tareas
tasks.forEach(task => {
    const li = document.createElement('li');
    li.textContent = `${task.name} - ${task.hours} horas`;
    taskList.appendChild(li);
});
