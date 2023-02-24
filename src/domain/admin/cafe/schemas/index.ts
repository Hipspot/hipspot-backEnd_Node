import { ImageList, ImageListSchema } from './imageList.schemas';
import { Info, infoSchema } from './info.schmas';
import { OpeningHours, openingHoursSchema } from './openingHours.schemas';
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
  [CafeSubDocumentsType.imageList]: ImageList,
  [CafeSubDocumentsType.info]: Info,
  [CafeSubDocumentsType.price]: Price,
  [CafeSubDocumentsType.rating]: Rating,
  [CafeSubDocumentsType.openingHours]: OpeningHours,
};

export const CafeSubSchemas = {
  [CafeSubDocumentsType.imageList]: ImageListSchema,
  [CafeSubDocumentsType.info]: infoSchema,
  [CafeSubDocumentsType.price]: priceSchema,
  [CafeSubDocumentsType.rating]: ratingSchema,
  [CafeSubDocumentsType.openingHours]: openingHoursSchema,
};
