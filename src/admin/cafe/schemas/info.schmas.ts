import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'info' })
export class Info extends Document {
  @Prop(Number)
  cafeId: number;

  @Prop(String)
  cafeName: string;

  @Prop(String)
  contactNum: string;

  @Prop(String)
  instaId: string;

  @Prop(String)
  naverMapUrl: string | null;

  @Prop(String)
  kakaoMapUrl: string | null;
}

export const InfoSchema = SchemaFactory.createForClass(Info);
