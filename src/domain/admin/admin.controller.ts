import {
  Controller,
  Get,
  Patch,
  Query,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-guard';
import { AdminService } from './admin.service';

@SetMetadata('role', ['admin'])
@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  getHello() {
    return this.adminService.getHello();
  }

  @Patch('/geojson')
  async updateGeojson(@Query('option') option) {
    switch (option) {
      case 'update':
        return await this.adminService.updateGeojson();

      default:
        return `${option} 옵션은 존재하지 않습니다.`;
    }
  }

  @Patch()
  async updateCafe(@Query('option') option) {
    switch (option) {
      case 'update':
        return await this.adminService.updateCafe();
      default:
        return `${option} 옵션은 존재하지 않습니다.`;
    }
  }

  @Patch('/imageList')
  async updateImageListData(@Query('option') option) {
    switch (option) {
      case 'update':
        return await this.adminService.updateImageListData();
      default:
        return `${option} 옵션은 존재하지 않습니다.`;
    }
  }
  @Patch('/openingHours')
  async updateOpeningHours(@Query('option') option) {
    switch (option) {
      case 'update':
        return await this.adminService.updateOpeningHours();
      default:
        return `${option} 옵션은 존재하지 않습니다.`;
    }
  }

  @Patch('/filtetList')
  async filterList(@Query('option') option) {
    switch (option) {
      case 'update':
        return await this.adminService.updateFilterList();
      default:
        return `${option} 옵션은 존재하지 않습니다.`;
    }
  }

  @Patch('/image/thumbNail')
  async updateThumbNail(@Query('option') option) {
    switch (option) {
      case 'update':
        return await this.adminService.updateThumbNail();
      default:
        return `${option} 옵션은 존재하지 않습니다.`;
    }
  }
}
