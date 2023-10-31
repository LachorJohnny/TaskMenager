document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("task");
    const taskList = document.getElementById("task-list");
    let draggingTask = null;

    // Funkcja do zapisywania zadań w localStorage
    function saveTasks() {
        const tasks = [];
        const taskItems = taskList.getElementsByTagName("li");
        for (const taskItem of taskItems) {
            tasks.push({
                text: taskItem.querySelector("span").textContent,
                completed: taskItem.classList.contains("completed"),
            });
        }
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Funkcja do wczytywania zadań z localStorage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        for (const task of tasks) {
            const taskItem = createTaskItem(task.text, task.completed);
            taskList.appendChild(taskItem);
            makeTaskDraggable(taskItem);
        }
    }

    // Funkcja, która ustawia element jako przeciagający
    function makeTaskDraggable(taskItem) {
        taskItem.setAttribute("draggable", true);

        taskItem.addEventListener("dragstart", function (event) {
            event.dataTransfer.setData("text/plain", "");
            draggingTask = taskItem;
            taskItem.classList.add("dragging");
        });

        taskItem.addEventListener("dragend", function (event) {
            draggingTask = null;
            taskItem.classList.remove("dragging");
            saveTasks();
        });
    }

    // Funkcja, która obsługuje przesuwanie zadań
    taskList.addEventListener("dragover", function (event) {
        event.preventDefault();
    });

    taskList.addEventListener("drop", function (event) {
        event.preventDefault();
        if (draggingTask) {
            const fromIndex = Array.from(taskList.children).indexOf(
                draggingTask
            );
            const to = event.target.closest("li");
            if (to && to !== draggingTask) {
                const toIndex = Array.from(taskList.children).indexOf(to);
                if (toIndex > fromIndex) {
                    taskList.insertBefore(draggingTask, to.nextSibling);
                } else {
                    taskList.insertBefore(draggingTask, to);
                }
            }

            // Aktualizuj localStorage po przesunięciu zadania
            saveTasks();
        }
    });

    function addTask() {
        const taskText = taskInput.value;
        if (taskText.trim() === "") {
            return;
        }

        const taskItem = createTaskItem(taskText, false);
        taskList.appendChild(taskItem);
        taskInput.value = "";

        makeTaskDraggable(taskItem);

        saveTasks();
    }

    function createTaskItem(text, completed) {
        const taskItem = document.createElement("li");
        if (completed) {
            taskItem.classList.add("completed");
        }
        const span = document.createElement("span");
        span.textContent = text;

        span.addEventListener("click", function () {
            const newText = prompt("Edytuj treść zadania:", text);
            if (newText !== null) {
                span.textContent = newText;
                saveTasks();
            }
        });

        const completeButton = document.createElement("button");
        completeButton.textContent = "Zakończ";
        completeButton.classList.add("complete");

        completeButton.addEventListener("click", function () {
            taskItem.classList.toggle("completed");
            saveTasks();
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Usuń";
        deleteButton.classList.add("delete");

        deleteButton.addEventListener("click", function () {
            taskList.removeChild(taskItem);
            saveTasks();
        });

        const buttonsDiv = document.createElement("div");
        buttonsDiv.classList.add("task-buttons");
        buttonsDiv.appendChild(completeButton);
        buttonsDiv.appendChild(deleteButton);

        taskItem.appendChild(span);
        taskItem.appendChild(buttonsDiv);

        return taskItem;
    }

    document.getElementById("add-task").addEventListener("click", addTask);
    taskInput.addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            addTask();
        }
    });

    loadTasks();
});
