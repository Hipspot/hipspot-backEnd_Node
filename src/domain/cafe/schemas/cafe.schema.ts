import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ImageTabList } from 'src/domain/admin/schemas/image-list.schemas';
import { OpeningHours } from 'src/domain/admin/schemas/opening-hours.schemas';

@Schema({ collection: 'cafe' })
export class Cafe extends Document {
  @Prop(String)
  cafeId: string;

  @Prop(String)
  cafeName: string;

  @Prop(String)
  address: string;

  @Prop({ type: Object })
  openingHours: OpeningHours;

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
