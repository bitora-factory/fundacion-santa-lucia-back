import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from 'src/common/base.repository';

@Injectable()
export class UsersService extends BaseRepository<User> {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {
        super(userRepository);
    }
    // Additional user-specific methods can be added here
}
