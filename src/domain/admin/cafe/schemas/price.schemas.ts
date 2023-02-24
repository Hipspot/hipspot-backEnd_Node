import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'price' })
export class Price extends Document {
  @Prop(String)
  americano: string;
}

export const priceSchema = SchemaFactory.createForClass(Price);
