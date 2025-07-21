import { Controller } from '@nestjs/common';
import { UsersService } from './user.service';
import { User } from './user.entity';
import { BaseController } from 'src/common/base.controller';

@Controller('user')
export class UserController extends BaseController<User> {
    constructor(private readonly usersService: UsersService) {
        super(usersService);
    }

}
