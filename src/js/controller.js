export default class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    const bindings = {
      turnDarkMode: this.turnDarkMode,
      controlPostButton: this.controlPostButton,
      addItemDone: this.addItem,
      deleteItem: this.deleteItem,
      toggleItem: this.toggleItem,
      toggleAll: this.toggleAll,
      editItem: this.editItem,
      toggleEditMenu: this.toggleEditMenu,
      closeEditMenu: this.closeEditMenu,
      editItemDone: this.editItemSave,
      openDropModal: this.openDropModal,
      closeDropModal: this.closeDropModal,
      dropItemsDone: this.dropItems,
    };

    for (const [event, handler] of Object.entries(bindings)) {
      this.view.bind(event, handler.bind(this));
    }
  }

  setView(hash) {
    const route = hash.split('/')[1];
    const page = route || '';
    this.updateFilterState(page);
  }

  turnDarkMode() {
    this.view.render('darkMode');
  }

  showAll() {
    const data = this.model.read();
    this.view.render('showEntries', data);
  }

  showActive() {
    const data = this.model.read({ completed: false });
    this.view.render('showEntries', data);
  }

  showCompleted() {
    const data = this.model.read({ completed: true });
    this.view.render('showEntries', data);
  }

  controlPostButton(status) {
    this.view.render(status + 'PostButton');
  }

  addItem(title) {
    this.model.create(title);
    this.view.render('addItemDone');
    this.view.render('disablePostButton');
    this.filter(true);
  }

  toggleEditMenu(id) {
    this.view.render('toggleEditMenu', id);
  }

  closeEditMenu() {
    this.view.render('closeEditMenu');
  }

  deleteItem(id) {
    this.model.delete(id);
    this.view.render('deleteItem', id);
    this.filter();
  }

  openDropModal() {
    this.view.render('openDropModal');
  }

  closeDropModal() {
    this.view.render('closeDropModal');
  }

  dropItems() {
    this.model.drop(this.activeRoute);
    this.view.render('closeDropModal');
    this.filter();
  }

  toggleItem(updateData) {
    const { id, completed } = updateData;
    this.model.update(id, { completed });
    this.view.render('toggleItem', updateData);
    this.filter();
  }

  toggleAll(completed) {
    this.model.toggleAll(completed);
    this.view.render('toggleAll', completed);
    this.filter();
  }

  editItem(id) {
    const data = this.model.read({ id: Number(id) });
    this.view.render('editItem', data[0]);
  }

  editItemSave(updateData) {
    const { id, title } = updateData;
    if (title.trim().length > 0) {
      this.model.update(id, { title });
      this.view.render('editItemDone', { id, title });
    } else {
      this.deleteItem(id);
    }
  }

  updateCount() {
    this.model.getCount(todos => {
      this.view.render('updateElementCount', todos);
      this.view.render('toggleAll', { completed: todos.total !== 0 && todos.total === todos.completed });
      if (
        this.activeRoute === 'All' &&
        (todos.total === 0 || todos.total === todos.completed || todos.completed === 0)
      ) {
        this.showAll();
      }
    });
  }

  filter(force) {
    const active = this.activeRoute;
    const activeRoute = active.charAt(0).toUpperCase() + active.substr(1);
    this.updateCount();
    if (force || this.lastActiveRoute !== 'All' || this.lastActiveRoute !== activeRoute) {
      this[`show${activeRoute}`]();
    }
    this.lastActiveRoute = activeRoute;
  }

  updateFilterState(currentPage = 'All') {
    this.activeRoute = currentPage;
    if (currentPage === '') {
      this.activeRoute = 'All';
    }
    this.filter();
    this.view.render('setFilter', currentPage);
  }
}
