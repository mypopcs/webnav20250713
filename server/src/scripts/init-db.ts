// /server/src/scripts/init-db.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UserService } from '../user/user.service';
import { CategoryService } from '../category/category.service';
import { TagService } from '../tag/tag.service';
import { WebsiteService } from '../website/website.service';
import { UserRole } from '../user/entities/user.entity';

async function bootstrap() {
  // 创建一个独立的 Nest 应用上下文，而不是一个完整的 web 服务器
  const app = await NestFactory.createApplicationContext(AppModule);

  console.log('🚀 初始化脚本启动...');

  // 从应用上下文中获取各个 Service 的实例
  const userService = app.get(UserService);
  const categoryService = app.get(CategoryService);
  const tagService = app.get(TagService);
  const websiteService = app.get(WebsiteService);

  // === 1. 创建管理员用户 ===
  const adminEmail = 'admin@dev.com';
  const adminPassword = 'admin123';
  let adminUser = await userService.findOneByEmail(adminEmail);

  if (!adminUser) {
    console.log(`👤 管理员账号 [${adminEmail}] 不存在，开始创建...`);
    adminUser = await userService.create({
      email: adminEmail,
      password: adminPassword, // 密码将在 schema 的 pre-save 钩子中自动加密
      role: UserRole.ADMIN,
    });
    console.log('✅ 管理员账号创建成功！');
  } else {
    console.log(`☑️ 管理员账号 [${adminEmail}] 已存在，跳过创建。`);
  }

  // === 2. 创建分类 ===
  const categories = [
    { name: 'AI 模型', order: 1 },
    { name: '学习网站', order: 2 },
    { name: '图像处理', order: 3 },
    { name: '灵感创意', order: 4 },
  ];
  const createdCategories = await Promise.all(
    categories.map(async (cat) => {
      let existingCat = await categoryService.findOneByName(cat.name);
      if (!existingCat) {
        console.log(`🗂️ 分类 [${cat.name}] 不存在，开始创建...`);
        existingCat = await categoryService.create(cat);
      }
      return existingCat;
    }),
  );
  console.log('✅ 分类数据创建/检查完毕！');

  // === 3. 创建标签 ===
  const tags = ['SD开源模型', '图像编辑', '在线工具', '教程', '社区'];
  const createdTags = await Promise.all(
    tags.map(async (tagName) => {
      let existingTag = await tagService.findOneByName(tagName);
      if (!existingTag) {
        console.log(`🏷️ 标签 [${tagName}] 不存在，开始创建...`);
        existingTag = await tagService.create({ name: tagName });
      }
      return existingTag;
    }),
  );
  console.log('✅ 标签数据创建/检查完毕！');

  // === 4. 创建示例网站 ===
  const websites = [
    {
      title: 'Civitai',
      url: 'https://civitai.com/',
      logo: 'https://via.placeholder.com/100x40.png?text=Civitai',
      shortDesc: 'AI艺术共享平台 | 海量SD开源模型',
      category: 'AI 模型',
      tags: ['SD开源模型', '社区'],
    },
    {
      title: '菜鸟教程',
      url: 'https://www.runoob.com/',
      logo: 'https://via.placeholder.com/100x40.png?text=Runoob',
      shortDesc: '学的不仅是技术，更是梦想！',
      category: '学习网站',
      tags: ['教程', '在线工具'],
    },
    {
      title: 'Photopea',
      url: 'https://www.photopea.com/',
      logo: 'https://via.placeholder.com/100x40.png?text=Photopea',
      shortDesc: '功能强大的在线图像编辑器。',
      category: '图像处理',
      tags: ['图像编辑', '在线工具'],
    },
  ];

  await Promise.all(
    websites.map(async (site) => {
      const existingSite = await websiteService.findOneByTitle(site.title);
      if (!existingSite) {
        console.log(`🌐 网站 [${site.title}] 不存在，开始创建...`);
        const categoryDoc = createdCategories.find(
          (c) => c.name === site.category,
        );
        const tagDocs = createdTags.filter((t) => site.tags.includes(t.name));

        if (categoryDoc) {
          await websiteService.create({
            title: site.title,
            url: site.url,
            logo: site.logo,
            shortDesc: site.shortDesc,
            category: categoryDoc._id.toString(),
            tags: tagDocs.map((t) => t._id.toString()),
          });
        }
      }
    }),
  );
  console.log('✅ 示例网站数据创建/检查完毕！');

  // 关闭应用上下文
  await app.close();
  console.log('👋 脚本执行完毕，已断开连接。');
}

bootstrap();