import Controller from '../js/controller';
import Model from '../js/model';
import View from '../js/view';

jest.mock('../js/model.js');
jest.mock('../js/view.js');

describe('Controller 테스트', () => {
  let model, view, controller, mockData;

  beforeEach(() => {
    mockData = [
      { title: 'test1', completed: false, id: 1 },
      { title: 'test2', completed: true, id: 2 },
    ];
    model = new Model();
    view = new View();
    controller = new Controller(model, view);
    jest.spyOn(model, 'read').mockReturnValue(mockData);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('constructor 테스트', () => {
    test('모든 이벤트가 생성자 호출 시 bind된다.', () => {
      const bindings = [
        'turnDarkMode',
        'controlPostButton',
        'addItemDone',
        'deleteItem',
        'toggleItem',
        'toggleAll',
        'editItem',
        'toggleEditMenu',
        'closeEditMenu',
        'editItemDone',
        'openDropModal',
        'closeDropModal',
        'dropItemsDone',
      ];

      bindings.forEach(binding => {
        expect(view.bind).toHaveBeenCalledWith(binding, expect.any(Function));
      });
    });
  });

  describe('setView 테스트', () => {
    test('hash가 있는 경우 updateFilterState메서드가 해당 해시로 실행된다.', () => {
      const updateFilterStateSpy = jest.spyOn(controller, 'updateFilterState');
      controller.setView('#/completed');
      expect(updateFilterStateSpy).toHaveBeenCalledWith('completed');
    });

    test('hash가 없는 경우 updateFilterState메서드가 "All"로 실행된다.', () => {
      const updateFilterStateSpy = jest.spyOn(controller, 'updateFilterState');
      controller.setView();
      expect(updateFilterStateSpy).toHaveBeenCalledWith('');
    });
  });

  describe('turnDarkMode 테스트', () => {
    test('다크모드를 렌더링 한다.', () => {
      controller.turnDarkMode();
      expect(view.render).toHaveBeenCalledWith('darkMode');
    });
  });

  describe('showAll 테스트', () => {
    test('할 일 목록 전부를 렌더링한다.', () => {
      controller.showAll();
      expect(model.read).toHaveBeenCalled();
      expect(view.render).toHaveBeenCalledWith('showEntries', mockData);
    });
  });

  describe('showActive 테스트', () => {
    test('할 일 목록 중 완료되지 않은 항목을 렌더링한다.', () => {
      controller.showActive();
      expect(model.read).toHaveBeenCalledWith({ completed: false });
      expect(view.render).toHaveBeenCalledWith('showEntries', mockData);
    });
  });

  describe('showCompleted 테스트', () => {
    test('할 일 목록 중 완료된 항목을 렌더링한다.', () => {
      controller.showCompleted();
      expect(model.read).toHaveBeenCalledWith({ completed: true });
      expect(view.render).toHaveBeenCalledWith('showEntries', mockData);
    });
  });

  describe('controlPostButton 테스트', () => {
    test('controlPostButton을 상태에 따라 렌더링한다.', () => {
      controller.controlPostButton('active');
      expect(view.render).toHaveBeenCalledWith('activePostButton');
      controller.controlPostButton('disable');
      expect(view.render).toHaveBeenCalledWith('disablePostButton');
    });
  });

  describe('addItem 테스트', () => {
    test('할 일 목록 하나를 추가하고 렌더링한다.', () => {
      controller.addItem('new Item');
      expect(model.create).toHaveBeenCalledWith('new Item');
      expect(view.render).toHaveBeenCalledWith('addItemDone');
      expect(view.render).toHaveBeenCalledWith('disablePostButton');
    });
  });

  describe('toggleEditMenu & closeEditMenu 테스트', () => {
    test('수정/삭제하는 메뉴를 열고 닫을 수 있다.', () => {
      controller.toggleEditMenu(1);
      expect(view.render).toHaveBeenCalledWith('toggleEditMenu', 1);
      controller.closeEditMenu();
      expect(view.render).toHaveBeenCalledWith('closeEditMenu');
    });
  });

  describe('deleteItem 테스트', () => {
    test('할 일 항목에서 항목을 지우고 렌더링한다.', () => {
      const filterSpy = jest.spyOn(controller, 'filter');
      controller.deleteItem(1);
      expect(model.delete).toHaveBeenCalledWith(1);
      expect(view.render).toHaveBeenCalledWith('deleteItem', 1);
      expect(filterSpy).toHaveBeenCalled();
    });
  });

  describe('openDropModal & closeDropModal 테스트', () => {
    test('전체 삭제 모달을 열고 닫을 수 있다.', () => {
      controller.openDropModal();
      expect(view.render).toHaveBeenCalledWith('openDropModal');
      controller.closeDropModal();
      expect(view.render).toHaveBeenCalledWith('closeDropModal');
    });
  });

  describe('dropItems 테스트', () => {
    test('모든 항목을 삭제하고 전체 삭제 모달을 닫는다.', () => {
      const filterSpy = jest.spyOn(controller, 'filter');
      controller.dropItems();
      expect(model.drop).toHaveBeenCalledWith(controller.activeRoute);
      expect(view.render).toHaveBeenCalledWith('closeDropModal');
      expect(filterSpy).toHaveBeenCalled();
    });
  });

  describe('toggleItem 테스트', () => {
    test('할 일 항목의 완료 여부를 토글한다.', () => {
      const filterSpy = jest.spyOn(controller, 'filter');
      controller.toggleItem({
        id: 1,
        completed: true,
      });
      expect(model.update).toHaveBeenCalledWith(1, { completed: true });
      expect(view.render).toHaveBeenCalledWith('toggleItem', {
        id: 1,
        completed: true,
      });
      expect(filterSpy).toHaveBeenCalled();
    });
  });

  describe('toggleAll 테스트', () => {
    test('할 일 항목의 완료 여부를 전부 토글한다.', () => {
      const filterSpy = jest.spyOn(controller, 'filter');
      controller.toggleAll(true);
      expect(model.toggleAll).toHaveBeenCalledWith(true);
      expect(view.render).toHaveBeenCalledWith('toggleAll', true);
      expect(filterSpy).toHaveBeenCalled();
    });
  });

  describe('editItem 테스트', () => {
    test('특정 항목을 수정 모드로 전환한다.', () => {
      controller.editItem(1);
      expect(model.read).toHaveBeenCalledWith({ id: 1 });
      expect(view.render).toHaveBeenCalledWith('editItem', mockData[0]);
    });
  });

  describe('editItemSave 테스트', () => {
    test('내용이 비어있지 않으면 해당 항목을 업데이트한다.', () => {
      controller.editItemSave({ id: 1, title: 'update!' });
      expect(model.update).toHaveBeenCalledWith(1, { title: 'update!' });
      expect(view.render).toHaveBeenCalledWith('editItemDone', { id: 1, title: 'update!' });
    });

    test('내용이 비어있으면 해당 항목을 지운다.', () => {
      const deleteSpy = jest.spyOn(controller, 'deleteItem');
      controller.editItemSave({ id: 1, title: '' });
      expect(deleteSpy).toHaveBeenCalledWith(1);
    });
  });

  describe('updateCount 테스트', () => {
    test('updateCount 호출 시 view.render가 올바른 인자로 호출된다.', () => {
      jest.spyOn(model, 'getCount').mockImplementation(callback => {
        callback({ total: 5, completed: 3 });
      });
      controller.updateCount();
      expect(model.getCount).toHaveBeenCalled();
      expect(view.render).toHaveBeenCalledWith('updateElementCount', { total: 5, completed: 3 });
      expect(view.render).toHaveBeenCalledWith('toggleAll', { completed: false });
    });

    test('activeRoute이 "All"이고 todos의 상태에 따라 showAll이 호출된다', () => {
      controller.activeRoute = 'All';
      jest.spyOn(controller, 'showAll');
      // todos가 완료된 상태가 없는 경우
      model.getCount.mockImplementation(callback => {
        callback({ total: 5, completed: 0 });
      });
      controller.updateCount();
      expect(controller.showAll).toHaveBeenCalled();

      // 모든 todos가 완료된 상태인 경우
      model.getCount.mockImplementation(callback => {
        callback({ total: 5, completed: 5 });
      });
      controller.updateCount();
      expect(controller.showAll).toHaveBeenCalled();

      // todos가 없는 경우
      model.getCount.mockImplementation(callback => {
        callback({ total: 0, completed: 0 });
      });
      controller.updateCount();
      expect(controller.showAll).toHaveBeenCalled();
    });
  });
});
