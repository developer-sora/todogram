import Store from './store.js';
import Model from './model.js';
import Controller from './controller.js';
import View from './view.js';

export default function App() {
  this.storage = new Store('todoList');
  this.model = new Model(this.storage);
  this.view = new View();
  this.controller = new Controller(this.model, this.view);
}
