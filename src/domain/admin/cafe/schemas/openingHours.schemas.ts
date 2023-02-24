import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { convertTime } from 'src/utils/helper/convert';

export type Day = '월' | '화' | '수' | '목' | '금' | '토' | '일' | '매일';

@Schema({ collection: 'opening_hours' })
export class OpeningHours extends Document {
  @Prop(String)
  cafeId: string;

  @Prop({ type: Object })
  timeBlock: {
    annotation: string;
    businessTime: { days: Day[]; time: string }[];
  };
  /**
   * @description 영업시간을 나타내는 정해진 형식의 string 값을 받아서 객체 형식으로 변환
   * @example 요일 :  ","로 구분 - "월,화,수,목,금" | "매일" | "화,목,금"
   *          시간 : 24시간 단위, "~"로 구분 - "10:00 ~ 24:00",
   *          비고 : "//"로 구분 - "매일 10:00 ~ 23:00 //공휴일 영업"
   *          새로운 시간 블록 "&"로 구분 - "월,수,금 10:00~20:00 & 목,토 12:00~23:00"
   * @
   * @param str 예시에 적은 형식으로 입력되는 string 값
   */
  static convertTime(str: string) {
    return convertTime(str);
  }
}

export const openingHoursSchema = SchemaFactory.createForClass(OpeningHours);
