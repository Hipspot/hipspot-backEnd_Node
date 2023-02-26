import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ProjectionType } from 'mongoose';
import { OpeningHours } from './schemas/opening-hours.schemas';
import { ImageList } from './schemas/image-list.schemas';
import { Info } from './schemas/info.schmas';
import { Rating } from './schemas/rating.schema';
import { Price } from './schemas/price.schemas';
import { FilterList } from './schemas/filtser-list.schemas';
import { getBucketListObjectsCommand } from 'src/libs/aws/getObjectLists';
import { Cafe } from 'src/domain/app/cafe/schemas/cafe.schema';

@Injectable()
export class CafeService {
  constructor(
    @InjectModel(Info.name) private infoModel: Model<Info>,
    @InjectModel(Rating.name) private ratingModel: Model<Rating>,
    @InjectModel(OpeningHours.name)
    private openingHoursModel: Model<OpeningHours>,
    @InjectModel(ImageList.name) private imageListModel: Model<ImageList>,
    @InjectModel(Price.name) private priceModel: Model<Price>,
    @InjectModel(FilterList.name) private filterListModel: Model<FilterList>,
    @InjectModel(Cafe.name) private cafeModel: Model<Cafe>,
  ) {}

  async getInfo(cafeId?: string, projection?: ProjectionType<Info>) {
    const info = await this.infoModel.find(
      cafeId ? { cafeId } : {},
      projection || {},
    );
    return info;
  }

  async getOpeningHours(
    cafeId?: string,
    projection?: ProjectionType<OpeningHours>,
  ) {
    const openingHorus = await this.openingHoursModel.find(
      cafeId ? { cafeId } : {},
      projection || {},
    );
    return openingHorus;
  }

  async getImageList(cafeId?: string, projection?: ProjectionType<ImageList>) {
    await getBucketListObjectsCommand();
    const imageList = await this.imageListModel.find(
      cafeId ? { cafeId } : {},
      projection || {},
    );
    return imageList;
  }

  async getRating(cafeId?: string, projection?: ProjectionType<Rating>) {
    const rating = await this.ratingModel.find(
      cafeId ? { cafeId } : {},
      projection || {},
    );
    return rating;
  }
  async getPrice(cafeId?: string, projection?: ProjectionType<Price>) {
    const price = await this.priceModel.find(
      cafeId ? { cafeId } : {},
      projection || {},
    );
    return price;
  }

  async getCafe(cafeId?: string, projection?: ProjectionType<Cafe>) {
    const cafe = await this.cafeModel.find(
      cafeId ? { cafeId } : {},
      projection || {},
    );
    return cafe;
  }

  async getFilterList(
    cafeId?: string,
    projection?: ProjectionType<FilterList>,
  ) {
    const filterList = await this.filterListModel.find(
      cafeId ? { cafeId } : {},
      projection || {},
    );
    return filterList;
  }

  async updateFilterList() {
    const filterLists = (await this.filterListModel.find(
      {},
    )) as unknown as FilterList[];

    for (let i = 0; i < filterLists.length; i++) {
      const { cafeId, filterListCSV } = filterLists[i];
      console.log(filterListCSV);
      if (!Array.isArray(filterListCSV)) {
        const filtetListArr = FilterList.fromCSV(filterListCSV);
        console.log(filtetListArr);
        await this.filterListModel.updateOne(
          { cafeId },
          { $set: { filterList: filtetListArr } },
        );
      }
    }

    return await this.filterListModel.find({});
  }

  async updateOpeningHours() {
    const openingHoursList = await this.openingHoursModel.find();
    for (let i = 0; i < openingHoursList.length; i++) {
      const { cafeId, time } = openingHoursList[i];
      const openingHours = OpeningHours.convertTime(time);
      (await this.openingHoursModel.updateOne(
        { cafeId },
        { $set: { openingHours } },
      )) as unknown as OpeningHours;
    }
    return await this.openingHoursModel.find({});
  }

  async updateImageListData() {
    const s3data = await getBucketListObjectsCommand();
    if (!s3data) {
      throw new Error('s3 데이터가 없습니다.');
    }
    const s3DataEntries = Object.entries(s3data);
    for (let i = 0; i < s3DataEntries.length; i++) {
      const [cafeId, imageList] = s3DataEntries[i] as unknown as [
        string,
        { menu: string[]; store: string[] },
      ];
      await this.imageListModel.updateOne(
        { cafeId },
        { $set: { menu: imageList.menu, store: imageList.store } },
      );
    }
    return await this.imageListModel.find({});
  }

  async updateCafe() {
    const cafe = await this.cafeModel.find({});

    for (let i = 0; i < cafe.length; i++) {
      const { cafeId } = cafe[i];

      const { cafeName, contactNum, address } = await this.infoModel.findOne(
        { cafeId },
        { _id: 0 },
      );
      const imageList = await this.imageListModel.findOne(
        { cafeId },
        { _id: 0, cafdId: 0 },
      );
      const { openingHours } = await this.openingHoursModel.findOne(
        { cafeId },
        { _id: 0, cafeId: 0 },
      );

      await this.cafeModel.updateOne(
        { cafeId },
        {
          $set: {
            cafeName,
            contactNum,
            address,
            openingHours,
            imageList,
          },
        },
      );
    }

    return await this.cafeModel.find({});
  }
}
