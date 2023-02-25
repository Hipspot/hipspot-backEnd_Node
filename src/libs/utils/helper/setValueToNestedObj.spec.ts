import { setValueToNestedObj } from './setValueToNestedObj';

describe('setValueToNestedObj 테스트', () => {
  describe('중첩된 객체의 목표 위치의 값을 배열로 설정한 경우', () => {
    test('값을 담을 객체가 빈 객체인 경우 ', () => {
      const obj = {};
      setValueToNestedObj(obj, ['depth1', 'depth2', 'depth3'], 'Value1');
      setValueToNestedObj(obj, ['depth1', 'depth2', 'depth3'], 'Value2');
      setValueToNestedObj(obj, ['depth1', 'depth2', 'depth3'], 'Value3');

      expect(obj).toEqual({
        depth1: { depth2: { depth3: ['Value1', 'Value2', 'Value3'] } },
      });
    });

    test('값을 담을 객체가 이미 값이 있는 경우', () => {
      const obj = { depth1: { depth2: { depth3: 'Value1' } }, x: { y: 123 } };
      setValueToNestedObj(obj, ['depth1', 'depth2', 'depth3'], 'Value2');

      expect(obj).toEqual({
        depth1: { depth2: { depth3: ['Value1', 'Value2'] } },
        x: { y: 123 },
      });
    });

    test('path는 존재하나 값이 없는 경우', () => {
      const imageList = {};
      setValueToNestedObj(imageList, ['1', 'menu'], null);
      setValueToNestedObj(imageList, ['1', 'store'], '1.jpg');
      setValueToNestedObj(imageList, ['1', 'store'], '2.jpg');

      expect(imageList).toEqual({
        1: { menu: null, store: ['1.jpg', '2.jpg'] },
      });
    });

    test('path는 존재하나 값이 없는 경우', () => {
      const imageList = {};
      setValueToNestedObj(imageList, ['1', 'menu'], '1.jpg');
      setValueToNestedObj(imageList, ['1', 'menu'], null);
      setValueToNestedObj(imageList, ['1', 'store'], '1.jpg');
      setValueToNestedObj(imageList, ['1', 'store'], '2.jpg');

      expect(imageList).toEqual({
        1: { menu: ['1.jpg'], store: ['1.jpg', '2.jpg'] },
      });
    });

    test('path 배열이 없으면 return ', () => {
      const obj = {};
      setValueToNestedObj(obj, [], 'Value');

      expect(obj).toEqual({});
    });
  });

  describe('중첩된 객체의 목표 위치 값을 최신화 하려는 경우', () => {
    test('값을 담을 객체가 빈 객체인 경우 ', () => {
      const obj = {};
      setValueToNestedObj(obj, ['depth1', 'depth2', 'depth3'], 'Value1', true);
      setValueToNestedObj(obj, ['depth1', 'depth2', 'depth3'], 'Value2', true);
      setValueToNestedObj(obj, ['depth1', 'depth2', 'depth3'], 'Value3', true);

      expect(obj).toEqual({ depth1: { depth2: { depth3: 'Value3' } } });
    });

    test('값을 담을 객체가 이미 값이 있는 경우', () => {
      const obj = { depth1: { depth2: { depth3: 'Value1' } }, x: { y: 123 } };
      setValueToNestedObj(obj, ['depth1', 'depth2', 'depth3'], 'Value2', true);

      expect(obj).toEqual({
        depth1: { depth2: { depth3: 'Value2' } },
        x: { y: 123 },
      });
    });

    test('path는 존재하나 값이 없는 경우', () => {
      const imageList = {};
      setValueToNestedObj(imageList, ['1', 'menu'], null);
      setValueToNestedObj(imageList, ['1', 'store'], '1.jpg', true);
      setValueToNestedObj(imageList, ['1', 'store'], '2.jpg', true);

      expect(imageList).toEqual({
        1: { menu: null, store: '2.jpg' },
      });
    });

    test('path 배열이 없으면 return ', () => {
      const obj = {};
      setValueToNestedObj(obj, [], 'Value', true);

      expect(obj).toEqual({});
    });
  });
});
