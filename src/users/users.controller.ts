import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { Role, Roles } from '../common/decorators/roles.decorator.js';
import {
  listUsersQuerySchema,
  type ListUsersQuery,
} from './dto/list-users-query.dto.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  @Get()
  @Roles(Role.Admin)
  findAll(
    @Query({ schema: listUsersQuerySchema }) query: ListUsersQuery,
  ) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @Roles(Role.Admin)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  remove(@CurrentUser('sub') userId: string, @Param('id') id: string) {
    if (userId === id)
      throw new UnauthorizedException('Operação não autorizada.');
    return this.usersService.remove(id);
  }
}
