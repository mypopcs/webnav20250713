import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module'; // 导入用户模块
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UserModule, // 导入 UserModule 以便使用 UserService
    PassportModule,
    // 异步配置 JwtModule，以便从 .env 文件读取配置
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        // 从 .env 文件读取 JWT 密钥
        secret: configService.get<string>('JWT_SECRET'),
        // 注意：这里的 signOptions 是全局默认值。
        // 我们会在登录时根据设备类型（管理端/用户端）动态设置不同的有效期。
        signOptions: {
          expiresIn: configService.get<string>(
            'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
          ),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService], // 我们稍后会在这里添加 Passport 策略 (Strategies)
})
export class AuthModule {}