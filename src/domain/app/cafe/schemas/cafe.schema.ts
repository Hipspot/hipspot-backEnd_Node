import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ImageTabList } from 'src/domain/admin/cafe/schemas/imageList.schemas';

@Schema({ collection: 'cafe' })
export class Cafe extends Document {
  @Prop(Number)
  cafeId: number;

  @Prop(String)
  cafeName: string;

  @Prop(String)
  address: string;

  @Prop([String])
  businessDay: string[];

  @Prop(String)
  businessTime: string | null;

  @Prop(String)
  contactNum: string;

  @Prop({ type: Object })
  imageList: {
    [key in ImageTabList]: string[];
  };

  @Prop(String)
  naverMapUrl: string | null;

  @Prop(String)
  kakaoMapUrl: string | null;
}

export const CafeSchema = SchemaFactory.createForClass(Cafe);
