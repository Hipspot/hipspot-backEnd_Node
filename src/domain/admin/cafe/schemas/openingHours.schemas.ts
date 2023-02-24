import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type day = '월' | '화' | '수' | '목' | '금' | '토' | '일';

@Schema({ collection: 'opening_hours' })
export class OpeningHours extends Document {
  @Prop(Number)
  cafeId: number;

  @Prop([String])
  businessDays: string[];

  @Prop(String)
  businessTime: string;
}

export const openingHoursSchema = SchemaFactory.createForClass(OpeningHours);
