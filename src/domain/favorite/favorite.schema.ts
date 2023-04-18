import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'favorite' })
export class Favorite extends Document {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop([String])
  favoriteList: string[];
}

export const FavoriteSchema = SchemaFactory.createForClass(Favorite);
