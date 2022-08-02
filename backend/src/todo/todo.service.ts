import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrentUserPayload } from 'src/types/current-user-payload';
import { User } from 'src/users/entity/user.entity';
import { Repository } from 'typeorm';
import CreateTodoGroupDto from './dto/create-todo-group.dto';
import CreateTodoItemDto from './dto/create-todo-item.dto';
import UpdateTodoGroupDto from './dto/update-todo-group.dto';
import UpdateTodoItemDto from './dto/update-todo-item.dto';
import { TodoGroup } from './entity/todo-group.entity';
import { Todo } from './entity/todo.entity';

@Injectable()
export class TodoService {
  private readonly logger = new Logger(TodoService.name);

  constructor(
    @InjectRepository(TodoGroup)
    private readonly todoGroupRepository: Repository<TodoGroup>,
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
  ) {}

  createTodoGroup(
    user: CurrentUserPayload,
    todoGroup: CreateTodoGroupDto,
  ): Promise<TodoGroup> {
    this.logger.log(
      `Creating todo group for user ${user.id} with name ${todoGroup.name}`,
    );
    const newTodoGroup = this.todoGroupRepository.create(todoGroup);
    newTodoGroup.owner = user as User;
    return this.todoGroupRepository.save(newTodoGroup);
  }

  async createTodoItem(
    user: User,
    groupId: string,
    todoItem: CreateTodoItemDto,
  ): Promise<Todo> {
    this.logger.log(
      `Creating todo item for user ${user.id} in group ${groupId}`,
    );

    const todoGroup = await this.getUserTodoGroup(user.id, groupId);

    const todo = this.todoRepository.create(todoItem);
    todo.todoGroup = todoGroup;

    return this.todoRepository.save(todo);
  }

  async getTodoGroup(
    user: CurrentUserPayload,
    groupId: string,
  ): Promise<TodoGroup> {
    this.logger.log(
      `Getting todo group for user ${user.id} with id ${groupId}`,
    );
    const todoGroup = await this.getUserTodoGroup(user.id, groupId);
    return todoGroup;
  }

  async getTodoGroups(user: CurrentUserPayload): Promise<TodoGroup[]> {
    this.logger.log(`Getting todo groups for user ${user.id}`);
    const todoGroups = await this.todoGroupRepository
      .createQueryBuilder('todoGroup')
      .leftJoinAndSelect('todoGroup.owner', 'owner')
      .leftJoinAndSelect('todoGroup.todos', 'items')
      .where('owner.id = :ownerId', { ownerId: user.id })
      .getMany();

    if (!todoGroups) {
      this.logger.error(`Todo groups not found for user ${user.id}`);
      return [];
    }

    return todoGroups;
  }

  async getTodoItems(
    user: CurrentUserPayload,
    groupId: string,
  ): Promise<Todo[]> {
    this.logger.log(
      `Getting todo items for user ${user.id} in group ${groupId}`,
    );

    const todoGroup = await this.todoGroupRepository
      .createQueryBuilder('todoGroup')
      .leftJoinAndSelect('todoGroup.owner', 'owner')
      .leftJoinAndSelect('todoGroup.todos', 'todos')
      .where('todoGroup.id = :id', { id: groupId })
      .andWhere('owner.id = :ownerId', { ownerId: user.id })
      .getOne();

    if (!todoGroup) {
      this.logger.error(`Todo group not found for user ${user.id}`);
      return [];
    }

    return todoGroup.todos;
  }

  async deleteTodoGroup(
    user: CurrentUserPayload,
    groupId: string,
  ): Promise<void> {
    this.logger.log(
      `Deleting todo group for user ${user.id} with id ${groupId}`,
    );
    const todoGroup = await this.getUserTodoGroup(user.id, groupId);
    await this.todoGroupRepository.remove(todoGroup);
  }

  async deleteTodoItem(
    user: CurrentUserPayload,
    groupId: string,
    todoId: string,
  ): Promise<void> {
    this.logger.log(
      `Deleting todo item for user ${user.id} in group ${groupId}`,
    );

    await this.getUserTodoGroup(user.id, groupId);

    const todo = await this.todoRepository
      .createQueryBuilder('todo')
      .leftJoinAndSelect('todo.todoGroup', 'todoGroup')
      .where('todo.id = :todoId', { todoId: todoId })
      .andWhere('todoGroup.id = :id', { id: groupId })
      .getOne();

    if (!todo) {
      this.logger.error(`Todo item not found for user ${user.id}`);
      throw new NotFoundException('Todo item not found');
    }

    await this.todoRepository.remove(todo);
  }

  async updateTodoGroup(
    user: CurrentUserPayload,
    groupId: string,
    todoGroupDto: UpdateTodoGroupDto,
  ): Promise<TodoGroup> {
    this.logger.log(
      `Updating todo group for user ${user.id} with id ${groupId}`,
    );
    const todoGroup = await this.getUserTodoGroup(user.id, groupId);
    todoGroup.name = todoGroupDto.name;
    return this.todoGroupRepository.save(todoGroup);
  }

  async updateTodoItem(
    user: CurrentUserPayload,
    groupId: string,
    todoId: string,
    todoItem: UpdateTodoItemDto,
  ): Promise<Todo> {
    this.logger.log(
      `Updating todo item for user ${user.id} in group ${groupId}`,
    );
    await this.getUserTodoGroup(user.id, groupId);
    const todo = await this.todoRepository
      .createQueryBuilder('todo')
      .leftJoinAndSelect('todo.todoGroup', 'todoGroup')
      .where('todo.id = :todoId', { todoId: todoId })
      .andWhere('todoGroup.id = :id', { id: groupId })
      .getOne();

    if (!todo) {
      this.logger.error(`Todo item not found for user ${user.id}`);
      return null;
    }

    Object.assign(todo, todoItem);
    if (todoItem.dueDate) {
      todo.dueDate = new Date(todoItem.dueDate);
    }
    return this.todoRepository.save(todo);
  }

  private async getUserTodoGroup(userId: string, groupId: string) {
    this.logger.log(
      `Getting todo group for user ${userId} in group ${groupId}`,
    );

    const todoGroup = await this.todoGroupRepository
      .createQueryBuilder('todoGroup')
      .leftJoinAndSelect('todoGroup.owner', 'owner')
      .where('todoGroup.id = :id', { id: groupId })
      .andWhere('owner.id = :ownerId', { ownerId: userId })
      .getOne();

    if (!todoGroup) {
      this.logger.error(`Todo group not found for user ${userId}`);
      throw new NotFoundException('Todo group not found');
    }

    return todoGroup;
  }
}
