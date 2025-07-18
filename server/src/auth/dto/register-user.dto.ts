import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
// CreateUserDto 通常用于内部创建，而 RegisterUserDto 用于从外部 API 接收数据
// 这里为了清晰，我们创建一个专用的注册 DTO
export class RegisterUserDto {
  @IsEmail({}, { message: '邮箱格式不正确' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  email: string;
  @MinLength(6, { message: '密码长度不能少于6位' })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;
}