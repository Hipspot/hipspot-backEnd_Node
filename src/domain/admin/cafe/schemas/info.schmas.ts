import { InjectModel, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface info {
  cafeId: number;
  cafeName: string;
  contactNum: string;
  naverMapUrl: string | null;
  kakaoMapUrl: string | null;
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
  naverMapUrl: string | null;

  @Prop(String)
  kakaoMapUrl: string | null;

  static fromCSV(csv: string) {
    const [cafeId, cafeName, contacNum, naverMapUrl, kakaoMapUrl] = csv
      .split(',')
      .map((str) => str.replace(`"`, ''));
    return { cafeId, cafeName, contacNum, naverMapUrl, kakaoMapUrl };
  }
}

export const infoSchema = SchemaFactory.createForClass(Info);
