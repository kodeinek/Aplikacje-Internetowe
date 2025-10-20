class Todo {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    this.find = '';
    this.draw();
    this.listen();
  }

  listen() {
    const search = document.querySelector('.search_bar input');
    if (search) {
      search.addEventListener('input', e => {
        this.find = e.target.value.toLowerCase();
        this.draw();
      });
    }

    const button = document.querySelector('.save');
    if (button) {
      button.addEventListener('click', () => this.addTask());
    }
  }

  addTask() {
    const desc = document.querySelector('.new_listing .description input').value || '';
    const date = document.querySelector('.new_listing .date input').value || '';

    if (desc.length < 3 || desc.length > 255) {
      alert("Opis musi mieć 3-255 znaków");
      return;
    }


    this.tasks.push({ description: desc, date });
    this.save();
    this.draw();
  }

  deleteTask(index) {
    this.tasks.splice(index, 1);
    this.save();
    this.draw();
  }

  editTask(index, newText) {
    this.tasks[index].description = newText;
    this.save();
    this.draw();
  }

  getFilteredTasks() {
    if (!this.find || this.find.length < 2) return this.tasks;
    return this.tasks.filter(t => t.description.toLowerCase().includes(this.find));
  }

  draw() {
    const listContainer = document.querySelector('.lista');
    listContainer.querySelectorAll('.instance').forEach(el => el.remove());

    const filtered = this.getFilteredTasks();

    filtered.forEach((t, i) => {
      const div = document.createElement('div');
      div.classList.add('instance');

      const desc = document.createElement('div');
      desc.classList.add('description');

      if (this.find && this.find.length >= 2) {
        const regex = new RegExp(`(${this.find})`, 'gi');
        const highlightedText = t.description.replace(regex, '<span class="highlight">$1</span>');
        desc.innerHTML = highlightedText;
      } else {
        desc.textContent = t.description;
      }

      desc.addEventListener('click', () => {
        const input = document.createElement('input');
        input.value = t.description;
        desc.textContent = '';
        desc.appendChild(input);
        input.focus();

        input.addEventListener('blur', () => {
          this.editTask(i, input.value);
        });
      });

      const date = document.createElement('div');
      date.classList.add('date');
      date.textContent = t.date ? t.date : '';

      date.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'date';
        input.value = t.date || '';
        date.textContent = '';
        date.appendChild(input);
        input.focus();

        input.addEventListener('blur', () => {

          this.tasks[i].date = input.value;
          this.save();
          this.draw();
        });
      });

      const del = document.createElement('div');
      del.classList.add('delete');
      del.textContent = 'X';
      del.addEventListener('click', () => this.deleteTask(i));

      div.appendChild(desc);
      div.appendChild(date);
      div.appendChild(del);
      listContainer.insertBefore(div, document.querySelector('.new_listing'));
    });
  }


  save() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new Todo();
});
