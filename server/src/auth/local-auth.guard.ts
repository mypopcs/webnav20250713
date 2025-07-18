import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
// AuthGuard('local') 会自动激活我们在下面定义的 LocalStrategy
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}