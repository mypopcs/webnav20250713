// /server/src/website/dto/create-website.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsUrl,
  IsOptional,
  IsMongoId,
  IsArray,
  MaxLength,
  ArrayMaxSize,
} from 'class-validator';

export class CreateWebsiteDto {
  @IsString()
  @IsNotEmpty({ message: '网站标题不能为空' })
  title: string;

  @IsUrl({}, { message: '请输入有效的网站链接' })
  @IsNotEmpty({ message: '网站链接不能为空' })
  url: string;

  @IsString()
  @IsNotEmpty({ message: 'Logo 链接不能为空' })
  logo: string;

  @IsString()
  @IsNotEmpty({ message: '网站短描述不能为空' })
  @MaxLength(100, { message: '短描述不能超过100个字符' })
  shortDesc: string;

  @IsString()
  @IsOptional()
  longDesc?: string;

  @IsMongoId({ message: '无效的分类ID' })
  @IsNotEmpty({ message: '必须指定一个分类' })
  category: string; 

  @IsArray({ message: '标签必须是一个数组' })
  @IsMongoId({ each: true, message: '数组中的每个标签ID都必须是有效的' })
  @IsOptional()
  tags?: string[]; 

  @IsArray()
  @IsUrl({}, { each: true, message: '每个缩略图链接都必须是有效的URL' })
  @ArrayMaxSize(5, { message: '最多只能提供5张缩略图' })
  @IsOptional()
  thumbnails?: string[];
}