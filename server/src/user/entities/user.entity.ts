// /server/src/user/entities/user.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcryptjs';

// 定义用户角色枚举
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Prop({ default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Mongoose 中间件: 在 'save' 操作之前执行，自动加密密码
UserSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});