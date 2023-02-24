import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'geoJson' })
export class Geojson extends Document {
  @Prop(String)
  type: string;

  @Prop({ type: Object, coordinates: [Number] })
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  @Prop({ type: Object, properties: Object })
  properties: {
    id: number;
    cafeName: string;
    filterId: number;
    thumbNail: string;
    resonablePrice: number;
  };
}

export const GeojsonSchema = SchemaFactory.createForClass(Geojson);
