export default function Controller(model, view) {
  this.model = model;
  this.view = view;
  this.view.render('showMain');
  this.view.bind('addItem', title => {
    this.addItem(title);
  });
  this.view.bind('deleteItem', id => {
    this.deleteItem(id);
  });
  this.view.bind('toggleItem', updateData => {
    this.toggleItem(updateData);
  });
  this.view.bind('editItem', id => {
    this.editItem(id);
  });
  this.view.bind('editItemDone', updateData => {
    this.editItemSave(updateData);
  });
  this.view.bind('showActive', () => {
    this.showActive();
  });
  this.view.bind('showCompleted', () => {
    this.showCompleted();
  });
  this.view.bind('dropItems', () => {
    this.dropItems();
  });
}

Controller.prototype.setView = function (locationHash = '') {
  const route = locationHash.split('/')[1];
  this.updateFilterState(route);
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

Controller.prototype.addItem = function (title) {
  this.model.create(title);
  this.view.render('addItem');
  this.filter();
};

Controller.prototype.deleteItem = function (id) {
  this.model.delete(id);
  this.updateCount();
  this.view.render('deleteItem', id);
};

Controller.prototype.dropItems = function () {
  this.model.drop(this.activeRoute);
  this.filter();
};

Controller.prototype.toggleItem = function (updateData) {
  const { id, completed } = updateData;
  this.model.update(id, { completed });
  this.view.render('toggleItem', updateData);
  this.updateCount();
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
  });
};

Controller.prototype.filter = function () {
  this.updateCount();
  this['show' + this.activeRoute]();
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
