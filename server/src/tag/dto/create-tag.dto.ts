// /server/src/tag/dto/create-tag.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTagDto {
  @IsString({ message: '标签名称必须是字符串' })
  @IsNotEmpty({ message: '标签名称不能为空' })
  name: string;
}