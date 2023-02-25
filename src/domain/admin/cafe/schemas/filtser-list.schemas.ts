import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum FilterListEnum {
  Hipspot,
  Study,
  Resonable,
  Dessert,
  Franchise,
  Independent,
}

@Schema({ collection: 'filter_list' })
export class FilterList extends Document {
  @Prop(String)
  cafeId: string;

  @Prop([String])
  filterList: string[];

  @Prop(String)
  filterListCSV: string;

  static fromCSV(csv: string) {
    const arr = csv
      .split(',')
      .filter((str) =>
        Object.keys(FilterListEnum)
          .filter((v) => !+v && v !== '0')
          .includes(str.trim()),
      )
      .map((v) => FilterListEnum[v.trim()]);

    return arr;
  }
}

export const filterListSchema = SchemaFactory.createForClass(FilterList);
