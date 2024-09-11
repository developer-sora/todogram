import Store from '../js/store.js';
import Model from '../js/model.js';

describe('Model 테스트', () => {
  class LocalStorageMock {
    constructor() {
      this.storage = {};
    }

    clear() {
      this.storage = {};
    }

    getItem(key) {
      return this.storage[key] || null;
    }

    setItem(key, value) {
      this.storage[key] = String(value);
    }

    removeItem(key) {
      delete this.storage[key];
    }
  }

  let store;
  let model;
  let currentPage = 'All';

  beforeEach(() => {
    if (typeof window === 'undefined') {
      global.localStorage = new LocalStorageMock();
    }
    store = new Store('test');
    model = new Model(store);
  });

  afterEach(() => {
    global.localStorage.clear();
  });

  test('새로운 할 일을 추가하면 목록에 항목이 하나 추가된다.', () => {
    const todoListCount = store.readAll().length;
    model.create('test');
    expect(store.readAll().length).toBe(todoListCount + 1);
  });

  test('할 일을 하나 삭제하면 목록에서 항목이 하나 삭제된다.', () => {
    model.create('test');
    const todoListCount = store.readAll().length;
    const todoId = store.readAll()[0].id;
    model.delete(todoId);
    expect(store.readAll().length).toBe(todoListCount - 1);
  });

  test('할 일을 수정하면 목록에 수정된 내용이 반영이 된다.', () => {
    model.create('test');
    const todoId = store.readAll()[0].id;
    model.update(todoId, { title: 'test2' });
    expect(store.readAll()[0].title).toBe('test2');
  });

  test('할 일을 완료하면 목록에 완료 상태가 반영이 된다.', () => {
    model.create('test');
    const todoId = store.readAll()[0].id;
    model.update(todoId, { completed: true });
    expect(store.readAll()[0].completed).toBeTruthy();
  });

  test('할 일을 전부 삭제하면 목록이 빈 상태가 된다.', () => {
    model.create('test');
    model.create('test');
    model.drop(currentPage);
    expect(store.readAll().length).toBe(0);
  });
});
