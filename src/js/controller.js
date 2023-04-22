export default function Controller(model, view) {
  this.model = model;
  this.view = view;
  this.view.render('showMain');
  this.view.bind('turnDarkMode', () => {
    this.turnDarkMode();
  });
  this.view.bind('addItemDoing', status => {
    this.addItemDoing(status);
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
  this.view.bind('toggleAll', completedAll => {
    this.toggleAll(completedAll);
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

Controller.prototype.addItemDoing = function (status) {
  if (status === 'writing') {
    this.view.render('addItemDoing');
  } else {
    this.view.render('addItemDone');
  }
};

Controller.prototype.addItem = function (title) {
  this.model.create(title);
  this.view.render('addItemDone');
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

Controller.prototype.toggleAll = function (completedAll) {
  this.model.toggleAll(completedAll);
  this.view.render('toggleAll');
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
    this.view.render('allCompleted', { allCompleted: todos.total !== 0 && todos.total === todos.completed });
    if (todos.total === 0 && this.activeRoute === 'All') {
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
/*
this.model.create(title, function () {
			this.view.render('clearNewTodo');
			this._filter(true);
		});

    model안에 view.render를 넘기는 이유?
 */
