import 'core-js';
import Store from './store.js';
import Model from './model.js';
import Controller from './controller.js';
import View from './view.js';
import Template from './template.js';
import '../tailwind.css';
import LocalStorageStorage from './db.js';

class Todo {
  constructor(dbName) {
    this.db = new LocalStorageStorage();
    this.storage = new Store(dbName, this.db);
    this.model = new Model(this.storage);
    this.template = new Template();
    this.view = new View(this.template);
    this.controller = new Controller(this.model, this.view);
    this.initialize();
  }

  initialize() {
    this.view.render('showDate');
    window.addEventListener('load', () => this.setView());
    window.addEventListener('hashchange', () => this.setView());
  }

  setView() {
    this.controller.setView(document.location.hash);
  }
}

new Todo('todoList');
