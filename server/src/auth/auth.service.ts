import { Injectable, ConflictException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserDocument, UserRole } from 'src/user/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

// 定义一个清晰、简单的类型，用于在应用内部传递已验证的用户信息
export interface ValidatedUserPayload {
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  /**
   * 用户注册
   * @param registerUserDto 包含邮箱和密码
   * @returns 创建后的用户信息（不含密码）
   */
  async register(registerUserDto: RegisterUserDto): Promise<UserDocument> {
    // 1. 检查用户是否已存在
    const existingUser = await this.userService.findOneByEmail(
      registerUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('该邮箱已被注册');
    }
    return this.userService.create(registerUserDto);
  }

  async validateUser(
    email: string,
    pass: string,
  ): Promise<UserDocument | null> {
    const user = await this.userService.findOneByEmailWithPassword(email);
    if (!user) {
      return null;
    }

    const isPasswordMatching = await bcrypt.compare(pass, user.password);
    if (!isPasswordMatching) {
      return null;
    }
    return user;
  }

  async login(user: ValidatedUserPayload) {
    // JWT Payload 现在使用明确的、来自 ValidatedUserPayload 的属性
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '15d' });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
  /**
   * 刷新并生成一个新的访问令牌
   * @param user 已验证的用户对象 (来自 JwtRefreshStrategy)
   * @returns 只包含新的 access_token
   */
  async refreshToken(user: ValidatedUserPayload) {
    // 载荷可以与 login 时保持一致
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    // 只签发一个新的 access_token
    const newAccessToken = this.jwtService.sign(payload);

    return {
      access_token: newAccessToken,
    };
  }
}