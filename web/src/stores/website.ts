// /web/src/stores/website.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getPublicWebsitesApi } from '../apis/website';
import { groupBy } from 'lodash-es'; // 我们将使用 lodash 来进行数据分组

// 定义网站和分类的数据类型
interface Website {
  _id: string;
  title: string;
  url: string;
  logo: string;
  shortDesc: string;
  longDesc?: string;
  category: { _id: string; name: string };
  tags: { _id: string; name: string }[];
  thumbnails: string[];
  status: boolean;
}

export const useWebsiteStore = defineStore('website', () => {
  const allWebsites = ref<Website[]>([]);
  const websitesByCategory = ref<Record<string, Website[]>>({});

  async function fetchAllWebsites() {
    try {
      const { data } = await getPublicWebsitesApi();
      // 只展示 status 为 true 的网站
      const visibleWebsites = data.filter((site: Website) => site.status);
      allWebsites.value = visibleWebsites;
      websitesByCategory.value = groupBy(visibleWebsites, 'category.name');
    } catch (error) {
      console.error("Failed to fetch websites:", error);
      // 在这里可以添加一些用户提示，例如使用 ElMessage
    }
  }

  return {
    allWebsites,
    websitesByCategory,
    fetchAllWebsites,
  };
});