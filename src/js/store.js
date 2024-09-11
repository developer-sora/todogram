import { localRead, localSave } from '../util/helper.js';

export default class Store {
  constructor(name) {
    this.dbName = name;
    if (!localRead(name)) {
      localSave(name, []);
    }
  }

  readAll() {
    return localRead(this.dbName);
  }

  read(query) {
    const todos = this.readAll();
    return todos.filter(todo => {
      return Object.keys(query).every(key => todo[key] === query[key]);
    });
  }

  add(updateData) {
    const todos = this.readAll();
    todos.push(updateData);
    localSave(this.dbName, todos);
  }

  delete(id) {
    const todos = this.readAll();
    const deleteCompleteTodos = todos.filter(todo => todo.id !== id);
    localSave(this.dbName, deleteCompleteTodos);
  }

  drop(currentPage) {
    let todos = this.readAll();
    if (currentPage === 'All') {
      todos = [];
    } else {
      const state = currentPage !== 'Active';
      todos = todos.filter(todo => todo.completed !== state);
    }
    localSave(this.dbName, todos);
  }

  update(id, updateData) {
    const todos = this.readAll();
    const index = todos.findIndex(todo => todo.id === id);
    if (index !== -1) {
      todos[index] = { ...todos[index], ...updateData };
      localSave(this.dbName, todos);
    }
  }

  toggleAll(completed) {
    const todos = this.readAll();
    todos.forEach(todo => (todo.completed = completed));
    localSave(this.dbName, todos);
  }
}
