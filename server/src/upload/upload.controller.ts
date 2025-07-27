import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname, join } from "path";
import { existsSync, mkdirSync } from "fs";

@Controller("upload")
export class UploadController {
  @Post("image")
  @UseInterceptors(
    FileInterceptor("file", {
      // 1. 配置文件存储选项
      storage: diskStorage({
        // 配置文件上传后的文件夹路径
        destination: (req, file, cb) => {
          const uploadPath = join(__dirname, "..", "..", "uploads");
          // 确保 uploads 目录存在
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        // 自定义文件名
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join("");
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      // 2. 配置文件大小和类型限制
      limits: {
        fileSize: 1024 * 1024 * 5, // 限制为 5MB
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(new BadRequestException("只允许上传图片文件！"), false);
        }
        cb(null, true);
      },
    })
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("上传失败，请确保文件是有效的图片。");
    }
    // 返回可访问的文件 URL
    return {
      url: `/uploads/${file.filename}`,
    };
  }
}
