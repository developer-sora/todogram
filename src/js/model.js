export default class Model {
  constructor(storage) {
    this.storage = storage;
  }

  read(query) {
    if (query) {
      return this.storage.read(query);
    }
    return this.storage.readAll();
  }

  create(title) {
    const newTodos = {
      title,
      completed: false,
      id: new Date().getTime(),
    };
    this.storage.add(newTodos);
  }

  delete(id) {
    this.storage.delete(id);
  }

  drop(currentPage) {
    this.storage.drop(currentPage);
  }

  update(id, updateData) {
    this.storage.update(id, updateData);
  }

  toggleAll(completed) {
    this.storage.toggleAll(completed);
  }

  getCount(callback) {
    const data = this.storage.readAll();

    const todos = data.reduce(
      (acc, todo) => {
        if (todo.completed) {
          acc.completed++;
        } else {
          acc.active++;
        }
        acc.total++;
        return acc;
      },
      {
        total: 0,
        active: 0,
        completed: 0,
      }
    );

    callback(todos);

    return todos;
  }
}
