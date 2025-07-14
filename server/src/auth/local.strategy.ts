// /server/src/auth/local.strategy.ts
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService, ValidatedUserPayload } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  /**
   * Passport 会自动调用此方法来验证凭证.
   * @returns 成功则返回一个符合 ValidatedUserPayload 类型的纯净JS对象
   */
  async validate(
    email: string,
    password: string,
  ): Promise<ValidatedUserPayload> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('邮箱或密码不正确');
    }

    // 手动、明确地构建一个符合我们类型定义的对象
    // 这是最可靠、最不会出错的方式
    const payload: ValidatedUserPayload = {
      id: user._id.toHexString(), // 明确将 ObjectId 转换为 string
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    };

    return payload;
  }
}