// /server/src/website/entities/website.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Category } from '../../category/entities/category.entity';
import { Tag } from '../../tag/entities/tag.entity';

export type WebsiteDocument = HydratedDocument<Website>;

@Schema({ timestamps: true })
export class Website {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  logo: string;

  @Prop({ required: true, trim: true })
  shortDesc: string;

  @Prop({ default: '' })
  longDesc: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category', required: true })
  category: Category;

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Tag' }])
  tags: Tag[];

  @Prop({ type: [String], default: [] })
  thumbnails: string[];

  @Prop({ default: true })
  status: boolean;
}

export const WebsiteSchema = SchemaFactory.createForClass(Website);