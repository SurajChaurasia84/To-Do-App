let allTasks = [];

document.addEventListener("DOMContentLoaded", () => {
    loadTasks();
    loadTheme();
    document
        .getElementById("taskInput")
        .addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                addTask();
            }
        });
});

function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskText = taskInput.value.trim();
    if (taskText === "") return;

    allTasks.push({ text: taskText, completed: false });
    saveTasks();
    renderTasks();
    taskInput.value = "";
}

function createTaskElement(task, index) {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    const span = document.createElement("span");
    span.textContent = task.text;

    span.addEventListener("click", () => {
        allTasks[index].completed = !allTasks[index].completed;
        saveTasks();
        renderTasks();
    });

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-btn");
    editBtn.innerHTML = `<i class="fas fa-pen"></i>`;
    editBtn.addEventListener("click", () => {
        const input = document.createElement("input");
        input.type = "text";
        input.value = task.text;
        input.classList.add("edit-input");

        input.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                const newText = input.value.trim();
                if (newText !== "") {
                    allTasks[index].text = newText;
                    saveTasks();
                    renderTasks();
                }
            }
        });

        li.replaceChild(input, span);
        input.focus();
    });

    const delBtn = document.createElement("button");
    delBtn.classList.add("delete-btn");
    delBtn.innerHTML = `<i class="fas fa-trash"></i>`;
    delBtn.addEventListener("click", () => {
        li.classList.add("fade-out");
        setTimeout(() => {
            allTasks.splice(index, 1);
            saveTasks();
            renderTasks();
        }, 400);
    });

    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(delBtn);
    return li;
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(allTasks));
}

function loadTasks() {
    const saved = JSON.parse(localStorage.getItem("tasks")) || [];
    allTasks = saved;
    renderTasks();
}

function renderTasks(filter = "all") {
    const list = document.getElementById("taskList");
    list.innerHTML = "";

    [...allTasks].reverse().forEach((task, i) => {
        const index = allTasks.length - 1 - i;

        if (
            (filter === "completed" && !task.completed) ||
            (filter === "pending" && task.completed)
        )
            return;

        const taskElement = createTaskElement(task, index);
        list.appendChild(taskElement);
    });

    const clearBtn = document.querySelector(".clear-btn");
    clearBtn.style.display = allTasks.length > 0 ? "block" : "none";
}

function filterTasks(type) {
    renderTasks(type);
}

function showModal() {
    document.getElementById("confirmModal").style.display = "flex";
}

function hideModal() {
    document.getElementById("confirmModal").style.display = "none";
}

function clearAllTasks() {
    allTasks = [];
    saveTasks();
    renderTasks();
    hideModal();
}

function toggleTheme() {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    document.getElementById("themeIcon").className = isDark
        ? "fas fa-moon"
        : "fas fa-sun";
    localStorage.setItem("theme", isDark ? "dark" : "light");
}

function loadTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark");
        document.getElementById("themeIcon").className = "fas fa-moon";
    } else {
        document.getElementById("themeIcon").className = "fas fa-sun";
    }
}
