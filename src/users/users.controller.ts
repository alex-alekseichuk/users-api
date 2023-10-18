import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { GetAllUsersQuery, GetAllUsersResponse, UpdateUsersRequest, UsersService } from "./users.service";
import {PaginationRequest} from '../common/pagination';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get()
  getAllUsers(
    // TODO: use class-validator
    @Query() query: Record<string, string>,
  ): Promise<GetAllUsersResponse> {
    return this.usersService.getAllUsers(
      GetAllUsersQuery.from(query),
      PaginationRequest.from(query),
    );
  }

  @Patch('statuses')
  updateUsersStatuses(
    @Body() request: UpdateUsersRequest,
  ) {
    return this.usersService.updateUsersStatuses(request);
  }

  @Post(':userId/remove-from-group')
  removeUserFromGroup(
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.usersService.removeUserFromGroup(userId);
  }

}
