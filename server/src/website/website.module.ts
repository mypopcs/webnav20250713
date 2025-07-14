// /server/src/website/website.module.ts
import { Module } from '@nestjs/common';
import { WebsiteService } from './website.service';
import { WebsiteController } from './website.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Website, WebsiteSchema } from './entities/website.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Website.name, schema: WebsiteSchema }]),
  ],
  controllers: [WebsiteController],
  providers: [WebsiteService],
  exports: [WebsiteService],
})
export class WebsiteModule {}