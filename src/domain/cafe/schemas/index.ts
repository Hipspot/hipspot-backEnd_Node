import { Info, infoSchema } from './info.schmas';
import { OpeningHours, openingHoursSchema } from './opening-hours.schemas';
import { Price, priceSchema } from './price.schemas';
import { Rating, ratingSchema } from './rating.schema';

export enum CafeSubDocumentsType {
  info = 'Info',
  price = 'Price',
  imageList = 'ImageList',
  openingHours = 'OpeningHours',
  rating = 'Rating',
}

export const CafeSubDocuments = {
  [CafeSubDocumentsType.info]: Info,
  [CafeSubDocumentsType.price]: Price,
  [CafeSubDocumentsType.rating]: Rating,
  [CafeSubDocumentsType.openingHours]: OpeningHours,
};

export const CafeSubSchemas = {
  [CafeSubDocumentsType.info]: infoSchema,
  [CafeSubDocumentsType.price]: priceSchema,
  [CafeSubDocumentsType.rating]: ratingSchema,
  [CafeSubDocumentsType.openingHours]: openingHoursSchema,
};
