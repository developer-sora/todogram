import { localRead, localSave } from './util/helper.js';

export default function Store(name) {
  this.dbName = name;
  if (!localRead(name)) {
    const todos = [];
    localSave(name, todos);
  }
}

Store.prototype.readAll = function () {
  return localRead(this.dbName);
};

Store.prototype.readItem = function (query) {
  const todos = this.readAll(this.dbName);
  const findTodoItem = todos.filter(v => {
    for (const q in query) {
      if (v[q] !== query[q]) return false;
    }
    return true;
  });
  return findTodoItem;
};

Store.prototype.newItemSave = function (updateData) {
  const todos = this.readAll(this.dbName);
  todos.push(updateData);
  localSave(this.dbName, todos);
};

Store.prototype.deleteItemSave = function (id) {
  const todos = this.readAll(this.dbName);
  const deletedTodos = todos.filter(v => v.id !== id);
  localSave(this.dbName, deletedTodos);
};

Store.prototype.dropItemsSave = function (currentPage) {
  if (currentPage === 'All') {
    const todos = [];
    localSave(this.dbName, todos);
  } else {
    const todos = this.readAll(this.dbName);
    const state = currentPage !== 'Active';
    const deletedTodos = todos.filter(v => v.completed !== state);
    localSave(this.dbName, deletedTodos);
  }
};

Store.prototype.updateItemSave = function (id, updateData) {
  const todos = this.readAll(this.dbName);
  const index = todos.findIndex(v => v.id === id);
  for (const key in updateData) {
    if (Object.prototype.hasOwnProperty.call(updateData, key)) todos[index][key] = updateData[key];
  }
  localSave(this.dbName, todos);
};
