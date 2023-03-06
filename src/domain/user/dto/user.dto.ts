import { IsEmail, IsString, IsUrl, IsUUID } from 'class-validator';

export type UserType = {
  userId: string;
  displayName: string;
  email: string;
  image: string;
};

export class UserDto {
  @IsString()
  @IsUUID()
  userId: string;

  @IsString()
  displayName: string;

  @IsEmail()
  email: string;

  @IsUrl()
  image: string;
}
