import { Injectable, NotFoundException } from '@nestjs/common'; // 导入 NotFoundException
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateWebsiteDto } from './dto/create-website.dto';
import { UpdateWebsiteDto } from './dto/update-website.dto';
import { Website, WebsiteDocument } from './entities/website.entity';

@Injectable()
export class WebsiteService {
  constructor(
    @InjectModel(Website.name) private websiteModel: Model<WebsiteDocument>,
  ) {}

  async create(createWebsiteDto: CreateWebsiteDto): Promise<WebsiteDocument> {
    const createdWebsite = new this.websiteModel(createWebsiteDto);
    return createdWebsite.save();
  }

  async findAll(): Promise<WebsiteDocument[]> {
    return this.websiteModel.find().populate('category').populate('tags').exec();
  }

  async findOne(id: string): Promise<WebsiteDocument> {
    const website = await this.websiteModel.findById(id).exec();
    if (!website) {
      throw new NotFoundException(`ID 为 "${id}" 的网站不存在`);
    }
    return website;
  }

  async findOneByTitle(title: string): Promise<WebsiteDocument | null> {
    return this.websiteModel.findOne({ title }).exec();
  }

  async update(
    id: string,
    updateWebsiteDto: UpdateWebsiteDto,
  ): Promise<WebsiteDocument> {
    const updatedWebsite = await this.websiteModel
      .findByIdAndUpdate(id, updateWebsiteDto, { new: true })
      .exec();
    if (!updatedWebsite) {
      throw new NotFoundException(`ID 为 "${id}" 的网站不存在`);
    }
    return updatedWebsite;
  }

  async remove(id: string): Promise<WebsiteDocument> {
    const deletedWebsite = await this.websiteModel.findByIdAndDelete(id).exec();
    if (!deletedWebsite) {
      throw new NotFoundException(`ID 为 "${id}" 的网站不存在`);
    }
    return deletedWebsite;
  }
}