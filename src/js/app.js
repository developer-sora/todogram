import Store from './store.js';
import Model from './model.js';
import Controller from './controller.js';
import View from './view.js';
import Template from './template.js';
import '../tailwind.css';
import LocalStorageStorage from './db.js';

class Todo {
  constructor() {
    this.db = new LocalStorageStorage('todoList');
    this.storage = new Store('todoList', this.db);
    this.model = new Model(this.storage);
    this.template = new Template();
    this.view = new View(this.template);
    this.controller = new Controller(this.model, this.view);
    this.initialize();
  }

  initialize() {
    this.setView();
    window.addEventListener('hashchange', () => this.setView());
    window.addEventListener('load', () => this.setView());
  }

  setView() {
    this.controller.setView(window.location.hash);
  }
}

new Todo();
