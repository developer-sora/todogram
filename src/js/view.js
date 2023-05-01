import { findParent } from '../util/helper.js';

export default function View(template) {
  this.template = template;
  this.$darkMode = document.querySelector('#dark-mode-toggle');
  this.$date = document.querySelector('.date');
  this.$todoList = document.querySelector('#todo-list');
  this.$toggleAll = document.querySelector('#toggle-all');
  this.$newTodo = document.querySelector('.new-todo');
  this.$activeCounter = document.querySelector('.active-count');
  this.$completedCounter = document.querySelector('.completed-count');
  this.$allDestroy = document.querySelector('.all-destroy');
  this.$modal = document.querySelector('.modal');
  this.$post = document.querySelector('#post');
}

View.prototype.getDate = function () {
  const now = new Date();
  return `
  ${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()} 
  `;
};

View.prototype.getItemId = function (element) {
  const $li = findParent(element, 'li');
  return parseInt($li.dataset.id, 10);
};

View.prototype.deleteItem = function (id) {
  const elem = document.querySelector('[data-id="' + id + '"]');
  if (elem) {
    this.$todoList.removeChild(elem);
  }
};

View.prototype.toggleItem = function (id, completed) {
  const elem = document.querySelector('[data-id="' + id + '"]');
  if (elem) {
    elem.querySelector('input').checked = completed;
  }
};

View.prototype.editItem = function (id, title) {
  const elem = document.querySelector('[data-id="' + id + '"]');
  if (!elem) {
    return;
  }
  const div = elem.querySelector('div');
  div.classList.add('hidden');
  const input = document.createElement('input');
  input.id = 'edit';
  input.className = 'w-[97%] border-b outline-none pl-8 pb-1 pt-2 mb-1 mr-2';
  elem.appendChild(input);
  input.focus();
  input.value = title;
};

View.prototype.openEditMenu = function (id) {
  const $openedUl = document.querySelector('.opened');
  if ($openedUl) {
    $openedUl.classList.add('hidden');
    $openedUl.classList.remove('opened');
  }
  const elem = document.querySelector('[data-id="' + id + '"]');
  if (elem) {
    elem.querySelector('ul').classList.toggle('hidden');
    elem.querySelector('ul').classList.toggle('opened');
  }
};

View.prototype.closeEditMenu = function () {
  const elem = document.querySelector('.opened');
  if (elem) {
    elem.classList.add('hidden');
    elem.classList.remove('opened');
  }
};

View.prototype.editItemDone = function (id, title) {
  const elem = document.querySelector('[data-id="' + id + '"]');
  if (!elem) {
    return;
  }
  const div = elem.querySelector('div');
  div.classList.remove('hidden');
  const input = elem.querySelector('#edit');
  elem.removeChild(input);
  elem.querySelector('label').textContent = title;
};

View.prototype.render = function (viewCmd, parameter) {
  const viewCommands = {
    darkMode: () => {
      document.documentElement.classList.toggle('dark');
    },
    showDate: () => {
      this.$date.innerHTML = this.getDate();
    },
    showEntries: () => {
      this.$todoList.innerHTML = this.template.showMainTemplate(parameter);
      this.$allDestroy.disabled = parameter.length === 0;
    },
    activePostButton: () => {
      this.$post.disabled = false;
      this.$post.classList.remove('opacity-30');
    },
    disablePostButton: () => {
      this.$post.disabled = true;
      this.$post.classList.add('opacity-30');
    },
    addItemDone: () => {
      this.$newTodo.value = '';
    },
    openEditMenu: () => {
      this.openEditMenu(parameter);
    },
    closeEditMenu: () => {
      this.closeEditMenu(parameter);
    },
    openDropModal: () => {
      this.$modal.innerHTML = this.template.showModalTemplate('modal');
    },
    closeDropModal: () => {
      this.$modal.innerHTML = '';
    },
    deleteItem: () => {
      this.deleteItem(parameter);
    },
    toggleItem: () => {
      this.toggleItem(parameter.id, parameter.completed);
    },
    toggleAll: () => {
      this.$toggleAll.checked = parameter.completed;
    },
    editItem: () => {
      this.editItem(parameter.id, parameter.title);
    },
    editItemDone: () => {
      this.editItemDone(parameter.id, parameter.title);
    },
    updateElementCount: () => {
      this.$activeCounter.innerHTML = parameter.active;
      this.$completedCounter.innerHTML = parameter.completed;
    },
  };
  viewCommands[viewCmd]();
};

View.prototype.bind = function (event, handler) {
  if (event === 'turnDarkMode') {
    this.$darkMode.addEventListener('click', () => {
      handler();
    });
  } else if (event === 'controlPostButton') {
    this.$newTodo.addEventListener('keyup', e => {
      if (e.target.value !== '') {
        handler('active');
      } else {
        handler('disable');
      }
    });
  } else if (event === 'addItemDone') {
    this.$newTodo.addEventListener('keyup', e => {
      if (e.target.value !== '' && e.key === 'Enter') {
        handler(this.$newTodo.value);
      }
    });
    this.$post.addEventListener('click', () => {
      handler(this.$newTodo.value);
    });
  } else if (event === 'openEditMenu') {
    this.$todoList.addEventListener('click', e => {
      if (e.target.classList.contains('editButton')) {
        handler(this.getItemId(e.target));
      }
    });
  } else if (event === 'closeEditMenu') {
    document.addEventListener('click', e => {
      if (!e.target.classList.contains('editButton')) {
        handler();
      }
    });
  } else if (event === 'deleteItem') {
    this.$todoList.addEventListener('click', e => {
      if (e.target.classList.contains('delete')) {
        handler(this.getItemId(e.target));
      }
    });
  } else if (event === 'openDropModal') {
    this.$allDestroy.addEventListener('click', () => {
      handler();
    });
  } else if (event === 'closeDropModal') {
    document.addEventListener('click', e => {
      if (e.target.id === 'modalBackground') handler();
    });
    this.$modal.addEventListener('click', e => {
      if (e.target.id === 'exit' || e.target.id === 'cancel') {
        handler();
      }
    });
  } else if (event === 'dropItemsDone') {
    this.$modal.addEventListener('click', e => {
      if (e.target.id === 'drop') {
        handler();
      }
    });
  } else if (event === 'toggleItem') {
    this.$todoList.addEventListener('click', e => {
      if (e.target.classList.contains('toggle')) {
        handler({
          id: this.getItemId(e.target),
          completed: e.target.checked,
        });
      }
    });
  } else if (event === 'toggleAll') {
    this.$toggleAll.addEventListener('click', e => {
      if (e.target.id === 'toggle-all') {
        handler(e.target.checked);
      }
    });
  } else if (event === 'editItem') {
    this.$todoList.addEventListener('dblclick', e => {
      if (e.target.classList.contains('list_elem')) {
        handler(this.getItemId(e.target));
      }
    });
    this.$todoList.addEventListener('click', e => {
      if (e.target.classList.contains('editItem')) {
        handler(this.getItemId(e.target));
      }
    });
  } else if (event === 'editItemDone') {
    this.$todoList.addEventListener(
      'blur',
      e => {
        if (e.target.id === 'edit') {
          handler({
            id: this.getItemId(e.target),
            title: e.target.value,
          });
        }
      },
      true
    );
    this.$todoList.addEventListener('keypress', e => {
      if (e.target.id === 'edit' && e.key === 'Enter') {
        e.target.blur();
      }
    });
  }
};
