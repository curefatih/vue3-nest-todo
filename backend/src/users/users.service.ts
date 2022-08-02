import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import * as bcrypt from 'bcrypt';
import CreateUserDto from './dto/create-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  create(createDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create({ ...createDto });

    return this.usersRepository.save(user);
  }

  async findOneWithEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findOneByEmailAndPassword(
    email: string,
    password: string,
  ): Promise<User | undefined> {
    this.logger.log(`Finding user with email ${email} with password.`);
    const user = await this.usersRepository.findOne({
      where: { email },
      select: ['id', 'name', 'email', 'password'],
    });

    if (!user) {
      this.logger.log(`User with email ${email} not found.`);
      return null;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      this.logger.log(`Password for user with email ${email} is incorrect.`);
      return null;
    }

    return user;
  }
}
