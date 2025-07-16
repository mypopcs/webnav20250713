<template>
  <div class="flex h-screen font-sans">
    <aside
      class="w-64 flex-shrink-0 bg-white dark:bg-gray-800 border-r dark:border-gray-700 p-4"
    >
      <h1 class="text-2xl font-bold text-center mb-8">网站导航</h1>
      <nav class="space-y-2">
        <a
          v-for="(websites, categoryName) in store.websitesByCategory"
          :key="categoryName"
          :href="`#category-${categoryName}`"
          @click.prevent="scrollToCategory(`#category-${categoryName}`)"
          class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <span>{{ categoryName }}</span>
        </a>
      </nav>
    </aside>

    <main class="flex-1 overflow-y-auto" ref="mainContentRef">
      <div class="container mx-auto p-4 sm:p-6 lg:p-8">
        <section
          v-for="(websites, categoryName) in store.websitesByCategory"
          :key="categoryName"
          :id="`category-${categoryName}`"
          class="mb-12 pt-4"
        >
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {{ categoryName }}
          </h2>
          <div
            class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            <WebsiteCard
              v-for="site in websites"
              :key="site._id"
              :website="site"
              class="cursor-pointer"
              @click="openWebsiteDetail(site)"
            />
          </div>
        </section>
      </div>
    </main>

    <el-drawer
      v-model="isDrawerOpen"
      :title="selectedWebsite?.title"
      direction="rtl"
      size="50%"
    >
      <div v-if="selectedWebsite" class="p-4">
        <el-image
          :src="selectedWebsite.logo"
          class="w-24 h-24 mx-auto mb-4 rounded-lg"
        />
        <h3 class="text-xl font-bold mb-2">描述</h3>
        <p class="text-gray-600 dark:text-gray-300 mb-4">
          {{ selectedWebsite.longDesc || selectedWebsite.shortDesc }}
        </p>

        <h3 class="text-xl font-bold mb-2">链接</h3>
        <el-link :href="selectedWebsite.url" type="primary" target="_blank">{{
          selectedWebsite.url
        }}</el-link>

        <el-divider />

        <h3 class="text-xl font-bold mb-2">标签</h3>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="tag in selectedWebsite.tags"
            :key="tag._id"
            class="inline-block rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300"
          >
            {{ tag.name }}
          </div>
        </div>

        <el-divider
          v-if="
            selectedWebsite.thumbnails && selectedWebsite.thumbnails.length > 0
          "
        />

        <h3
          class="text-xl font-bold mb-2"
          v-if="
            selectedWebsite.thumbnails && selectedWebsite.thumbnails.length > 0
          "
        >
          缩略图
        </h3>
        <el-carousel trigger="click" height="250px">
          <el-carousel-item
            v-for="(img, index) in selectedWebsite.thumbnails"
            :key="index"
          >
            <el-image :src="img" fit="contain" class="h-full w-full" />
          </el-carousel-item>
        </el-carousel>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useWebsiteStore } from "./stores/website";
import WebsiteCard from "./components/WebsiteCard.vue";

const store = useWebsiteStore();

// --- 抽屉逻辑 ---
const isDrawerOpen = ref(false);
const selectedWebsite = ref<any>(null);

const openWebsiteDetail = (website: any) => {
  selectedWebsite.value = website;
  isDrawerOpen.value = true;
};

// --- 平滑滚动逻辑 ---
const mainContentRef = ref<HTMLElement | null>(null);

const scrollToCategory = (selector: string) => {
  const element = document.querySelector(selector);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

onMounted(() => {
  store.fetchAllWebsites();
});
</script>
