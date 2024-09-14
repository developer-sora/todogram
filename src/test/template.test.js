import Template from '../js/template.js';

describe('Template 테스트', () => {
  let template;

  const testCases = [
    { hash: '#/completed', expected: 'completed' },
    { hash: '#/all', expected: 'all' },
    { hash: '#/active', expected: 'active' },
  ];

  beforeEach(() => {
    template = new Template();
  });

  testCases.forEach(({ hash, expected }) => {
    test(`현재 페이지가 ${expected}이고 할 일 목록이 없을 때 showMainTemplate를 호출하면 해당 페이지에 맞는 noDataTemplate을 리턴한다.`, () => {
      window.location.hash = hash;
      const result = template.showMainTemplate([]);
      expect(result).toBe(template.noDataTemplate(expected === 'completed' ? expected : 'default'));
    });
  });

  test(`할 일 목록이 있을 때 showMainTemplate를 호출하면 defaultTemplate를 리턴한다.`, () => {
    const data = [
      { id: 1, title: 'test1', completed: false },
      { id: 2, title: 'test2 completed', completed: true },
    ];
    const result = template.showMainTemplate(data);
    expect(result).toBe(data.map(v => template.defaultTemplate(v)).join(''));
  });

  testCases.forEach(({ hash, expected }) => {
    test(`현재 페이지가 ${expected}일 때 해당 페이지에 맞는 dropModalTemplate(삭제 모달)을 리턴한다`, () => {
      window.location.hash = hash;
      const result = template.showModalTemplate();
      expect(result).toBe(template.dropModalTemplate(expected));
    });
  });
});
