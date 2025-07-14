import { Injectable, NotFoundException } from '@nestjs/common'; // 导入 NotFoundException
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    // 如果找不到用户，就抛出 404 异常
    if (!user) {
      throw new NotFoundException(`ID 为 "${id}" 的用户不存在`);
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<UserDocument | null> {
    // 这个方法可以返回 null，因为它是服务内部逻辑，比如注册时检查邮箱是否存在
    return this.userModel.findOne({ email }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
    // findByIdAndUpdate 在找不到时也会返回 null
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    if (!updatedUser) {
      throw new NotFoundException(`ID 为 "${id}" 的用户不存在`);
    }
    return updatedUser;
  }

  async remove(id: string): Promise<UserDocument> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new NotFoundException(`ID 为 "${id}" 的用户不存在`);
    }
    return deletedUser;
  }
}