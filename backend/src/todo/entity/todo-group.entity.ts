import { User } from 'src/users/entity/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Todo } from './todo.entity';

@Entity()
export class TodoGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => Todo, (todo) => todo.todoGroup)
  todos: Todo[];

  @ManyToOne(() => User, (user) => user.todoGroups, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  owner: User;
}
