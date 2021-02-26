import { getDataFromApi, addTaskToApi, deleteTaskToApi } from './data';

class PomodoroApp {
  constructor(options) {
    let { tableTbodySelector, taskFormSelector } = options;
    this.$tableTbody = document.querySelector(tableTbodySelector);
    this.$taskForm = document.querySelector(taskFormSelector);
    this.$taskFormInput = this.$taskForm.querySelector('input');
    this.$addButton = this.$taskForm.querySelector('button');
  }

  addTask(task) {
    this.$addButton.textContent = 'Loading...';
    this.$addButton.disabled = true;
    addTaskToApi(task)
      .then((data) => data.json())
      .then((newTask) => {
        this.addTaskToTable(newTask);
        this.$addButton.textContent = 'Add Task';
        this.$addButton.disabled = false;
      });
  }

  addTaskToTable(task, index) {
    const $newTaskEl = document.createElement('tr');
    $newTaskEl.innerHTML = `<th scope="row" class="count"></th><td>${task.title}</td> <td><button id='${task.id}' class="delete-button"><i class="bi bi-trash"></i></button></td>`;
    this.$tableTbody.appendChild($newTaskEl);

    this.$taskFormInput.value = '';
  }

  handleAddTask() {
    this.$taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const task = { title: this.$taskFormInput.value };
      if (this.$taskFormInput.value) {
        this.addTask(task);
      }
    });
  }

  fillTasksTable() {
    getDataFromApi().then((currentTasks) => {
      currentTasks.forEach((task, index) => {
        this.addTaskToTable(task, index + 1);
      });
      this.fillDeleteTask();
    });
  }

  fillDeleteTask() {
    const $deleteButton = document.querySelectorAll('.delete-button');
    $deleteButton.forEach((button) => {
      button.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this?')) {
          deleteTaskToApi(button.id).then(() => {
            location.reload();
          });
        }
      });
    });
  }

  init() {
    this.fillTasksTable();
    this.handleAddTask();
  }
}

export default PomodoroApp;
