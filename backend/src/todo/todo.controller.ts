import { PG_INVALID_TEXT_REPRESENTATION } from '@drdgvhbh/postgres-error-codes';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import CreateTodoGroupDto from './dto/create-todo-group.dto';
import CreateTodoItemDto from './dto/create-todo-item.dto';
import UpdateTodoGroupDto from './dto/update-todo-group.dto';
import UpdateTodoItemDto from './dto/update-todo-item.dto';
import { TodoService } from './todo.service';

@ApiBearerAuth()
@ApiTags('todo')
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  async createGroup(
    @Req() req: any,
    @Body() createTodoGroup: CreateTodoGroupDto,
  ) {
    return await this.todoService.createTodoGroup(req.user, createTodoGroup);
  }

  @Get('/:id')
  async getGroup(@Req() req: any, @Param('id') id: string) {
    const group = await this.todoService.getTodoGroup(req.user, id);

    if (!group) {
      throw new HttpException('Todo group not found', HttpStatus.NOT_FOUND);
    }

    return group;
  }

  @Put('/:id')
  async updateGroup(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateTodoGroup: UpdateTodoGroupDto,
  ) {
    const result = await this.todoService.updateTodoGroup(
      req.user,
      id,
      updateTodoGroup,
    );

    if (!result) {
      throw new HttpException('Todo group not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }

  @Get('/')
  async getAllGroups(@Req() req: any) {
    return await this.todoService.getTodoGroups(req.user);
  }

  @Delete('/:id')
  async deleteGroup(@Req() req: any, @Param('id') id: string) {
    try {
      return await this.todoService.deleteTodoGroup(req.user, id);
    } catch (error) {
      if (error.code === PG_INVALID_TEXT_REPRESENTATION) {
        throw new HttpException('Wrong id', HttpStatus.BAD_REQUEST);
      }
      throw error;
    }
  }

  @Post('/:id/item')
  async createItem(
    @Req() req: any,
    @Param('id') id: string,
    @Body() createItem: CreateTodoItemDto,
  ) {
    return await this.todoService.createTodoItem(req.user, id, createItem);
  }

  @Get('/:id/item')
  async getItems(@Req() req: any, @Param('id') id: string) {
    return await this.todoService.getTodoItems(req.user, id);
  }

  @Put('/:id/item/:itemId')
  async updateItem(
    @Req() req: any,
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Body() updateItem: UpdateTodoItemDto,
  ) {
    return await this.todoService.updateTodoItem(
      req.user,
      id,
      itemId,
      updateItem,
    );
  }

  @Delete('/:id/item/:itemId')
  async deleteItem(
    @Req() req: any,
    @Param('id') id: string,
    @Param('itemId') itemId: string,
  ) {
    try {
      return await this.todoService.deleteTodoItem(req.user, id, itemId);
    } catch (error) {
      console.log('code:', error.code);
    }
  }
}
