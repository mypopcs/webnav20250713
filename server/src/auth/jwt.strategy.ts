// /server/src/auth/jwt.strategy.ts
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { ValidatedUserPayload } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.access_token;
        },
      ]),
      ignoreExpiration: false,
      // --- VVVV 核心修正点 VVVV ---
      // 我们为 get 方法提供一个默认值 '' (空字符串)
      // 这样 secretOrKey 的类型就永远是 string，不再可能是 undefined
      secretOrKey: configService.get<string>('JWT_SECRET', ''),
      // --- AAAA 核心修正点 AAAA ---
    });
  }

  async validate(payload: any): Promise<ValidatedUserPayload> {
    return { id: payload.sub, email: payload.email, role: payload.role, isActive: true };
  }
}