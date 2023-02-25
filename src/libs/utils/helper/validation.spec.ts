import { isContactNum, isNumber } from './validation';

describe('helper function test', () => {
  describe('isNumber is', () => {
    test('숫자일때 통과', () => {
      const num = `12231323`;
      expect(isNumber(num)).toBe(true);
    });
    test('0-9 이외에 값이 있으면 실패', () => {
      const str1 = '12312393-';
      const str2 = 'HI';

      expect(isNumber(str1)).toBe(false);
      expect(isNumber(str2)).toBe(false);
    });
  });

  describe('isContactNum is', () => {
    test('4자리-4자리-4자리 숫자 통과', () => {
      const num1 = '1234-4124-3333';
      const num2 = '0101-2932-4443';
      const num3 = '0507-2330-6666';

      expect(isContactNum(num1)).toBe(true);
      expect(isContactNum(num2)).toBe(true);
      expect(isContactNum(num3)).toBe(true);
    });
  });
});
