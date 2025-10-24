class Todo {
  constructor() {
    const saved = localStorage.getItem("tasks");

    this.tasks = saved ? JSON.parse(saved) : [];
    localStorage.setItem("tasks", JSON.stringify(this.tasks));

    this.term = "";

    this.tbody = document.getElementById("taskList");
    this.addBtn = document.getElementById("addTaskBtn");
    this.newTaskInput = document.getElementById("newTaskInput");
    this.newTaskDate = document.getElementById("newTaskDate");
    this.searchInput = document.getElementById("searchInput");

    this.addBtn.addEventListener("click", () => this.addTask());
    this.newTaskInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") this.addTask();
    });

    this.searchInput.addEventListener("input", () => {
      this.term = this.searchInput.value.trim().toLowerCase();
      this.draw();
    });

    this.draw();
  }

  save() {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }

  get filteredTasks() {
    if (!this.term) return this.tasks;
    return this.tasks.filter(task =>
      task.text.toLowerCase().includes(this.term)
    );
  }

  draw() {

    this.tbody.innerHTML = "";
    const filtered = this.filteredTasks;

    if (filtered.length === 0) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 4;
      td.style.textAlign = "center";
      td.style.padding = "16px";
      td.textContent = this.tasks.length
        ? "Brak pasujących zadań."
        : "Brak zadań — dodaj nowe.";
      tr.appendChild(td);
      this.tbody.appendChild(tr);
      return;
    }

    filtered.forEach(task => {

      const tr = document.createElement("tr");
      const tdName = document.createElement("td");

      if (this.term) {
        const regex = new RegExp(`(${this.term})`, "gi");
        tdName.innerHTML = task.text.replace(regex, '<mark>$1</mark>');
      } else {
        tdName.textContent = task.text;
      }

      const tdDate = document.createElement("td");
      tdDate.textContent = task.date || "";

      const tdEdit = document.createElement("td");
      const editBtn = document.createElement("button");

      editBtn.textContent = "Edytuj";
      editBtn.className = "edit-btn";
      editBtn.addEventListener("click", () => this.editTask(task.id));

      tdEdit.appendChild(editBtn);



      const tdDelete = document.createElement("td");
      const removeBtn = document.createElement("button");

      removeBtn.textContent = "Usuń";
      removeBtn.className = "remove-btn";
      removeBtn.addEventListener("click", () => this.deleteTask(task.id));
    
      tdDelete.appendChild(removeBtn);
    

      tr.appendChild(tdName);
      tr.appendChild(tdDate);
      tr.appendChild(tdEdit);
      tr.appendChild(tdDelete);

      this.tbody.appendChild(tr);
    });
  }

  addTask() {
    
    const text = this.newTaskInput.value.trim();
    const date = this.newTaskDate.value;

    if (text.length < 3) {
      alert("Nazwa zadania musi mieć co najmniej 3 znaki.");
      return;
    }
    if (text.length > 255) {
      alert("Nazwa zadania nie może przekraczać 255 znaków.");
      return;
    }
    if (date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const inputDate = new Date(date);
      if (inputDate < today) {
        alert("Data musi być pusta lub w przyszłości.");
        return;
      }
    }

    const newTask = {
      id: crypto.randomUUID(),
      text,
      date
    };

    this.tasks.push(newTask);
    this.save();
    this.newTaskInput.value = "";
    this.newTaskDate.value = "";
    this.draw();
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.save();
    this.draw();
  }

  editTask(id) {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return;

    const newText = prompt("Edytuj nazwę zadania:", task.text);
    if (newText === null) return;

    const newDate = prompt("Edytuj datę (rrrr-mm-dd):", task.date || "");
    if (newDate === null) return;

    if (newText.trim().length === 0) {
      alert("Nazwa zadania nie może być pusta.");
      return;
    }

    task.text = newText.trim();
    task.date = newDate;
    this.save();
    this.draw();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.todo = new Todo();
});
