/**
 * @description 영업시간을 나타내는 정해진 형식의 string 값을 받아서 객체 형식으로 변환
 * @example 요일 :  ","로 구분 - "월,화,수,목,금" | "매일" | "화,목,금"
 *          시간 : 24시간 단위, "~"로 구분 - "10:00 ~ 24:00",
 *          비고 : "//"로 구분 - "매일 10:00 ~ 23:00 //공휴일 영업"
 *          새로운 시간 블록 : "&"로 구분 - "월,수,금 10:00~20:00 & 목,토 12:00~23:00"
 *          예시 : "월,화,수 10:00~20:00 & 목,금 20:00~22:00 // 일요일 휴무"
 * @
 * @param str 예시에 적은 형식으로 입력되는 string 값
 */
export const convertTime = (str: string) => {
  if (!str.length || str === '-') return { annotation: '', timeBlock: [] };
  const businessTime: {
    annotation: string;
    timeBlock: { day: string[]; time: string }[];
  } = { annotation: '', timeBlock: [] };

  if (str.includes('//')) {
    const temp = str.split('//');
    businessTime.annotation = temp.pop().trim();
    str = temp.join();
  }

  const blocks = str.split('&');
  if (str) {
    for (let i = 0; i < blocks.length; i++) {
      const blockStr = blocks[i].trim();
      if (!blockStr) return;
      const firstDigitIndex = blockStr.match(/\d/).index;
      const block = {
        day: blockStr.substring(0, firstDigitIndex).trim().split(','),
        time: blockStr.substring(firstDigitIndex).trim(),
      };
      businessTime.timeBlock.push(block);
    }
  }
  return businessTime;
};
