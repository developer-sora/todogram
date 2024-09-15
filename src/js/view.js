import { findParent } from '../util/helper.js';

export default class View {
  constructor(template) {
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

  #getDate() {
    const now = new Date();
    return `${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()}`;
  }

  #getItemId(element) {
    const $li = findParent(element, 'li');
    return parseInt($li.dataset.id, 10);
  }

  #deleteItem(id) {
    const elem = document.querySelector(`[data-id="${id}"]`);
    if (elem) this.$todoList.removeChild(elem);
  }

  #toggleItem(id, completed) {
    const elem = document.querySelector(`[data-id="${id}"]`);
    if (elem) elem.querySelector('input').checked = completed;
  }

  #editItem(id, title) {
    const elem = document.querySelector(`[data-id="${id}"]`);
    if (elem) {
      const div = elem.querySelector('div');
      div.classList.add('hidden');
      const input = document.createElement('input');
      input.id = 'edit';
      input.className = 'w-[97%] border-b outline-none pl-8 pb-1 pt-2 mb-1 mr-2';
      input.value = title;
      elem.appendChild(input);
      input.focus();
    }
  }

  #openEditMenu(id) {
    const elem = document.querySelector(`[data-id="${id}"]`);
    if (elem) {
      const menu = elem.querySelector('ul');
      menu.classList.remove('hidden');
      menu.classList.add('opened');
    }
  }

  #closeEditMenu() {
    const openedMenu = document.querySelector('.opened');
    if (openedMenu) {
      openedMenu.classList.add('hidden');
      openedMenu.classList.remove('opened');
    }
  }

  #editItemDone(id, title) {
    const elem = document.querySelector(`[data-id="${id}"]`);
    if (!elem) return;
    elem.querySelector('div').classList.remove('hidden');
    const input = elem.querySelector('#edit');
    if (!input) return;
    elem.removeChild(input);
    elem.querySelector('label').textContent = title;
  }

  render(viewCmd, parameter) {
    const viewCommands = {
      darkMode: () => document.documentElement.classList.toggle('dark'),
      showDate: () => (this.$date.innerHTML = this.#getDate()),
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
      addItemDone: () => (this.$newTodo.value = ''),
      openEditMenu: () => this.#openEditMenu(parameter),
      closeEditMenu: () => this.#closeEditMenu(),
      openDropModal: () => (this.$modal.innerHTML = this.template.showModalTemplate()),
      closeDropModal: () => (this.$modal.innerHTML = ''),
      deleteItem: () => this.#deleteItem(parameter),
      toggleItem: () => this.#toggleItem(parameter.id, parameter.completed),
      toggleAll: () => (this.$toggleAll.checked = parameter.completed),
      editItem: () => this.#editItem(parameter.id, parameter.title),
      editItemDone: () => this.#editItemDone(parameter.id, parameter.title),
      updateElementCount: () => {
        this.$activeCounter.innerHTML = parameter.active;
        this.$completedCounter.innerHTML = parameter.completed;
      },
    };

    if (viewCommands[viewCmd]) {
      viewCommands[viewCmd]();
    }
  }

  bind(event, handler) {
    const eventHandlers = {
      turnDarkMode: () => this.$darkMode.addEventListener('click', handler),
      controlPostButton: () =>
        this.$newTodo.addEventListener('keyup', e => {
          handler(e.target.value !== '' ? 'active' : 'disable');
        }),
      addItemDone: () => {
        this.$newTodo.addEventListener('keyup', e => {
          if (e.target.value !== '' && e.key === 'Enter') {
            handler(this.$newTodo.value);
          }
        });
        this.$post.addEventListener('click', () => handler(this.$newTodo.value));
      },
      openEditMenu: () =>
        this.$todoList.addEventListener('click', e => {
          if (e.target.classList.contains('editButton')) {
            handler(this.#getItemId(e.target));
          }
        }),
      closeEditMenu: () => {
        document.addEventListener('click', e => {
          if (!e.target.classList.contains('editButton')) {
            handler();
          }
        });
      },
      deleteItem: () =>
        this.$todoList.addEventListener('click', e => {
          if (e.target.classList.contains('delete')) {
            handler(this.#getItemId(e.target));
          }
        }),
      openDropModal: () => this.$allDestroy.addEventListener('click', handler),
      closeDropModal: () => {
        document.addEventListener('click', e => {
          if (e.target.id === 'dropModalBackground') handler();
        });
        this.$modal.addEventListener('click', e => {
          if (e.target.id === 'exit' || e.target.id === 'cancel') {
            handler();
          }
        });
      },
      dropItemsDone: () =>
        this.$modal.addEventListener('click', e => {
          if (e.target.id === 'drop') {
            handler();
          }
        }),
      toggleItem: () =>
        this.$todoList.addEventListener('click', e => {
          if (e.target.classList.contains('toggle')) {
            handler({
              id: this.#getItemId(e.target),
              completed: e.target.checked,
            });
          }
        }),
      toggleAll: () =>
        this.$toggleAll.addEventListener('click', e => {
          handler(e.target.checked);
        }),
      editItem: () => {
        this.$todoList.addEventListener('dblclick', e => {
          if (e.target.classList.contains('list_elem')) {
            handler(this.#getItemId(e.target));
          }
        });
        this.$todoList.addEventListener('click', e => {
          if (e.target.classList.contains('editItem')) {
            handler(this.#getItemId(e.target));
          }
        });
      },
      editItemDone: () => {
        this.$todoList.addEventListener(
          'blur',
          e => {
            if (e.target.id === 'edit') {
              handler({
                id: this.#getItemId(e.target),
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
      },
    };

    if (eventHandlers[event]) {
      eventHandlers[event]();
    }
  }
}
