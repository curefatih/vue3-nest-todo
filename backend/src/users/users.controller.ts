import { PG_UNIQUE_VIOLATION } from '@drdgvhbh/postgres-error-codes';
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { Public } from 'src/decorator/public.decorator';
import CreateUserDto from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Public()
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.usersService.create(createUserDto);
    } catch (error) {
      if (error.code === PG_UNIQUE_VIOLATION) {
        throw new HttpException(
          'User with this email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw error;
    }
  }
}
