import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'location' })
export class Location extends Document {
  @Prop(String)
  cafeId: number;

  @Prop(String)
  address: string;

  @Prop(Number)
  lat: number;

  @Prop(Number)
  lng: number;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
