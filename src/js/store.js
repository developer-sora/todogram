export default class Store {
  constructor(name, storage) {
    this.dbName = name;
    this.storage = storage;
    if (!this.storage.readAll(this.dbName)) {
      this.storage.save(this.dbName, []);
    }
  }

  readAll() {
    return this.storage.readAll(this.dbName);
  }

  read(query) {
    const todos = this.readAll();
    return todos.filter(todo => {
      return Object.keys(query).every(key => todo[key] === query[key]);
    });
  }

  add(updateData) {
    const todos = this.readAll();
    const addedTodos = [...todos, updateData];
    this.storage.save(this.dbName, addedTodos);
  }

  delete(id) {
    const todos = this.readAll();
    const deleteCompleteTodos = todos.filter(todo => todo.id !== id);
    this.storage.save(this.dbName, deleteCompleteTodos);
  }

  drop(currentPage) {
    let todos = this.readAll();
    if (currentPage === 'All') {
      todos = [];
    } else {
      const state = currentPage !== 'Active';
      todos = todos.filter(todo => todo.completed !== state);
    }
    this.storage.save(this.dbName, todos);
  }

  update(id, updateData) {
    const todos = this.readAll();
    const index = todos.findIndex(todo => todo.id === id);
    if (index === -1) {
      return;
    }
    const updatedTodos = todos.map((todo, i) => {
      return i === index ? { ...todo, ...updateData } : todo;
    });
    this.storage.save(this.dbName, updatedTodos);
  }

  toggleAll(completed) {
    const todos = this.readAll();
    const updatedTodos = todos.map(todo => ({ ...todo, completed }));
    this.storage.save(this.dbName, updatedTodos);
  }
}
