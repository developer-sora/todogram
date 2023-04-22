export default function Controller(model, view) {
  this.model = model;
  this.view = view;
  this.view.render('showDate');
  this.view.bind('turnDarkMode', () => {
    this.turnDarkMode();
  });
  this.view.bind('controlPostButton', status => {
    this.controlPostButton(status);
  });
  this.view.bind('addItemDone', title => {
    this.addItem(title);
  });
  this.view.bind('deleteItem', id => {
    this.deleteItem(id);
  });
  this.view.bind('toggleItem', updateData => {
    this.toggleItem(updateData);
  });
  this.view.bind('toggleAll', completed => {
    this.toggleAll(completed);
  });
  this.view.bind('editItem', id => {
    this.editItem(id);
  });
  this.view.bind('openEditMenu', id => {
    this.openEditMenu(id);
  });
  this.view.bind('closeEditMenu', () => {
    this.closeEditMenu();
  });
  this.view.bind('editItemDone', updateData => {
    this.editItemSave(updateData);
  });
  this.view.bind('openDropModal', () => {
    this.openDropModal();
  });
  this.view.bind('closeDropModal', () => {
    this.closeDropModal();
  });
  this.view.bind('dropItemsDone', () => {
    this.dropItems();
  });
}

Controller.prototype.setView = function (locationHash = '') {
  const route = locationHash.split('/')[1];
  this.updateFilterState(route);
};

Controller.prototype.turnDarkMode = function () {
  this.view.render('darkMode');
};

Controller.prototype.showAll = function () {
  const data = this.model.read();
  this.view.render('showEntries', data);
};

Controller.prototype.showActive = function () {
  const data = this.model.read({ completed: false });
  this.view.render('showEntries', data);
};

Controller.prototype.showCompleted = function () {
  const data = this.model.read({ completed: true });
  this.view.render('showEntries', data);
};

Controller.prototype.controlPostButton = function (status) {
  this.view.render(status + 'PostButton');
};

Controller.prototype.addItem = function (title) {
  this.model.create(title);
  this.view.render('addItemDone');
  this.view.render('disablePostButton');
  this.filter(true);
};

Controller.prototype.openEditMenu = function (id) {
  this.view.render('openEditMenu', id);
};

Controller.prototype.closeEditMenu = function () {
  this.view.render('closeEditMenu');
};

Controller.prototype.deleteItem = function (id) {
  this.model.delete(id);
  this.view.render('deleteItem', id);
  this.filter();
};

Controller.prototype.openDropModal = function () {
  this.view.render('openDropModal');
};

Controller.prototype.closeDropModal = function () {
  this.view.render('closeDropModal');
};

Controller.prototype.dropItems = function () {
  this.model.drop(this.activeRoute);
  this.view.render('closeDropModal');
  this.filter();
};

Controller.prototype.toggleItem = function (updateData) {
  const { id, completed } = updateData;
  this.model.update(id, { completed });
  this.view.render('toggleItem', updateData);
  this.filter();
};

Controller.prototype.toggleAll = function (completed) {
  this.model.toggleAll(completed);
  this.view.render('toggleAll', completed);
  this.filter();
};

Controller.prototype.editItem = function (id) {
  const data = this.model.read({ id: Number(id) });
  this.view.render('editItem', data[0]);
};

Controller.prototype.editItemSave = function (updateData) {
  const { id, title } = updateData;
  if (title.length !== 0) {
    this.model.update(id, { title });
    this.view.render('editItemDone', { id, title });
  } else {
    this.deleteItem(id);
  }
};

Controller.prototype.updateCount = function () {
  this.model.getCount(todos => {
    this.view.render('updateElementCount', todos);
    this.view.render('toggleAll', { completed: todos.total !== 0 && todos.total === todos.completed });
    if (this.activeRoute === 'All' && (todos.total === 0 || todos.total === todos.completed || todos.completed === 0)) {
      this.showAll();
    }
  });
};

Controller.prototype.filter = function (force) {
  this.updateCount();
  if (force || this.lastActiveRoute !== 'All' || this.lastActiveRoute !== this.activeRoute) {
    this['show' + this.activeRoute]();
  }
  this.lastActiveRoute = this.activeRoute;
};

Controller.prototype.updateFilterState = function (currentPage = 'All') {
  const activeRouter = currentPage.charAt(0).toUpperCase() + currentPage.substring(1);
  this.activeRoute = activeRouter;
  this.filter();
};
