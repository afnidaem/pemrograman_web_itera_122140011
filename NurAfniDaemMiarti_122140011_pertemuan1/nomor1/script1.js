document.addEventListener("DOMContentLoaded", loadTasks);

function addTask() {
    let taskInput = document.getElementById("taskInput");
    let taskText = taskInput.value.trim();
    if (taskText === "") return;
    
    let tasks = getTasks();
    tasks.push({ text: taskText, completed: false, editing: false });
    saveTasks(tasks);
    taskInput.value = "";
    renderTasks();
}

function toggleTask(index) {
    let tasks = getTasks();
    tasks[index].completed = !tasks[index].completed;
    saveTasks(tasks);
    renderTasks();
}

function deleteTask(index) {
    let tasks = getTasks();
    tasks.splice(index, 1);
    saveTasks(tasks);
    renderTasks();
}

function editTask(index) {
    let tasks = getTasks();
    tasks[index].editing = true;
    saveTasks(tasks);
    renderTasks();
}

function saveEditedTask(index) {
    let tasks = getTasks();
    let inputField = document.getElementById(`edit-${index}`);
    let newText = inputField.value.trim();
    if (newText !== "") {
        tasks[index].text = newText;
    }
    tasks[index].editing = false;
    saveTasks(tasks);
    renderTasks();
}

function cancelEdit(index) {
    let tasks = getTasks();
    tasks[index].editing = false;
    saveTasks(tasks);
    renderTasks();
}

function toggleAllTasks() {
    let tasks = getTasks();
    let allCompleted = tasks.every(task => task.completed);
    tasks = tasks.map(task => ({ ...task, completed: !allCompleted }));
    saveTasks(tasks);
    renderTasks();
}

function deleteAllTasks() {
    if (confirm("Apakah Anda yakin ingin menghapus semua tugas?")) {
        localStorage.removeItem("tasks");
        renderTasks();
    }
}

function getTasks() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
    let taskList = document.getElementById("taskList");
    let toggleAllButton = document.getElementById("toggleAll");
    taskList.innerHTML = "";
    let tasks = getTasks();
    let allCompleted = tasks.length > 0 && tasks.every(task => task.completed);
    toggleAllButton.textContent = allCompleted ? "Batalkan Semua" : "Selesai Semua";
    
    tasks.forEach((task, index) => {
        let li = document.createElement("li");
        li.classList.add("task-card");
        if (task.editing) {
            li.innerHTML = `<div class="task-content">
                                <input type="text" id="edit-${index}" class="edit-input" value="${task.text}">
                            </div>
                            <div class="task-actions">
                                <button class="save-button" onclick="saveEditedTask(${index})">Simpan</button>
                                <button class="cancel-button" onclick="cancelEdit(${index})">Batal</button>
                            </div>`;
        } else {
            li.innerHTML = `<div class="task-content">
                                <input type="checkbox" ${task.completed ? 'checked' : ''} onclick="toggleTask(${index})">
                                <span class="${task.completed ? 'done' : ''}">${task.text}</span>
                            </div>
                            <div class="task-actions">
                                <button class="edit-button" onclick="editTask(${index})">Edit</button>
                                <button class="delete-button" onclick="deleteTask(${index})">Hapus</button>
                            </div>`;
        }
        taskList.appendChild(li);
    });
}

function loadTasks() {
    renderTasks();
}