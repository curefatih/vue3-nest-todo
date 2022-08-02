import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoGroup } from './entity/todo-group.entity';
import { Todo } from './entity/todo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TodoGroup, Todo])],
  providers: [TodoService],
  controllers: [TodoController],
})
export class TodoModule {}
