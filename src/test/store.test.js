import Store from '../js/store.js';

describe('Store 클래스 테스트', () => {
  let store;
  let mockStorage;
  const dbName = 'testDB';

  beforeEach(() => {
    mockStorage = {
      readAll: jest.fn(),
      save: jest.fn(),
    };
    store = new Store(dbName, mockStorage);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor 테스트', () => {
    test('초기 데이터가 없을 때 생성자에서 storage에 빈 배열을 넣어 초기화한다', () => {
      mockStorage.readAll.mockReturnValue(null);
      store = new Store(dbName, mockStorage);
      expect(mockStorage.save).toHaveBeenCalledWith(dbName, []);
    });

    test('storage에 데이터가 있으면 생성자에서 storage에 빈 배열을 저장하지 않는다', () => {
      const newMockStorage = {
        readAll: jest.fn(),
        save: jest.fn(),
      };
      newMockStorage.readAll.mockReturnValue([{ id: 1, title: 'test1', completed: true }]);
      store = new Store(dbName, newMockStorage);
      expect(newMockStorage.save).not.toHaveBeenCalled();
    });
  });

  describe('readAll 테스트', () => {
    test('readAll 메서드가 storage의 readAll 메서드를 호출한다', () => {
      const todos = [{ id: 1, title: 'test1' }];
      mockStorage.readAll.mockReturnValue(todos);
      const result = store.readAll();
      expect(mockStorage.readAll).toHaveBeenCalledWith(dbName);
      expect(result).toEqual(todos);
    });
  });

  describe('read 테스트', () => {
    test('read 메서드가 query에 맞는 항목들을 리턴한다', () => {
      const todos = [
        { id: 1, title: 'test1', completed: true },
        { id: 2, title: 'test2', completed: false },
      ];
      const query = { completed: true };
      mockStorage.readAll.mockReturnValue(todos);
      const result = store.read(query);
      expect(result).toEqual([{ id: 1, title: 'test1', completed: true }]);
    });
  });

  describe('add 테스트', () => {
    test('add 메서드가 새로운 항목을 추가하고 storage에 저장한다', () => {
      const todos = [{ id: 1, title: 'test1', completed: true }];
      const newTodo = { id: 2, title: 'test2', completed: false };
      mockStorage.readAll.mockReturnValue([...todos]);
      store.add(newTodo);
      expect(mockStorage.save).toHaveBeenCalledWith(dbName, [...todos, newTodo]);
    });
  });

  describe('delete 테스트', () => {
    test('delete 메서드가 항목을 삭제하고 storage에 저장한다', () => {
      const todos = [
        { id: 1, title: 'test1' },
        { id: 2, title: 'test2' },
      ];
      const deleteId = 1;
      mockStorage.readAll.mockReturnValue([...todos]);
      store.delete(deleteId);
      expect(mockStorage.save).toHaveBeenCalledWith(dbName, [{ id: 2, title: 'test2' }]);
    });
  });

  describe('drop 테스트', () => {
    test('drop 메서드가 현재 페이지가 All인 경우 빈 배열을 storage에 저장한다', () => {
      store.drop('All');
      expect(mockStorage.save).toHaveBeenCalledWith(dbName, []);
    });

    test('drop 메서드가 현재 페이지가 Active인 경우 해야 할 항목들을 삭제하여 storage에 저장한다', () => {
      const todos = [
        { id: 1, title: 'test1', completed: true },
        { id: 2, title: 'test2', completed: false },
      ];
      mockStorage.readAll.mockReturnValue([...todos]);
      store.drop('Active');
      expect(mockStorage.save).toHaveBeenCalledWith(dbName, [{ id: 1, title: 'test1', completed: true }]);
    });

    test('drop 메서드가 현재 페이지가 Completed인 경우 완료된 항목들을 삭제하여 storage에 저장한다', () => {
      const todos = [
        { id: 1, title: 'test1', completed: true },
        { id: 2, title: 'test2', completed: false },
      ];
      mockStorage.readAll.mockReturnValue([...todos]);
      store.drop('Completed');
      expect(mockStorage.save).toHaveBeenCalledWith(dbName, [{ id: 2, title: 'test2', completed: false }]);
    });
  });

  describe('update 테스트', () => {
    test('update 메서드가 해당 항목을 수정하고 storage에 저장한다', () => {
      const todos = [{ id: 1, title: 'test1' }];
      mockStorage.readAll.mockReturnValue(todos);
      store.update(todos[0].id, { title: 'update!' });
      expect(mockStorage.save).toHaveBeenCalledWith(dbName, [{ id: 1, title: 'update!' }]);
    });

    test('update 메서드가 수정할 항목이 없는 경우 에러를 발생시킨다.', () => {
      const todos = [{ id: 1, title: 'test1' }];
      mockStorage.readAll.mockReturnValue(todos);
      expect(store.update(2, { title: 'update!' })).toBeUndefined();
    });
  });

  describe('toggleAll 테스트', () => {
    test('toggleAll 메서드가 모든 항목을 완료 혹은 미완료 상태로 변경하여 storage에 저장한다', () => {
      const todos = [
        { id: 1, title: 'test1', completed: false },
        { id: 2, title: 'test2', completed: false },
      ];
      mockStorage.readAll.mockReturnValue(todos);
      // 완료
      store.toggleAll(true);
      expect(mockStorage.save).toHaveBeenCalledWith(dbName, [
        { id: 1, title: 'test1', completed: true },
        { id: 2, title: 'test2', completed: true },
      ]);
      // 미완료
      store.toggleAll(false);
      expect(mockStorage.save).toHaveBeenCalledWith(dbName, [
        { id: 1, title: 'test1', completed: false },
        { id: 2, title: 'test2', completed: false },
      ]);
    });
  });
});
