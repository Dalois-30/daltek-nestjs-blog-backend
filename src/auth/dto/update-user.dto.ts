import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { UserRoles } from '../constant/user-roles';

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  readonly email?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly username?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  readonly verified?: boolean;

  @ApiPropertyOptional({
    enum: UserRoles,
  })
  @IsNotEmpty()
  @IsEnum(UserRoles)
  @IsOptional()
  readonly role?: UserRoles;
}

export class UpdateUserDtoPassword {
  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  readonly email?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  password?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly username?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  readonly verified?: boolean;

  // @ApiPropertyOptional({
  //   enum: UserRoles,
  // })
  @IsNotEmpty()
  @IsEnum(UserRoles)
  @IsOptional()
  readonly role?: UserRoles;
}
