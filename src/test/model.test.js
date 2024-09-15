import Store from '../js/store.js';
import Model from '../js/model.js';

jest.mock('../js/store.js');

describe('Model 테스트', () => {
  let store;
  let model;

  beforeEach(() => {
    store = new Store();
    store.add = jest.fn();
    model = new Model(store);
  });

  describe('read 테스트', () => {
    test('read 메서드가 query를 전달하면 store.read(query)를 호출한다', () => {
      const query = { id: 1 };
      model.read(query);
      expect(store.read).toHaveBeenCalledWith(query);
    });

    test('read 메서드가 query를 전달하지 않으면 store.readAll을 호출한다', () => {
      model.read();
      expect(store.readAll).toHaveBeenCalled();
    });
  });

  describe('create 테스트', () => {
    test('create 메서드가 호출되면 store.add가 새로운 항목을 추가한다', () => {
      const title = 'test1';
      // create시 id를 Date.now로 받기 때문에 id를 1로 받게 설정
      jest.spyOn(Date, 'now').mockReturnValue(1);
      model.create(title);
      expect(store.add).toHaveBeenCalledWith({
        title,
        completed: false,
        id: 1,
      });
      jest.restoreAllMocks();
    });
  });

  describe('delete 테스트', () => {
    test('delete 메서드가 호출되면 store.delete를 호출한다', () => {
      const id = 1;
      model.delete(id);
      expect(store.delete).toHaveBeenCalledWith(id);
    });
  });

  describe('drop 테스트', () => {
    test('drop 메서드가 호출되면 store.drop을 호출한다', () => {
      const currentPage = 'All';
      model.drop(currentPage);
      expect(store.drop).toHaveBeenCalledWith(currentPage);
    });
  });

  describe('update 테스트', () => {
    test('update 메서드가 호출되면 store.update를 호출한다', () => {
      const id = 1;
      const updateData = { title: 'Updated Todo' };
      model.update(id, updateData);
      expect(store.update).toHaveBeenCalledWith(id, updateData);
    });
  });

  describe('toggleAll 테스트', () => {
    test('toggleAll 메서드가 호출되면 store.toggleAll을 호출한다', () => {
      const completed = true;
      model.toggleAll(completed);
      expect(store.toggleAll).toHaveBeenCalledWith(completed);
    });
  });

  describe('getCount 테스트', () => {
    test('getCount 메서드가 호출되면 total, active, completed를 계산하고 callback을 호출한다', () => {
      const todosMock = [
        { title: 'test1', completed: true },
        { title: 'test2', completed: false },
      ];

      store.readAll.mockReturnValue(todosMock);

      const callbackMock = jest.fn();
      const result = model.getCount(callbackMock);

      expect(result).toEqual({
        total: 2,
        active: 1,
        completed: 1,
      });

      expect(callbackMock).toHaveBeenCalledWith({
        total: 2,
        active: 1,
        completed: 1,
      });
    });
  });
});
