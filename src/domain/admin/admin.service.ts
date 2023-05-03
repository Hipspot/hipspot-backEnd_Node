import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ProjectionType } from 'mongoose';
import { CafeRepository } from '../cafe/cafe.repository';
import { CafeService } from '../cafe/cafe.service';
import { Cafe } from '../cafe/schemas/cafe.schema';
import { ImageListRepository } from '../image-list/image-list.repository';
import { LocationService } from '../location/location.service';
import { Geojson } from '../map/schemas/Geojson.schemas';
import { FilterList } from './schemas/filter-list.schemas';
import { ImageList } from './schemas/image-list.schemas';
import { Info } from './schemas/info.schmas';
import { OpeningHours } from './schemas/opening-hours.schemas';
import { Price } from './schemas/price.schemas';
import { Rating } from './schemas/rating.schema';
import { AwsS3Service } from 'src/module/aws-s3/aws-s3.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Geojson.name) private geojsonModel: Model<Geojson>,
    @InjectModel(Info.name) private infoModel: Model<Info>,
    @InjectModel(OpeningHours.name)
    private openingHoursModel: Model<OpeningHours>,
    @InjectModel(Price.name) private priceModel: Model<Price>,
    @InjectModel(FilterList.name) private filterListModel: Model<FilterList>,

    private readonly imageListRepository: ImageListRepository,
    private readonly cafeService: CafeService,
    private readonly locationService: LocationService,
    private readonly cafeRepository: CafeRepository,
    private readonly awsS3Service: AwsS3Service,
  ) {}

  getHello(): string {
    return '어드민 서버 구동되었습니다.';
  }

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
    const imageList = await this.imageListRepository.findOne(
      cafeId ? { cafeId } : {},
      projection || {},
    );
    return imageList;
  }

  async getRating(cafeId?: string, projection?: ProjectionType<Rating>) {
    const rating = await this.cafeRepository.findOne(cafeId, projection || {});
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
    const cafe = await this.cafeRepository.findOne(cafeId, projection || {});
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
    const s3data = await this.awsS3Service.getBucketListObjectsCommand();
    if (!s3data) {
      throw new Error('s3 데이터가 없습니다.');
    }
    const s3DataEntries = Object.entries(s3data);
    for (let i = 0; i < s3DataEntries.length; i++) {
      const [cafeId, imageList] = s3DataEntries[i] as unknown as [
        string,
        { menu: string[]; store: string[] },
      ];
      await this.imageListRepository.updateOne(
        { cafeId },
        { $set: { menu: imageList.menu, store: imageList.store } },
      );
    }
    return await this.imageListRepository.findAll();
  }

  async updateCafe() {
    const cafe = await this.cafeRepository.findAll();

    for (let i = 0; i < cafe.length; i++) {
      const { cafeId } = cafe[i];

      const { cafeName, contactNum, address } = await this.infoModel.findOne(
        { cafeId },
        { _id: 0 },
      );
      const imageList = await this.imageListRepository.findOne(
        { cafeId },
        { _id: 0, cafdId: 0 },
      );
      const { openingHours } = await this.openingHoursModel.findOne(
        { cafeId },
        { _id: 0, cafeId: 0 },
      );

      return await this.cafeRepository.updateOne(
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
  }

  async updateGeojson() {
    const cafeList = await this.cafeService.getCafeList();
    for (let i = 0; i < cafeList.length; i++) {
      const { cafeId, cafeName, imageList } = cafeList[i];
      const [price] = await this.getPrice(cafeId, {
        _id: 0,
        cafeId: 0,
      });
      const location = await this.locationService.getLocationData(cafeId, {
        _id: 0,
        cafeId: 0,
        lot_address: 0,
        address: 0,
      });
      const [{ filterList }] = await this.getFilterList(cafeId, {
        _id: 0,
        cafeId: 0,
        filterListCSV: 0,
      });

      const geojson: Pick<Geojson, 'type' | 'properties' | 'geometry'> = {
        type: 'Feature',
        properties: {
          cafeId,
          cafeName,
          filterList: filterList.map(Number),
          resonablePrice: Number(price.americano) || null,
          thumbNail: imageList.store?.[0] || imageList.menu?.[0] || null,
        },
        geometry: {
          type: 'Point',
          coordinates: [location.lat, location.lng],
        },
      };

      await this.geojsonModel.updateOne(
        { 'properties.cafeId': cafeId },
        { $set: geojson, $unset: { cafeId: 0, store: 0, menu: 0 } },
        { upsert: true },
      );
    }
    return await this.geojsonModel.find({});
  }
}
