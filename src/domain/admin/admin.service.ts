import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {
  getHello(): string {
    return '어드민 서버 구동되었습니다.';
  }
}
