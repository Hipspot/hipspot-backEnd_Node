import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ImageTabList = 'store' | 'menu';

@Schema({ collection: 'image_list' })
export class ImageList extends Document {
  @Prop(String)
  cafeId: number;

  @Prop([String])
  store: string[];

  @Prop([String])
  menu: string[];
}

export const ImageListSchema = SchemaFactory.createForClass(ImageList);
