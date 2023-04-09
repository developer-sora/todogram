import Store from './store.js';
import Model from './model.js';
import Controller from './controller.js';
import View from './view.js';

export default function App() {
  const storage = new Store('todoList');
  const model = new Model(storage);
  const view = new View();
  const controller = new Controller(model, view);
  controller.showAll();
}
