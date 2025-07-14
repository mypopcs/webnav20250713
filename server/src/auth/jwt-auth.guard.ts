// /server/src/auth/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// 'jwt' 这个名字对应了我们在 JwtStrategy 中默认使用的策略名
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}