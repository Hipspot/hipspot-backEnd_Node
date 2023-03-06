import { IsEmail, IsString, IsUrl } from 'class-validator';

export type ParsedGoogltAuthProfileType = {
  email: string;
  displayName: string;
  photo: string;
  accessToken?: string;
  refreshToken?: string;
};

export class GoogltAuthDto implements ParsedGoogltAuthProfileType {
  @IsEmail()
  email: string;

  @IsString()
  displayName: string;

  @IsString()
  @IsUrl()
  photo: string;

  @IsString()
  accessToken?: string;

  @IsString()
  refreshToken?: string;
}
