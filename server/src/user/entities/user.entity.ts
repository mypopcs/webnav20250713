import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcryptjs';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export type UserDocument = HydratedDocument<User>;

// --- VVVV 在这里为 @Schema 添加配置对象 VVVV ---
@Schema({
  timestamps: true,
  toJSON: {
    // transform 是一个函数，它在文档对象被转换为 JSON 格式时执行
    // ret: a plain object representation of the document
    transform: (doc, ret) => {
      // 从返回的普通对象中删除 password 字段
      delete ret['password'];
      // 你也可以在这里转换其他字段，比如将 _id 转换为 id
      // ret.id = ret._id;
      // delete ret._id;
    },
  },
})
export class User {
  @Prop({ required: true, unique: true, trim: true })
  email: string;

  @Prop({ required: true, select: false }) // select: false 确保在常规查询中默认不返回密码
  password: string;

  @Prop({ enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Prop({ default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});