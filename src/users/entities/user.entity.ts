import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne} from 'typeorm';

export enum GroupStatus {
  EMPTY = 'empty',
  NOT_EMPTY = 'notEmpty',
}

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('enum', { enum: GroupStatus })
  status: GroupStatus;

  @OneToMany(() => User, (user) => user.group)
  users: User[];
}

export enum UserStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  BLOCKED = 'blocked',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column('enum', { enum: UserStatus })
  status: UserStatus;

  @ManyToOne(() => Group, (group) => group.users)
  group: Group;
}
