import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'rating' })
export class Rating extends Document {
  @Prop(String)
  cafeId: string;

  @Prop(Number)
  review: number;

  @Prop(Number)
  star: number;
}

export const ratingSchema = SchemaFactory.createForClass(Rating);
