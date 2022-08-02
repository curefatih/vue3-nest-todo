import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export default class UpdateTodoItemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  text: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  @IsOptional()
  dueDate: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  priority: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  @IsOptional()
  completed: boolean;
}
