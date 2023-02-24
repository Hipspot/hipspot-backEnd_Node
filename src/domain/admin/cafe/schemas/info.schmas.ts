import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { isContactNum, isNumber } from 'src/utils/helper/validation';

export interface info {
  cafeId: number;
  cafeName: string;
  contactNum: string;
  address: string;
  naverMapUrl: string | null;
  kakaoMapUrl: string | null;
}
enum InfoEnum {
  cafeId,
  cafeName,
  contactNum,
  address,
  naverMapUrl,
  kakaoMapUrl,
}

@Schema({ collection: 'info' })
export class Info extends Document implements info {
  @Prop(Number)
  cafeId: number;

  @Prop(String)
  cafeName: string;

  @Prop(String)
  contactNum: string;

  @Prop(String)
  address: string;

  @Prop(String)
  naverMapUrl: string | null;

  @Prop(String)
  kakaoMapUrl: string | null;

  /**
   * @description csv 값을 받아서 객체 형식으로 변환
   * @param csv "cafeId,CafeName,ContactNum,Address,naverMapUrl,kakaoMapUrl"
   *
   */
  static fromCSV(csv: string) {
    const infoModel = {};
    csv.split(',').forEach((str, i) => {
      const parsed = str.length > 0 ? str.replace(`"`, '') : '';
      switch (InfoEnum[i]) {
        case 'cafeId':
          if (isNumber(parsed)) return (infoModel['cafeId'] = parsed);
          throw new Error();
        case 'cafeName':
          return (infoModel['cafeName'] = parsed);
          throw new Error();
        case 'contactNum':
          if (isContactNum(parsed)) return (infoModel['contactNum'] = parsed);
          throw new Error();
        case 'address':
          return (infoModel['address'] = parsed);
          throw new Error();
        case 'naverMapUrl':
          return (infoModel['naverMapUrl'] = parsed);
          throw new Error();
        case 'kakaoMapUrl':
          return (infoModel['kakaoMapUrl'] = parsed);
          throw new Error();
        default:
          return parsed;
      }
    });
    return infoModel;
  }
}

export const infoSchema = SchemaFactory.createForClass(Info);
