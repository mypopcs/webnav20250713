import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { TagModule } from './tag/tag.module';
import { WebsiteModule } from './website/website.module';

@Module({
  imports: [
    // 1. 配置模块:
    // 使用 ConfigModule.forRoot() 来加载和解析 .env 文件。
    // isGlobal: true 使得配置在整个应用中全局可用，无需在每个模块中单独导入。
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: `.env.${process.env.NODE_ENV}` // 可选：根据环境加载不同配置文件
    }),

    // 2. 数据库模块:
    // 使用 MongooseModule.forRootAsync() 进行异步配置。
    // 这样做的好处是，它可以在注入 ConfigService 后，动态地获取数据库连接字符串。
    MongooseModule.forRootAsync({
      // 依赖注入 ConfigModule，以便下面 useFactory 能使用 ConfigService
      imports: [ConfigModule],
      // useFactory 会在模块初始化时执行，返回一个配置对象
      useFactory: async (configService: ConfigService) => ({
        // 从环境变量中获取数据库连接 URI
        uri: configService.get<string>('DATABASE_URL'),
        // 可以在这里添加更多 Mongoose 连接选项
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
      }),
      // 将 ConfigService 注入到 useFactory 中
      inject: [ConfigService],
    }),

    UserModule,

    CategoryModule,

    TagModule,

    WebsiteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}