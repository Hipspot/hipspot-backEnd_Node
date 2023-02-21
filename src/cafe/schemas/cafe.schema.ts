import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
class ImageList extends Document {
  @Prop([String])
  store: string[];

  @Prop([String])
  menu: string[];
}

export const ImageListSchema = SchemaFactory.createForClass(ImageList);

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

  @Prop(String)
  instaId: string;

  @Prop({ type: ImageListSchema })
  imageList: ImageList;

  @Prop(String)
  naverMapUrl: string | null;

  @Prop(String)
  kakaoMapUrl: string | null;
}

export const CafeSchema = SchemaFactory.createForClass(Cafe);
