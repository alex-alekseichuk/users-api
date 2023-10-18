import { Injectable, NotFoundException } from "@nestjs/common";
import { Group, GroupStatus, User, UserStatus } from "./entities/user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository, In, DataSource} from "typeorm";
import { PaginationRequest } from "../common/pagination";
import { getProps } from "../common/query-fields";

export class GetAllUsersQuery {
  public name?: string;
  public email?: string;

  public static from(query: Record<string, string>) {
    return getProps(query, ['name', 'email']);
  }
}

export class GetAllUsersResponse {
  public users: User[];
  public total: number;
}

export class UpdateUsersRequest {
  public usersStatuses: Array<{
    userId: number,
    status: UserStatus,
  }>
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Group) private readonly groupRepository: Repository<Group>,
    private dataSource: DataSource,
  ) {
  }

  public async getAllUsers(query: GetAllUsersQuery, pagination: PaginationRequest): Promise<GetAllUsersResponse> {
    // TODO: query -> where LIKE 'something%' instead of field = 'something'
    return {
      total:  await this.userRepository.count({ where: query }),
      users: await this.userRepository.find({
        where: query,
        take: pagination.limit,
        skip: pagination.offset,
        relations: ['group'],
      }),
    };
  }

  public async updateUsersStatuses(updateUsersStatuses: UpdateUsersRequest) {
    // TODO: return number of updated users
    // TODO: check for incorrect statuses?
    for (const statusKey in UserStatus) {
      const status = UserStatus[statusKey];
      const userIds = updateUsersStatuses.usersStatuses
        .filter(it => it.status === status)
        .map(it => Number(it.userId))
        .filter(it => !isNaN(it));
      if (userIds.length > 0)
        await this.userRepository.createQueryBuilder()
          .update(User)
          .set({ status })
          .where({ id: In(userIds) })
          .execute();
    }
  }

  public async removeUserFromGroup(userId: number) {
    await this.dataSource.transaction(async manager => {
      const user = await this.userRepository.findOne({where: {id: userId}, relations:['group']});
      if (!user) throw new NotFoundException(); // TODO: throw domain exception instead
      if (user.group) {
        const group = user.group;
        const groupSize = await this.userRepository.count({where: {group}});

        user.group = null;
        await manager.save(user);

        if (groupSize > 1)
          return;

        group.status = GroupStatus.EMPTY;
        await manager.save(group);
      }
    });
  }
}
