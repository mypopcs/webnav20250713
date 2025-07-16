// /server/src/category/dto/create-category.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateCategoryDto {
  @IsString({ message: '分类名称必须是字符串' })
  @IsNotEmpty({ message: '分类名称不能为空' })
  name: string;

  @IsNumber({}, { message: '排序值必须是数字' })
  @IsOptional()
  order?: number;
}