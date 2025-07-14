// /server/src/user/user.module.ts
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';

@Module({
   // 这里的 forFeature 就是把 Model 和 Schema 绑定起来，提供给依赖注入系统
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService],
  // 导出 UserService，这样其他模块（如我们的初始化脚本）才能使用它
  exports: [UserService],
})
export class UserModule {}