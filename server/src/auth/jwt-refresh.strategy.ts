// /server/src/auth/jwt-refresh.strategy.ts
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { ValidatedUserPayload } from './auth.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh', // 为这个策略指定一个唯一的名称
) {
  constructor(private readonly configService: ConfigService) {
    super({
      // 核心区别：从名为 'refresh_token' 的 cookie 中提取 JWT
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.refresh_token;
        },
      ]),
      ignoreExpiration: false,
      // 注意：理论上刷新令牌可以使用一个不同的、更强的密钥，但为简化起见，我们共用密钥
      secretOrKey: configService.get<string>('JWT_SECRET', ''),
    });
  }

  /**
   * 验证 refresh_token 的载荷
   * @param payload 解码后的载荷
   * @returns 返回的对象会被附加到 req.user 上
   */
  async validate(payload: any): Promise<ValidatedUserPayload> {
    // 这里的逻辑可以与 JwtStrategy 保持一致
    return { id: payload.sub, email: payload.email, role: payload.role, isActive: true };
  }
}