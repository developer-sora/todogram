import { findParent } from '../util/helper.js';
import showTemplate from '../util/template.js';

export default function View() {
  this.showTemplate = showTemplate;
  this.$darkMode = document.querySelector('#dark-mode-toggle');
  this.$date = document.querySelector('.date');
  this.$todoList = document.querySelector('#todo-list');
  this.$toggleAll = document.querySelector('#toggle-all');
  this.$newTodo = document.querySelector('.new-todo');
  this.$activeCounter = document.querySelector('.todo-count');
  this.$completedCounter = document.querySelector('.done-count');
  this.$allDestroy = document.querySelector('.all-destroy');
  this.$modal = document.querySelector('.modal');
  this.$post = document.querySelector('#post');
}

// 화살표 함수와 function() 차이점 공부

View.prototype.getDate = function () {
  const now = new Date();
  return `
  ${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()} 
  `;
};

View.prototype._itemId = function (element) {
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

View.prototype.allCompleted = function (allCompleted) {
  this.$toggleAll.checked = allCompleted;
};

View.prototype.toggleAll = function () {
  const completedAll = this.$toggleAll.checked;
  const elem = document.querySelectorAll('#toggle');
  if (elem) {
    elem.forEach((_, idx) => {
      elem[idx].checked = completedAll;
    });
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
  input.className = 'w-full border-b outline-none pl-10 pb-1 pt-2 mb-1';
  elem.appendChild(input);
  input.focus();
  input.value = title;
};

View.prototype.openEditMenu = function (id) {
  const elem = document.querySelector('[data-id="' + id + '"]');
  if (elem) {
    elem.querySelector('ul').classList.remove('hidden');
  }
};

View.prototype.closeEditMenu = function () {
  const elem = document.querySelector('#editMenu');
  if (elem) {
    elem.parentNode.removeChild(elem);
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

View.prototype.controlPostButton = function () {
  const elem = document.querySelector('#post');
  elem.classList.add('hover:text-blue-700');
};

View.prototype.render = function (viewCmd, parameter) {
  const viewCommands = {
    darkMode: () => {
      document.documentElement.classList.toggle('dark');
    },
    showMain: () => {
      this.$date.innerHTML = this.getDate();
    },
    showEntries: () => {
      this.$todoList.innerHTML = this.showTemplate(parameter);
      if (parameter.length === 0) {
        this.$allDestroy.disabled = true;
      } else {
        this.$allDestroy.disabled = false;
      }
    },
    addItemDoing: () => {
      this.$post.disabled = false;
      this.$post.classList.remove('opacity-30');
    },
    addItemDone: () => {
      this.$newTodo.value = '';
      this.$post.disabled = true;
      this.$post.classList.add('opacity-30');
    },
    openEditMenu: () => {
      this.openEditMenu(parameter);
    },
    closeEditMenu: () => {
      this.closeEditMenu();
    },
    openDropModal: () => {
      this.$modal.innerHTML = showTemplate('modal');
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
      this.toggleAll();
    },
    allCompleted: () => {
      this.allCompleted(parameter.allCompleted);
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
  }
  if (event === 'addItemDoing') {
    this.$newTodo.addEventListener('keyup', e => {
      if (e.target.value !== '') {
        handler('writing');
      } else {
        handler('noText');
      }
    });
  }
  if (event === 'addItemDone') {
    this.$newTodo.addEventListener('keyup', e => {
      if (e.target.value !== '' && e.key === 'Enter') {
        handler(this.$newTodo.value);
      }
    });
    this.$post.addEventListener('click', () => {
      handler(this.$newTodo.value);
    });
  }
  if (event === 'openEditMenu') {
    this.$todoList.addEventListener('click', e => {
      if (e.target.classList.contains('editButton')) {
        handler(this._itemId(e.target));
      }
    });
  }
  if (event === 'closeEditMenu') {
    document.addEventListener('click', e => {
      if (e.target.classList.contains('opened')) {
        console.log('123');
      }
    });
  }
  if (event === 'openDropModal') {
    this.$allDestroy.addEventListener('click', () => {
      handler();
    });
  }
  if (event === 'closeDropModal') {
    document.addEventListener('click', e => {
      if (e.target.id === 'modalBackground') handler();
    });
    this.$modal.addEventListener('click', e => {
      if (e.target.id === 'exit' || e.target.id === 'cancel') {
        handler();
      }
    });
  }
  if (event === 'dropItemsDone') {
    this.$modal.addEventListener('click', e => {
      if (e.target.id === 'delete') {
        handler();
      }
    });
  }
  if (event === 'toggleItem') {
    this.$todoList.addEventListener('click', e => {
      if (e.target.className.split(' ')[0] === 'toggle') {
        handler({
          id: this._itemId(e.target),
          completed: e.target.checked,
        });
      }
    });
  }
  if (event === 'toggleAll') {
    this.$toggleAll.addEventListener('click', e => {
      if (e.target.id === 'toggle-all') {
        handler(e.target.checked);
      }
    });
  }
  if (event === 'editItem') {
    this.$todoList.addEventListener('dblclick', e => {
      if (e.target.className.includes('list_elem')) {
        handler(this._itemId(e.target));
      }
    });
  }
  if (event === 'editItemDone') {
    this.$todoList.addEventListener(
      'blur',
      e => {
        if (e.target.id === 'edit') {
          handler({
            id: this._itemId(e.target),
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

// blur에 true넣는 이유??
// 이벤트 캡쳐링..
