import { Injectable, ConflictException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserDocument } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  /**
   * 用户注册
   * @param registerUserDto
   */
  // 返回类型现在可以是简单的 Promise<UserDocument>
  // 因为 NestJS 在发送响应时会自动调用 toJSON，我们的 transform 会生效
  async register(registerUserDto: RegisterUserDto): Promise<UserDocument> {
    const existingUser = await this.userService.findOneByEmail(
      registerUserDto.email,
    );

    if (existingUser) {
      throw new ConflictException('该邮箱已被注册');
    }

    // 现在我们直接返回创建的用户文档即可
    // 不需要再手动调用 .toObject() 或删除密码
    return this.userService.create(registerUserDto);
  }
}