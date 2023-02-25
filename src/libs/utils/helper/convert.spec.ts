import { convertTime } from './convert';

describe('convert 테스트', () => {
  describe('convertTime 함수 테스트', () => {
    test('string 값이 없거나,  - 로 들어오는 경우', () => {
      const time = '-';
      const model = convertTime(time);
      expect(model.annotation).toBe('');
      expect(model.timeBlock).toEqual([]);
    });

    test('형식에 맞게 들어온 경우 1 ', () => {
      const time = '월,화,수 10:00~20:00 & 목,금 20:00~22:00 // 일요일 휴무';
      const model = convertTime(time);
      expect(model.annotation).toBe('일요일 휴무');
      expect(model.timeBlock).toEqual([
        { day: ['월', '화', '수'], time: '10:00~20:00' },
        { day: ['목', '금'], time: '20:00~22:00' },
      ]);
    });

    test('형식에 맞게 들어온 경우 2 ', () => {
      const time = '매일 10:00 ~ 20:00';
      const model = convertTime(time);
      expect(model.annotation).toBe('');
      expect(model.timeBlock).toEqual([
        { day: ['매일'], time: '10:00 ~ 20:00' },
      ]);
    });

    test('주석이 없는 경우', () => {
      const time = '월,화,수,목,금,토 11:00 ~ 24:00';
      const model = convertTime(time);
      expect(model.annotation).toBe('');
      expect(model.timeBlock).toEqual([
        { day: ['월', '화', '수', '목', '금', '토'], time: '11:00 ~ 24:00' },
      ]);

      const time2 = '매일 10:00 ~ 22:00';
      const model2 = convertTime(time2);
      expect(model2.annotation).toBe('');
      expect(model2.timeBlock).toEqual([
        { day: ['매일'], time: '10:00 ~ 22:00' },
      ]);
    });

    test('주석만 있는 경우', () => {
      const time = '//24시간 영업';
      const model2 = convertTime(time);
      expect(model2.annotation).toBe('24시간 영업');
      expect(model2.timeBlock).toEqual([]);
    });
  });
});
