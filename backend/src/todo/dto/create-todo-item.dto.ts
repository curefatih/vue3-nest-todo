import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export default class CreateTodoItemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  dueDate: string;

  @ApiProperty()
  @IsInt()
  priority: number;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  completed?: boolean;
}
