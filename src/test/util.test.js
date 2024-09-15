import { findParent } from '../util/helper';

describe('util.js 테스트', () => {
  // findParent 함수 테스트
  test('findParent 함수에서 부모 노드가 없으면 undefined를 반환한다.', () => {
    const noParentElement = {
      parentNode: null,
    };

    const result = findParent(noParentElement, 'div');

    expect(result).toBeUndefined();
  });
});
