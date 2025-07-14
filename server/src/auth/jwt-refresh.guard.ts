// /server/src/auth/jwt-refresh.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// 使用我们为刷新策略定义的唯一名称 'jwt-refresh'
@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {}