import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'user' })
export class User extends Document {
  @Prop({ required: true, type: String, unique: true })
  userId: string;

  @Prop(String)
  displayName: string;

  @Prop({ required: true, type: String, unique: true })
  email: string;

  @Prop(String)
  image: string;
}

export const userSchema = SchemaFactory.createForClass(User);
