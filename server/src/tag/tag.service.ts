import { Injectable, NotFoundException } from '@nestjs/common'; // 导入 NotFoundException
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag, TagDocument } from './entities/tag.entity';

@Injectable()
export class TagService {
  constructor(@InjectModel(Tag.name) private tagModel: Model<TagDocument>) {}

  async create(createTagDto: CreateTagDto): Promise<TagDocument> {
    const createdTag = new this.tagModel(createTagDto);
    return createdTag.save();
  }

  async findAll(): Promise<TagDocument[]> {
    return this.tagModel.find().exec();
  }

  async findOne(id: string): Promise<TagDocument> {
    const tag = await this.tagModel.findById(id).exec();
    if (!tag) {
      throw new NotFoundException(`ID 为 "${id}" 的标签不存在`);
    }
    return tag;
  }

  async findOneByName(name: string): Promise<TagDocument | null> {
    return this.tagModel.findOne({ name }).exec();
  }

  async update(id: string, updateTagDto: UpdateTagDto): Promise<TagDocument> {
    const updatedTag = await this.tagModel
      .findByIdAndUpdate(id, updateTagDto, { new: true })
      .exec();
    if (!updatedTag) {
      throw new NotFoundException(`ID 为 "${id}" 的标签不存在`);
    }
    return updatedTag;
  }

  async remove(id: string): Promise<TagDocument> {
    const deletedTag = await this.tagModel.findByIdAndDelete(id).exec();
    if (!deletedTag) {
      throw new NotFoundException(`ID 为 "${id}" 的标签不存在`);
    }
    return deletedTag;
  }
}