import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'geojson' })
export class Geojson extends Document {
  @Prop(String)
  type: string;

  @Prop({ type: Object, geometry: { coordinates: [Number], type: String } })
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  @Prop({
    type: Object,
    properties: {
      cafeId: String,
      cafeName: String,
      filterList: [Number],
      thumbNail: String,
      reasonablePrice: Number || null,
    },
  })
  properties: {
    cafeId: string;
    cafeName: string;
    filterList: number[];
    thumbNail: string;
    resonablePrice: number | null;
  };
}

export const geojsonSchema = SchemaFactory.createForClass(Geojson);
